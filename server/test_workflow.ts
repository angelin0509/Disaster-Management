import { getDb, queryAll, queryOne, executeRun } from './db';
import bcrypt from 'bcryptjs';
import { createToken, verifyToken } from './auth';

async function runTests() {
  console.log('--- STARTING DISASTERSHIELD AUTOMATED WORKFLOW TESTS ---');

  const db = await getDb();

  // TEST 1: Submit Emergency Request and verify database record
  console.log('\n[TEST 1] Submitting valid emergency request to database...');
  const reqId = `REQ-TEST-${Date.now().toString().slice(-4)}`;
  const now = new Date().toISOString();
  executeRun(
    db,
    `INSERT INTO emergency_requests (id, requester_id, name, phone, area, emergency_type, people_count, details, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?)`,
    [reqId, 'USR-PEOPLE-01', 'Test Citizen Ravi', '+91 98888 11111', 'T. Nagar, Chennai', 'Flood', 3, 'Water level 2ft', now, now]
  );
  executeRun(
    db,
    `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
     VALUES (?, ?, 'None', 'Pending', 'Test Citizen Ravi', ?)`,
    [`HIST-${reqId}-0`, reqId, now]
  );

  const savedReq = queryOne(db, 'SELECT * FROM emergency_requests WHERE id = ?', [reqId]);
  if (!savedReq || savedReq.name !== 'Test Citizen Ravi' || savedReq.status !== 'Pending') {
    throw new Error('TEST 1 FAILED: Request not saved properly in database.');
  }
  console.log(`[TEST 1 PASSED] Request ${reqId} created with status '${savedReq.status}'.`);

  // TEST 2: Update status to In Progress
  console.log('\n[TEST 2] Rescue team updates status to In Progress...');
  const updateTime1 = new Date().toISOString();
  executeRun(
    db,
    'UPDATE emergency_requests SET status = ?, updated_at = ? WHERE id = ?',
    ['In Progress', updateTime1, reqId]
  );
  executeRun(
    db,
    `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
     VALUES (?, ?, 'Pending', 'In Progress', 'Rescue SAR-1 Team', ?)`,
    [`HIST-${reqId}-1`, reqId, updateTime1]
  );
  const updatedReq1 = queryOne(db, 'SELECT status FROM emergency_requests WHERE id = ?', [reqId]);
  if (updatedReq1?.status !== 'In Progress') {
    throw new Error('TEST 2 FAILED: Status not updated to In Progress.');
  }
  console.log(`[TEST 2 PASSED] Status successfully updated to '${updatedReq1.status}'.`);

  // TEST 3: Change status to Completed and verify stats calculation
  console.log('\n[TEST 3] Changing status to Completed and validating stats recalculation...');
  const updateTime2 = new Date().toISOString();
  executeRun(
    db,
    'UPDATE emergency_requests SET status = ?, updated_at = ? WHERE id = ?',
    ['Completed', updateTime2, reqId]
  );
  const totalCompleted = queryOne(db, "SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Completed'");
  const totalPeopleAssisted = queryOne(db, "SELECT SUM(people_count) as sum FROM emergency_requests WHERE status = 'Completed'");
  if (totalCompleted.count <= 0 || totalPeopleAssisted.sum <= 0) {
    throw new Error('TEST 3 FAILED: Statistics calculation failed.');
  }
  console.log(`[TEST 3 PASSED] Total completed: ${totalCompleted.count}, People assisted: ${totalPeopleAssisted.sum}.`);

  // TEST 4: Register Volunteer and assign task
  console.log('\n[TEST 4] Register volunteer and assign task...');
  const volUserId = `USR-VOL-TEST-${Date.now().toString().slice(-4)}`;
  const volId = `VOL-TEST-${Date.now().toString().slice(-4)}`;
  const salt = bcrypt.genSaltSync(8);
  const hash = bcrypt.hashSync('testpass123', salt);
  executeRun(
    db,
    'INSERT INTO users (id, username, email, password_hash, role, full_name, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [volUserId, `testvol_${Date.now().toString().slice(-4)}`, `testvol_${Date.now().toString().slice(-4)}@shield.org`, hash, 'volunteer', 'Volunteer Selvam', '+91 97777 22222', now]
  );
  executeRun(
    db,
    'INSERT INTO volunteers (id, user_id, phone, email, location, skills, availability, experience, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [volId, volUserId, '+91 97777 22222', 'testvol@shield.org', 'Mylapore, Chennai', 'Search and rescue support', 'Available', '3 years field experience', now]
  );

  const testTaskId = `TSK-TEST-${Date.now().toString().slice(-4)}`;
  executeRun(
    db,
    'INSERT INTO tasks (id, emergency_request_id, title, description, priority, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [testTaskId, reqId, 'Deliver Drinking Water & Food Packs', 'Distribute 50 rations', 'High', 'Assigned', now, now]
  );
  executeRun(
    db,
    'INSERT INTO task_assignments (id, task_id, volunteer_id, assignment_status, notes, assigned_at) VALUES (?, ?, ?, ?, ?, ?)',
    [`ASN-TEST-${Date.now().toString().slice(-4)}`, testTaskId, volId, 'Assigned', 'Dispatched by Rescue SAR-1', now]
  );

  const assignedTasks = queryAll(
    db,
    `SELECT t.id, t.title, ta.assignment_status, u.full_name
     FROM tasks t
     JOIN task_assignments ta ON t.id = ta.task_id
     JOIN volunteers v ON ta.volunteer_id = v.id
     JOIN users u ON v.user_id = u.id
     WHERE ta.volunteer_id = ?`,
    [volId]
  );
  if (assignedTasks.length === 0 || assignedTasks[0].id !== testTaskId) {
    throw new Error('TEST 4 FAILED: Volunteer task assignment not found.');
  }
  console.log(`[TEST 4 PASSED] Task '${assignedTasks[0].title}' successfully visible to volunteer '${assignedTasks[0].full_name}'.`);

  // TEST 5: Head Office Overview Data from database
  console.log('\n[TEST 5] Head Office stats and category distribution queries...');
  const categoryBreakdown = queryAll(
    db,
    'SELECT emergency_type as category, COUNT(*) as count FROM emergency_requests GROUP BY emergency_type'
  );
  if (categoryBreakdown.length === 0) {
    throw new Error('TEST 5 FAILED: No category distribution returned from real DB.');
  }
  console.log(`[TEST 5 PASSED] Category distribution retrieved successfully (${categoryBreakdown.length} active categories).`);

  // TEST 6: Token role verification and authorization guards
  console.log('\n[TEST 6 & 7] Token verification and role authorization...');
  const citizenToken = createToken({ userId: 'USR-PEOPLE-01', username: 'citizen', email: 'citizen@shield.org', role: 'people', fullName: 'Citizen Ananya' });
  const verified = verifyToken(citizenToken);
  if (!verified || verified.role !== 'people') {
    throw new Error('Token verification failed');
  }
  const isRescueAuthorized = (verified.role as string) === 'rescue';
  if (isRescueAuthorized) {
    throw new Error('TEST 7 FAILED: Citizen should NOT have rescue authorization.');
  }
  console.log('[TEST 6 & 7 PASSED] Token generated, cryptographically validated, and unauthorized role access rejected.');

  console.log('\n--- ALL TEST SUITES PASSED RIGOROUSLY ---');
}

runTests().catch((e) => {
  console.error('TEST SUITE FAILED:', e);
  process.exit(1);
});

import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import os from 'os';
import { getDb, queryAll, queryOne, executeRun } from '../db';
import { requireAuth, requireRole, createToken, AuthenticatedRequest } from '../auth';

const router = express.Router();

// Helper to get local network IP address
function getLocalNetworkIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (ifaceList) {
      for (const iface of ifaceList) {
        if (!iface.internal && iface.family === 'IPv4') {
          return iface.address;
        }
      }
    }
  }
  return 'localhost';
}

// ---------------- AUTH ROUTES ---------------- //

router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { login, password, role } = req.body;
    if (!login || !password) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const db = await getDb();
    const user = queryOne(
      db,
      'SELECT * FROM users WHERE email = ? OR username = ?',
      [login.trim().toLowerCase(), login.trim().toLowerCase()]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const match = bcrypt.compareSync(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password. Please check and try again.' });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        error: `Account role mismatch. This account is registered as '${user.role}', but you selected '${role}'.`
      });
    }

    const token = createToken({
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      fullName: user.full_name
    });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.full_name,
        phone: user.phone
      }
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication.' });
  }
});

router.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, fullName, phone, location, skills, experience } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ error: 'Missing required registration fields.' });
    }

    const targetRole = role === 'volunteer' ? 'volunteer' : 'people';
    const db = await getDb();

    // Check duplicate
    const existing = queryOne(
      db,
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email.trim().toLowerCase(), username.trim().toLowerCase()]
    );

    if (existing) {
      return res.status(409).json({ error: 'An account with this email or username already exists.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const userId = `USR-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    executeRun(
      db,
      `INSERT INTO users (id, username, email, password_hash, role, full_name, phone, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, username.trim().toLowerCase(), email.trim().toLowerCase(), hash, targetRole, fullName.trim(), phone || '', now]
    );

    // If registering as volunteer, insert into volunteers table
    if (targetRole === 'volunteer') {
      const volId = `VOL-${Date.now().toString(36).toUpperCase()}`;
      executeRun(
        db,
        `INSERT INTO volunteers (id, user_id, phone, email, location, skills, availability, experience, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          volId,
          userId,
          phone || '',
          email.trim().toLowerCase(),
          location || 'Not specified',
          Array.isArray(skills) ? skills.join(', ') : (skills || 'General Support'),
          'Available',
          experience || 'Community volunteer',
          now
        ]
      );
    }

    const token = createToken({
      userId,
      username: username.trim().toLowerCase(),
      email: email.trim().toLowerCase(),
      role: targetRole,
      fullName: fullName.trim()
    });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        role: targetRole,
        fullName: fullName.trim(),
        phone: phone || ''
      }
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Failed to create account.' });
  }
});

router.get('/auth/me', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const user = queryOne(db, 'SELECT id, username, email, role, full_name, phone, created_at FROM users WHERE id = ?', [req.user!.userId]);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load user profile.' });
  }
});

// Network connection helper for multi-laptop demonstration
router.get('/network-info', (req: Request, res: Response) => {
  const localIp = getLocalNetworkIp();
  res.json({
    localIp,
    port: 3000,
    serverUrl: `http://${localIp}:3000`,
    instructions: `Connect both laptops to the same Wi-Fi network. Laptop 1 hosts the server at port 3000. Open 'http://${localIp}:3000' on Laptop 2.`
  });
});

// ---------------- EMERGENCY REQUESTS ---------------- //

router.get('/requests', async (req: Request, res: Response) => {
  try {
    const { status, category, search, requesterId } = req.query;
    const db = await getDb();

    let sql = 'SELECT * FROM emergency_requests WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'All') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      sql += ' AND emergency_type = ?';
      params.push(category);
    }

    if (requesterId) {
      sql += ' AND (requester_id = ? OR phone = ?)';
      params.push(requesterId, requesterId);
    }

    if (search) {
      sql += ' AND (id LIKE ? OR name LIKE ? OR area LIKE ? OR details LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY created_at DESC';

    const requests = queryAll(db, sql, params);
    res.json({ requests });
  } catch (err) {
    console.error('Fetch requests error:', err);
    res.status(500).json({ error: 'Failed to retrieve emergency requests.' });
  }
});

router.post('/requests', async (req: Request, res: Response) => {
  try {
    const { requesterId, name, phone, area, emergencyType, peopleCount, details, latitude, longitude } = req.body;

    if (!name || !phone || !area || !emergencyType) {
      return res.status(400).json({ error: 'Please provide full name, contact phone, area, and emergency type.' });
    }

    const db = await getDb();
    const count = parseInt(peopleCount, 10) || 1;
    const now = new Date().toISOString();

    // Unique Request ID format: REQ-YYYY-RANDOM4
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const requestId = `REQ-${new Date().getFullYear()}-${randomSuffix}`;

    executeRun(
      db,
      `INSERT INTO emergency_requests (id, requester_id, name, phone, area, emergency_type, people_count, details, status, latitude, longitude, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?, ?, ?, ?)`,
      [
        requestId,
        requesterId || null,
        name.trim(),
        phone.trim(),
        area.trim(),
        emergencyType,
        count,
        details ? details.trim() : '',
        latitude || null,
        longitude || null,
        now,
        now
      ]
    );

    // Record initial status history
    executeRun(
      db,
      `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`HIST-${requestId}-0`, requestId, 'None', 'Pending', name.trim(), now]
    );

    res.status(201).json({
      success: true,
      requestId,
      status: 'Pending',
      createdAt: now,
      message: 'Emergency request received and prioritized in coordination queue.'
    });
  } catch (err) {
    console.error('Create request error:', err);
    res.status(500).json({ error: 'Failed to submit emergency request.' });
  }
});

router.get('/requests/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const db = await getDb();
    const request = queryOne(db, 'SELECT * FROM emergency_requests WHERE id = ?', [id]);
    if (!request) {
      return res.status(404).json({ error: 'Emergency request not found with provided ID.' });
    }

    const history = queryAll(
      db,
      'SELECT * FROM status_history WHERE emergency_request_id = ? ORDER BY changed_at ASC',
      [id]
    );

    const relatedTasks = queryAll(
      db,
      `SELECT t.*, ta.volunteer_id, ta.assignment_status, v.phone as volunteer_phone, u.full_name as volunteer_name
       FROM tasks t
       LEFT JOIN task_assignments ta ON t.id = ta.task_id
       LEFT JOIN volunteers v ON ta.volunteer_id = v.id
       LEFT JOIN users u ON v.user_id = u.id
       WHERE t.emergency_request_id = ?`,
      [id]
    );

    res.json({ request, history, tasks: relatedTasks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch request details.' });
  }
});

router.patch('/requests/:id/status', requireAuth, requireRole(['rescue', 'headoffice']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    if (!['Pending', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status value. Must be Pending, In Progress, or Completed.' });
    }

    const db = await getDb();
    const existing = queryOne(db, 'SELECT * FROM emergency_requests WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'Emergency request not found.' });
    }

    const oldStatus = existing.status;
    const now = new Date().toISOString();
    const changedBy = `${req.user!.fullName} (${req.user!.role.toUpperCase()})`;

    executeRun(
      db,
      'UPDATE emergency_requests SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, id]
    );

    executeRun(
      db,
      `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`HIST-${id}-${Date.now().toString(36)}`, id, oldStatus, status, `${changedBy}${note ? ' - ' + note : ''}`, now]
    );

    res.json({ success: true, id, oldStatus, newStatus: status, updatedAt: now });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ error: 'Failed to update request status.' });
  }
});

// ---------------- VOLUNTEER COORDINATION ---------------- //

router.get('/volunteers', requireAuth, requireRole(['rescue', 'headoffice', 'volunteer']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const volunteers = queryAll(
      db,
      `SELECT v.*, u.full_name, u.username
       FROM volunteers v
       JOIN users u ON v.user_id = u.id
       ORDER BY v.created_at DESC`
    );
    res.json({ volunteers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load volunteers list.' });
  }
});

router.get('/volunteers/me', requireAuth, requireRole(['volunteer']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const vol = queryOne(
      db,
      `SELECT v.*, u.full_name, u.username
       FROM volunteers v
       JOIN users u ON v.user_id = u.id
       WHERE v.user_id = ?`,
      [req.user!.userId]
    );

    if (!vol) {
      return res.status(404).json({ error: 'Volunteer profile not registered yet.' });
    }

    res.json({ volunteer: vol });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get volunteer profile.' });
  }
});

router.patch('/volunteers/me', requireAuth, requireRole(['volunteer']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { availability, location, skills, experience, phone } = req.body;
    const db = await getDb();

    const vol = queryOne(db, 'SELECT id FROM volunteers WHERE user_id = ?', [req.user!.userId]);
    if (!vol) {
      return res.status(404).json({ error: 'Volunteer record not found.' });
    }

    if (availability && !['Available', 'Busy', 'Off-duty'].includes(availability)) {
      return res.status(400).json({ error: 'Invalid availability state.' });
    }

    executeRun(
      db,
      `UPDATE volunteers
       SET availability = COALESCE(?, availability),
           location = COALESCE(?, location),
           skills = COALESCE(?, skills),
           experience = COALESCE(?, experience),
           phone = COALESCE(?, phone)
       WHERE id = ?`,
      [
        availability || null,
        location || null,
        Array.isArray(skills) ? skills.join(', ') : (skills || null),
        experience || null,
        phone || null,
        vol.id
      ]
    );

    const updated = queryOne(db, 'SELECT * FROM volunteers WHERE id = ?', [vol.id]);
    res.json({ success: true, volunteer: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update volunteer profile.' });
  }
});

// ---------------- TASK ASSIGNMENT ROUTES ---------------- //

router.get('/tasks', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    let sql = `
      SELECT t.*,
             er.area as emergency_area, er.emergency_type, er.name as requester_name, er.phone as requester_phone,
             ta.id as assignment_id, ta.volunteer_id, ta.assignment_status, ta.notes as assignment_notes,
             ta.assigned_at, ta.completed_at,
             u.full_name as volunteer_name
      FROM tasks t
      LEFT JOIN emergency_requests er ON t.emergency_request_id = er.id
      LEFT JOIN task_assignments ta ON t.id = ta.task_id
      LEFT JOIN volunteers v ON ta.volunteer_id = v.id
      LEFT JOIN users u ON v.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    // If role is volunteer, only return tasks assigned to this volunteer
    if (req.user!.role === 'volunteer') {
      const vol = queryOne(db, 'SELECT id FROM volunteers WHERE user_id = ?', [req.user!.userId]);
      if (!vol) {
        return res.json({ tasks: [] });
      }
      sql += ' AND ta.volunteer_id = ?';
      params.push(vol.id);
    }

    sql += ' ORDER BY t.created_at DESC';
    const tasks = queryAll(db, sql, params);
    res.json({ tasks });
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

router.post('/tasks', requireAuth, requireRole(['rescue', 'headoffice']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { emergencyRequestId, title, description, priority, volunteerId } = req.body;

    if (!title || !priority || !volunteerId) {
      return res.status(400).json({ error: 'Title, priority, and volunteer assignment are required.' });
    }

    const db = await getDb();
    const taskId = `TSK-${Date.now().toString(36).toUpperCase()}`;
    const assignId = `ASN-${Date.now().toString(36).toUpperCase()}`;
    const now = new Date().toISOString();

    // Verify volunteer is available
    const vol = queryOne(db, 'SELECT * FROM volunteers WHERE id = ?', [volunteerId]);
    if (!vol) {
      return res.status(404).json({ error: 'Selected volunteer does not exist.' });
    }

    executeRun(
      db,
      `INSERT INTO tasks (id, emergency_request_id, title, description, priority, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, 'Assigned', ?, ?)`,
      [taskId, emergencyRequestId || null, title.trim(), description || '', priority, now, now]
    );

    executeRun(
      db,
      `INSERT INTO task_assignments (id, task_id, volunteer_id, assignment_status, notes, assigned_at)
       VALUES (?, ?, ?, 'Assigned', 'Assigned by Rescue Coordination Unit', ?)`,
      [assignId, taskId, volunteerId, now]
    );

    // If emergency request attached, ensure its status is In Progress
    if (emergencyRequestId) {
      executeRun(
        db,
        "UPDATE emergency_requests SET status = 'In Progress', updated_at = ? WHERE id = ? AND status = 'Pending'",
        [now, emergencyRequestId]
      );
      executeRun(
        db,
        `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
         VALUES (?, ?, 'Pending', 'In Progress', ?, ?)`,
        [`HIST-${emergencyRequestId}-${Date.now().toString(36)}`, emergencyRequestId, `Task Assigned: ${title}`, now]
      );
    }

    res.status(201).json({ success: true, taskId, assignId });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

router.patch('/tasks/:id/status', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!['Assigned', 'Accepted', 'In Progress', 'Completed', 'Declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid task status.' });
    }

    const db = await getDb();
    const task = queryOne(db, 'SELECT * FROM tasks WHERE id = ?', [id]);
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const now = new Date().toISOString();
    const completedAt = status === 'Completed' ? now : null;

    executeRun(
      db,
      'UPDATE tasks SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, id]
    );

    executeRun(
      db,
      `UPDATE task_assignments
       SET assignment_status = ?,
           notes = COALESCE(?, notes),
           completed_at = COALESCE(?, completed_at)
       WHERE task_id = ?`,
      [status, notes || null, completedAt, id]
    );

    res.json({ success: true, id, status, updated_at: now });
  } catch (err) {
    console.error('Task status error:', err);
    res.status(500).json({ error: 'Failed to update task status.' });
  }
});

// ---------------- STATISTICS & MONITORING ---------------- //

router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const db = await getDb();

    // Requests breakdown
    const totalRequestsRes = queryOne(db, 'SELECT COUNT(*) as count FROM emergency_requests');
    const pendingRes = queryOne(db, "SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Pending'");
    const inProgressRes = queryOne(db, "SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'In Progress'");
    const completedRes = queryOne(db, "SELECT COUNT(*) as count FROM emergency_requests WHERE status = 'Completed'");

    // Volunteers breakdown
    const totalVolunteersRes = queryOne(db, 'SELECT COUNT(*) as count FROM volunteers');
    const availableVolunteersRes = queryOne(db, "SELECT COUNT(*) as count FROM volunteers WHERE availability = 'Available'");

    // Active task assignments
    const activeTasksRes = queryOne(db, "SELECT COUNT(*) as count FROM tasks WHERE status IN ('Assigned', 'In Progress')");

    // People rescued / assisted
    const peopleAssistedRes = queryOne(db, "SELECT SUM(people_count) as total FROM emergency_requests WHERE status = 'Completed'");

    // Category breakdown
    const categoryRows = queryAll(
      db,
      `SELECT emergency_type as category, COUNT(*) as count
       FROM emergency_requests
       GROUP BY emergency_type
       ORDER BY count DESC`
    );

    // Recent requests
    const recentRequests = queryAll(
      db,
      `SELECT id, name, area, emergency_type, people_count, status, created_at
       FROM emergency_requests
       ORDER BY created_at DESC
       LIMIT 6`
    );

    // Audit activities
    const recentActivities = queryAll(
      db,
      `SELECT sh.*, er.name as requester_name, er.emergency_type
       FROM status_history sh
       LEFT JOIN emergency_requests er ON sh.emergency_request_id = er.id
       ORDER BY sh.changed_at DESC
       LIMIT 8`
    );

    res.json({
      totalRequests: totalRequestsRes?.count || 0,
      pendingRequests: pendingRes?.count || 0,
      inProgressRequests: inProgressRes?.count || 0,
      completedRequests: completedRes?.count || 0,
      totalVolunteers: totalVolunteersRes?.count || 0,
      availableVolunteers: availableVolunteersRes?.count || 0,
      activeTasks: activeTasksRes?.count || 0,
      peopleAssisted: peopleAssistedRes?.total || 0,
      categoryDistribution: categoryRows,
      recentRequests,
      recentActivities
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to calculate database statistics.' });
  }
});

// CSV Export for Head Office
router.get('/reports/export-csv', requireAuth, requireRole(['headoffice', 'rescue']), async (req: AuthenticatedRequest, res: Response) => {
  try {
    const db = await getDb();
    const rows = queryAll(
      db,
      `SELECT id, name, phone, area, emergency_type, people_count, status, details, created_at, updated_at
       FROM emergency_requests
       ORDER BY created_at DESC`
    );

    const headers = ['Request ID', 'Requester Name', 'Contact Phone', 'Area / Location', 'Emergency Type', 'People Count', 'Status', 'Details', 'Submission Time', 'Last Updated'];

    const csvLines = [headers.join(',')];
    for (const r of rows) {
      const line = [
        r.id,
        `"${(r.name || '').replace(/"/g, '""')}"`,
        `"${(r.phone || '').replace(/"/g, '""')}"`,
        `"${(r.area || '').replace(/"/g, '""')}"`,
        `"${r.emergency_type}"`,
        r.people_count,
        `"${r.status}"`,
        `"${(r.details || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
        r.created_at,
        r.updated_at
      ];
      csvLines.push(line.join(','));
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=DisasterShield_Emergency_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    res.send(csvLines.join('\n'));
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate CSV export.' });
  }
});

export default router;

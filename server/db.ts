import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'disastershield.sqlite');

let dbInstance: Database | null = null;

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to save database to disk:', err);
  }
}

export async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
      console.log('Loaded existing SQLite database from disk:', DB_FILE);
    } catch (e) {
      console.warn('Failed to load existing database file, creating a fresh one:', e);
      dbInstance = new SQL.Database();
    }
  } else {
    console.log('Creating fresh SQLite database at:', DB_FILE);
    dbInstance = new SQL.Database();
  }

  // Enable foreign keys
  dbInstance.run('PRAGMA foreign_keys = ON;');

  initSchema(dbInstance);
  seedInitialData(dbInstance);
  saveDatabase();

  return dbInstance;
}

function initSchema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('people', 'volunteer', 'rescue', 'headoffice')),
      full_name TEXT NOT NULL,
      phone TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS emergency_requests (
      id TEXT PRIMARY KEY,
      requester_id TEXT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      area TEXT NOT NULL,
      emergency_type TEXT NOT NULL,
      people_count INTEGER NOT NULL DEFAULT 1,
      details TEXT,
      status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Progress', 'Completed')),
      latitude REAL,
      longitude REAL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS volunteers (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      location TEXT NOT NULL,
      skills TEXT NOT NULL,
      availability TEXT NOT NULL DEFAULT 'Available' CHECK(availability IN ('Available', 'Busy', 'Off-duty')),
      experience TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS volunteer_skills (
      id TEXT PRIMARY KEY,
      volunteer_id TEXT NOT NULL,
      skill_name TEXT NOT NULL,
      FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      emergency_request_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'High' CHECK(priority IN ('Critical', 'High', 'Medium', 'Low')),
      status TEXT NOT NULL DEFAULT 'Assigned' CHECK(status IN ('Assigned', 'In Progress', 'Completed', 'Declined')),
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS task_assignments (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      volunteer_id TEXT NOT NULL,
      assignment_status TEXT NOT NULL DEFAULT 'Assigned' CHECK(assignment_status IN ('Assigned', 'Accepted', 'Declined', 'Completed')),
      notes TEXT,
      assigned_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
      FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS status_history (
      id TEXT PRIMARY KEY,
      emergency_request_id TEXT NOT NULL,
      old_status TEXT NOT NULL,
      new_status TEXT NOT NULL,
      changed_by TEXT NOT NULL,
      changed_at TEXT NOT NULL,
      FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_requests_status ON emergency_requests(status);
    CREATE INDEX IF NOT EXISTS idx_requests_created ON emergency_requests(created_at);
    CREATE INDEX IF NOT EXISTS idx_volunteers_avail ON volunteers(availability);
    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
  `);
}

function seedInitialData(db: Database) {
  // Check if users exist
  const res = db.exec('SELECT COUNT(*) as count FROM users');
  const userCount = res[0]?.values[0]?.[0] as number;

  if (userCount > 0) {
    return;
  }

  console.log('Seeding initial demonstration data...');

  const now = new Date().toISOString();
  const salt = bcrypt.genSaltSync(10);

  // Default demonstration users
  const defaultUsers = [
    {
      id: 'USR-PEOPLE-01',
      username: 'citizen',
      email: 'citizen@shield.org',
      password: 'citizen123',
      role: 'people',
      full_name: 'Ananya Sharma',
      phone: '+91 98450 12345'
    },
    {
      id: 'USR-VOL-01',
      username: 'volunteer',
      email: 'volunteer@shield.org',
      password: 'volunteer123',
      role: 'volunteer',
      full_name: 'Karthik Raja',
      phone: '+91 94441 55678'
    },
    {
      id: 'USR-VOL-02',
      username: 'volunteer2',
      email: 'priya.vol@shield.org',
      password: 'volunteer123',
      role: 'volunteer',
      full_name: 'Priya Sundaram',
      phone: '+91 98840 99887'
    },
    {
      id: 'USR-RESCUE-01',
      username: 'rescue',
      email: 'rescue@shield.org',
      password: 'rescue123',
      role: 'rescue',
      full_name: 'Capt. Vikram Rathore (Rescue SAR-1)',
      phone: '+91 99000 88776'
    },
    {
      id: 'USR-HEAD-01',
      username: 'headoffice',
      email: 'headoffice@shield.org',
      password: 'office123',
      role: 'headoffice',
      full_name: 'Dr. Meera Nambiar (State Coordinator)',
      phone: '+91 98111 22334'
    }
  ];

  for (const u of defaultUsers) {
    const hash = bcrypt.hashSync(u.password, salt);
    db.run(
      'INSERT INTO users (id, username, email, password_hash, role, full_name, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [u.id, u.username, u.email, hash, u.role, u.full_name, u.phone, now]
    );
  }

  // Seed initial volunteer profiles
  db.run(
    `INSERT INTO volunteers (id, user_id, phone, email, location, skills, availability, experience, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'VOL-01',
      'USR-VOL-01',
      '+91 94441 55678',
      'volunteer@shield.org',
      'Velachery, Chennai, Tamil Nadu',
      'First aid, Search and rescue support, Transportation support',
      'Available',
      '4 years emergency disaster volunteer, Red Cross certified first responder',
      now
    ]
  );

  db.run(
    `INSERT INTO volunteers (id, user_id, phone, email, location, skills, availability, experience, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      'VOL-02',
      'USR-VOL-02',
      '+91 98840 99887',
      'priya.vol@shield.org',
      'Adyar, Chennai, Tamil Nadu',
      'Food distribution, Shelter assistance, Medical support',
      'Available',
      'Registered nurse, experienced in mobile triage and relief supplies',
      now
    ]
  );

  // Initial seed emergency requests
  const sampleRequests = [
    {
      id: 'REQ-2026-1001',
      name: 'Ramesh Sundar',
      phone: '+91 98401 23456',
      area: 'Ward 142, AGS Colony, Velachery, Chennai',
      type: 'Flood',
      count: 4,
      details: 'Ground floor submerged with 3.5 feet flood water. Elderly grandmother and 2 children need boat evacuation to dry shelter.',
      status: 'Pending',
      lat: 12.9815,
      lng: 80.2180,
      time: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'REQ-2026-1002',
      name: 'Lakshmi Narayan',
      phone: '+91 94432 77889',
      area: 'Bazaar Road, Saidapet, Chennai',
      type: 'Trapped Person',
      count: 2,
      details: 'Collapsed portico blocking main entrance of residential house. Inhabitants safe inside but unable to open gate.',
      status: 'In Progress',
      lat: 13.0213,
      lng: 80.2231,
      time: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      id: 'REQ-2026-1003',
      name: 'Dr. Arun Verma',
      phone: '+91 97900 11223',
      area: 'Sector 4, Rohini Community Clinic, Delhi',
      type: 'Medical Emergency',
      count: 6,
      details: 'Backup generator failed during storm; urgent oxygen cylinder transport and portable power supply required.',
      status: 'In Progress',
      lat: 28.7158,
      lng: 77.1147,
      time: new Date(Date.now() - 3600000 * 8).toISOString()
    },
    {
      id: 'REQ-2026-1004',
      name: 'Sunita Devi',
      phone: '+91 98101 44556',
      area: 'Block C, Mayur Vihar Phase 1, Delhi',
      type: 'Building Damage',
      count: 5,
      details: 'Severe ceiling plaster cracking after heavy rains. Structural evaluation requested; family temporarily sheltering outside.',
      status: 'Completed',
      lat: 28.6083,
      lng: 77.2949,
      time: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'REQ-2026-1005',
      name: 'Mohamed Farooq',
      phone: '+91 98412 66778',
      area: 'Coastal Road, Nagapattinam Port',
      type: 'Cyclone',
      count: 12,
      details: 'High tidal surge flooded fisherman colony huts. Emergency drinking water and high-energy food packets needed.',
      status: 'Pending',
      lat: 10.7656,
      lng: 79.8424,
      time: new Date(Date.now() - 3600000 * 1).toISOString()
    }
  ];

  for (const r of sampleRequests) {
    db.run(
      `INSERT INTO emergency_requests (id, requester_id, name, phone, area, emergency_type, people_count, details, status, latitude, longitude, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [r.id, 'USR-PEOPLE-01', r.name, r.phone, r.area, r.type, r.count, r.details, r.status, r.lat, r.lng, r.time, r.time]
    );

    // Initial status history
    db.run(
      `INSERT INTO status_history (id, emergency_request_id, old_status, new_status, changed_by, changed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [`HIST-${r.id}-0`, r.id, 'Submitted', r.status, 'System Initializer', r.time]
    );
  }

  // Seed sample task and assignment
  const taskId = 'TSK-2026-001';
  db.run(
    `INSERT INTO tasks (id, emergency_request_id, title, description, priority, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      taskId,
      'REQ-2026-1002',
      'Portico Debris Removal & Access Clearance',
      'Deploy cutting equipment to clear fallen portico gate at Bazaar Road and secure exit route.',
      'Critical',
      'In Progress',
      now,
      now
    ]
  );

  db.run(
    `INSERT INTO task_assignments (id, task_id, volunteer_id, assignment_status, notes, assigned_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      'ASN-2026-001',
      taskId,
      'VOL-01',
      'Accepted',
      'Volunteer Karthik en route with hand tools and emergency stretcher.',
      now
    ]
  );
}

// Helper methods to query sql.js cleanly
export function queryAll<T = any>(db: Database, sql: string, params: any[] = []): T[] {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function queryOne<T = any>(db: Database, sql: string, params: any[] = []): T | null {
  const items = queryAll<T>(db, sql, params);
  return items.length > 0 ? items[0] : null;
}

export function executeRun(db: Database, sql: string, params: any[] = []): void {
  db.run(sql, params);
  saveDatabase();
}

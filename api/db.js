const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let db;

const initDatabase = () => {
  if (!db) {
    // For Vercel, we'll use an in-memory database or a file-based one
    const dbPath = process.env.NODE_ENV === 'production' 
      ? '/tmp/pmajay.db' 
      : path.join(__dirname, '../server/pmajay.db');
    
    db = new sqlite3.Database(dbPath);
    
    // Initialize tables if they don't exist
    db.serialize(() => {
      // Beneficiaries table
      db.run(`
        CREATE TABLE IF NOT EXISTS beneficiaries (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          age INTEGER NOT NULL,
          gender TEXT NOT NULL,
          state TEXT NOT NULL,
          district TEXT NOT NULL,
          caste_category TEXT NOT NULL,
          aadhar_number TEXT UNIQUE NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          education_level TEXT NOT NULL,
          annual_income REAL NOT NULL,
          family_size INTEGER NOT NULL,
          occupation TEXT,
          skills TEXT,
          bank_account TEXT NOT NULL,
          ifsc_code TEXT NOT NULL,
          eligibility_score INTEGER,
          is_verified BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Projects table
      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          beneficiary_id INTEGER NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          project_type TEXT NOT NULL,
          requested_amount REAL NOT NULL,
          approved_amount REAL DEFAULT 0,
          status TEXT DEFAULT 'submitted',
          priority_score REAL DEFAULT 0,
          completion_percentage INTEGER DEFAULT 0,
          submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries (id)
        )
      `);

      // Training programs table
      db.run(`
        CREATE TABLE IF NOT EXISTS training_programs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          category TEXT NOT NULL,
          duration_weeks INTEGER NOT NULL,
          max_participants INTEGER NOT NULL,
          current_participants INTEGER DEFAULT 0,
          start_date DATE,
          end_date DATE,
          status TEXT DEFAULT 'upcoming',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Audit logs table
      db.run(`
        CREATE TABLE IF NOT EXISTS audit_logs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          action TEXT NOT NULL,
          table_name TEXT NOT NULL,
          record_id INTEGER,
          old_values TEXT,
          new_values TEXT,
          user_id TEXT,
          ip_address TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
    });
  }
  return db;
};

const getDatabase = () => {
  if (!db) {
    initDatabase();
  }
  return db;
};

module.exports = { getDatabase, initDatabase };

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Database
const db = new sqlite3.Database('./pmajay.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Database Schema
function initializeDatabase() {
  db.serialize(() => {
    // Beneficiaries Table
    db.run(`CREATE TABLE IF NOT EXISTS beneficiaries (
      id TEXT PRIMARY KEY,
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
      bank_account TEXT,
      ifsc_code TEXT,
      verification_status TEXT DEFAULT 'pending',
      eligibility_score REAL DEFAULT 0,
      registration_date TEXT DEFAULT CURRENT_TIMESTAMP,
      last_updated TEXT DEFAULT CURRENT_TIMESTAMP
    )`);

    // Projects Table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      beneficiary_id TEXT NOT NULL,
      project_type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      category TEXT NOT NULL,
      requested_amount REAL NOT NULL,
      approved_amount REAL DEFAULT 0,
      status TEXT DEFAULT 'submitted',
      priority_score REAL DEFAULT 0,
      submission_date TEXT DEFAULT CURRENT_TIMESTAMP,
      approval_date TEXT,
      completion_date TEXT,
      completion_percentage INTEGER DEFAULT 0,
      remarks TEXT,
      FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id)
    )`);

    // Skills Table
    db.run(`CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      demand_level TEXT NOT NULL,
      avg_income_potential REAL
    )`);

    // Training Programs Table
    db.run(`CREATE TABLE IF NOT EXISTS training_programs (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      skill_category TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      provider TEXT NOT NULL,
      location TEXT NOT NULL,
      capacity INTEGER NOT NULL,
      enrolled_count INTEGER DEFAULT 0,
      start_date TEXT,
      end_date TEXT,
      status TEXT DEFAULT 'open'
    )`);

    // Enrollments Table
    db.run(`CREATE TABLE IF NOT EXISTS enrollments (
      id TEXT PRIMARY KEY,
      beneficiary_id TEXT NOT NULL,
      training_program_id TEXT NOT NULL,
      enrollment_date TEXT DEFAULT CURRENT_TIMESTAMP,
      status TEXT DEFAULT 'enrolled',
      completion_status TEXT DEFAULT 'in_progress',
      FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id),
      FOREIGN KEY (training_program_id) REFERENCES training_programs(id)
    )`);

    // Audit Logs Table
    db.run(`CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      action TEXT NOT NULL,
      performed_by TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
      details TEXT
    )`);

    // Seed initial data
    seedData();
  });
}

// Seed Sample Data
function seedData() {
  // Check if data already exists
  db.get('SELECT COUNT(*) as count FROM skills', [], (err, row) => {
    if (err || row.count > 0) return;

    // Seed Skills
    const skills = [
      { id: uuidv4(), name: 'Tailoring', category: 'Income Generation', demand_level: 'High', avg_income_potential: 15000 },
      { id: uuidv4(), name: 'Plumbing', category: 'Skill Development', demand_level: 'High', avg_income_potential: 20000 },
      { id: uuidv4(), name: 'Carpentry', category: 'Skill Development', demand_level: 'Medium', avg_income_potential: 18000 },
      { id: uuidv4(), name: 'Beauty & Wellness', category: 'Income Generation', demand_level: 'High', avg_income_potential: 16000 },
      { id: uuidv4(), name: 'Mobile Repair', category: 'Skill Development', demand_level: 'High', avg_income_potential: 22000 },
      { id: uuidv4(), name: 'Food Processing', category: 'Income Generation', demand_level: 'Medium', avg_income_potential: 14000 },
      { id: uuidv4(), name: 'Computer Basics', category: 'Skill Development', demand_level: 'High', avg_income_potential: 25000 },
      { id: uuidv4(), name: 'Dairy Farming', category: 'Income Generation', demand_level: 'Medium', avg_income_potential: 30000 },
    ];

    skills.forEach(skill => {
      db.run('INSERT INTO skills VALUES (?, ?, ?, ?, ?)', 
        [skill.id, skill.name, skill.category, skill.demand_level, skill.avg_income_potential]);
    });

    // Seed Training Programs
    const programs = [
      { 
        id: uuidv4(), 
        name: 'Advanced Tailoring Course', 
        skill_category: 'Income Generation',
        duration_days: 90,
        provider: 'National Skill Development Corporation',
        location: 'Delhi',
        capacity: 30,
        enrolled_count: 12,
        start_date: '2025-11-01',
        end_date: '2026-01-30',
        status: 'open'
      },
      { 
        id: uuidv4(), 
        name: 'Digital Marketing Bootcamp', 
        skill_category: 'Skill Development',
        duration_days: 60,
        provider: 'PM Kaushal Vikas Yojana',
        location: 'Mumbai',
        capacity: 25,
        enrolled_count: 8,
        start_date: '2025-11-15',
        end_date: '2026-01-15',
        status: 'open'
      },
    ];

    programs.forEach(program => {
      db.run('INSERT INTO training_programs VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [program.id, program.name, program.skill_category, program.duration_days, 
         program.provider, program.location, program.capacity, program.enrolled_count,
         program.start_date, program.end_date, program.status]);
    });
  });
}

// Helper function to calculate eligibility score
function calculateEligibilityScore(beneficiary) {
  let score = 0;
  
  // Income criterion (40 points max)
  if (beneficiary.annual_income < 50000) score += 40;
  else if (beneficiary.annual_income < 100000) score += 30;
  else if (beneficiary.annual_income < 150000) score += 20;
  else score += 10;
  
  // Education criterion (20 points max)
  const educationScores = {
    'No formal education': 20,
    'Primary': 18,
    'Secondary': 15,
    'Higher Secondary': 12,
    'Graduate': 8,
    'Post Graduate': 5
  };
  score += educationScores[beneficiary.education_level] || 10;
  
  // Family size criterion (20 points max)
  if (beneficiary.family_size > 6) score += 20;
  else if (beneficiary.family_size > 4) score += 15;
  else score += 10;
  
  // SC category verification (20 points - mandatory)
  if (beneficiary.caste_category === 'SC') score += 20;
  
  return score;
}

// Helper function to log audit
function logAudit(entityType, entityId, action, performedBy, details) {
  const id = uuidv4();
  db.run('INSERT INTO audit_logs (id, entity_type, entity_id, action, performed_by, details) VALUES (?, ?, ?, ?, ?, ?)',
    [id, entityType, entityId, action, performedBy, JSON.stringify(details)]);
}

// ============ API ENDPOINTS ============

// Dashboard Stats
app.get('/api/dashboard/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as total, AVG(eligibility_score) as avg_score FROM beneficiaries', [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    stats.totalBeneficiaries = row?.total || 0;
    stats.avgEligibilityScore = row?.avg_score?.toFixed(2) || 0;
    
    db.get('SELECT COUNT(*) as verified FROM beneficiaries WHERE verification_status = "verified"', [], (err, row) => {
      stats.verifiedBeneficiaries = row?.verified || 0;
      
      db.get('SELECT COUNT(*) as total, SUM(approved_amount) as total_amount FROM projects', [], (err, row) => {
        stats.totalProjects = row?.total || 0;
        stats.totalFundingApproved = row?.total_amount || 0;
        
        db.get('SELECT COUNT(*) as active FROM projects WHERE status IN ("approved", "in_progress")', [], (err, row) => {
          stats.activeProjects = row?.active || 0;
          
          db.get('SELECT COUNT(*) as completed FROM projects WHERE status = "completed"', [], (err, row) => {
            stats.completedProjects = row?.completed || 0;
            
            db.all(`SELECT state, COUNT(*) as count FROM beneficiaries GROUP BY state ORDER BY count DESC LIMIT 5`, [], (err, rows) => {
              stats.topStates = rows || [];
              
              db.all(`SELECT category, COUNT(*) as count FROM projects GROUP BY category`, [], (err, rows) => {
                stats.projectsByCategory = rows || [];
                res.json(stats);
              });
            });
          });
        });
      });
    });
  });
});

// Beneficiaries - Get All
app.get('/api/beneficiaries', (req, res) => {
  const { state, status, limit = 100, offset = 0 } = req.query;
  
  let query = 'SELECT * FROM beneficiaries WHERE 1=1';
  const params = [];
  
  if (state) {
    query += ' AND state = ?';
    params.push(state);
  }
  
  if (status) {
    query += ' AND verification_status = ?';
    params.push(status);
  }
  
  query += ' ORDER BY eligibility_score DESC, registration_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Beneficiaries - Get One
app.get('/api/beneficiaries/:id', (req, res) => {
  db.get('SELECT * FROM beneficiaries WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Beneficiary not found' });
    res.json(row);
  });
});

// Beneficiaries - Create
app.post('/api/beneficiaries', (req, res) => {
  const beneficiary = {
    id: uuidv4(),
    ...req.body,
    eligibility_score: 0,
    verification_status: 'pending'
  };
  
  // Calculate eligibility score
  beneficiary.eligibility_score = calculateEligibilityScore(beneficiary);
  
  const query = `INSERT INTO beneficiaries 
    (id, name, age, gender, state, district, caste_category, aadhar_number, phone, email, 
     education_level, annual_income, family_size, occupation, skills, bank_account, ifsc_code, 
     verification_status, eligibility_score) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    beneficiary.id, beneficiary.name, beneficiary.age, beneficiary.gender, beneficiary.state, 
    beneficiary.district, beneficiary.caste_category, beneficiary.aadhar_number, beneficiary.phone, 
    beneficiary.email, beneficiary.education_level, beneficiary.annual_income, beneficiary.family_size,
    beneficiary.occupation, beneficiary.skills, beneficiary.bank_account, beneficiary.ifsc_code,
    beneficiary.verification_status, beneficiary.eligibility_score
  ], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Aadhar number already registered' });
      }
      return res.status(500).json({ error: err.message });
    }
    
    logAudit('beneficiary', beneficiary.id, 'created', 'system', beneficiary);
    res.status(201).json({ ...beneficiary, message: 'Beneficiary registered successfully' });
  });
});

// Beneficiaries - Update Verification Status
app.patch('/api/beneficiaries/:id/verify', (req, res) => {
  const { status, remarks } = req.body;
  
  db.run('UPDATE beneficiaries SET verification_status = ?, last_updated = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Beneficiary not found' });
      
      logAudit('beneficiary', req.params.id, 'verification_updated', 'admin', { status, remarks });
      res.json({ message: 'Verification status updated', status });
    });
});

// Projects - Get All
app.get('/api/projects', (req, res) => {
  const { beneficiary_id, status, category, limit = 100 } = req.query;
  
  let query = `SELECT p.*, b.name as beneficiary_name, b.state, b.district 
               FROM projects p 
               JOIN beneficiaries b ON p.beneficiary_id = b.id 
               WHERE 1=1`;
  const params = [];
  
  if (beneficiary_id) {
    query += ' AND p.beneficiary_id = ?';
    params.push(beneficiary_id);
  }
  
  if (status) {
    query += ' AND p.status = ?';
    params.push(status);
  }
  
  if (category) {
    query += ' AND p.category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY p.priority_score DESC, p.submission_date DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Projects - Create
app.post('/api/projects', (req, res) => {
  const project = {
    id: uuidv4(),
    ...req.body,
    status: 'submitted',
    priority_score: Math.random() * 100, // Simple priority algorithm
    completion_percentage: 0
  };
  
  const query = `INSERT INTO projects 
    (id, beneficiary_id, project_type, title, description, category, requested_amount, status, priority_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    project.id, project.beneficiary_id, project.project_type, project.title, 
    project.description, project.category, project.requested_amount, project.status, project.priority_score
  ], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    logAudit('project', project.id, 'created', 'beneficiary', project);
    res.status(201).json({ ...project, message: 'Project submitted successfully' });
  });
});

// Projects - Update Status
app.patch('/api/projects/:id/status', (req, res) => {
  const { status, approved_amount, remarks, completion_percentage } = req.body;
  
  let query = 'UPDATE projects SET status = ?';
  const params = [status];
  
  if (approved_amount !== undefined) {
    query += ', approved_amount = ?, approval_date = CURRENT_TIMESTAMP';
    params.push(approved_amount);
  }
  
  if (remarks) {
    query += ', remarks = ?';
    params.push(remarks);
  }
  
  if (completion_percentage !== undefined) {
    query += ', completion_percentage = ?';
    params.push(completion_percentage);
    if (completion_percentage === 100) {
      query += ', completion_date = CURRENT_TIMESTAMP';
    }
  }
  
  query += ' WHERE id = ?';
  params.push(req.params.id);
  
  db.run(query, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Project not found' });
    
    logAudit('project', req.params.id, 'status_updated', 'admin', { status, approved_amount, remarks });
    res.json({ message: 'Project status updated' });
  });
});

// Skills - Get All
app.get('/api/skills', (req, res) => {
  db.all('SELECT * FROM skills ORDER BY demand_level DESC, avg_income_potential DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Training Programs - Get All
app.get('/api/training-programs', (req, res) => {
  const { status, category } = req.query;
  
  let query = 'SELECT * FROM training_programs WHERE 1=1';
  const params = [];
  
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  
  if (category) {
    query += ' AND skill_category = ?';
    params.push(category);
  }
  
  query += ' ORDER BY start_date DESC';
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Enrollments - Create
app.post('/api/enrollments', (req, res) => {
  const enrollment = {
    id: uuidv4(),
    ...req.body,
    status: 'enrolled',
    completion_status: 'in_progress'
  };
  
  db.run('INSERT INTO enrollments (id, beneficiary_id, training_program_id, status, completion_status) VALUES (?, ?, ?, ?, ?)',
    [enrollment.id, enrollment.beneficiary_id, enrollment.training_program_id, enrollment.status, enrollment.completion_status],
    function(err) {
      if (err) return res.status(500).json({ error: err.message });
      
      // Update enrolled count
      db.run('UPDATE training_programs SET enrolled_count = enrolled_count + 1 WHERE id = ?', 
        [enrollment.training_program_id]);
      
      logAudit('enrollment', enrollment.id, 'created', 'system', enrollment);
      res.status(201).json({ ...enrollment, message: 'Enrolled successfully' });
    });
});

// Audit Logs - Get All
app.get('/api/audit-logs', (req, res) => {
  const { entity_type, entity_id, limit = 50 } = req.query;
  
  let query = 'SELECT * FROM audit_logs WHERE 1=1';
  const params = [];
  
  if (entity_type) {
    query += ' AND entity_type = ?';
    params.push(entity_type);
  }
  
  if (entity_id) {
    query += ' AND entity_id = ?';
    params.push(entity_id);
  }
  
  query += ' ORDER BY timestamp DESC LIMIT ?';
  params.push(parseInt(limit));
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Analytics - Beneficiary Distribution
app.get('/api/analytics/beneficiary-distribution', (req, res) => {
  const analytics = {};
  
  db.all('SELECT state, COUNT(*) as count FROM beneficiaries GROUP BY state', [], (err, rows) => {
    analytics.byState = rows || [];
    
    db.all('SELECT caste_category, COUNT(*) as count FROM beneficiaries GROUP BY caste_category', [], (err, rows) => {
      analytics.byCaste = rows || [];
      
      db.all('SELECT education_level, COUNT(*) as count FROM beneficiaries GROUP BY education_level', [], (err, rows) => {
        analytics.byEducation = rows || [];
        
        db.all(`SELECT 
                  CASE 
                    WHEN annual_income < 50000 THEN 'Below 50k'
                    WHEN annual_income < 100000 THEN '50k-100k'
                    WHEN annual_income < 150000 THEN '100k-150k'
                    ELSE 'Above 150k'
                  END as income_bracket,
                  COUNT(*) as count
                FROM beneficiaries 
                GROUP BY income_bracket`, [], (err, rows) => {
          analytics.byIncome = rows || [];
          res.json(analytics);
        });
      });
    });
  });
});

// Analytics - Project Trends
app.get('/api/analytics/project-trends', (req, res) => {
  db.all(`SELECT 
            DATE(submission_date) as date,
            COUNT(*) as count
          FROM projects
          GROUP BY DATE(submission_date)
          ORDER BY date DESC
          LIMIT 30`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 PM-AJAY GIA Server running on port ${PORT}`);
  console.log(`📊 Dashboard: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database connection closed');
    process.exit(0);
  });
});


const { getDatabase, initDatabase } = require('./db');

// GET /api/init-db - Initialize database and seed with demo data
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Initialize database
      const db = initDatabase();
      
      // Check if data already exists
      db.get('SELECT COUNT(*) as count FROM beneficiaries', (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database initialization failed' });
        }

        if (row.count > 0) {
          return res.json({ 
            message: 'Database already initialized with demo data',
            beneficiaries: row.count,
            status: 'ready'
          });
        }

        // If no data exists, seed the database
        seedDatabase(db, res);
      });
    } catch (error) {
      console.error('Error initializing database:', error);
      res.status(500).json({ error: 'Database initialization failed' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function seedDatabase(db, res) {
  // Insert demo beneficiaries
  const beneficiaries = [
    {
      name: 'Rajesh Kumar',
      age: 28,
      gender: 'Male',
      state: 'Uttar Pradesh',
      district: 'Lucknow',
      caste_category: 'SC',
      aadhar_number: '123456789012',
      phone: '9876543210',
      email: 'rajesh.kumar@email.com',
      education_level: 'Secondary',
      annual_income: 45000,
      family_size: 6,
      occupation: 'Farmer',
      skills: 'Agriculture, Animal Husbandry',
      bank_account: '1234567890123456',
      ifsc_code: 'SBIN0000001',
      eligibility_score: 85,
      is_verified: 1
    },
    {
      name: 'Priya Sharma',
      age: 24,
      gender: 'Female',
      state: 'Bihar',
      district: 'Patna',
      caste_category: 'SC',
      aadhar_number: '234567890123',
      phone: '9876543211',
      email: 'priya.sharma@email.com',
      education_level: 'Higher Secondary',
      annual_income: 35000,
      family_size: 5,
      occupation: 'Tailor',
      skills: 'Tailoring, Embroidery',
      bank_account: '2345678901234567',
      ifsc_code: 'SBIN0000002',
      eligibility_score: 90,
      is_verified: 1
    },
    {
      name: 'Amit Singh',
      age: 32,
      gender: 'Male',
      state: 'Madhya Pradesh',
      district: 'Bhopal',
      caste_category: 'SC',
      aadhar_number: '345678901234',
      phone: '9876543212',
      email: 'amit.singh@email.com',
      education_level: 'Primary',
      annual_income: 25000,
      family_size: 8,
      occupation: 'Laborer',
      skills: 'Construction, Masonry',
      bank_account: '3456789012345678',
      ifsc_code: 'SBIN0000003',
      eligibility_score: 95,
      is_verified: 0
    },
    {
      name: 'Sunita Devi',
      age: 29,
      gender: 'Female',
      state: 'Rajasthan',
      district: 'Jaipur',
      caste_category: 'SC',
      aadhar_number: '456789012345',
      phone: '9876543213',
      email: 'sunita.devi@email.com',
      education_level: 'No formal education',
      annual_income: 20000,
      family_size: 7,
      occupation: 'Domestic Worker',
      skills: 'Cooking, Cleaning',
      bank_account: '4567890123456789',
      ifsc_code: 'SBIN0000004',
      eligibility_score: 100,
      is_verified: 1
    },
    {
      name: 'Vikram Yadav',
      age: 35,
      gender: 'Male',
      state: 'Maharashtra',
      district: 'Mumbai',
      caste_category: 'SC',
      aadhar_number: '567890123456',
      phone: '9876543214',
      email: 'vikram.yadav@email.com',
      education_level: 'Graduate',
      annual_income: 80000,
      family_size: 4,
      occupation: 'Driver',
      skills: 'Driving, Vehicle Maintenance',
      bank_account: '5678901234567890',
      ifsc_code: 'SBIN0000005',
      eligibility_score: 60,
      is_verified: 1
    }
  ];

  const beneficiaryQuery = `
    INSERT INTO beneficiaries (
      name, age, gender, state, district, caste_category, aadhar_number,
      phone, email, education_level, annual_income, family_size,
      occupation, skills, bank_account, ifsc_code, eligibility_score, is_verified
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let insertedCount = 0;
  const totalBeneficiaries = beneficiaries.length;

  beneficiaries.forEach((beneficiary) => {
    const params = [
      beneficiary.name, beneficiary.age, beneficiary.gender, beneficiary.state,
      beneficiary.district, beneficiary.caste_category, beneficiary.aadhar_number,
      beneficiary.phone, beneficiary.email, beneficiary.education_level,
      beneficiary.annual_income, beneficiary.family_size, beneficiary.occupation,
      beneficiary.skills, beneficiary.bank_account, beneficiary.ifsc_code,
      beneficiary.eligibility_score, beneficiary.is_verified
    ];

    db.run(beneficiaryQuery, params, function(err) {
      if (err) {
        console.error('Error inserting beneficiary:', err);
        return;
      }

      insertedCount++;
      if (insertedCount === totalBeneficiaries) {
        // Insert demo projects
        insertDemoProjects(db, res);
      }
    });
  });
}

function insertDemoProjects(db, res) {
  const projects = [
    {
      beneficiary_id: 1,
      title: 'Organic Vegetable Farming',
      description: 'Establishing organic vegetable farming with modern irrigation techniques to increase crop yield and income',
      category: 'Income Generation',
      project_type: 'Agriculture',
      requested_amount: 50000,
      approved_amount: 45000,
      status: 'in_progress',
      priority_score: 85,
      completion_percentage: 60
    },
    {
      beneficiary_id: 2,
      title: 'Tailoring Business Setup',
      description: 'Setting up a small tailoring business with modern equipment and training',
      category: 'Income Generation',
      project_type: 'Small Business',
      requested_amount: 30000,
      approved_amount: 30000,
      status: 'completed',
      priority_score: 90,
      completion_percentage: 100
    },
    {
      beneficiary_id: 3,
      title: 'Construction Skills Training',
      description: 'Advanced construction and masonry skills training program for better employment opportunities',
      category: 'Skill Development',
      project_type: 'Training',
      requested_amount: 25000,
      approved_amount: 20000,
      status: 'approved',
      priority_score: 95,
      completion_percentage: 0
    },
    {
      beneficiary_id: 4,
      title: 'Community Kitchen Setup',
      description: 'Establishing a community kitchen for local events and catering services',
      category: 'Income Generation',
      project_type: 'Food Service',
      requested_amount: 40000,
      approved_amount: 35000,
      status: 'in_progress',
      priority_score: 100,
      completion_percentage: 30
    },
    {
      beneficiary_id: 5,
      title: 'Vehicle Maintenance Workshop',
      description: 'Setting up a small vehicle maintenance and repair workshop',
      category: 'Income Generation',
      project_type: 'Automotive',
      requested_amount: 60000,
      approved_amount: 50000,
      status: 'submitted',
      priority_score: 60,
      completion_percentage: 0
    }
  ];

  const projectQuery = `
    INSERT INTO projects (
      beneficiary_id, title, description, category, project_type,
      requested_amount, approved_amount, status, priority_score, completion_percentage
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let projectCount = 0;
  const totalProjects = projects.length;

  projects.forEach((project) => {
    const params = [
      project.beneficiary_id, project.title, project.description, project.category,
      project.project_type, project.requested_amount, project.approved_amount,
      project.status, project.priority_score, project.completion_percentage
    ];

    db.run(projectQuery, params, function(err) {
      if (err) {
        console.error('Error inserting project:', err);
        return;
      }

      projectCount++;
      if (projectCount === totalProjects) {
        // Insert training programs
        insertTrainingPrograms(db, res);
      }
    });
  });
}

function insertTrainingPrograms(db, res) {
  const trainingPrograms = [
    {
      title: 'Digital Literacy Program',
      description: 'Basic computer skills and digital literacy training for SC community members',
      category: 'Skill Development',
      duration_weeks: 8,
      max_participants: 30,
      current_participants: 25,
      start_date: '2024-01-15',
      end_date: '2024-03-15',
      status: 'ongoing'
    },
    {
      title: 'Entrepreneurship Development',
      description: 'Business planning and entrepreneurship skills training for income generation',
      category: 'Skill Development',
      duration_weeks: 12,
      max_participants: 20,
      current_participants: 18,
      start_date: '2024-02-01',
      end_date: '2024-04-30',
      status: 'ongoing'
    },
    {
      title: 'Agricultural Techniques',
      description: 'Modern farming techniques and sustainable agriculture practices',
      category: 'Skill Development',
      duration_weeks: 6,
      max_participants: 25,
      current_participants: 0,
      start_date: '2024-03-01',
      end_date: '2024-04-15',
      status: 'upcoming'
    }
  ];

  const trainingQuery = `
    INSERT INTO training_programs (
      title, description, category, duration_weeks, max_participants,
      current_participants, start_date, end_date, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  let trainingCount = 0;
  const totalTraining = trainingPrograms.length;

  trainingPrograms.forEach((program) => {
    const params = [
      program.title, program.description, program.category, program.duration_weeks,
      program.max_participants, program.current_participants, program.start_date,
      program.end_date, program.status
    ];

    db.run(trainingQuery, params, function(err) {
      if (err) {
        console.error('Error inserting training program:', err);
        return;
      }

      trainingCount++;
      if (trainingCount === totalTraining) {
        res.json({
          message: 'Database initialized successfully with demo data!',
          beneficiaries: 5,
          projects: 5,
          training_programs: 3,
          status: 'ready'
        });
      }
    });
  });
}

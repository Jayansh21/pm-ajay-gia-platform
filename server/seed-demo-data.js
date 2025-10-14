const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');

// Connect to database
const db = new sqlite3.Database('./pmajay.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to database');
});

// Sample beneficiaries with different profiles
const sampleBeneficiaries = [
  {
    name: 'Rajesh Kumar',
    age: 32,
    gender: 'Male',
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    caste_category: 'SC',
    aadhar_number: '123456789001',
    phone: '9876543210',
    email: 'rajesh.kumar@example.com',
    education_level: 'Secondary',
    annual_income: 45000,
    family_size: 6,
    occupation: 'Daily wage labor',
    skills: 'Carpentry, Basic electrical work',
    bank_account: '1234567890',
    ifsc_code: 'SBIN0001234',
  },
  {
    name: 'Priya Devi',
    age: 28,
    gender: 'Female',
    state: 'Bihar',
    district: 'Patna',
    caste_category: 'SC',
    aadhar_number: '123456789002',
    phone: '9876543211',
    email: 'priya.devi@example.com',
    education_level: 'Primary',
    annual_income: 32000,
    family_size: 5,
    occupation: 'Agricultural labor',
    skills: 'Tailoring',
    bank_account: '2234567890',
    ifsc_code: 'SBIN0002234',
  },
  {
    name: 'Suresh Sharma',
    age: 45,
    gender: 'Male',
    state: 'Rajasthan',
    district: 'Jaipur',
    caste_category: 'SC',
    aadhar_number: '123456789003',
    phone: '9876543212',
    email: null,
    education_level: 'No formal education',
    annual_income: 28000,
    family_size: 7,
    occupation: 'Street vendor',
    skills: 'Food preparation',
    bank_account: '3234567890',
    ifsc_code: 'SBIN0003234',
  },
  {
    name: 'Anita Kumari',
    age: 24,
    gender: 'Female',
    state: 'West Bengal',
    district: 'Kolkata',
    caste_category: 'SC',
    aadhar_number: '123456789004',
    phone: '9876543213',
    email: 'anita.kumari@example.com',
    education_level: 'Higher Secondary',
    annual_income: 55000,
    family_size: 4,
    occupation: 'Retail assistant',
    skills: 'Computer basics, English',
    bank_account: '4234567890',
    ifsc_code: 'SBIN0004234',
  },
  {
    name: 'Ramesh Prasad',
    age: 38,
    gender: 'Male',
    state: 'Maharashtra',
    district: 'Mumbai',
    caste_category: 'SC',
    aadhar_number: '123456789005',
    phone: '9876543214',
    email: 'ramesh.prasad@example.com',
    education_level: 'Graduate',
    annual_income: 85000,
    family_size: 3,
    occupation: 'Office assistant',
    skills: 'MS Office, Data entry',
    bank_account: '5234567890',
    ifsc_code: 'SBIN0005234',
  },
  {
    name: 'Sunita Rani',
    age: 35,
    gender: 'Female',
    state: 'Punjab',
    district: 'Amritsar',
    caste_category: 'SC',
    aadhar_number: '123456789006',
    phone: '9876543215',
    email: null,
    education_level: 'Secondary',
    annual_income: 40000,
    family_size: 5,
    occupation: 'Domestic worker',
    skills: 'Cooking, Cleaning',
    bank_account: '6234567890',
    ifsc_code: 'SBIN0006234',
  },
];

// Calculate eligibility score
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

// Seed beneficiaries
function seedBeneficiaries() {
  return new Promise((resolve, reject) => {
    const beneficiaryIds = [];
    let completed = 0;

    sampleBeneficiaries.forEach((beneficiary) => {
      const id = uuidv4();
      beneficiaryIds.push(id);
      const eligibility_score = calculateEligibilityScore(beneficiary);
      const verification_status = Math.random() > 0.3 ? 'verified' : 'pending';

      const query = `INSERT INTO beneficiaries 
        (id, name, age, gender, state, district, caste_category, aadhar_number, phone, email, 
         education_level, annual_income, family_size, occupation, skills, bank_account, ifsc_code, 
         verification_status, eligibility_score) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(query, [
        id, beneficiary.name, beneficiary.age, beneficiary.gender, beneficiary.state,
        beneficiary.district, beneficiary.caste_category, beneficiary.aadhar_number,
        beneficiary.phone, beneficiary.email, beneficiary.education_level, beneficiary.annual_income,
        beneficiary.family_size, beneficiary.occupation, beneficiary.skills, beneficiary.bank_account,
        beneficiary.ifsc_code, verification_status, eligibility_score
      ], (err) => {
        if (err) {
          console.error('Error inserting beneficiary:', err);
        } else {
          console.log(`✓ Added beneficiary: ${beneficiary.name}`);
        }
        completed++;
        if (completed === sampleBeneficiaries.length) {
          resolve(beneficiaryIds);
        }
      });
    });
  });
}

// Sample projects
function seedProjects(beneficiaryIds) {
  return new Promise((resolve, reject) => {
    const sampleProjects = [
      {
        beneficiary_id: beneficiaryIds[0],
        project_type: 'Entrepreneurship Support',
        title: 'Carpentry Workshop Setup',
        description: 'Establishing a small carpentry workshop with basic tools and equipment to provide custom furniture services in the local community.',
        category: 'Income Generation',
        requested_amount: 75000,
        approved_amount: 70000,
        status: 'in_progress',
        completion_percentage: 45,
      },
      {
        beneficiary_id: beneficiaryIds[1],
        project_type: 'Micro-Enterprise Setup',
        title: 'Tailoring Business',
        description: 'Starting a tailoring business with sewing machines and initial fabric inventory to serve local customers.',
        category: 'Income Generation',
        requested_amount: 50000,
        approved_amount: 45000,
        status: 'approved',
        completion_percentage: 0,
      },
      {
        beneficiary_id: beneficiaryIds[2],
        project_type: 'Small Business Grant',
        title: 'Street Food Cart',
        description: 'Purchasing a mobile food cart with cooking equipment to sell hygienic street food.',
        category: 'Income Generation',
        requested_amount: 35000,
        approved_amount: 0,
        status: 'submitted',
        completion_percentage: 0,
      },
      {
        beneficiary_id: beneficiaryIds[3],
        project_type: 'Digital Literacy',
        title: 'Computer Skills Training',
        description: 'Enrolling in 6-month computer training program covering MS Office, internet, and digital marketing basics.',
        category: 'Skill Development',
        requested_amount: 25000,
        approved_amount: 25000,
        status: 'completed',
        completion_percentage: 100,
      },
      {
        beneficiary_id: beneficiaryIds[4],
        project_type: 'Professional Certification',
        title: 'Accounting Certification',
        description: 'Professional accounting certification course to enhance job prospects in finance sector.',
        category: 'Skill Development',
        requested_amount: 40000,
        approved_amount: 35000,
        status: 'in_progress',
        completion_percentage: 60,
      },
    ];

    let completed = 0;

    sampleProjects.forEach((project) => {
      const id = uuidv4();
      const priority_score = Math.random() * 100;

      const query = `INSERT INTO projects 
        (id, beneficiary_id, project_type, title, description, category, requested_amount, 
         approved_amount, status, priority_score, completion_percentage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      db.run(query, [
        id, project.beneficiary_id, project.project_type, project.title, project.description,
        project.category, project.requested_amount, project.approved_amount, project.status,
        priority_score, project.completion_percentage
      ], (err) => {
        if (err) {
          console.error('Error inserting project:', err);
        } else {
          console.log(`✓ Added project: ${project.title}`);
        }
        completed++;
        if (completed === sampleProjects.length) {
          resolve();
        }
      });
    });
  });
}

// Main seed function
async function seedDatabase() {
  try {
    console.log('\n🌱 Seeding demo data...\n');
    
    const beneficiaryIds = await seedBeneficiaries();
    console.log(`\n✅ Added ${beneficiaryIds.length} beneficiaries\n`);
    
    await seedProjects(beneficiaryIds);
    console.log('\n✅ Added 5 sample projects\n');
    
    console.log('🎉 Demo data seeding completed successfully!\n');
    
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    db.close();
    process.exit(1);
  }
}

// Run seeding
seedDatabase();


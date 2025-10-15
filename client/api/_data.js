// In-memory mock data for Vercel serverless API (non-persistent)

const beneficiaries = [
  {
    id: 'b1',
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
    verification_status: 'verified',
    eligibility_score: 85,
    registration_date: '2025-10-01T00:00:00.000Z',
    last_updated: '2025-10-01T00:00:00.000Z',
  },
  {
    id: 'b2',
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
    verification_status: 'pending',
    eligibility_score: 90,
    registration_date: '2025-10-03T00:00:00.000Z',
    last_updated: '2025-10-03T00:00:00.000Z',
  },
];

const projects = [
  {
    id: 'p1',
    beneficiary_id: 'b1',
    project_type: 'Entrepreneurship Support',
    title: 'Carpentry Workshop Setup',
    description: 'Establishing a small carpentry workshop',
    category: 'Income Generation',
    requested_amount: 75000,
    approved_amount: 70000,
    status: 'in_progress',
    priority_score: 78.2,
    submission_date: '2025-10-05T00:00:00.000Z',
    approval_date: '2025-10-06T00:00:00.000Z',
    completion_percentage: 45,
  },
  {
    id: 'p2',
    beneficiary_id: 'b2',
    project_type: 'Micro-Enterprise Setup',
    title: 'Tailoring Business',
    description: 'Starting a tailoring business',
    category: 'Income Generation',
    requested_amount: 50000,
    approved_amount: 45000,
    status: 'approved',
    priority_score: 67.1,
    submission_date: '2025-10-07T00:00:00.000Z',
    approval_date: '2025-10-08T00:00:00.000Z',
    completion_percentage: 0,
  },
];

const skills = [
  { id: 's1', name: 'Tailoring', category: 'Income Generation', demand_level: 'High', avg_income_potential: 15000 },
  { id: 's2', name: 'Plumbing', category: 'Skill Development', demand_level: 'High', avg_income_potential: 20000 },
  { id: 's3', name: 'Carpentry', category: 'Skill Development', demand_level: 'Medium', avg_income_potential: 18000 },
];

const trainingPrograms = [
  {
    id: 't1',
    name: 'Advanced Tailoring Course',
    skill_category: 'Income Generation',
    duration_days: 90,
    provider: 'NSDC',
    location: 'Delhi',
    capacity: 30,
    enrolled_count: 12,
    start_date: '2025-11-01',
    end_date: '2026-01-30',
    status: 'open',
  },
  {
    id: 't2',
    name: 'Digital Marketing Bootcamp',
    skill_category: 'Skill Development',
    duration_days: 60,
    provider: 'PMKVY',
    location: 'Mumbai',
    capacity: 25,
    enrolled_count: 8,
    start_date: '2025-11-15',
    end_date: '2026-01-15',
    status: 'open',
  },
];

const auditLogs = [
  { id: 'a1', entity_type: 'beneficiary', entity_id: 'b1', action: 'created', performed_by: 'system', timestamp: '2025-10-01T00:00:00.000Z', details: 'Beneficiary registered successfully' },
];

module.exports = {
  beneficiaries,
  projects,
  skills,
  trainingPrograms,
  auditLogs,
};



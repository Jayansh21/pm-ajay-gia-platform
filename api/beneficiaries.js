const { getDatabase } = require('./db');

// GET /api/beneficiaries
export default async function handler(req, res) {
  const db = getDatabase();
  
  if (req.method === 'GET') {
    try {
      const { search, state, verified } = req.query;
      let query = 'SELECT * FROM beneficiaries WHERE 1=1';
      const params = [];

      if (search) {
        query += ' AND (name LIKE ? OR aadhar_number LIKE ? OR phone LIKE ?)';
        const searchTerm = `%${search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      if (state) {
        query += ' AND state = ?';
        params.push(state);
      }

      if (verified !== undefined) {
        query += ' AND is_verified = ?';
        params.push(verified === 'true' ? 1 : 0);
      }

      query += ' ORDER BY created_at DESC';

      db.all(query, params, (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
      });
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        name, age, gender, state, district, caste_category, aadhar_number,
        phone, email, education_level, annual_income, family_size,
        occupation, skills, bank_account, ifsc_code
      } = req.body;

      // Calculate eligibility score
      const eligibilityScore = calculateEligibilityScore({
        annual_income,
        education_level,
        family_size,
        caste_category
      });

      const query = `
        INSERT INTO beneficiaries (
          name, age, gender, state, district, caste_category, aadhar_number,
          phone, email, education_level, annual_income, family_size,
          occupation, skills, bank_account, ifsc_code, eligibility_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        name, age, gender, state, district, caste_category, aadhar_number,
        phone, email, education_level, annual_income, family_size,
        occupation, skills, bank_account, ifsc_code, eligibilityScore
      ];

      db.run(query, params, function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          id: this.lastID,
          eligibility_score: eligibilityScore,
          message: 'Beneficiary registered successfully'
        });
      });
    } catch (error) {
      console.error('Error creating beneficiary:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

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

const { getDatabase } = require('./db');

// GET /api/projects
export default async function handler(req, res) {
  const db = getDatabase();
  
  if (req.method === 'GET') {
    try {
      const query = `
        SELECT p.*, b.name as beneficiary_name, b.state, b.district
        FROM projects p
        JOIN beneficiaries b ON p.beneficiary_id = b.id
        ORDER BY p.submission_date DESC
      `;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        res.json(rows);
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      const {
        beneficiary_id, title, description, category, project_type,
        requested_amount
      } = req.body;

      const query = `
        INSERT INTO projects (
          beneficiary_id, title, description, category, project_type, requested_amount
        ) VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [beneficiary_id, title, description, category, project_type, requested_amount];

      db.run(query, params, function(err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        
        res.status(201).json({
          id: this.lastID,
          message: 'Project submitted successfully'
        });
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

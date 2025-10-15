const { getDatabase } = require('../db');

// GET /api/dashboard/stats
export default async function handler(req, res) {
  const db = getDatabase();
  
  if (req.method === 'GET') {
    try {
      const stats = {};

      // Get total beneficiaries
      db.get('SELECT COUNT(*) as count FROM beneficiaries', (err, row) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ error: 'Database error' });
        }
        stats.totalBeneficiaries = row?.count || 0;

        // Get verified beneficiaries
        db.get('SELECT COUNT(*) as count FROM beneficiaries WHERE is_verified = 1', (err, row) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
          }
          stats.verifiedBeneficiaries = row?.count || 0;

          // Get average eligibility score
          db.get('SELECT AVG(eligibility_score) as avg FROM beneficiaries', (err, row) => {
            if (err) {
              console.error('Database error:', err);
              return res.status(500).json({ error: 'Database error' });
            }
            stats.avgEligibilityScore = Math.round(row?.avg || 0);

            // Get total projects
            db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
              if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
              }
              stats.totalProjects = row?.count || 0;

              // Get active projects
              db.get('SELECT COUNT(*) as count FROM projects WHERE status = "in_progress"', (err, row) => {
                if (err) {
                  console.error('Database error:', err);
                  return res.status(500).json({ error: 'Database error' });
                }
                stats.activeProjects = row?.count || 0;

                // Get completed projects
                db.get('SELECT COUNT(*) as count FROM projects WHERE status = "completed"', (err, row) => {
                  if (err) {
                    console.error('Database error:', err);
                    return res.status(500).json({ error: 'Database error' });
                  }
                  stats.completedProjects = row?.count || 0;

                  // Get total funding approved
                  db.get('SELECT SUM(approved_amount) as total FROM projects', (err, row) => {
                    if (err) {
                      console.error('Database error:', err);
                      return res.status(500).json({ error: 'Database error' });
                    }
                    stats.totalFundingApproved = row?.total || 0;

                    // Get top states
                    db.all(`
                      SELECT state, COUNT(*) as count 
                      FROM beneficiaries 
                      GROUP BY state 
                      ORDER BY count DESC 
                      LIMIT 5
                    `, [], (err, rows) => {
                      if (err) {
                        console.error('Database error:', err);
                        return res.status(500).json({ error: 'Database error' });
                      }
                      stats.topStates = rows || [];

                      // Get projects by category
                      db.all(`
                        SELECT category, COUNT(*) as count 
                        FROM projects 
                        GROUP BY category
                      `, [], (err, rows) => {
                        if (err) {
                          console.error('Database error:', err);
                          return res.status(500).json({ error: 'Database error' });
                        }
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
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

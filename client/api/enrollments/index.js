export default function handler(req, res) {
  if (req.method === 'POST') {
    res.status(201).json({ message: 'Enrolled successfully (mock)' });
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}



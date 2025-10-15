export default function handler(req, res) {
  if (req.method === 'PATCH') {
    res.status(200).json({ message: 'Project status updated (mock)' });
    return;
  }
  res.status(405).json({ error: 'Method not allowed' });
}



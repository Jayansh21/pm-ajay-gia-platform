import { projects } from '../_data';

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(projects);
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({ message: 'Project submitted successfully (mock)' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}



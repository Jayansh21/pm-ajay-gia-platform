const { beneficiaries } = require('../_data');

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(beneficiaries);
    return;
  }

  if (req.method === 'POST') {
    res.status(201).json({ message: 'Beneficiary registered successfully (mock)' });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
}



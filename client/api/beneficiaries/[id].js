const { beneficiaries } = require('../_data');

export default function handler(req, res) {
  const { id } = req.query;
  const b = beneficiaries.find((x) => x.id === id);
  if (!b) {
    res.status(404).json({ error: 'Beneficiary not found (mock)' });
    return;
  }
  res.status(200).json(b);
}



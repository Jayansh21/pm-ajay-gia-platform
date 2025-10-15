const { projects } = require('../_data');

export default function handler(req, res) {
  const byDate = Object.values(
    projects.reduce((acc, p) => {
      const date = (p.submission_date || '').slice(0, 10);
      if (!date) return acc;
      acc[date] = acc[date] || { date, count: 0 };
      acc[date].count += 1;
      return acc;
    }, {})
  )
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 30);

  res.status(200).json(byDate);
}



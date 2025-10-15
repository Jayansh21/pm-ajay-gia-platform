const { beneficiaries } = require('../_data');

export default function handler(req, res) {
  const byState = Object.values(
    beneficiaries.reduce((acc, b) => {
      acc[b.state] = acc[b.state] || { state: b.state, count: 0 };
      acc[b.state].count += 1;
      return acc;
    }, {})
  );

  const byCaste = Object.values(
    beneficiaries.reduce((acc, b) => {
      acc[b.caste_category] = acc[b.caste_category] || { caste_category: b.caste_category, count: 0 };
      acc[b.caste_category].count += 1;
      return acc;
    }, {})
  );

  const byEducation = Object.values(
    beneficiaries.reduce((acc, b) => {
      acc[b.education_level] = acc[b.education_level] || { education_level: b.education_level, count: 0 };
      acc[b.education_level].count += 1;
      return acc;
    }, {})
  );

  const byIncome = [
    { income_bracket: 'Below 50k', count: beneficiaries.filter((b) => b.annual_income < 50000).length },
    { income_bracket: '50k-100k', count: beneficiaries.filter((b) => b.annual_income >= 50000 && b.annual_income < 100000).length },
    { income_bracket: '100k-150k', count: beneficiaries.filter((b) => b.annual_income >= 100000 && b.annual_income < 150000).length },
    { income_bracket: 'Above 150k', count: beneficiaries.filter((b) => b.annual_income >= 150000).length },
  ];

  res.status(200).json({ byState, byCaste, byEducation, byIncome });
}



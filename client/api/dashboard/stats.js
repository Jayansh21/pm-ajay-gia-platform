import { beneficiaries, projects } from '../_data';

export default function handler(req, res) {
  const totalBeneficiaries = beneficiaries.length;
  const avgEligibilityScore = (
    beneficiaries.reduce((a, b) => a + (b.eligibility_score || 0), 0) /
    Math.max(totalBeneficiaries, 1)
  ).toFixed(2);

  const verifiedBeneficiaries = beneficiaries.filter(
    (b) => b.verification_status === 'verified'
  ).length;

  const totalProjects = projects.length;
  const totalFundingApproved = projects.reduce(
    (a, p) => a + (p.approved_amount || 0),
    0
  );

  const activeProjects = projects.filter(
    (p) => p.status === 'approved' || p.status === 'in_progress'
  ).length;

  const completedProjects = projects.filter((p) => p.status === 'completed').length;

  res.status(200).json({
    totalBeneficiaries,
    avgEligibilityScore,
    verifiedBeneficiaries,
    totalProjects,
    totalFundingApproved,
    activeProjects,
    completedProjects,
    topStates: [],
    projectsByCategory: [],
  });
}



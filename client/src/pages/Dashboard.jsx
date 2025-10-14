import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  FolderKanban, 
  TrendingUp, 
  IndianRupee,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { getDashboardStats } from '../api/api';

const StatCard = ({ icon: Icon, title, value, subtitle, color, link }) => (
  <div className="card group hover:scale-105">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-600 text-sm mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    {link && (
      <Link to={link} className="mt-4 flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium">
        View Details <ArrowRight size={16} className="ml-1" />
      </Link>
    )}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Welcome to PM-AJAY GIA Platform</h1>
        <p className="text-primary-100">
          Empowering SC communities through Income Generation, Skill Development, and Infrastructure Support
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          title="Total Beneficiaries"
          value={stats?.totalBeneficiaries || 0}
          subtitle={`${stats?.verifiedBeneficiaries || 0} verified`}
          color="bg-blue-500"
          link="/beneficiaries"
        />
        <StatCard
          icon={CheckCircle}
          title="Avg Eligibility Score"
          value={stats?.avgEligibilityScore || '0'}
          subtitle="Out of 100"
          color="bg-green-500"
        />
        <StatCard
          icon={FolderKanban}
          title="Total Projects"
          value={stats?.totalProjects || 0}
          subtitle={`${stats?.activeProjects || 0} active`}
          color="bg-purple-500"
          link="/projects"
        />
        <StatCard
          icon={IndianRupee}
          title="Funding Approved"
          value={`₹${((stats?.totalFundingApproved || 0) / 100000).toFixed(1)}L`}
          subtitle={`${stats?.completedProjects || 0} completed`}
          color="bg-orange-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/beneficiaries/register" className="card bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400">
          <div className="flex items-center">
            <div className="p-3 bg-blue-500 rounded-lg mr-4">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Register Beneficiary</h3>
              <p className="text-sm text-gray-600">Add new SC beneficiary</p>
            </div>
          </div>
        </Link>

        <Link to="/projects/submit" className="card bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 hover:border-purple-400">
          <div className="flex items-center">
            <div className="p-3 bg-purple-500 rounded-lg mr-4">
              <FolderKanban className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Submit Project</h3>
              <p className="text-sm text-gray-600">Income/Skill/Infrastructure</p>
            </div>
          </div>
        </Link>

        <Link to="/analytics" className="card bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 hover:border-green-400">
          <div className="flex items-center">
            <div className="p-3 bg-green-500 rounded-lg mr-4">
              <TrendingUp className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-600">Data-driven insights</p>
            </div>
          </div>
        </Link>
      </div>

      {/* State-wise Distribution */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Top States by Beneficiary Count</h2>
        <div className="space-y-3">
          {stats?.topStates?.slice(0, 5).map((state, index) => (
            <div key={state.state} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className="font-semibold text-lg text-primary-600 mr-3">#{index + 1}</span>
                <span className="font-medium text-gray-900">{state.state}</span>
              </div>
              <span className="badge bg-primary-100 text-primary-700">{state.count} beneficiaries</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects by Category */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Projects by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats?.projectsByCategory?.map((category) => (
            <div key={category.category} className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg">
              <h3 className="font-medium text-gray-700 mb-1">{category.category}</h3>
              <p className="text-2xl font-bold text-primary-700">{category.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Highlights */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Impact Highlights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-green-100 mb-1">Transparency</p>
            <p className="text-xl font-semibold">100% Digital Tracking</p>
          </div>
          <div>
            <p className="text-green-100 mb-1">Accuracy</p>
            <p className="text-xl font-semibold">AI-Based Selection</p>
          </div>
          <div>
            <p className="text-green-100 mb-1">Accountability</p>
            <p className="text-xl font-semibold">Complete Audit Trail</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


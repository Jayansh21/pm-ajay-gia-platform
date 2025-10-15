import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  CheckCircle, 
  FolderKanban, 
  TrendingUp, 
  IndianRupee,
  AlertCircle,
  ArrowRight,
  Award,
  Target,
  Zap
} from 'lucide-react';
import { getDashboardStats } from '../api/api';

const StatCard = ({ icon: Icon, title, value, subtitle, gradient, link, delay }) => (
  <div 
    className={`stat-card ${gradient} animate-fadeIn hover-lift`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <Icon size={28} className="mr-3 opacity-90" />
          <p className="text-white text-opacity-90 text-sm font-medium uppercase tracking-wide">{title}</p>
        </div>
        <h3 className="text-4xl font-bold mb-1">{value}</h3>
        {subtitle && <p className="text-white text-opacity-80 text-sm">{subtitle}</p>}
      </div>
    </div>
    {link && (
      <Link 
        to={link} 
        className="mt-4 inline-flex items-center text-white text-opacity-90 hover:text-opacity-100 text-sm font-semibold bg-white bg-opacity-20 px-4 py-2 rounded-lg hover:bg-opacity-30 transition-all"
      >
        View Details <ArrowRight size={16} className="ml-2" />
      </Link>
    )}
  </div>
);

const QuickActionCard = ({ icon: Icon, title, subtitle, gradient, link, delay }) => (
  <Link 
    to={link} 
    className={`glass-card hover-lift animate-slideIn group`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center">
      <div className={`p-4 rounded-2xl ${gradient} mr-4 transform group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-white" size={28} />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
      Get Started <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
    </div>
  </Link>
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
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Dashboard Overview</h1>
          <p className="text-gray-600 text-lg">Real-time insights into the PM-AJAY GIA platform performance and impact</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <TrendingUp size={28} className="mr-3" />
          Key Performance Indicators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            title="Total Beneficiaries"
            value={stats?.totalBeneficiaries || 0}
            subtitle={`${stats?.verifiedBeneficiaries || 0} verified beneficiaries`}
            gradient="bg-gradient-blue"
            link="/beneficiaries"
            delay={0}
          />
          <StatCard
            icon={CheckCircle}
            title="Eligibility Score"
            value={stats?.avgEligibilityScore || '0'}
            subtitle="Average score out of 100"
            gradient="bg-gradient-green"
            delay={100}
          />
          <StatCard
            icon={FolderKanban}
            title="Total Projects"
            value={stats?.totalProjects || 0}
            subtitle={`${stats?.activeProjects || 0} active projects running`}
            gradient="bg-gradient-purple"
            link="/projects"
            delay={200}
          />
          <StatCard
            icon={IndianRupee}
            title="Funding Approved"
            value={`₹${((stats?.totalFundingApproved || 0) / 100000).toFixed(1)}L`}
            subtitle={`${stats?.completedProjects || 0} projects completed`}
            gradient="bg-gradient-orange"
            delay={300}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <Zap size={28} className="mr-3" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickActionCard
            icon={Users}
            title="Manage Beneficiaries"
            subtitle="View and manage all registered beneficiaries"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
            link="/beneficiaries"
            delay={0}
          />
          <QuickActionCard
            icon={FolderKanban}
            title="Project Management"
            subtitle="Track and manage all ongoing projects"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
            link="/projects"
            delay={100}
          />
          <QuickActionCard
            icon={TrendingUp}
            title="View Analytics"
            subtitle="Data-driven insights and visualizations"
            gradient="bg-gradient-to-br from-green-500 to-green-600"
            link="/analytics"
            delay={200}
          />
        </div>
      </div>

      {/* State-wise Distribution */}
      <div className="glass-card animate-fadeIn">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mr-4">
            <Users size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Top States by Beneficiary Count</h2>
        </div>
        <div className="space-y-4">
          {stats?.topStates?.slice(0, 5).map((state, index) => (
            <div 
              key={state.state} 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border-2 border-gray-100 hover:border-indigo-300 transition-all hover:shadow-lg"
            >
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mr-4">
                  <span className="font-bold text-white text-lg">#{index + 1}</span>
                </div>
                <span className="font-bold text-gray-900 text-lg">{state.state}</span>
              </div>
              <div className="flex items-center">
                <span className="badge bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-lg px-5 py-2">
                  {state.count} beneficiaries
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects by Category */}
      <div className="glass-card animate-fadeIn">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mr-4">
            <FolderKanban size={24} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Projects by Category</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats?.projectsByCategory?.map((category, index) => (
            <div 
              key={category.category} 
              className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-xl transform hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h3 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">{category.category}</h3>
              <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {category.count}
              </p>
              <p className="text-sm text-gray-600 mt-1">Active Projects</p>
            </div>
          ))}
        </div>
      </div>

      {/* Impact Highlights */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Award size={32} className="text-yellow-300 mr-3" />
            <h2 className="text-3xl font-bold text-white">Impact Highlights</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-3">
                <Target size={24} className="text-yellow-300 mr-2" />
                <p className="text-white text-opacity-90 font-semibold">Transparency</p>
              </div>
              <p className="text-2xl font-bold text-white">100% Digital</p>
              <p className="text-white text-opacity-80 text-sm mt-1">Complete project tracking</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-3">
                <Zap size={24} className="text-yellow-300 mr-2" />
                <p className="text-white text-opacity-90 font-semibold">Accuracy</p>
              </div>
              <p className="text-2xl font-bold text-white">AI-Powered</p>
              <p className="text-white text-opacity-80 text-sm mt-1">Smart beneficiary selection</p>
            </div>
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <div className="flex items-center mb-3">
                <CheckCircle size={24} className="text-yellow-300 mr-2" />
                <p className="text-white text-opacity-90 font-semibold">Accountability</p>
              </div>
              <p className="text-2xl font-bold text-white">Full Audit Trail</p>
              <p className="text-white text-opacity-80 text-sm mt-1">Every action logged</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

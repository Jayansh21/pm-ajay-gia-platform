import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { getBeneficiaryDistribution, getProjectTrends, getDashboardStats } from '../api/api';

const Analytics = () => {
  const [distribution, setDistribution] = useState(null);
  const [trends, setTrends] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [distRes, trendsRes, statsRes] = await Promise.all([
        getBeneficiaryDistribution(),
        getProjectTrends(),
        getDashboardStats(),
      ]);
      setDistribution(distRes.data);
      setTrends(trendsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics & Insights</h1>
        <p className="text-gray-600 mt-1">Data-driven decision making for better outcomes</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Beneficiaries</p>
              <p className="text-3xl font-bold text-blue-700">{stats?.totalBeneficiaries || 0}</p>
              <p className="text-xs text-blue-600 mt-1">Across all states</p>
            </div>
            <Users size={40} className="text-blue-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-green-700">{stats?.activeProjects || 0}</p>
              <p className="text-xs text-green-600 mt-1">In progress</p>
            </div>
            <Target size={40} className="text-green-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completion Rate</p>
              <p className="text-3xl font-bold text-purple-700">
                {stats?.totalProjects > 0 
                  ? Math.round((stats.completedProjects / stats.totalProjects) * 100) 
                  : 0}%
              </p>
              <p className="text-xs text-purple-600 mt-1">{stats?.completedProjects} completed</p>
            </div>
            <TrendingUp size={40} className="text-purple-600 opacity-50" />
          </div>
        </div>

        <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Funding</p>
              <p className="text-2xl font-bold text-orange-700">
                ₹{((stats?.totalFundingApproved || 0) / 100000).toFixed(1)}L
              </p>
              <p className="text-xs text-orange-600 mt-1">Approved amount</p>
            </div>
            <DollarSign size={40} className="text-orange-600 opacity-50" />
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Beneficiaries by State</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribution?.byState || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="state" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Caste Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Distribution by Category</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribution?.byCaste || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ caste_category, percent }) => `${caste_category}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="caste_category"
              >
                {distribution?.byCaste?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Income Bracket Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distribution?.byIncome || []} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="income_bracket" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Education Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Education Level Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribution?.byEducation || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ education_level, count }) => `${education_level}: ${count}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="education_level"
              >
                {distribution?.byEducation?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Project Trends */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Project Submission Trends (Last 30 Days)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} name="Projects Submitted" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Key Insights */}
      <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <h2 className="text-2xl font-bold mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Targeting Accuracy</h3>
            <p className="text-sm">
              AI-based eligibility scoring reduces inclusion/exclusion errors by prioritizing beneficiaries 
              with lower income, larger families, and SC category verification.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Digital Tracking</h3>
            <p className="text-sm">
              100% of projects are tracked digitally from submission to completion, ensuring transparency 
              and accountability throughout the lifecycle.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Geographic Coverage</h3>
            <p className="text-sm">
              Platform covers beneficiaries across {distribution?.byState?.length || 0} states/UTs, 
              enabling centralized monitoring and resource allocation.
            </p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Impact Measurement</h3>
            <p className="text-sm">
              Real-time analytics enable data-driven decisions for skill matching, income generation 
              initiatives, and infrastructure investments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;


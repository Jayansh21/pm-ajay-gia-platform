import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, MapPin, Users } from 'lucide-react';
import { getProjects, updateProjectStatus } from '../api/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchProjects();
  }, [filterCategory, filterStatus]);

  const fetchProjects = async () => {
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      if (filterStatus) params.status = filterStatus;
      
      const response = await getProjects(params);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, approved_amount = 0) => {
    try {
      await updateProjectStatus(id, { status, approved_amount });
      fetchProjects();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleProgressUpdate = async (id, completion_percentage) => {
    try {
      await updateProjectStatus(id, { 
        completion_percentage,
        status: completion_percentage === 100 ? 'completed' : 'in_progress'
      });
      fetchProjects();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-700',
      under_review: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-gray-100 text-gray-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || styles.submitted;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Income Generation': 'bg-green-100 text-green-700',
      'Skill Development': 'bg-blue-100 text-blue-700',
      'Infrastructure': 'bg-orange-100 text-orange-700',
    };
    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="glass-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Project Management</h1>
            <p className="text-gray-600 text-lg">Track Income Generation, Skill Development & Infrastructure projects</p>
          </div>
          <Link to="/projects/submit" className="btn-primary flex items-center text-lg">
            <FolderPlus size={24} className="mr-3" />
            Submit New Project
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-blue hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wide mb-1">Submitted</p>
              <p className="text-4xl font-bold text-white">
                {projects.filter(p => (p.status || '') === 'submitted').length}
              </p>
            </div>
            <Clock size={36} className="text-white opacity-80" />
          </div>
        </div>
        <div className="stat-card bg-gradient-purple hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wide mb-1">In Progress</p>
              <p className="text-4xl font-bold text-white">
                {projects.filter(p => (p.status || '') === 'in_progress').length}
              </p>
            </div>
            <TrendingUp size={36} className="text-white opacity-80" />
          </div>
        </div>
        <div className="stat-card bg-gradient-green hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wide mb-1">Completed</p>
              <p className="text-4xl font-bold text-white">
                {projects.filter(p => (p.status || '') === 'completed').length}
              </p>
            </div>
            <CheckCircle size={36} className="text-white opacity-80" />
          </div>
        </div>
        <div className="stat-card bg-gradient-orange hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-opacity-90 text-sm font-semibold uppercase tracking-wide mb-1">Total Funding</p>
              <p className="text-3xl font-bold text-white">
                ₹{(projects.reduce((sum, p) => sum + (p.approved_amount || 0), 0) / 100000).toFixed(1)}L
              </p>
            </div>
            <TrendingUp size={36} className="text-white opacity-80" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="input-field"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="Income Generation">Income Generation</option>
              <option value="Skill Development">Skill Development</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="input-field"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-card hover-lift animate-fadeIn border-l-4 border-indigo-500">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{project.title}</h3>
                  <div className="flex items-center text-gray-600">
                    <Users size={14} className="mr-1" />
                    <p className="text-sm font-medium">{project.beneficiary_name}</p>
                  </div>
                </div>
                <span className={`badge shadow-md ${getStatusBadge(project.status)}`}>
                  {(project.status || 'submitted').replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Category & Type */}
              <div className="flex gap-2 flex-wrap">
                <span className={`badge shadow-sm ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                <span className="badge bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm">
                  {project.project_type}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">{project.description}</p>

              {/* Location */}
              <div className="flex items-center text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <MapPin size={16} className="mr-2 text-indigo-500" />
                <span className="font-medium">{project.district}, {project.state}</span>
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t-2 border-gray-100">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Requested</p>
                  <p className="text-lg font-bold text-blue-700">₹{project.requested_amount.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-xl">
                  <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-1">Approved</p>
                  <p className="text-lg font-bold text-green-700">₹{project.approved_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar (if in progress) */}
              {(project.status || '') === 'in_progress' && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border-2 border-purple-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold text-purple-900">Project Progress</span>
                    <span className="text-2xl font-bold text-purple-700">{project.completion_percentage}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${project.completion_percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Progress Update Section */}
                  <div className="mt-4 p-4 bg-white rounded-xl shadow-sm">
                    <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                      <TrendingUp size={16} className="mr-2 text-indigo-600" />
                      Update Progress
                    </h4>
                    <div className="flex gap-3 items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={project.completion_percentage || 0}
                        onChange={(e) => handleProgressUpdate(project.id, parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                      />
                      <span className="text-lg font-bold text-indigo-700 min-w-[4rem] text-center bg-indigo-100 px-3 py-1 rounded-lg">
                        {project.completion_percentage || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      <AlertCircle size={12} className="mr-1" />
                      Slide to update your project completion percentage
                    </p>
                  </div>
                </div>
              )}

              {/* Priority Score */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="text-xs text-gray-500">
                  Priority Score: <span className="font-semibold text-primary-600">{project.priority_score.toFixed(0)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(project.submission_date).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              {(project.status || '') === 'submitted' && (
                <div className="flex gap-2 pt-3 border-t">
                  <button
                    onClick={() => handleStatusUpdate(project.id, 'approved', project.requested_amount)}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-3 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(project.id, 'rejected')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 px-3 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              )}

              {(project.status || '') === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate(project.id, 'in_progress', project.approved_amount)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium py-2 px-3 rounded-lg"
                >
                  Mark In Progress
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <FolderPlus size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No projects found matching your criteria.</p>
          <Link to="/projects/submit" className="text-primary-600 hover:text-primary-700 font-medium mt-2 inline-block">
            Submit your first project →
          </Link>
        </div>
      )}
    </div>
  );
};

export default Projects;


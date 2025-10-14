import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderPlus, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Track Income Generation, Skill Development & Infrastructure projects</p>
        </div>
        <Link to="/projects/submit" className="btn-primary flex items-center">
          <FolderPlus size={20} className="mr-2" />
          Submit New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Submitted</p>
              <p className="text-2xl font-bold text-blue-700">
                {projects.filter(p => (p.status || '') === 'submitted').length}
              </p>
            </div>
            <Clock size={28} className="text-blue-600" />
          </div>
        </div>
        <div className="card bg-purple-50 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-2xl font-bold text-purple-700">
                {projects.filter(p => (p.status || '') === 'in_progress').length}
              </p>
            </div>
            <TrendingUp size={28} className="text-purple-600" />
          </div>
        </div>
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-700">
                {projects.filter(p => (p.status || '') === 'completed').length}
              </p>
            </div>
            <CheckCircle size={28} className="text-green-600" />
          </div>
        </div>
        <div className="card bg-orange-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Funding</p>
              <p className="text-xl font-bold text-orange-700">
                ₹{(projects.reduce((sum, p) => sum + (p.approved_amount || 0), 0) / 100000).toFixed(1)}L
              </p>
            </div>
            <TrendingUp size={28} className="text-orange-600" />
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
          <div key={project.id} className="card hover:shadow-xl transition-all">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                  <p className="text-sm text-gray-600">{project.beneficiary_name}</p>
                </div>
                <span className={`badge ${getStatusBadge(project.status)}`}>
                  {(project.status || 'submitted').replace('_', ' ')}
                </span>
              </div>

              {/* Category & Type */}
              <div className="flex gap-2">
                <span className={`badge ${getCategoryColor(project.category)}`}>
                  {project.category}
                </span>
                <span className="badge bg-gray-100 text-gray-700">
                  {project.project_type}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

              {/* Location */}
              <div className="text-xs text-gray-500">
                📍 {project.district}, {project.state}
              </div>

              {/* Amounts */}
              <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500">Requested</p>
                  <p className="font-semibold text-gray-900">₹{project.requested_amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="font-semibold text-green-600">₹{project.approved_amount.toLocaleString()}</p>
                </div>
              </div>

              {/* Progress Bar (if in progress) */}
              {(project.status || '') === 'in_progress' && (
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.completion_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${project.completion_percentage}%` }}
                    ></div>
                  </div>
                  
                  {/* Progress Update Section */}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">Update Progress</h4>
                    <div className="flex gap-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={project.completion_percentage || 0}
                        onChange={(e) => handleProgressUpdate(project.id, parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium text-blue-700 min-w-[3rem]">
                        {project.completion_percentage || 0}%
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">
                      Slide to update your project progress
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


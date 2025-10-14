import React, { useEffect, useState } from 'react';
import { User, FileText, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getProjects, updateProjectStatus, getBeneficiaries } from '../api/api';

const BeneficiaryPortal = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedBeneficiary) {
      fetchProjectsForBeneficiary();
    }
  }, [selectedBeneficiary]);

  const fetchData = async () => {
    try {
      const response = await getBeneficiaries({ status: 'verified' });
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectsForBeneficiary = async () => {
    try {
      const response = await getProjects({ beneficiary_id: selectedBeneficiary });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleProgressUpdate = async (projectId, completion_percentage) => {
    try {
      await updateProjectStatus(projectId, { 
        completion_percentage,
        status: completion_percentage === 100 ? 'completed' : 'in_progress'
      });
      fetchProjectsForBeneficiary();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      submitted: 'bg-blue-100 text-blue-700',
      approved: 'bg-green-100 text-green-700',
      in_progress: 'bg-purple-100 text-purple-700',
      completed: 'bg-gray-100 text-gray-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || styles.submitted;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return <FileText size={16} />;
      case 'approved': return <CheckCircle size={16} />;
      case 'in_progress': return <TrendingUp size={16} />;
      case 'completed': return <CheckCircle size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
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
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Beneficiary Portal</h1>
        <p className="text-blue-100">Track your projects and update progress</p>
      </div>

      {/* Beneficiary Selection */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beneficiaries.map((beneficiary) => (
            <div
              key={beneficiary.id}
              onClick={() => setSelectedBeneficiary(beneficiary.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedBeneficiary === beneficiary.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <User size={20} className="mr-2 text-primary-600" />
                <h3 className="font-semibold text-gray-900">{beneficiary.name}</h3>
              </div>
              <p className="text-sm text-gray-600">{beneficiary.district}, {beneficiary.state}</p>
              <p className="text-sm text-gray-500">Aadhar: {beneficiary.aadhar_number}</p>
              <div className="mt-2">
                <span className="text-sm font-medium text-primary-600">
                  Eligibility: {beneficiary.eligibility_score}/100
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Projects for Selected Beneficiary */}
      {selectedBeneficiary && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Projects</h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No projects found for this beneficiary.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div key={project.id} className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        <p className="text-sm text-gray-600">{project.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge ${getStatusBadge(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{project.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>

                    {/* Financial Info */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Requested</p>
                        <p className="font-semibold text-gray-900">₹{project.requested_amount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Approved</p>
                        <p className="font-semibold text-green-600">₹{project.approved_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {project.status === 'in_progress' && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Project Progress</span>
                          <span className="font-medium text-gray-900">{project.completion_percentage || 0}%</span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${project.completion_percentage || 0}%` }}
                          ></div>
                        </div>

                        {/* Progress Update Slider */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="text-sm font-medium text-blue-900 mb-3">Update Your Progress</h4>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                step="5"
                                value={project.completion_percentage || 0}
                                onChange={(e) => handleProgressUpdate(project.id, parseInt(e.target.value))}
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${project.completion_percentage || 0}%, #e5e7eb ${project.completion_percentage || 0}%, #e5e7eb 100%)`
                                }}
                              />
                              <span className="text-lg font-bold text-blue-700 min-w-[4rem] text-center">
                                {project.completion_percentage || 0}%
                              </span>
                            </div>
                            <p className="text-xs text-blue-600">
                              Move the slider to update your project completion percentage
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Status Messages */}
                    {project.status === 'submitted' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800">
                          <Clock size={16} className="inline mr-1" />
                          Your project is under review. We'll notify you once it's approved.
                        </p>
                      </div>
                    )}

                    {project.status === 'approved' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          <CheckCircle size={16} className="inline mr-1" />
                          Congratulations! Your project has been approved. You can now start implementation.
                        </p>
                      </div>
                    )}

                    {project.status === 'completed' && (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-800">
                          <CheckCircle size={16} className="inline mr-1" />
                          Project completed successfully! Great work!
                        </p>
                      </div>
                    )}

                    {/* Project Details */}
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      <p>Submitted: {new Date(project.submission_date).toLocaleDateString()}</p>
                      {project.approval_date && (
                        <p>Approved: {new Date(project.approval_date).toLocaleDateString()}</p>
                      )}
                      {project.completion_date && (
                        <p>Completed: {new Date(project.completion_date).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {selectedBeneficiary && (
        <div className="card bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
          <h3 className="font-semibold text-gray-900 mb-2">How to Update Progress</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Select your project from the list above</li>
            <li>• Use the slider to update your completion percentage</li>
            <li>• Progress updates are saved automatically</li>
            <li>• At 100%, your project will be marked as completed</li>
            <li>• You can update progress anytime during project implementation</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default BeneficiaryPortal;

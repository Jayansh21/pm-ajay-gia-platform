import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';
import { createProject, getBeneficiaries } from '../api/api';

const ProjectSubmission = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState([]);
  
  const [formData, setFormData] = useState({
    beneficiary_id: '',
    project_type: '',
    title: '',
    description: '',
    category: '',
    requested_amount: '',
  });

  useEffect(() => {
    fetchBeneficiaries();
  }, []);

  const fetchBeneficiaries = async () => {
    try {
      const response = await getBeneficiaries({ status: 'verified' });
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    }
  };

  const projectTypes = {
    'Income Generation': [
      'Entrepreneurship Support',
      'Micro-Enterprise Setup',
      'Agricultural Enhancement',
      'Livestock Development',
      'Small Business Grant',
    ],
    'Skill Development': [
      'Vocational Training',
      'Technical Skills',
      'Digital Literacy',
      'Professional Certification',
      'Employability Training',
    ],
    'Infrastructure': [
      'Community Center',
      'Training Facility',
      'Digital Infrastructure',
      'Equipment Purchase',
      'Facility Renovation',
    ],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      ...(name === 'category' && { project_type: '' }), // Reset project_type when category changes
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createProject({
        ...formData,
        requested_amount: parseFloat(formData.requested_amount),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/projects');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit project');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20">
        <div className="card bg-green-50 border-2 border-green-200 text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-500 p-3">
              <Send size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Project Submitted Successfully!</h2>
          <p className="text-green-700">Your project has been submitted for review.</p>
          <p className="text-sm text-gray-600 mt-2">Redirecting to projects list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/projects')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Submit New Project</h1>
          <p className="text-gray-600 mt-1">Income Generation / Skill Development / Infrastructure</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="text-red-600 mr-3 flex-shrink-0" size={20} />
          <div>
            <h3 className="font-medium text-red-800">Submission Failed</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="card space-y-6">
        {/* Beneficiary Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Beneficiary <span className="text-red-500">*</span>
          </label>
          <select
            name="beneficiary_id"
            value={formData.beneficiary_id}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Choose a verified beneficiary</option>
            {beneficiaries.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} - {b.aadhar_number} ({b.state})
              </option>
            ))}
          </select>
          {beneficiaries.length === 0 && (
            <p className="text-sm text-red-600 mt-1">No verified beneficiaries found. Please register and verify beneficiaries first.</p>
          )}
        </div>

        {/* Project Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="input-field"
          >
            <option value="">Select Category</option>
            <option value="Income Generation">Income Generation</option>
            <option value="Skill Development">Skill Development</option>
            <option value="Infrastructure">Infrastructure</option>
          </select>
        </div>

        {/* Project Type */}
        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Type <span className="text-red-500">*</span>
            </label>
            <select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              required
              className="input-field"
            >
              <option value="">Select Project Type</option>
              {projectTypes[formData.category]?.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}

        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input-field"
            placeholder="e.g., Tailoring Business Setup"
          />
        </div>

        {/* Project Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="5"
            className="input-field"
            placeholder="Provide detailed description of the project, objectives, expected outcomes, and how it will benefit the beneficiary..."
          ></textarea>
        </div>

        {/* Requested Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Requested Amount (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="requested_amount"
            value={formData.requested_amount}
            onChange={handleChange}
            required
            min="1000"
            step="100"
            className="input-field"
            placeholder="Enter amount in rupees"
          />
          <p className="text-xs text-gray-500 mt-1">
            Typical ranges: Income Generation (₹25,000-₹2,00,000), Skill Development (₹10,000-₹50,000), Infrastructure (₹50,000-₹5,00,000)
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Project Evaluation Criteria</h3>
          <p className="text-sm text-blue-800 mb-2">
            Your project will be evaluated based on:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Beneficiary eligibility score</li>
            <li>Project feasibility and impact potential</li>
            <li>Budget reasonability</li>
            <li>Alignment with PM-AJAY GIA objectives</li>
            <li>Geographic priority and need assessment</li>
          </ul>
        </div>

        {/* Category Guidelines */}
        {formData.category && (
          <div className={`border-l-4 p-4 rounded ${
            formData.category === 'Income Generation' ? 'bg-green-50 border-green-500' :
            formData.category === 'Skill Development' ? 'bg-blue-50 border-blue-500' :
            'bg-orange-50 border-orange-500'
          }`}>
            <h4 className="font-medium mb-2">
              {formData.category} Guidelines
            </h4>
            <p className="text-sm text-gray-700">
              {formData.category === 'Income Generation' && 
                'Focus on creating sustainable livelihood opportunities through entrepreneurship and micro-enterprises. Include equipment costs, initial inventory, and working capital.'}
              {formData.category === 'Skill Development' && 
                'Emphasize training programs that enhance employability and technical skills. Include training fees, materials, certification costs, and placement support.'}
              {formData.category === 'Infrastructure' && 
                'Support community-level infrastructure that benefits multiple SC families. Include construction, equipment, and maintenance costs.'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || beneficiaries.length === 0}
            className="btn-primary flex-1 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                Submit Project
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectSubmission;


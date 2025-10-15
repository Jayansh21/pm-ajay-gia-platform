import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { createBeneficiary } from '../api/api';

const BeneficiaryRegistration = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    state: '',
    district: '',
    caste_category: 'SC',
    aadhar_number: '',
    phone: '',
    email: '',
    education_level: '',
    annual_income: '',
    family_size: '',
    occupation: '',
    skills: '',
    bank_account: '',
    ifsc_code: '',
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
  ];

  const educationLevels = [
    'No formal education', 'Primary', 'Secondary', 
    'Higher Secondary', 'Graduate', 'Post Graduate'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createBeneficiary({
        ...formData,
        age: parseInt(formData.age),
        annual_income: parseFloat(formData.annual_income),
        family_size: parseInt(formData.family_size),
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/beneficiaries');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register beneficiary');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto mt-20 animate-fadeIn">
        <div className="glass-card text-center">
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 p-4 animate-pulse-slow glow-green">
              <Save size={48} className="text-white" />
            </div>
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-3">Registration Successful!</h2>
          <p className="text-xl text-gray-700 mb-2">Beneficiary has been registered successfully.</p>
          <div className="mt-6 inline-flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full">
            <div className="spinner mr-3"></div>
            <p className="text-sm font-semibold text-green-800">Redirecting to beneficiaries list...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="glass-card">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/beneficiaries')}
            className="p-3 hover:bg-indigo-100 rounded-xl transition-all transform hover:scale-110"
          >
            <ArrowLeft size={24} className="text-indigo-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-4xl font-bold gradient-text">Register New Beneficiary</h1>
            <p className="text-gray-600 mt-2 text-lg">Add SC beneficiary for PM-AJAY GIA program with AI-powered eligibility scoring</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error animate-slideIn">
          <AlertCircle className="flex-shrink-0" size={24} />
          <div>
            <h3 className="font-bold text-lg">Registration Failed</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card space-y-8">
        {/* Personal Information */}
        <div>
          <div className="flex items-center mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3">
              <Save size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="18"
                max="100"
                className="input-field"
                placeholder="Age"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caste Category <span className="text-red-500">*</span>
              </label>
              <select
                name="caste_category"
                value={formData.caste_category}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="OBC">OBC</option>
                <option value="General">General</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aadhar Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="aadhar_number"
                value={formData.aadhar_number}
                onChange={handleChange}
                required
                pattern="[0-9]{12}"
                className="input-field"
                placeholder="12-digit Aadhar"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                className="input-field"
                placeholder="10-digit mobile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-field"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Level <span className="text-red-500">*</span>
              </label>
              <select
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Education</option>
                {educationLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select State</option>
                {indianStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                District <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter district"
              />
            </div>
          </div>
        </div>

        {/* Economic Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Economic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Income (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="annual_income"
                value={formData.annual_income}
                onChange={handleChange}
                required
                min="0"
                className="input-field"
                placeholder="Annual income in rupees"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Family Size <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="family_size"
                value={formData.family_size}
                onChange={handleChange}
                required
                min="1"
                className="input-field"
                placeholder="Number of family members"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Occupation
              </label>
              <input
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                className="input-field"
                placeholder="Current occupation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Skills (comma separated)
              </label>
              <input
                type="text"
                name="skills"
                value={formData.skills}
                onChange={handleChange}
                className="input-field"
                placeholder="e.g., Tailoring, Farming"
              />
            </div>
          </div>
        </div>

        {/* Banking Information */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Banking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Account Number
              </label>
              <input
                type="text"
                name="bank_account"
                value={formData.bank_account}
                onChange={handleChange}
                className="input-field"
                placeholder="Bank account number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                name="ifsc_code"
                value={formData.ifsc_code}
                onChange={handleChange}
                className="input-field"
                placeholder="IFSC code"
              />
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h3 className="font-bold text-2xl mb-3 flex items-center">
              <span className="text-3xl mr-3">🤖</span>
              AI-Based Eligibility Assessment
            </h3>
            <p className="text-blue-100 mb-4 text-lg">
              Upon registration, our intelligent AI system will automatically calculate an eligibility score based on:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
                <p className="font-semibold">💰 Annual Income</p>
                <p className="text-sm text-blue-100">Lower income = Higher priority</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
                <p className="font-semibold">🎓 Education Level</p>
                <p className="text-sm text-blue-100">Less education = Higher priority</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
                <p className="font-semibold">👨‍👩‍👧‍👦 Family Size</p>
                <p className="text-sm text-blue-100">Larger families = Higher priority</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3">
                <p className="font-semibold">✅ SC Verification</p>
                <p className="text-sm text-blue-100">Mandatory requirement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 flex items-center justify-center text-lg py-4"
          >
            {loading ? (
              <>
                <div className="spinner mr-3"></div>
                Processing Registration...
              </>
            ) : (
              <>
                <Save size={24} className="mr-3" />
                Register Beneficiary
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/beneficiaries')}
            className="btn-secondary px-8 py-4"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeneficiaryRegistration;



import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Search, Filter, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getBeneficiaries, verifyBeneficiary } from '../api/api';

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBeneficiaries();
  }, [filterStatus]);

  const fetchBeneficiaries = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const response = await getBeneficiaries(params);
      setBeneficiaries(response.data);
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (id, status) => {
    try {
      await verifyBeneficiary(id, { status });
      fetchBeneficiaries();
    } catch (error) {
      console.error('Error updating verification:', error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return styles[status] || styles.pending;
  };

  const getEligibilityColor = (score) => {
    if (score >= 80) return 'text-green-600 font-bold';
    if (score >= 60) return 'text-blue-600 font-semibold';
    if (score >= 40) return 'text-yellow-600 font-medium';
    return 'text-red-600';
  };

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.aadhar_number.includes(searchTerm) ||
    b.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Beneficiary Management</h1>
          <p className="text-gray-600 mt-1">Track and manage SC beneficiaries</p>
        </div>
        <Link to="/beneficiaries/register" className="btn-primary flex items-center">
          <UserPlus size={20} className="mr-2" />
          Register New Beneficiary
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, Aadhar, or state..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="input-field pl-10"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Verified</p>
              <p className="text-2xl font-bold text-green-700">
                {beneficiaries.filter(b => b.verification_status === 'verified').length}
              </p>
            </div>
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>
        <div className="card bg-yellow-50 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-2xl font-bold text-yellow-700">
                {beneficiaries.filter(b => b.verification_status === 'pending').length}
              </p>
            </div>
            <Clock size={32} className="text-yellow-600" />
          </div>
        </div>
        <div className="card bg-blue-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Registered</p>
              <p className="text-2xl font-bold text-blue-700">{beneficiaries.length}</p>
            </div>
            <UserPlus size={32} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Beneficiaries List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beneficiary Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eligibility Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBeneficiaries.map((beneficiary) => (
                <tr key={beneficiary.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="font-medium text-gray-900">{beneficiary.name}</div>
                      <div className="text-sm text-gray-500">
                        {beneficiary.age} yrs • {beneficiary.gender} • {beneficiary.caste_category}
                      </div>
                      <div className="text-xs text-gray-400">Aadhar: {beneficiary.aadhar_number}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{beneficiary.district}</div>
                    <div className="text-xs text-gray-500">{beneficiary.state}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-2xl ${getEligibilityColor(beneficiary.eligibility_score)}`}>
                      {beneficiary.eligibility_score.toFixed(0)}
                    </div>
                    <div className="text-xs text-gray-500">out of 100</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${getStatusBadge(beneficiary.verification_status)}`}>
                      {beneficiary.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {beneficiary.verification_status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleVerification(beneficiary.id, 'verified')}
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Verify
                        </button>
                        <button
                          onClick={() => handleVerification(beneficiary.id, 'rejected')}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBeneficiaries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No beneficiaries found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Beneficiaries;


import React, { useEffect, useState } from 'react';
import { GraduationCap, Calendar, MapPin, Users, TrendingUp, IndianRupee } from 'lucide-react';
import { getTrainingPrograms, getSkills, createEnrollment, getBeneficiaries } from '../api/api';

const TrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [skills, setSkills] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, skillsRes, beneficiariesRes] = await Promise.all([
        getTrainingPrograms({ status: 'open' }),
        getSkills(),
        getBeneficiaries({ status: 'verified' }),
      ]);
      setPrograms(programsRes.data);
      setSkills(skillsRes.data);
      setBeneficiaries(beneficiariesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedBeneficiary || !selectedProgram) return;
    
    setEnrolling(true);
    try {
      await createEnrollment({
        beneficiary_id: selectedBeneficiary,
        training_program_id: selectedProgram.id,
      });
      alert('Enrollment successful!');
      setSelectedProgram(null);
      setSelectedBeneficiary('');
      fetchData();
    } catch (error) {
      alert('Enrollment failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setEnrolling(false);
    }
  };

  const getDemandBadge = (level) => {
    const styles = {
      High: 'bg-green-100 text-green-700',
      Medium: 'bg-yellow-100 text-yellow-700',
      Low: 'bg-gray-100 text-gray-700',
    };
    return styles[level] || styles.Low;
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Training & Skill Development</h1>
        <p className="text-gray-600 mt-1">Enhance employability through targeted training programs</p>
      </div>

      {/* Skills Overview */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">High-Demand Skills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {skills.map((skill) => (
            <div
              key={skill.id}
              className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-400 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-900">{skill.name}</h3>
                <span className={`badge ${getDemandBadge(skill.demand_level)} text-xs`}>
                  {skill.demand_level}
                </span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{skill.category}</p>
              <div className="flex items-center text-sm font-medium text-green-600">
                <IndianRupee size={14} className="mr-1" />
                {skill.avg_income_potential?.toLocaleString()}/mo
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Programs */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Training Programs</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => {
            const capacity = program.capacity;
            const enrolled = program.enrolled_count;
            const availableSeats = capacity - enrolled;
            const fillPercentage = (enrolled / capacity) * 100;

            return (
              <div key={program.id} className="card hover:shadow-xl transition-all">
                <div className="space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-900 flex-1">{program.name}</h3>
                      <GraduationCap size={24} className="text-primary-600" />
                    </div>
                    <span className={`badge ${
                      program.skill_category === 'Income Generation' ? 'bg-green-100 text-green-700' :
                      program.skill_category === 'Skill Development' ? 'bg-blue-100 text-blue-700' :
                      'bg-purple-100 text-purple-700'
                    }`}>
                      {program.skill_category}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      <span>{program.duration_days} days</span>
                      <span className="mx-2">•</span>
                      <span>{new Date(program.start_date).toLocaleDateString()} - {new Date(program.end_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span>{program.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users size={16} className="mr-2" />
                      <span>Provider: {program.provider}</span>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        Enrollment: {enrolled}/{capacity}
                      </span>
                      <span className={`font-medium ${availableSeats > 5 ? 'text-green-600' : 'text-orange-600'}`}>
                        {availableSeats} seats left
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          fillPercentage < 70 ? 'bg-green-500' :
                          fillPercentage < 90 ? 'bg-yellow-500' :
                          'bg-red-500'
                        }`}
                        style={{ width: `${fillPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enroll Button */}
                  <button
                    onClick={() => setSelectedProgram(program)}
                    disabled={availableSeats === 0}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition ${
                      availableSeats === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {availableSeats === 0 ? 'Fully Booked' : 'Enroll Beneficiary'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No training programs available at the moment.</p>
        </div>
      )}

      {/* Enrollment Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Enroll in Training</h3>
              <p className="text-gray-600 text-sm mt-1">{selectedProgram.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Beneficiary <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedBeneficiary}
                onChange={(e) => setSelectedBeneficiary(e.target.value)}
                className="input-field"
              >
                <option value="">Choose a beneficiary</option>
                {beneficiaries.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} - {b.state}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Duration:</strong> {selectedProgram.duration_days} days<br />
                <strong>Location:</strong> {selectedProgram.location}<br />
                <strong>Provider:</strong> {selectedProgram.provider}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleEnroll}
                disabled={!selectedBeneficiary || enrolling}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Confirm Enrollment'}
              </button>
              <button
                onClick={() => {
                  setSelectedProgram(null);
                  setSelectedBeneficiary('');
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Impact Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-4">Skill Development Impact</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-100 mb-1">Total Programs</p>
            <p className="text-3xl font-bold">{programs.length}</p>
          </div>
          <div>
            <p className="text-blue-100 mb-1">Total Capacity</p>
            <p className="text-3xl font-bold">{programs.reduce((sum, p) => sum + p.capacity, 0)}</p>
          </div>
          <div>
            <p className="text-blue-100 mb-1">Enrolled</p>
            <p className="text-3xl font-bold">{programs.reduce((sum, p) => sum + p.enrolled_count, 0)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;


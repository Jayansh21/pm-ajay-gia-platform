import axios from 'axios';

// Allow overriding API base via env for deployments (e.g., Vercel)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats');

// Beneficiaries
export const getBeneficiaries = (params) => api.get('/beneficiaries', { params });
export const getBeneficiary = (id) => api.get(`/beneficiaries/${id}`);
export const createBeneficiary = (data) => api.post('/beneficiaries', data);
export const verifyBeneficiary = (id, data) => api.patch(`/beneficiaries/${id}/verify`, data);

// Projects
export const getProjects = (params) => api.get('/projects', { params });
export const createProject = (data) => api.post('/projects', data);
export const updateProjectStatus = (id, data) => api.patch(`/projects/${id}/status`, data);

// Skills
export const getSkills = () => api.get('/skills');

// Training Programs
export const getTrainingPrograms = (params) => api.get('/training-programs', { params });
export const createEnrollment = (data) => api.post('/enrollments', data);

// Analytics
export const getBeneficiaryDistribution = () => api.get('/analytics/beneficiary-distribution');
export const getProjectTrends = () => api.get('/analytics/project-trends');

// Audit Logs
export const getAuditLogs = (params) => api.get('/audit-logs', { params });

export default api;


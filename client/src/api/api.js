import axios from 'axios';
import { demoData } from '../utils/demoData';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to use demo data as fallback
const withDemoFallback = async (apiCall, demoData) => {
  // Always use demo data for now (for Vercel deployment)
  console.log('Using demo data for Vercel deployment');
  return { data: demoData };
  
  // Original logic (commented out for Vercel)
  /*
  // Check if demo mode is enabled
  if (localStorage.getItem('demoMode') === 'true') {
    console.log('Demo mode enabled, using demo data');
    return { data: demoData };
  }
  
  try {
    const response = await apiCall();
    // Check if response is successful (status 200-299)
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      console.log('API returned non-success status, using demo data:', response.status);
      return { data: demoData };
    }
  } catch (error) {
    console.log('API failed, using demo data:', error.message);
    return { data: demoData };
  }
  */
};

// Dashboard
export const getDashboardStats = () => withDemoFallback(
  () => api.get('/dashboard/stats'),
  demoData.dashboardStats
);

// Beneficiaries
export const getBeneficiaries = (params) => withDemoFallback(
  () => api.get('/beneficiaries', { params }),
  demoData.beneficiaries
);
export const getBeneficiary = (id) => api.get(`/beneficiaries/${id}`);
export const createBeneficiary = (data) => api.post('/beneficiaries', data);
export const verifyBeneficiary = (id, data) => api.patch(`/beneficiaries/${id}/verify`, data);

// Projects
export const getProjects = (params) => withDemoFallback(
  () => api.get('/projects', { params }),
  demoData.projects
);
export const createProject = (data) => api.post('/projects', data);
export const updateProjectStatus = (id, data) => api.patch(`/projects/${id}/status`, data);

// Skills
export const getSkills = () => withDemoFallback(
  () => api.get('/skills'),
  []
);

// Training Programs
export const getTrainingPrograms = (params) => withDemoFallback(
  () => api.get('/training-programs', { params }),
  []
);
export const createEnrollment = (data) => api.post('/enrollments', data);

// Analytics
export const getBeneficiaryDistribution = () => withDemoFallback(
  () => api.get('/analytics/beneficiary-distribution'),
  []
);
export const getProjectTrends = () => withDemoFallback(
  () => api.get('/analytics/project-trends'),
  []
);

// Audit Logs
export const getAuditLogs = (params) => withDemoFallback(
  () => api.get('/audit-logs', { params }),
  []
);

export default api;


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Beneficiaries from './pages/Beneficiaries';
import BeneficiaryRegistration from './pages/BeneficiaryRegistration';
import Projects from './pages/Projects';
import ProjectSubmission from './pages/ProjectSubmission';
import BeneficiaryPortal from './pages/BeneficiaryPortal';
import TrainingPrograms from './pages/TrainingPrograms';
import Analytics from './pages/Analytics';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <Router>
      <Routes>
        {/* Standalone Home Page */}
        <Route path="/" element={<Home />} />
        
        {/* Main Application with Layout */}
        <Route path="/app/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/app/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/beneficiaries" element={<Beneficiaries />} />
              <Route path="/beneficiaries/register" element={<BeneficiaryRegistration />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/submit" element={<ProjectSubmission />} />
              <Route path="/beneficiary-portal" element={<BeneficiaryPortal />} />
              <Route path="/training" element={<TrainingPrograms />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/audit" element={<AuditLogs />} />
            </Routes>
          </Layout>
        } />
        
        {/* Redirect old paths to new app paths */}
        <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
        <Route path="/beneficiaries" element={<Navigate to="/app/beneficiaries" replace />} />
        <Route path="/beneficiaries/register" element={<Navigate to="/app/beneficiaries/register" replace />} />
        <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
        <Route path="/projects/submit" element={<Navigate to="/app/projects/submit" replace />} />
        <Route path="/beneficiary-portal" element={<Navigate to="/app/beneficiary-portal" replace />} />
        <Route path="/training" element={<Navigate to="/app/training" replace />} />
        <Route path="/analytics" element={<Navigate to="/app/analytics" replace />} />
        <Route path="/audit" element={<Navigate to="/app/audit" replace />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;


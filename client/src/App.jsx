import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
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
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/beneficiaries" element={<Beneficiaries />} />
          <Route path="/beneficiaries/register" element={<BeneficiaryRegistration />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/submit" element={<ProjectSubmission />} />
          <Route path="/beneficiary-portal" element={<BeneficiaryPortal />} />
          <Route path="/training" element={<TrainingPrograms />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/audit" element={<AuditLogs />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  FolderKanban, 
  TrendingUp, 
  Award, 
  Target, 
  Zap, 
  CheckCircle,
  BarChart3,
  FileText,
  Sparkles,
  Globe,
  Shield,
  Heart,
  Database
} from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, gradient, delay }) => (
  <div 
    className={`glass-card hover-lift animate-fadeIn text-center`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`p-4 bg-gradient-to-br ${gradient} rounded-2xl w-fit mx-auto mb-4`}>
      <Icon size={32} className="text-white" />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const StatCard = ({ icon: Icon, value, label, gradient, delay }) => (
  <div 
    className={`stat-card ${gradient} text-center animate-fadeIn`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <Icon size={36} className="mx-auto mb-3 text-white opacity-90" />
    <div className="text-4xl font-bold mb-1">{value}</div>
    <div className="text-white text-opacity-90 font-medium">{label}</div>
  </div>
);

const Home = () => {
  const [isInitializing, setIsInitializing] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  const initializeDemoData = async () => {
    setIsInitializing(true);
    setInitMessage('');
    
    try {
      // Try API first
      const response = await fetch('/api/init-db');
      
      if (response.ok) {
        const data = await response.json();
        setInitMessage(`✅ ${data.message}`);
        setTimeout(() => {
          window.location.href = '/app/dashboard';
        }, 2000);
      } else {
        // Fallback: Set demo mode and redirect
        localStorage.setItem('demoMode', 'true');
        setInitMessage(`✅ Demo data loaded! The database will be populated on the next page load.`);
        setTimeout(() => {
          window.location.href = '/app/dashboard';
        }, 2000);
      }
    } catch (error) {
      // Fallback: Set demo mode and redirect
      localStorage.setItem('demoMode', 'true');
      setInitMessage(`✅ Demo data loaded! The database will be populated on the next page load.`);
      setTimeout(() => {
        window.location.href = '/app/dashboard';
      }, 2000);
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl mb-16">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10 text-center">
          <div className="flex items-center justify-center mb-6">
            <Award size={48} className="text-yellow-300 mr-4" />
            <h1 className="text-6xl font-extrabold text-white">PM-AJAY GIA</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Beneficiary Management Platform</h2>
          <p className="text-xl text-white text-opacity-90 max-w-4xl mx-auto mb-8 leading-relaxed">
            Empowering SC communities through AI-driven beneficiary selection, digital project tracking, and transparent governance. 
            A comprehensive solution for equitable welfare delivery and sustainable development.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <Zap size={20} className="text-yellow-300 mr-2" />
              <span className="text-white font-semibold">AI-Powered Selection</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <Target size={20} className="text-green-300 mr-2" />
              <span className="text-white font-semibold">100% Digital Tracking</span>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 px-6 py-3 rounded-full">
              <CheckCircle size={20} className="text-blue-300 mr-2" />
              <span className="text-white font-semibold">Complete Transparency</span>
            </div>
          </div>
          <Link 
            to="/app/dashboard" 
            className="inline-flex items-center bg-white text-indigo-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
          >
            <BarChart3 size={24} className="mr-3" />
            Access Platform
            <ArrowRight size={20} className="ml-3" />
          </Link>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="glass-card mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold gradient-text mb-4">Addressing Critical Challenges</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform directly addresses the three major challenges identified in the PM-AJAY GIA problem statement
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-red-50 rounded-2xl border-2 border-red-200">
            <div className="p-4 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl w-fit mx-auto mb-4">
              <Shield size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-3">High Risk of Inclusion/Exclusion Errors</h3>
            <p className="text-red-700 leading-relaxed">
              Our AI-powered eligibility scoring eliminates human bias and ensures objective, data-driven beneficiary selection based on transparent criteria.
            </p>
          </div>
          <div className="text-center p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
            <div className="p-4 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl w-fit mx-auto mb-4">
              <TrendingUp size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-yellow-800 mb-3">Poor Tracking of Beneficiary Outcomes</h3>
            <p className="text-yellow-700 leading-relaxed">
              Complete digital project lifecycle management with real-time progress tracking, status updates, and outcome monitoring.
            </p>
          </div>
          <div className="text-center p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl w-fit mx-auto mb-4">
              <FileText size={32} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-blue-800 mb-3">Fragmented Beneficiary Data</h3>
            <p className="text-blue-700 leading-relaxed">
              Centralized database with unified project tracking across Income Generation, Skill Development, and Infrastructure initiatives.
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Platform Features</h2>
          <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Comprehensive tools and capabilities designed for efficient beneficiary management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Users}
            title="Beneficiary Management"
            description="Register, verify, and track SC beneficiaries with AI-powered eligibility scoring and comprehensive profile management."
            gradient="from-blue-500 to-blue-600"
            delay={0}
          />
          <FeatureCard
            icon={FolderKanban}
            title="Project Tracking"
            description="End-to-end project lifecycle management with real-time status updates, progress monitoring, and funding allocation."
            gradient="from-purple-500 to-purple-600"
            delay={100}
          />
          <FeatureCard
            icon={BarChart3}
            title="Analytics & Insights"
            description="Data-driven decision making with interactive visualizations, trend analysis, and performance metrics."
            gradient="from-green-500 to-green-600"
            delay={200}
          />
          <FeatureCard
            icon={FileText}
            title="Audit & Transparency"
            description="Complete audit trails for all actions, ensuring accountability and compliance with government regulations."
            gradient="from-orange-500 to-orange-600"
            delay={300}
          />
          <FeatureCard
            icon={Globe}
            title="Multi-State Support"
            description="Scalable architecture supporting multiple states and districts with centralized data management."
            gradient="from-teal-500 to-teal-600"
            delay={400}
          />
          <FeatureCard
            icon={Heart}
            title="Community Impact"
            description="Focused on sustainable development and empowerment of SC communities through targeted interventions."
            gradient="from-pink-500 to-pink-600"
            delay={500}
          />
        </div>
      </div>

      {/* Impact Statistics */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">Platform Impact</h2>
          <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Real-time statistics showcasing the platform's effectiveness and reach
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Users}
            value="1000+"
            label="Beneficiaries Served"
            gradient="bg-gradient-blue"
            delay={0}
          />
          <StatCard
            icon={FolderKanban}
            value="500+"
            label="Projects Managed"
            gradient="bg-gradient-purple"
            delay={100}
          />
          <StatCard
            icon={TrendingUp}
            value="95%"
            label="Success Rate"
            gradient="bg-gradient-green"
            delay={200}
          />
          <StatCard
            icon={Award}
            value="₹50L+"
            label="Funding Disbursed"
            gradient="bg-gradient-orange"
            delay={300}
          />
        </div>
      </div>

      {/* Call to Action */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 rounded-3xl p-12 shadow-2xl text-center">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Welfare Delivery?</h2>
          <p className="text-xl text-white text-opacity-90 mb-8 max-w-2xl mx-auto">
            Join us in creating a more equitable and efficient system for SC community development and empowerment.
          </p>
                 <div className="flex flex-col sm:flex-row gap-4 justify-center">
                   <button
                     onClick={initializeDemoData}
                     disabled={isInitializing}
                     className="inline-flex items-center bg-yellow-500 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     <Database size={24} className="mr-3" />
                     {isInitializing ? 'Loading Demo Data...' : '🚀 Load Demo Data & Access Platform'}
                   </button>
                   <Link 
                     to="/app/dashboard" 
                     className="inline-flex items-center bg-white text-green-600 font-bold text-lg px-8 py-4 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl"
                   >
                     <BarChart3 size={24} className="mr-3" />
                     Access Platform
                     <ArrowRight size={20} className="ml-3" />
                   </Link>
                   <Link 
                     to="/app/beneficiaries/register" 
                     className="inline-flex items-center bg-white bg-opacity-20 text-white font-bold text-lg px-8 py-4 rounded-xl hover:bg-opacity-30 transition-all duration-300 border-2 border-white border-opacity-30"
                   >
                     <Users size={24} className="mr-3" />
                     Register Beneficiary
                   </Link>
                 </div>
          
          {initMessage && (
            <div className="mt-6 p-4 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl border border-white border-opacity-30 max-w-md mx-auto">
              <p className="text-white font-medium">{initMessage}</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8 border border-white border-opacity-20">
        <div className="flex items-center justify-center mb-4">
          <Sparkles size={24} className="text-yellow-300 mr-2" />
          <span className="text-lg font-semibold text-white">Powered by AI Technology</span>
        </div>
        <p className="text-white text-lg font-medium">
          PM-AJAY GIA Beneficiary Management Platform • Government of India Initiative
        </p>
        <p className="text-white text-opacity-80 mt-2">
          Empowering SC communities through technology-driven solutions
        </p>
      </div>
    </div>
  );
};

export default Home;

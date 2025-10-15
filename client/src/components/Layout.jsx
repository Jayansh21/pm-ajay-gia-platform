import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  GraduationCap, 
  BarChart3, 
  FileText,
  UserCheck,
  Menu,
  X,
  Award,
  Sparkles,
  Home
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: Home, label: 'Home', gradient: 'from-indigo-500 to-indigo-600' },
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard', gradient: 'from-blue-500 to-blue-600' },
    { path: '/app/beneficiaries', icon: Users, label: 'Beneficiaries', gradient: 'from-green-500 to-green-600' },
    { path: '/app/projects', icon: FolderKanban, label: 'Projects', gradient: 'from-purple-500 to-purple-600' },
    { path: '/app/beneficiary-portal', icon: UserCheck, label: 'Beneficiary Portal', gradient: 'from-pink-500 to-pink-600' },
    { path: '/app/training', icon: GraduationCap, label: 'Training', gradient: 'from-orange-500 to-orange-600' },
    { path: '/app/analytics', icon: BarChart3, label: 'Analytics', gradient: 'from-teal-500 to-teal-600' },
    { path: '/app/audit', icon: FileText, label: 'Audit Logs', gradient: 'from-gray-500 to-gray-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Top Navigation */}
      <nav className="bg-white shadow-xl fixed w-full z-50 border-b-4 border-indigo-600">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-xl hover:bg-indigo-100 transition-all transform hover:scale-110"
              >
                {sidebarOpen ? <X size={24} className="text-indigo-600" /> : <Menu size={24} className="text-indigo-600" />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mr-3 transform hover:rotate-12 transition-transform">
                    <Award size={28} className="text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold gradient-text">PM-AJAY GIA</h1>
                    <p className="text-xs text-gray-600 hidden sm:block">Beneficiary Management Platform</p>
                  </div>
                </Link>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
                <Sparkles size={16} className="text-indigo-600 mr-2" />
                <span className="text-sm font-semibold text-indigo-700">AI-Powered</span>
              </div>
              <div className="flex items-center bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full">
                <Award size={16} className="text-green-600 mr-2" />
                <span className="text-sm font-semibold text-green-700">Gov of India</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-20">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out mt-20 lg:mt-0 border-r-2 border-gray-100
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="h-full overflow-y-auto py-6 px-4">
            <div className="mb-6 px-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Navigation</p>
            </div>
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3.5 mb-2 rounded-xl transition-all duration-200 group relative overflow-hidden
                    ${isActive 
                      ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg transform scale-105` 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-white opacity-20 animate-pulse-slow"></div>
                  )}
                  <div className={`
                    p-2 rounded-lg mr-3 relative z-10
                    ${isActive 
                      ? 'bg-white bg-opacity-20' 
                      : `bg-gradient-to-br ${item.gradient} bg-opacity-10 group-hover:bg-opacity-20`
                    }
                  `}>
                    <Icon size={20} className={isActive ? 'text-white' : ''} />
                  </div>
                  <span className={`font-semibold relative z-10 ${isActive ? 'text-white' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse-slow"></div>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-100">
            <div className="text-center">
              <p className="text-xs text-gray-600 mb-1">Powered by AI Technology</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-slow status-dot-green"></div>
                <p className="text-xs font-semibold text-gray-700">System Online</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 modal-backdrop z-30 lg:hidden mt-20"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto min-h-screen">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

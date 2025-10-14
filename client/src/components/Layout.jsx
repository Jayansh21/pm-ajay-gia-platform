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
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/beneficiaries', icon: Users, label: 'Beneficiaries' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/beneficiary-portal', icon: UserCheck, label: 'Beneficiary Portal' },
    { path: '/training', icon: GraduationCap, label: 'Training' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/audit', icon: FileText, label: 'Audit Logs' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg fixed w-full z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-primary-500"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                <h1 className="text-xl sm:text-2xl font-bold">PM-AJAY GIA Platform</h1>
              </div>
            </div>
            <div className="hidden sm:block text-sm">
              <span className="bg-primary-500 px-3 py-1 rounded-full">Gov of India Initiative</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out mt-16 lg:mt-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <nav className="h-full overflow-y-auto py-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition
                    ${isActive ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600 font-medium' : ''}
                  `}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden mt-16"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;


import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const Layout: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigation = [
    { name: 'Practice', href: '/practice', icon: '🎯' },
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Interviews', href: '/interviews', icon: '💼' },
    { name: 'Resume', href: '/resume', icon: '📄' },
    { name: 'Profile', href: '/profile', icon: '👤' },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex`}>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform ${showMobileMenu ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={`flex items-center justify-center h-16 px-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PrepDash</h1>
          </div>

          {/* User Info */}
          <div className={`flex flex-col items-center py-6 px-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <h3 className={`mt-3 text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Bottom Actions */}
          <div className={`px-4 py-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors mb-2 ${
                isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <span className="mr-3">{isDarkMode ? '🌙' : '☀️'}</span>
              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
            >
              <span className="mr-3">🚪</span>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile Menu Button */}
        <div className={`lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>PrepDash</h1>
          <div className="w-10"></div>
        </div>

        {/* Page Content */}
        <main className="pt-16 lg:pt-0 min-h-screen">
          <Outlet />
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
    </div>
  );
};

export default Layout;

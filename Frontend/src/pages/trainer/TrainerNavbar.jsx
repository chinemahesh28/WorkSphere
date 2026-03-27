import React, { useState } from 'react';
import { useToast } from '../../components/ToastContext';

const TrainerNavbar = ({ activePage, setActivePage }) => {
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem('user')) || JSON.parse(localStorage.getItem('currentUser')) || {};
  const trainerName = user?.fullName || user?.username || 'Trainer';
  const trainerEmail = user?.email || '';

  const navLinks = [
    { key: 'dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { key: 'class-update', label: 'Class Updates', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { key: 'manage-records', label: 'Manage Records', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
  ];

  const linkClass = "flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm";
  const activeClass = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg";
  const inactiveClass = "text-gray-700 hover:bg-gray-100 hover:text-indigo-600";

  const handleLogout = async () => {
    const confirmed = await toast.confirm('Are you sure you want to logout?', 'Logout');
    if (confirmed) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  };

  const getClassStats = () => {
    const updates = JSON.parse(localStorage.getItem('classUpdates')) || [];
    const userId = user?.id;
    return updates.filter(u => u.trainerId === userId).length;
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Left — Logo */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="WorkSphere" className="w-9 h-9 rounded-lg object-cover animate-logo-glow shadow-md" />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-brand-shimmer bg-[length:200%_auto] hidden sm:block">WorkSphere</span>
            </div>

            {/* Center — Nav Links (Desktop) */}
            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map(link => (
                <button
                  key={link.key}
                  onClick={() => setActivePage(link.key)}
                  className={`${linkClass} ${activePage === link.key ? activeClass : inactiveClass}`}
                >
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right — User Menu */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                    {trainerName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{trainerName}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2" onClick={() => setUserMenuOpen(false)}>
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{trainerName}</p>
                      <p className="text-xs text-gray-500">{trainerEmail}</p>
                    </div>
                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total Classes:</span>
                        <span className="font-medium text-indigo-600">{getClassStats()}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 space-y-1 shadow-lg z-40">
          {navLinks.map(link => (
            <button
              key={link.key}
              onClick={() => { setActivePage(link.key); setIsMenuOpen(false); }}
              className={`w-full ${linkClass} ${activePage === link.key ? activeClass : inactiveClass}`}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
              </svg>
              {link.label}
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default TrainerNavbar;

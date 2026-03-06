import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../components/ToastContext';

const CounsellorNavbar = ({ activePage, setActivePage }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [counsellorName, setCounsellorName] = useState('Counsellor');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.fullName) {
      setCounsellorName(currentUser.fullName.split(' ')[0]);
    }
  }, []);

  const getStudentStats = () => {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    return students.length;
  };

  const linkClass = "flex items-center px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm";
  const activeClass = "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg";
  const inactiveClass = "text-gray-700 hover:bg-gray-100 hover:text-indigo-600";

  const handleLogout = async () => {
    const confirmed = await toast.confirm('Are you sure you want to logout?', 'Logout');
    if (confirmed) {
      localStorage.removeItem('currentUser');
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
    },
    {
      key: 'add-student',
      label: 'Add Student',
      icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
    },
    {
      key: 'manage-students',
      label: 'Manage Students',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      key: 'assign-batch',
      label: 'Assign Batch',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    {
      key: 'assign-trainer',
      label: 'Assign Trainer',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
    }
  ];

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left — Logo */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="WorkSphere" className="w-9 h-9 rounded-lg object-cover animate-logo-glow shadow-md" />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-brand-shimmer bg-[length:200%_auto] hidden sm:block">WorkSphere</span>
            </div>

            {/* Center — Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => setActivePage(item.key)}
                  className={`${linkClass} ${activePage === item.key ? activeClass : inactiveClass}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right — User Menu */}
            <div className="flex items-center space-x-3">
              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-lg transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-medium">
                    {counsellorName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium">{counsellorName}</span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{counsellorName}</p>
                      <p className="text-xs text-gray-500">Counsellor</p>
                    </div>

                    <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-medium text-indigo-600">{getStudentStats()}</span>
                      </div>
                    </div>

                    <button
                      disabled
                      className="block w-full text-left px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                      title="Profile feature coming soon"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </div>
                    </button>

                    <div className="border-t border-gray-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </div>
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

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3">
            <div className="flex flex-col space-y-2">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    setActivePage(item.key);
                    setIsMenuOpen(false);
                  }}
                  className={`${linkClass} ${activePage === item.key ? activeClass : inactiveClass}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                  </svg>
                  {item.label}
                </button>
              ))}

              <div className="border-t border-gray-200 my-2 pt-2">
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className={`${linkClass} text-red-600 hover:bg-red-50 w-full text-left`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default CounsellorNavbar;

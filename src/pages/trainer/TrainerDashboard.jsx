import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
{/*import { AuthContext } from '../context/AuthContext';*/}

const TrainerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Mock dashboard data
  const stats = {
    totalEmployees: 156,
    activeEmployees: 142,
    departments: 8,
    pendingLeaves: 12,
    upcomingTrainings: 5,
    newHires: 8
  };

  const recentActivities = [
    { id: 1, user: "Mahesh", action: "added new employee", time: "5 minutes ago", role: "ADMIN" },
    { id: 2, user: "Amit", action: "completed training session", time: "1 hour ago", role: "TRAINER" },
    { id: 3, user: "Neha", action: "generated monthly report", time: "3 hours ago", role: "ANALYST" },
    { id: 4, user: "Priya", action: "scheduled counseling session", time: "5 hours ago", role: "COUNSELLOR" },
    { id: 5, user: "Rahul", action: "approved leave request", time: "1 day ago", role: "ADMIN" },
  ];

  const upcomingEvents = [
    { id: 1, title: "New Employee Orientation", date: "2024-01-25", time: "10:00 AM", type: "training" },
    { id: 2, title: "Performance Review Meeting", date: "2024-01-26", time: "2:00 PM", type: "meeting" },
    { id: 3, title: "Team Building Activity", date: "2024-01-27", time: "11:00 AM", type: "event" },
    { id: 4, title: "Quarterly Review", date: "2024-01-28", time: "3:00 PM", type: "meeting" },
  ];

  const departmentDistribution = [
    { name: "Engineering", count: 45, color: "bg-blue-500" },
    { name: "Sales", count: 32, color: "bg-green-500" },
    { name: "Marketing", count: 28, color: "bg-purple-500" },
    { name: "HR", count: 15, color: "bg-yellow-500" },
    { name: "Finance", count: 20, color: "bg-red-500" },
    { name: "Operations", count: 16, color: "bg-indigo-500" },
  ];

  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'TRAINER': return 'bg-green-100 text-green-800';
      case 'ANALYST': return 'bg-purple-100 text-purple-800';
      case 'COUNSELLOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'training': return '🎓';
      case 'meeting': return '📅';
      case 'event': return '🎉';
      default: return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">EMS - Employee Management System</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition">Dashboard</Link>
              <Link to="/employees" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition">Employees</Link>
              <Link to="/departments" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition">Departments</Link>
              <Link to="/reports" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition">Reports</Link>
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700 hidden md:block">Welcome, {user?.username || 'Guest'}</span>
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.username || 'Guest'}!
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base">
                  Here's what's happening with your organization today.
                </p>
              </div>
              {user && (
                <div className={`px-4 py-2 rounded-lg ${getRoleColor(user.role)} font-medium`}>
                  {user.role}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Employees */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Total Employees</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.totalEmployees}</p>
            <p className="text-sm text-gray-600 mt-2">{stats.activeEmployees} active this month</p>
          </div>

          {/* Departments */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Active</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Departments</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.departments}</p>
            <p className="text-sm text-gray-600 mt-2">Across all divisions</p>
          </div>

          {/* Pending Leaves */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Pending</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Pending Leaves</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.pendingLeaves}</p>
            <p className="text-sm text-gray-600 mt-2">Requires approval</p>
          </div>

          {/* Upcoming Trainings */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">Scheduled</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">Upcoming Trainings</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.upcomingTrainings}</p>
            <p className="text-sm text-gray-600 mt-2">This week</p>
          </div>

          {/* New Hires */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">This month</span>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">New Hires</h3>
            <p className="text-2xl font-bold text-gray-800">{stats.newHires}</p>
            <p className="text-sm text-gray-600 mt-2">Joined recently</p>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <h3 className="text-white text-lg font-semibold mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-sm transition">
                Add Employee
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-sm transition">
                Leave Request
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-sm transition">
                Schedule Training
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg text-sm transition">
                Generate Report
              </button>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Department Distribution */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Department Distribution</h2>
              <div className="space-y-4">
                {departmentDistribution.map((dept) => (
                  <div key={dept.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{dept.name}</span>
                      <span className="text-gray-600">{dept.count} employees</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${dept.color} h-2.5 rounded-full`} 
                        style={{ width: `${(dept.count / stats.totalEmployees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Upcoming Events */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h2>
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-2xl mr-3">{getTypeIcon(event.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{event.title}</p>
                      <p className="text-xs text-gray-600">{event.date} at {event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">User</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Action</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivities.map((activity) => (
                    <tr key={activity.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-800">{activity.user}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{activity.action}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(activity.role)}`}>
                          {activity.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 Employee Management System. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default TrainerDashboard;
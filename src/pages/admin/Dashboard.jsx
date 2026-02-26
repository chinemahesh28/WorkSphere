import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [timeRange, setTimeRange] = useState('week');

  // Load users from localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
    
    // Generate mock recent activities based on users
    generateRecentActivities(storedUsers);
    setLoading(false);
  };

  // Generate mock recent activities
  const generateRecentActivities = (users) => {
    const activities = [];
    const actions = ['created', 'updated', 'logged in', 'changed password', 'updated profile'];
    const now = new Date();
    
    users.slice(0, 8).forEach((user, index) => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)];
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      
      activities.push({
        id: index,
        user: user.username,
        email: user.email,
        role: user.role,
        action: randomAction,
        time: `${randomHours}h ${randomMinutes}m ago`,
        timestamp: now - (randomHours * 3600000)
      });
    });
    
    // Sort by most recent
    activities.sort((a, b) => b.timestamp - a.timestamp);
    setRecentActivities(activities);
  };

  // Get counts by role
  const getRoleCounts = () => {
    const counts = {
      ADMIN: 0,
      TRAINER: 0,
      ANALYST: 0,
      COUNSELLOR: 0
    };
    
    users.forEach(user => {
      if (counts.hasOwnProperty(user.role)) {
        counts[user.role]++;
      }
    });
    
    return counts;
  };

  const roleCounts = getRoleCounts();

  // Get percentage change (mock data)
  const getPercentageChange = (role) => {
    const changes = {
      ADMIN: '+12%',
      TRAINER: '+8%',
      ANALYST: '+15%',
      COUNSELLOR: '+5%'
    };
    return changes[role] || '0%';
  };

  // Get role color
  const getRoleColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'red';
      case 'TRAINER': return 'green';
      case 'ANALYST': return 'purple';
      case 'COUNSELLOR': return 'blue';
      default: return 'gray';
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'TRAINER':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'ANALYST':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
      case 'COUNSELLOR':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'TRAINER': return 'bg-green-100 text-green-800';
      case 'ANALYST': return 'bg-purple-100 text-purple-800';
      case 'COUNSELLOR': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.active !== false).length;
  const newThisMonth = users.filter(u => {
    // Mock data - in real app, check creation date
    return Math.random() > 0.7;
  }).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header with Welcome and Time Range Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        
        <div className="flex space-x-2">
          {['day', 'week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              +{newThisMonth} this month
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-3xl font-bold text-gray-800">{totalUsers}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">{activeUsers}</span>
            <span className="text-gray-500 ml-1">active users</span>
          </div>
        </div>

        {/* Role-wise Stats */}
        {Object.entries(roleCounts).map(([role, count]) => {
          const color = getRoleColor(role);
          return (
            <div key={role} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-${color}-100 p-3 rounded-lg`}>
                  <div className={`text-${color}-600`}>
                    {getRoleIcon(role)}
                  </div>
                </div>
                <span className={`text-sm font-medium text-${color}-600 bg-${color}-100 px-2 py-1 rounded-full`}>
                  {getPercentageChange(role)}
                </span>
              </div>
              <h3 className="text-gray-500 text-sm font-medium">{role}s</h3>
              <p className="text-3xl font-bold text-gray-800">{count}</p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`bg-${color}-500 h-1.5 rounded-full`} 
                  style={{ width: `${(count / (totalUsers || 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Distribution Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">User Distribution by Role</h2>
          <div className="space-y-4">
            {Object.entries(roleCounts).map(([role, count]) => {
              const color = getRoleColor(role);
              const percentage = ((count / (totalUsers || 1)) * 100).toFixed(1);
              
              return (
                <div key={role}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700 flex items-center">
                      <span className={`w-3 h-3 rounded-full bg-${color}-500 mr-2`}></span>
                      {role}
                    </span>
                    <span className="text-gray-600">{count} users ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`bg-${color}-500 h-2.5 rounded-full transition-all duration-500`} 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Total Admins</p>
              <p className="text-xl font-bold text-gray-800">{roleCounts.ADMIN}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Trainers</p>
              <p className="text-xl font-bold text-gray-800">{roleCounts.TRAINER}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Analysts</p>
              <p className="text-xl font-bold text-gray-800">{roleCounts.ANALYST}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Counsellors</p>
              <p className="text-xl font-bold text-gray-800">{roleCounts.COUNSELLOR}</p>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activities</h2>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                    activity.role === 'ADMIN' ? 'bg-red-500' :
                    activity.role === 'TRAINER' ? 'bg-green-500' :
                    activity.role === 'ANALYST' ? 'bg-purple-500' : 'bg-blue-500'
                  }`}>
                    {activity.user?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">{activity.user}</p>
                    <p className="text-xs text-gray-500">{activity.email}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-medium">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(activity.role)}`}>
                    {activity.role}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">All Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.slice(0, 5).map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-medium ${
                          user.role === 'ADMIN' ? 'bg-red-500' :
                          user.role === 'TRAINER' ? 'bg-green-500' :
                          user.role === 'ANALYST' ? 'bg-purple-500' : 'bg-blue-500'
                        }`}>
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => navigate(`/admin/${user.role.toLowerCase()}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {users.length > 5 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <button
              onClick={() => navigate('/admin/users')}
              className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View all {users.length} users →
            </button>
          </div>
        )}
      </div>

     
    </div>
  );
};

export default Dashboard;
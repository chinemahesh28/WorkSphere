import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [batches, setBatches] = useState([]);
  const [analystName, setAnalystName] = useState('Analyst');

  // Load batches from localStorage
  useEffect(() => {
    loadData();
    // Get current user name
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    if (currentUser.fullName) {
      setAnalystName(currentUser.fullName.split(' ')[0]);
    }
  }, []);

  const loadData = () => {
    setLoading(true);
    const storedBatches = JSON.parse(localStorage.getItem('batches')) || [];
    setBatches(storedBatches);
    setLoading(false);
  };

  // Calculate batch statistics
  const getBatchStats = () => {
    const now = new Date();
    const total = batches.length;
    const active = batches.filter(b => b.status === 'active').length;
    const completed = batches.filter(b => b.status === 'completed').length;
    const upcoming = batches.filter(b => {
      const startDate = new Date(b.startDate);
      return startDate > now && b.status === 'scheduled';
    }).length;

    // Total students across all batches
    const totalStudents = batches.reduce((sum, batch) => 
      sum + (batch.enrolledStudents || 0), 0
    );

    // Average batch size
    const avgBatchSize = total ? Math.round(totalStudents / total) : 0;

    return { total, active, completed, upcoming, totalStudents, avgBatchSize };
  };

  const stats = getBatchStats();

  // Get recent batches
  const getRecentBatches = () => {
    return batches
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const recentBatches = getRecentBatches();

  // Get domain distribution
  const getDomainDistribution = () => {
    const domains = {};
    batches.forEach(batch => {
      if (batch.domain) {
        domains[batch.domain] = (domains[batch.domain] || 0) + 1;
      }
    });
    return domains;
  };

  const domainDistribution = getDomainDistribution();

  // Get upcoming batches (next 5)
  const getUpcomingBatches = () => {
    const now = new Date();
    return batches
      .filter(b => new Date(b.startDate) > now)
      .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
      .slice(0, 5);
  };

  const upcomingBatches = getUpcomingBatches();

  return (
    <div className="p-6 space-y-6">
      {/* Header with Welcome Message */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {analystName}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening with your batches today.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/analyst/batches/create')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition transform hover:scale-105 flex items-center shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Batch
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Batches</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-green-600 font-medium">{stats.active}</span>
            <span className="text-gray-500 ml-1">active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Active Batches</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.active}</p>
          <p className="text-sm text-gray-500 mt-2">Currently running</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
          <p className="text-sm text-gray-500 mt-2">Across all batches</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Upcoming</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.upcoming}</p>
          <p className="text-sm text-gray-500 mt-2">Scheduled batches</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Avg. Batch Size</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.avgBatchSize}</p>
          <p className="text-sm text-gray-500 mt-2">Students per batch</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Batches */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Recent Batches</h2>
            <button
              onClick={() => navigate('/analyst/batches/manage')}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
            >
              View All
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : recentBatches.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-gray-500">No batches created yet</p>
              <button
                onClick={() => navigate('/analyst/batches/create')}
                className="mt-4 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Create your first batch
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentBatches.map((batch, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  onClick={() => navigate(`/analyst/batches/manage?id=${batch.id}`)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      batch.domain === 'Web Development' ? 'bg-blue-500' :
                      batch.domain === 'Data Science' ? 'bg-green-500' :
                      batch.domain === 'Cloud Computing' ? 'bg-purple-500' :
                      batch.domain === 'Cybersecurity' ? 'bg-red-500' :
                      'bg-indigo-500'
                    }`}>
                      {batch.batchName?.charAt(0) || 'B'}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{batch.batchName}</h3>
                      <p className="text-sm text-gray-500">
                        {batch.domain} • {batch.timing} • {batch.enrolledStudents || 0} students
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      batch.status === 'active' ? 'bg-green-100 text-green-700' :
                      batch.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {batch.status || 'scheduled'}
                    </span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Domain Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Domain Distribution</h2>
          {Object.keys(domainDistribution).length === 0 ? (
            <p className="text-gray-500 text-center py-8">No domains yet</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(domainDistribution).map(([domain, count]) => (
                <div key={domain}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{domain}</span>
                    <span className="font-medium text-gray-800">{count} batches</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/analyst/batches/create')}
                className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Create New Batch
              </button>
              <button
                onClick={() => navigate('/analyst/batches/manage')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Manage Batches
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Batches Schedule */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Batches Schedule</h2>
        
        {upcomingBatches.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No upcoming batches scheduled</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Batch Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Domain</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Start Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Timing</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Duration</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Students</th>
                </tr>
              </thead>
              <tbody>
                {upcomingBatches.map((batch, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{batch.batchName}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {batch.domain}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(batch.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{batch.timing}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{batch.duration} weeks</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{batch.enrolledStudents || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Batch Success Rate</h3>
          <p className="text-3xl font-bold mb-2">
            {stats.total ? Math.round((stats.completed / stats.total) * 100) : 0}%
          </p>
          <p className="text-indigo-100 text-sm">
            {stats.completed} completed out of {stats.total} batches
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Student Engagement</h3>
          <p className="text-3xl font-bold mb-2">
            {stats.totalStudents ? Math.round((stats.totalStudents / stats.total) * 10) : 0}/10
          </p>
          <p className="text-green-100 text-sm">Average rating from students</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">Resource Utilization</h3>
          <p className="text-3xl font-bold mb-2">
            {stats.active ? Math.round((stats.active / stats.total) * 100) : 0}%
          </p>
          <p className="text-purple-100 text-sm">Active batches utilization</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
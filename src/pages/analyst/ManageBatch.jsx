import React, { useState, useEffect } from 'react';

const ManageBatch = ({ setActivePage }) => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Load batches from localStorage
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = () => {
    setLoading(true);
    const storedBatches = JSON.parse(localStorage.getItem('batches')) || [];
    setBatches(storedBatches);
    setLoading(false);
  };

  // Get unique domains for filter
  const getUniqueDomains = () => {
    const domains = batches.map(b => b.domain).filter(Boolean);
    return ['ALL', ...new Set(domains)];
  };

  // Filter batches based on search, domain, and status
  const getFilteredBatches = () => {
    return batches.filter(batch => {
      const matchesSearch = 
        (batch.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         batch.batchCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         batch.trainerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         batch.domain?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesDomain = filterDomain === 'ALL' || batch.domain === filterDomain;
      const matchesStatus = filterStatus === 'ALL' || batch.status === filterStatus;
      
      return matchesSearch && matchesDomain && matchesStatus;
    });
  };

  const filteredBatches = getFilteredBatches();
  const domains = getUniqueDomains();

  // Handle edit
  const handleEdit = (batch) => {
    setSelectedBatch(batch);
    setEditFormData(batch);
    setShowEditModal(true);
  };

  // Handle update
  const handleUpdate = (e) => {
    e.preventDefault();
    
    const updatedBatches = batches.map(batch => 
      batch.id === selectedBatch.id ? editFormData : batch
    );
    
    localStorage.setItem('batches', JSON.stringify(updatedBatches));
    setBatches(updatedBatches);
    setShowEditModal(false);
    alert('Batch updated successfully!');
  };

  // Handle delete
  const handleDelete = () => {
    const updatedBatches = batches.filter(batch => batch.id !== selectedBatch.id);
    localStorage.setItem('batches', JSON.stringify(updatedBatches));
    setBatches(updatedBatches);
    setShowDeleteModal(false);
    alert('Batch deleted successfully!');
  };

  // Handle view details
  const handleViewDetails = (batch) => {
    setSelectedBatch(batch);
    setShowDetailsModal(true);
  };

  // Handle status change
  const handleStatusChange = (batch, newStatus) => {
    const updatedBatches = batches.map(b => 
      b.id === batch.id ? { ...b, status: newStatus } : b
    );
    
    localStorage.setItem('batches', JSON.stringify(updatedBatches));
    setBatches(updatedBatches);
    alert(`Batch status changed to ${newStatus}`);
  };

  // Calculate statistics
  const getStats = () => {
    const total = batches.length;
    const active = batches.filter(b => b.status === 'active').length;
    const scheduled = batches.filter(b => b.status === 'scheduled').length;
    const completed = batches.filter(b => b.status === 'completed').length;
    const cancelled = batches.filter(b => b.status === 'cancelled').length;
    const totalStudents = batches.reduce((sum, b) => sum + (parseInt(b.enrolledStudents) || 0), 0);
    const totalCapacity = batches.reduce((sum, b) => sum + (parseInt(b.capacity) || 0), 0);
    const fillRate = totalCapacity ? Math.round((totalStudents / totalCapacity) * 100) : 0;

    return { total, active, scheduled, completed, cancelled, totalStudents, totalCapacity, fillRate };
  };

  const stats = getStats();

  // Get status badge color
  const getStatusBadge = (status) => {
    switch(status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get mode badge color
  const getModeBadge = (mode) => {
    switch(mode) {
      case 'online':
        return 'bg-purple-100 text-purple-800';
      case 'offline':
        return 'bg-indigo-100 text-indigo-800';
      case 'hybrid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Batches</h1>
          <p className="text-gray-600">View and manage all training batches</p>
        </div>
        
        <button
          onClick={() => setActivePage('create-batch')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition transform hover:scale-105 flex items-center shadow-lg"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create New Batch
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-indigo-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {stats.active} Active
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Batches</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Scheduled</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.scheduled}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Students</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalStudents}</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Fill Rate</h3>
          <p className="text-3xl font-bold text-gray-800">{stats.fillRate}%</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search by batch name, code, trainer, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="w-full md:w-48">
            <select
              value={filterDomain}
              onChange={(e) => setFilterDomain(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              {domains.map(domain => (
                <option key={domain} value={domain}>
                  {domain === 'ALL' ? 'All Domains' : domain}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-40">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trainer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex justify-center items-center">
                      <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </td>
                </tr>
              ) : filteredBatches.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No batches found
                  </td>
                </tr>
              ) : (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                          batch.domain === 'Web Development' ? 'bg-blue-500' :
                          batch.domain === 'Data Science' ? 'bg-green-500' :
                          batch.domain === 'Cloud Computing' ? 'bg-purple-500' :
                          batch.domain === 'Cybersecurity' ? 'bg-red-500' :
                          'bg-indigo-500'
                        }`}>
                          {batch.batchName?.charAt(0) || 'B'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{batch.batchName}</div>
                          <div className="text-xs text-gray-500">{batch.batchCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-medium">
                        {batch.domain}
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${getModeBadge(batch.mode)}`}>
                          {batch.mode}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {new Date(batch.startDate).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">{batch.timing}</div>
                      <div className="text-xs text-gray-500">{batch.daysOfWeek?.length} days/week</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{batch.trainerName}</div>
                      <div className="text-xs text-gray-500">{batch.trainerExperience}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {batch.enrolledStudents || 0} / {batch.capacity}
                      </div>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${((batch.enrolledStudents || 0) / batch.capacity) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={batch.status}
                        onChange={(e) => handleStatusChange(batch, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusBadge(batch.status)}`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(batch)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="View Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleEdit(batch)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedBatch(batch);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Batch Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Batch Name</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.batchName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Batch Code</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.batchCode}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Domain</h4>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.domain}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Mode</h4>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{selectedBatch.mode}</p>
                </div>
              </div>

              {/* Schedule */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Start Date: {new Date(selectedBatch.startDate).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">End Date: {new Date(selectedBatch.endDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Timing: {selectedBatch.timing}</p>
                    <p className="text-sm text-gray-600">Duration: {selectedBatch.duration}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Days: {selectedBatch.daysOfWeek?.join(', ')}</p>
                  </div>
                </div>
              </div>

              {/* Capacity & Pricing */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Capacity & Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Capacity: {selectedBatch.capacity}</p>
                    <p className="text-sm text-gray-600">Enrolled: {selectedBatch.enrolledStudents || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Price: {selectedBatch.currency} {selectedBatch.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedBatch.status)}`}>
                        {selectedBatch.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Trainer Info */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Trainer Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name: {selectedBatch.trainerName}</p>
                    <p className="text-sm text-gray-600">Email: {selectedBatch.trainerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience: {selectedBatch.trainerExperience}</p>
                  </div>
                </div>
              </div>

              {/* Curriculum */}
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-md font-semibold text-gray-800 mb-3">Curriculum</h4>
                <p className="text-sm text-gray-600 whitespace-pre-line">{selectedBatch.curriculum}</p>
                
                {selectedBatch.prerequisites && (
                  <>
                    <h5 className="text-sm font-medium text-gray-700 mt-3">Prerequisites</h5>
                    <p className="text-sm text-gray-600">{selectedBatch.prerequisites}</p>
                  </>
                )}

                {selectedBatch.materials && (
                  <>
                    <h5 className="text-sm font-medium text-gray-700 mt-3">Materials</h5>
                    <p className="text-sm text-gray-600">{selectedBatch.materials}</p>
                  </>
                )}
              </div>

              {/* Location/Meeting */}
              {(selectedBatch.location || selectedBatch.meetingLink) && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Location</h4>
                  {selectedBatch.location && (
                    <p className="text-sm text-gray-600">📍 {selectedBatch.location}</p>
                  )}
                  {selectedBatch.meetingLink && (
                    <p className="text-sm text-indigo-600">
                      🔗 <a href={selectedBatch.meetingLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {selectedBatch.meetingLink}
                      </a>
                    </p>
                  )}
                </div>
              )}

              {/* Tags */}
              {selectedBatch.tags && selectedBatch.tags.length > 0 && (
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBatch.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">Edit Batch</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                  <input
                    type="text"
                    value={editFormData.batchName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, batchName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code</label>
                  <input
                    type="text"
                    value={editFormData.batchCode || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, batchCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={editFormData.capacity || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled Students</label>
                  <input
                    type="number"
                    value={editFormData.enrolledStudents || 0}
                    onChange={(e) => setEditFormData({ ...editFormData, enrolledStudents: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={editFormData.price || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trainer Name</label>
                  <input
                    type="text"
                    value={editFormData.trainerName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, trainerName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                ></textarea>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-lg font-medium transition"
                >
                  Update Batch
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Delete Batch</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{selectedBatch?.batchName}"? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatch;
import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const Dashboard = () => {
  const toast = useToast();
  const [batches, setBatches] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'startDate', direction: 'desc' });
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    scheduled: 0,
    completed: 0
  });

  // Load data from localStorage
  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const response = await api.get('/api/batches');
      setBatches(response.data);
      setFilteredBatches(response.data);
      updateStats(response.data);
    } catch (error) {
      toast.error('Failed to load batches');
    }
  };

  // Update statistics
  const updateStats = (batchData) => {
    const newStats = batchData.reduce((acc, batch) => {
      acc.total++;
      acc[batch.status]++;
      return acc;
    }, { total: 0, active: 0, scheduled: 0, completed: 0 });
    setStats(newStats);
  };

  // Filter and search logic
  useEffect(() => {
    let result = [...batches];

    // Apply search
    if (searchTerm) {
      result = result.filter(batch => 
        batch.batchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.batchNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(batch => batch.status === statusFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortConfig.key === 'startDate' || sortConfig.key === 'endDate') {
        return sortConfig.direction === 'asc' 
          ? new Date(a[sortConfig.key]) - new Date(b[sortConfig.key])
          : new Date(b[sortConfig.key]) - new Date(a[sortConfig.key]);
      }
      
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setFilteredBatches(result);
  }, [searchTerm, statusFilter, sortConfig, batches]);

  // Handle batch deletion
  const handleDeleteBatch = async (batchId) => {
    if (await toast.confirm('Are you sure you want to delete this batch?', 'Delete Batch')) {
      try {
        await api.delete(`/api/batches/${batchId}`);
        const updatedBatches = batches.filter(batch => batch.id !== batchId);
        setBatches(updatedBatches);
        updateStats(updatedBatches);
        toast.success('Batch deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete batch.');
      }
    }
  };

  // Handle status update
  const handleStatusUpdate = async (batchId, newStatus) => {
    try {
      const batchToUpdate = batches.find(b => b.id === batchId);
      if (!batchToUpdate) return;
      const response = await api.put(`/api/batches/${batchId}`, { ...batchToUpdate, status: newStatus });
      const updatedBatches = batches.map(batch => 
        batch.id === batchId ? response.data : batch
      );
      setBatches(updatedBatches);
      updateStats(updatedBatches);
      toast.success('Status updated successfully.');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  // Handle sort
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return '↕️';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header with Refresh Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analyst Dashboard</h1>
          <p className="mt-2 text-gray-600">Here's an overview of your training batches and their current status.</p>
        </div>
        <button 
          onClick={loadBatches}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Batches', value: stats.total, key: 'all', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bg: 'bg-indigo-50', text: 'text-indigo-600' },
          { label: 'Active', value: stats.active, key: 'active', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', bg: 'bg-green-50', text: 'text-green-600' },
          { label: 'Scheduled', value: stats.scheduled, key: 'scheduled', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Completed', value: stats.completed, key: 'completed', icon: 'M5 13l4 4L19 7', bg: 'bg-gray-50', text: 'text-gray-600' },
        ].map((stat, i) => (
          <div 
            key={i} 
            onClick={() => setStatusFilter(stat.key)}
            className={`${stat.bg} p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer ${statusFilter === stat.key ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
              </div>
              <div className={`${stat.text} opacity-20`}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search batches by name, ID, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
          </select>

          {/* Clear Filters */}
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredBatches.length} of {batches.length} batches
        </div>
      </div>

      {/* Batch List with Interactive Features */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Batch Overview</h3>
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {filteredBatches.length} Batches
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('batchName')}>
                  Batch Info {getSortIcon('batchName')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('domain')}>
                  Domain {getSortIcon('domain')}
                </th>
                <th className="px-6 py-4 cursor-pointer hover:text-indigo-600" onClick={() => handleSort('startDate')}>
                  Timeline {getSortIcon('startDate')}
                </th>
                <th className="px-6 py-4 text-center cursor-pointer hover:text-indigo-600" onClick={() => handleSort('status')}>
                  Status {getSortIcon('status')}
                </th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr 
                    key={batch.id} 
                    className="hover:bg-gray-50 transition-colors group"
                    onClick={() => {
                      setSelectedBatch(batch);
                      setIsModalOpen(true);
                    }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors tracking-tight">{batch.batchName}</div>
                      <div className="text-sm text-gray-400 font-mono tracking-tighter">{batch.batchNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {batch.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 font-medium">{batch.startDate}</div>
                      <div className="text-xs text-gray-400">to {batch.endDate}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={batch.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate(batch.id, e.target.value);
                        }}
                        className={`inline-flex px-3 py-1 rounded-lg text-xs font-bold border transition-all ${getStatusColor(batch.status)} shadow-sm cursor-pointer`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="scheduled">SCHEDULED</option>
                        <option value="active">ACTIVE</option>
                        <option value="completed">COMPLETED</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBatch(batch);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBatch(batch.id);
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Batch"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      {searchTerm || statusFilter !== 'all' ? 
                        'No batches match your filters. Try adjusting your search criteria.' : 
                        'No batches found. Create your first batch to see it here!'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Batch Details Modal */}
      {isModalOpen && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Batch Details</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Batch Name</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedBatch.batchName}</p>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-bold ${getStatusColor(selectedBatch.status)}`}>
                  {selectedBatch.status.toUpperCase()}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Batch Number</p>
                  <p className="text-lg font-semibold text-gray-800 font-mono">{selectedBatch.batchNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Domain</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.domain}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">End Date</p>
                  <p className="text-lg font-semibold text-gray-800">{selectedBatch.endDate}</p>
                </div>
              </div>

              {/* Progress Bar (example) */}
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">Progress</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getStatusBadgeColor(selectedBatch.status)} transition-all duration-500`}
                    style={{ 
                      width: selectedBatch.status === 'completed' ? '100%' : 
                             selectedBatch.status === 'active' ? '50%' : '25%' 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Scheduled</span>
                  <span>Active</span>
                  <span>Completed</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedBatch.id, 'scheduled');
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-medium"
                >
                  Mark as Scheduled
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedBatch.id, 'active');
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors font-medium"
                >
                  Mark as Active
                </button>
                <button
                  onClick={() => {
                    handleStatusUpdate(selectedBatch.id, 'completed');
                    setIsModalOpen(false);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
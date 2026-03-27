import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const ManageBatch = () => {
  const toast = useToast();
  const [batches, setBatches] = useState([]);
  const [editingBatch, setEditingBatch] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    try {
      const response = await api.get('/api/batches');
      setBatches(response.data);
    } catch (error) {
      toast.error('Failed to load batches');
    }
  };

  const handleDelete = async (id) => {
    if (await toast.confirm('Are you sure you want to delete this batch? This action cannot be undone.', 'Delete Batch')) {
      try {
        await api.delete(`/api/batches/${id}`);
        setBatches(batches.filter(batch => batch.id !== id));
        toast.success('Batch deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete batch');
      }
    }
  };

  const handleEdit = (batch) => {
    setEditingBatch({ ...batch });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/batches/${editingBatch.id}`, editingBatch);
      setBatches(batches.map(batch => 
        batch.id === editingBatch.id ? response.data : batch
      ));
      setShowEditModal(false);
      toast.success('Batch updated successfully.');
    } catch (error) {
      toast.error('Failed to update batch');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'scheduled': return 'text-blue-600 bg-blue-50';
      case 'completed': return 'text-gray-600 bg-gray-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manage Batches</h2>
        <div className="text-sm text-gray-500">Total: {batches.length} Batches</div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Batch Details</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Timing</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {batches.length > 0 ? (
                batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">{batch.batchName}</div>
                      <div className="text-xs text-gray-400 font-mono uppercase">{batch.batchNo}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{batch.domain}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{batch.timing}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2.5 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider ${getStatusColor(batch.status)}`}>
                        {batch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleEdit(batch)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Edit Batch"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(batch.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Delete Batch"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400 italic">No batches available to manage.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingBatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Batch</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:rotate-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Batch Name</label>
                  <input 
                    type="text" 
                    value={editingBatch.batchName}
                    onChange={(e) => setEditingBatch({...editingBatch, batchName: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Batch ID</label>
                  <input 
                    type="text" 
                    value={editingBatch.batchNo}
                    onChange={(e) => setEditingBatch({...editingBatch, batchNo: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
                  <select 
                    value={editingBatch.status}
                    onChange={(e) => setEditingBatch({...editingBatch, status: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg outline-none"
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Timing</label>
                  <input 
                    type="text" 
                    value={editingBatch.timing}
                    onChange={(e) => setEditingBatch({...editingBatch, timing: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatch;

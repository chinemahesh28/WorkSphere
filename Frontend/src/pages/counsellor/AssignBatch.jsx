import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const AssignBatch = () => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [studentsRes, batchesRes, assignmentsRes] = await Promise.all([
        api.get('/api/students'),
        api.get('/api/batches'),
        api.get('/api/student-batch-assignments')
      ]);
      setStudents(studentsRes.data || []);
      setBatches(batchesRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  const handleAssign = async () => {
    if (!selectedStudent || !selectedBatch) {
      toast.warning('Please select both a student and a batch.');
      return;
    }

    try {
      const response = await api.post('/api/student-batch-assignments', {
        studentId: selectedStudent,
        batchId: selectedBatch
      });
      setAssignments([...assignments, response.data]);
      setSelectedStudent('');
      setSelectedBatch('');
      toast.success('Student assigned to batch successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign student');
    }
  };

  const handleRemove = async (assignmentId) => {
    if (await toast.confirm('Remove this batch assignment?', 'Remove Assignment')) {
      try {
        await api.delete(`/api/student-batch-assignments/${assignmentId}`);
        setAssignments(assignments.filter(a => a.id !== assignmentId));
        toast.success('Assignment removed.');
      } catch (error) {
        toast.error('Failed to remove assignment');
      }
    }
  };

  const handleEdit = (assignment) => {
    setEditingAssignment({ ...assignment });
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/student-batch-assignments/${editingAssignment.id}`, {
        studentId: editingAssignment.studentId,
        batchId: editingAssignment.batchId
      });
      setAssignments(assignments.map(a =>
        a.id === editingAssignment.id ? response.data : a
      ));
      setShowEditModal(false);
      setEditingAssignment(null);
      toast.success('Assignment updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    }
  };

  const getStudentName = (id) => {
    const s = students.find(s => s.id === id);
    return s ? s.fullName : 'Unknown Student';
  };

  const getStudentEmail = (id) => {
    const s = students.find(s => s.id === id);
    return s ? s.email : '';
  };

  const getBatchName = (id) => {
    const b = batches.find(b => b.id === id);
    return b ? b.batchName : 'Unknown Batch';
  };

  const getBatchNo = (id) => {
    const b = batches.find(b => b.id === id);
    return b ? b.batchNo : '';
  };

  const filteredAssignments = assignments.filter(a => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      getStudentName(a.studentId).toLowerCase().includes(term) ||
      getBatchName(a.batchId).toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Assign Batch to Student</h1>
        <p className="mt-2 text-gray-600">Select a student and assign them to an available training batch.</p>
      </div>

      {/* Assignment Form */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5">
          <h2 className="text-lg font-bold text-white">New Assignment</h2>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Select Student */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select Student*</label>
              <select
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              >
                <option value="">-- Choose a Student --</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} ({s.email})
                  </option>
                ))}
              </select>
              {students.length === 0 && (
                <p className="text-xs text-amber-600">No students available. Add students first.</p>
              )}
            </div>

            {/* Select Batch */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select Batch*</label>
              <select
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all"
              >
                <option value="">-- Choose a Batch --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.batchName} ({b.batchNo}) — {b.domain}
                  </option>
                ))}
              </select>
              {batches.length === 0 && (
                <p className="text-xs text-amber-600">No batches available. Batches are created by the Analyst.</p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleAssign}
              disabled={!selectedStudent || !selectedBatch}
              className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign Student to Batch
            </button>
          </div>
        </div>
      </div>

      {/* Current Assignments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Current Assignments</h3>
            <p className="text-sm text-gray-500">{assignments.length} total assignments</p>
          </div>
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Assigned On</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                          {getStudentName(assignment.studentId).charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{getStudentName(assignment.studentId)}</div>
                          <div className="text-xs text-gray-400">{getStudentEmail(assignment.studentId)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-800">{getBatchName(assignment.batchId)}</div>
                      <div className="text-xs text-gray-400 font-mono">{getBatchNo(assignment.batchId)}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(assignment.assignedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(assignment)}
                          className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                          title="Edit Assignment"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleRemove(assignment.id)}
                          className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                          title="Remove Assignment"
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
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {searchTerm ? 'No assignments match your search.' : 'No batch assignments yet. Start by assigning a student to a batch above.'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && editingAssignment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Batch Assignment</h3>
              <button onClick={() => setShowEditModal(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Student</label>
                <select value={editingAssignment.studentId} onChange={(e) => setEditingAssignment({...editingAssignment, studentId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fullName} ({s.email})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Batch</label>
                <select value={editingAssignment.batchId} onChange={(e) => setEditingAssignment({...editingAssignment, batchId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.batchName} ({b.batchNo}) — {b.domain}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
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

export default AssignBatch;

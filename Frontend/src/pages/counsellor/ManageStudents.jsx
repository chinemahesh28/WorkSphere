import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const ManageStudents = ({ setActivePage }) => {
  const toast = useToast();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [domainFilter, setDomainFilter] = useState('all');
  const [editingStudent, setEditingStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);

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
      setFilteredStudents(studentsRes.data || []);
      setBatches(batchesRes.data || []);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      toast.error('Failed to load data');
    }
  };

  // Filter and search logic
  useEffect(() => {
    let result = [...students];

    if (searchTerm) {
      result = result.filter(s =>
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
      );
    }

    if (domainFilter !== 'all') {
      result = result.filter(s => s.domainInterest === domainFilter);
    }

    setFilteredStudents(result);
  }, [searchTerm, domainFilter, students]);

  const handleDelete = async (id) => {
    if (await toast.confirm('Are you sure you want to delete this student? This action cannot be undone.', 'Delete Student')) {
      try {
        await api.delete(`/api/students/${id}`);
        const updatedStudents = students.filter(s => s.id !== id);
        setStudents(updatedStudents);
        setAssignments(assignments.filter(a => a.student?.id !== id && a.studentId !== id));
        toast.success('Student deleted successfully.');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent({ ...student });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/api/students/${editingStudent.id}`, editingStudent);
      const updatedStudents = students.map(s =>
        s.id === editingStudent.id ? response.data : s
      );
      setStudents(updatedStudents);
      setShowEditModal(false);
      toast.success('Student updated successfully.');
    } catch (error) {
      toast.error('Failed to update student');
    }
  };

  const domains = [...new Set(students.map(s => s.domainInterest))];

  // Get batch assignment info for a student
  const getStudentBatch = (studentId) => {
    const assignment = assignments.find(a => (a.student?.id === studentId) || (a.studentId === studentId));
    if (assignment) {
      const batchId = assignment.batch?.id || assignment.batchId;
      const batch = batches.find(b => b.id === batchId);
      return batch ? batch.batchName : 'Unknown Batch';
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Students</h2>
          <p className="text-gray-500 text-sm mt-1">View, edit, and manage all registered students.</p>
        </div>
        <button
          onClick={() => setActivePage('add-student')}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Domains</option>
            {domains.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          {(searchTerm || domainFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setDomainFilter('all');
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Qualification</th>
                <th className="px-6 py-4">Domain Interest</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const assignedBatch = getStudentBatch(student.id);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                            {student.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="font-bold text-gray-800">{student.fullName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{student.email}</div>
                        <div className="text-xs text-gray-400">{student.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{student.qualification}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                          {student.domainInterest}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {assignedBatch ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                            {assignedBatch}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Not assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            title="Edit Student"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete Student"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {searchTerm || domainFilter !== 'all'
                        ? 'No students match your filters. Try adjusting your search criteria.'
                        : 'No students found. Add your first student to see them here!'}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center">
              <h3 className="font-bold text-lg">Edit Student</h3>
              <button onClick={() => setShowEditModal(false)} className="hover:rotate-90 transition-transform">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.fullName}
                    onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</label>
                  <input
                    type="email"
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</label>
                  <input
                    type="tel"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Qualification</label>
                  <select
                    value={editingStudent.qualification}
                    onChange={(e) => setEditingStudent({ ...editingStudent, qualification: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg outline-none"
                  >
                    <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                    <option value="BCA">BCA</option>
                    <option value="MCA">MCA</option>
                    <option value="M.Tech / M.E.">M.Tech / M.E.</option>
                    <option value="BSc Computer Science">BSc Computer Science</option>
                    <option value="MSc Computer Science">MSc Computer Science</option>
                    <option value="BBA">BBA</option>
                    <option value="MBA">MBA</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Domain Interest</label>
                  <select
                    value={editingStudent.domainInterest}
                    onChange={(e) => setEditingStudent({ ...editingStudent, domainInterest: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg outline-none"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="DevOps">DevOps</option>
                  </select>
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

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ManageStudents;

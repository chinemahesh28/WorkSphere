import React, { useState, useEffect } from 'react';

const CounsellorHome = ({ setActivePage }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    assignedStudents: 0,
    totalBatches: 0,
    batchesWithTrainers: 0
  });
  const [batchDetails, setBatchDetails] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [expandedBatch, setExpandedBatch] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const batches = JSON.parse(localStorage.getItem('batches')) || [];
    const studentBatchAssignments = JSON.parse(localStorage.getItem('studentBatchAssignments')) || [];
    const batchTrainerAssignments = JSON.parse(localStorage.getItem('batchTrainerAssignments')) || [];
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const trainers = allUsers.filter(u => u.role === 'TRAINER');

    const assignedStudentIds = new Set(studentBatchAssignments.map(a => a.studentId));
    const batchesWithTrainerIds = new Set(batchTrainerAssignments.map(a => a.batchId));

    setStats({
      totalStudents: students.length,
      assignedStudents: assignedStudentIds.size,
      totalBatches: batches.length,
      batchesWithTrainers: batchesWithTrainerIds.size
    });

    const enrichedBatches = batches.map(batch => {
      const batchStudentIds = studentBatchAssignments
        .filter(a => a.batchId === batch.id)
        .map(a => a.studentId);
      const batchStudents = students.filter(s => batchStudentIds.includes(s.id));

      const batchTrainerIds = batchTrainerAssignments
        .filter(a => a.batchId === batch.id)
        .map(a => a.trainerId);
      const batchTrainers = trainers.filter(t => batchTrainerIds.includes(t.id));

      return { ...batch, students: batchStudents, trainers: batchTrainers };
    });

    setBatchDetails(enrichedBatches);
    setRecentStudents(students.slice(-5).reverse());
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'scheduled': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const statCards = [
    {
      label: 'Total Students',
      value: stats.totalStudents,
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      action: 'manage-students'
    },
    {
      label: 'Assigned to Batches',
      value: stats.assignedStudents,
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      bg: 'bg-green-50',
      text: 'text-green-600',
      action: 'assign-batch'
    },
    {
      label: 'Total Batches',
      value: stats.totalBatches,
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      action: 'assign-batch'
    },
    {
      label: 'Trainers Assigned',
      value: stats.batchesWithTrainers,
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      bg: 'bg-gray-50',
      text: 'text-gray-600',
      action: 'assign-trainer'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Counsellor Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage student enrollments, batch assignments, and trainer allocations.</p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div
            key={i}
            onClick={() => setActivePage(stat.action)}
            className={`${stat.bg} p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer`}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setActivePage('add-student')}
          className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <div className="text-left">
            <p className="font-bold">Add New Student</p>
            <p className="text-sm text-indigo-100">Register a student</p>
          </div>
        </button>

        <button
          onClick={() => setActivePage('assign-batch')}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <div className="text-left">
            <p className="font-bold">Assign Batch</p>
            <p className="text-sm text-gray-500">Assign students to batches</p>
          </div>
        </button>

        <button
          onClick={() => setActivePage('assign-trainer')}
          className="flex items-center gap-3 p-4 bg-white border border-gray-200 text-gray-800 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="text-left">
            <p className="font-bold">Assign Trainer</p>
            <p className="text-sm text-gray-500">Assign trainers to batches</p>
          </div>
        </button>
      </div>

      {/* ========== BATCH DETAILS WITH STUDENTS & TRAINERS ========== */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Batch Details</h2>
          <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
            {batchDetails.length} Batches
          </span>
        </div>

        {batchDetails.length > 0 ? (
          <div className="space-y-4">
            {batchDetails.map((batch) => {
              const isExpanded = expandedBatch === batch.id;
              return (
                <div key={batch.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  {/* Batch Header */}
                  <button
                    onClick={() => setExpandedBatch(isExpanded ? null : batch.id)}
                    className="w-full px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                        {batch.batchName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{batch.batchName}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-400 font-mono">{batch.batchNo}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{batch.domain}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-500">{batch.timing}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusColor(batch.status)} uppercase`}>
                        {batch.status}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="font-bold">{batch.students.length}</span> Students
                      </div>
                      <div className="flex items-center gap-1 text-xs text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-bold">{batch.trainers.length}</span> Trainer{batch.trainers.length !== 1 ? 's' : ''}
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-6 py-5 bg-gray-50/30 space-y-5">
                      {/* Batch Timeline */}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Start: </span>
                          <span className="font-semibold text-gray-800">{batch.startDate}</span>
                        </div>
                        <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <div>
                          <span className="text-gray-500">End: </span>
                          <span className="font-semibold text-gray-800">{batch.endDate}</span>
                        </div>
                      </div>

                      {/* Trainers Section */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Assigned Trainers
                        </h4>
                        {batch.trainers.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {batch.trainers.map(trainer => (
                              <div key={trainer.id} className="flex items-center gap-2 bg-white border border-purple-200 rounded-xl px-3 py-2 shadow-sm">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                  {trainer.fullName?.charAt(0).toUpperCase() || 'T'}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">{trainer.fullName || trainer.username}</p>
                                  <p className="text-xs text-gray-400">{trainer.email}</p>
                                </div>
                                {trainer.domain && (
                                  <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-100 text-purple-600 border border-purple-200">
                                    {trainer.domain}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No trainer assigned yet.</p>
                        )}
                      </div>

                      {/* Students Section */}
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                          Enrolled Students ({batch.students.length})
                        </h4>
                        {batch.students.length > 0 ? (
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
                                <tr>
                                  <th className="px-4 py-3">Name</th>
                                  <th className="px-4 py-3">Email</th>
                                  <th className="px-4 py-3">Phone</th>
                                  <th className="px-4 py-3">Domain Interest</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                {batch.students.map(student => (
                                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-4 py-3">
                                      <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                          {student.fullName.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-800 text-sm">{student.fullName}</span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-600">{student.phone}</td>
                                    <td className="px-4 py-3">
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                                        {student.domainInterest}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 italic">No students enrolled in this batch yet.</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-gray-500">No batches available. Batches are created by the Analyst.</p>
          </div>
        )}
      </div>

      {/* Recent Students Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Recent Students</h3>
          <button
            onClick={() => setActivePage('manage-students')}
            className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-indigo-100 transition-colors"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Domain Interest</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentStudents.length > 0 ? (
                recentStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                          {student.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">{student.fullName}</div>
                          <div className="text-xs text-gray-400">{student.qualification}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                        {student.domainInterest}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      No students added yet. Click "Add New Student" to get started!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default CounsellorHome;

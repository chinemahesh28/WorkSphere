import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const TrainerHome = ({ setActivePage }) => {
  const [stats, setStats] = useState({ myBatches: 0, totalClasses: 0, totalMaterials: 0, totalStudents: 0 });
  const [assignedBatches, setAssignedBatches] = useState([]);
  const [recentUpdates, setRecentUpdates] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.id;

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [batchesRes, batchTrainerAssignmentsRes, studentBatchAssignmentsRes, classUpdatesRes] = await Promise.all([
        api.get('/api/batches'),
        api.get(`/api/batch-trainer-assignments/trainer/${trainerId}`),
        api.get('/api/student-batch-assignments'),
        api.get(`/api/class-updates/trainer/${trainerId}`)
      ]);

      const batches = batchesRes.data || [];
      const batchTrainerAssignments = batchTrainerAssignmentsRes.data || [];
      const studentBatchAssignments = studentBatchAssignmentsRes.data || [];
      const myUpdates = classUpdatesRes.data || [];

      // My batch IDs
      const myBatchIds = batchTrainerAssignments.map(a => a.batchId || a.batch?.id);
      const myBatches = batches.filter(b => myBatchIds.includes(b.id));

      // Students in my batches
      const myStudentIds = new Set(
        studentBatchAssignments.filter(a => myBatchIds.includes(a.batchId || a.batch?.id)).map(a => a.studentId || a.student?.id)
      );

      const myMaterials = myUpdates.filter(m => m.fileData || m.fileName);

      setStats({
        myBatches: myBatches.length,
        totalClasses: myUpdates.length,
        totalMaterials: myMaterials.length,
        totalStudents: myStudentIds.size
      });

      // Enrich batches with student count
      const enriched = myBatches.map(batch => {
        const studentCount = studentBatchAssignments.filter(a => (a.batchId === batch.id) || (a.batch?.id === batch.id)).length;
        const classCount = myUpdates.filter(u => (u.batchId === batch.id) || (u.batch?.id === batch.id)).length;
        return { ...batch, studentCount, classCount };
      });
      setAssignedBatches(enriched);

      // Recent 5 updates
      setRecentUpdates(myUpdates.slice(-5).reverse().map(u => ({
        ...u,
        batchName: batches.find(b => b.id === (u.batchId || u.batch?.id))?.batchName || 'Unknown'
      })));
    } catch (error) {
      console.error("Failed to load generic trainer data", error);
    }
  };

  const statCards = [
    { label: 'My Batches', value: stats.myBatches, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bg: 'bg-indigo-50', text: 'text-indigo-600' },
    { label: 'Classes Taken', value: stats.totalClasses, icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Materials Uploaded', value: stats.totalMaterials, icon: 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Students', value: stats.totalStudents, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', bg: 'bg-gray-50', text: 'text-gray-600' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Trainer Dashboard</h1>
          <p className="mt-2 text-gray-600">View your batches, class records, and uploaded materials.</p>
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white/50 shadow-sm transition-all hover:shadow-md hover:scale-[1.02] cursor-pointer`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                <p className={`text-3xl font-bold mt-1 ${stat.text}`}>{stat.value}</p>
              </div>
              <div className={`${stat.text} opacity-20`}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={stat.icon} /></svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      

      {/* Assigned Batches */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h3 className="font-bold text-gray-800 text-lg">My Assigned Batches</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Domain</th>
                <th className="px-6 py-4">Timing</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Classes</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {assignedBatches.length > 0 ? assignedBatches.map(batch => (
                <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-200">
                        {batch.batchName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">{batch.batchName}</div>
                        <div className="text-xs text-gray-400 font-mono">{batch.batchNo}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">{batch.domain}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{batch.timing}</td>
                  <td className="px-6 py-4"><span className="font-bold text-indigo-600">{batch.studentCount}</span></td>
                  <td className="px-6 py-4"><span className="font-bold text-green-600">{batch.classCount}</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase ${
                      batch.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                      batch.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-gray-100 text-gray-700 border-gray-200'
                    }`}>{batch.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500 italic">No batches assigned to you yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Class Updates */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-lg">Recent Class Updates</h3>
          <button onClick={() => setActivePage('manage-records')} className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider hover:bg-indigo-100 transition-colors">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Topic</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentUpdates.length > 0 ? recentUpdates.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">{u.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">{u.batchName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{u.topic}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${u.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500 italic">No class updates yet. Log your first class session!</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default TrainerHome;

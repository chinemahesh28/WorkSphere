import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';

const ManageRecords = ({ setActivePage }) => {
  const toast = useToast();
  const [records, setRecords] = useState([]);
  const [batches, setBatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [batchFilter, setBatchFilter] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editFile, setEditFile] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.id;

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const allBatches = JSON.parse(localStorage.getItem('batches')) || [];
    const updates = JSON.parse(localStorage.getItem('classUpdates')) || [];
    const assignments = JSON.parse(localStorage.getItem('batchTrainerAssignments')) || [];
    const myBatchIds = assignments.filter(a => a.trainerId === trainerId).map(a => a.batchId);
    setBatches(allBatches.filter(b => myBatchIds.includes(b.id)));
    const myRecords = updates.filter(u => u.trainerId === trainerId).map(u => ({
      ...u, batchName: allBatches.find(b => b.id === u.batchId)?.batchName || 'Unknown'
    }));
    setRecords(myRecords.reverse());
  };

  const handleDelete = async (id) => {
    if (!await toast.confirm('Delete this class record?', 'Delete Record')) return;
    const all = JSON.parse(localStorage.getItem('classUpdates')) || [];
    localStorage.setItem('classUpdates', JSON.stringify(all.filter(u => u.id !== id)));
    loadData();
  };

  const handleEdit = (record) => {
    setEditingRecord({ ...record });
    setEditFile(null);
    setShowEditModal(true);
  };

  const openBlobUrl = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    const blob = new Blob([ab], { type: mimeString });
    return URL.createObjectURL(blob);
  };

  const handleViewDocument = (record) => {
    if (record.fileData) {
      const blobUrl = openBlobUrl(record.fileData);
      window.open(blobUrl, '_blank');
    }
  };

  const handleDownload = (record) => {
    if (record.fileData) {
      const link = document.createElement('a');
      link.href = record.fileData;
      link.download = record.fileName || 'material.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEditFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB.'); return; }
      setEditFile(file);
    } else {
      toast.error('Please select a PDF file.');
      e.target.value = '';
    }
  };

  const handleRemoveEditFile = () => {
    setEditingRecord({ ...editingRecord, fileData: null, fileName: null, materialTitle: '' });
    setEditFile(null);
    const fileInput = document.getElementById('edit-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();

    const doSave = (fileData, fileName) => {
      const all = JSON.parse(localStorage.getItem('classUpdates')) || [];
      const updated = all.map(u => {
        if (u.id !== editingRecord.id) return u;
        const base = {
          ...u,
          batchId: editingRecord.batchId,
          date: editingRecord.date,
          topic: editingRecord.topic,
          description: editingRecord.description,
          status: editingRecord.status,
          materialTitle: editingRecord.materialTitle || ''
        };
        if (fileData !== undefined) {
          if (fileData) {
            base.fileData = fileData;
            base.fileName = fileName;
          } else {
            delete base.fileData;
            delete base.fileName;
            delete base.materialTitle;
          }
        }
        return base;
      });

      try {
        localStorage.setItem('classUpdates', JSON.stringify(updated));
        setShowEditModal(false);
        setEditingRecord(null);
        setEditFile(null);
        loadData();
      } catch (err) {
        toast.error('Save failed — attached file may be too large for storage.');
      }
    };

    if (editFile) {
      const reader = new FileReader();
      reader.onload = () => doSave(reader.result, editFile.name);
      reader.readAsDataURL(editFile);
    } else if (editingRecord.fileData === null) {
      doSave(null, null);
    } else {
      doSave(undefined, undefined);
    }
  };

  const filtered = records.filter(r => {
    const s = searchTerm.toLowerCase();
    const matchSearch = !searchTerm || r.topic.toLowerCase().includes(s) || r.batchName.toLowerCase().includes(s) || (r.materialTitle || '').toLowerCase().includes(s);
    return matchSearch && (batchFilter === 'all' || r.batchId === batchFilter);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Manage Class Records</h1>
          <p className="mt-2 text-gray-600">View, edit, and manage your teaching history.</p>
        </div>
        <button onClick={() => setActivePage('class-update')}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          New Update
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input type="text" placeholder="Search by topic, batch, or material..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={batchFilter} onChange={(e) => setBatchFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="all">All Batches</option>
          {batches.map(b => <option key={b.id} value={b.id}>{b.batchName}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50"><p className="text-sm text-gray-500">{filtered.length} record{filtered.length !== 1 ? 's' : ''}</p></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr><th className="px-6 py-4">Date</th><th className="px-6 py-4">Batch</th><th className="px-6 py-4">Topic</th><th className="px-6 py-4">Description</th><th className="px-6 py-4">Material</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">{r.date}</td>
                  <td className="px-6 py-4 font-medium text-gray-800 whitespace-nowrap">{r.batchName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{r.topic}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{r.description || '—'}</td>
                  <td className="px-6 py-4">
                    {r.fileData ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleViewDocument(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors" title={`View ${r.materialTitle || r.fileName}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          View
                        </button>
                        <button onClick={() => handleDownload(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors" title={`Download ${r.fileName}`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          Download
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4"><span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${r.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{r.status}</span></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleEdit(r)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors" title="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(r.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500 italic">No records found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showEditModal && editingRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center sticky top-0">
              <h3 className="font-bold text-lg">Edit Record</h3>
              <button onClick={() => setShowEditModal(false)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Batch</label>
                <select value={editingRecord.batchId} onChange={(e) => setEditingRecord({...editingRecord, batchId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required>
                  {batches.map(b => <option key={b.id} value={b.id}>{b.batchName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" value={editingRecord.date} onChange={(e) => setEditingRecord({...editingRecord, date: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Topic</label>
                <input type="text" value={editingRecord.topic} onChange={(e) => setEditingRecord({...editingRecord, topic: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea value={editingRecord.description} onChange={(e) => setEditingRecord({...editingRecord, description: e.target.value})} rows="3" className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select value={editingRecord.status} onChange={(e) => setEditingRecord({...editingRecord, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Material Section in Edit Modal */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Attached Material</label>
                {(editingRecord.fileData || editFile) ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-200">
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12a2 2 0 002-2V6l-4-4H6a2 2 0 00-2 2v12a2 2 0 002 2zm4-10h4v4H8V8z" /></svg>
                      <span className="text-sm text-gray-700 truncate flex-1">{editFile ? editFile.name : editingRecord.fileName}</span>
                      <button type="button" onClick={handleRemoveEditFile} className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Remove">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Material Title</label>
                      <input type="text" value={editingRecord.materialTitle || ''} onChange={(e) => setEditingRecord({...editingRecord, materialTitle: e.target.value})} placeholder="e.g. React Basics"
                        className="w-full px-3 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-sm text-gray-500 font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Attach PDF
                    <input id="edit-file-input" type="file" accept=".pdf" onChange={handleEditFileChange} className="hidden" />
                  </label>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t"><button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg">Cancel</button><button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-700">Save</button></div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ManageRecords;

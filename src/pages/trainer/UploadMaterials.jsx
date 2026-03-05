import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';

const UploadMaterials = () => {
  const toast = useToast();
  const [batches, setBatches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({ batchId: '', title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.id;

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    const allBatches = JSON.parse(localStorage.getItem('batches')) || [];
    const assignments = JSON.parse(localStorage.getItem('batchTrainerAssignments')) || [];
    const myBatchIds = assignments.filter(a => a.trainerId === trainerId).map(a => a.batchId);
    setBatches(allBatches.filter(b => myBatchIds.includes(b.id)));

    const allMaterials = JSON.parse(localStorage.getItem('trainerMaterials')) || [];
    const myMaterials = allMaterials.filter(m => m.trainerId === trainerId).map(m => ({
      ...m, batchName: allBatches.find(b => b.id === m.batchId)?.batchName || 'Unknown'
    }));
    setMaterials(myMaterials.reverse());
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB.'); return; }
      setSelectedFile(file);
    } else { toast.error('Please select a PDF file.'); e.target.value = ''; }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.batchId || !formData.title || !selectedFile) { toast.warning('Please fill all required fields and select a PDF.'); return; }
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = () => {
      const allMaterials = JSON.parse(localStorage.getItem('trainerMaterials')) || [];
      allMaterials.push({
        id: Date.now().toString(), trainerId, batchId: formData.batchId,
        title: formData.title, description: formData.description,
        fileName: selectedFile.name, fileData: reader.result,
        uploadedAt: new Date().toISOString()
      });
      try {
        localStorage.setItem('trainerMaterials', JSON.stringify(allMaterials));
        toast.success('Material uploaded successfully!');
        setFormData({ batchId: '', title: '', description: '' }); setSelectedFile(null);
        document.getElementById('file-input').value = '';
        loadData();
      } catch (err) {
        toast.error('Upload failed — file may be too large for localStorage.');
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = async (id) => {
    if (!await toast.confirm('Delete this material?', 'Delete Material')) return;
    const all = JSON.parse(localStorage.getItem('trainerMaterials')) || [];
    localStorage.setItem('trainerMaterials', JSON.stringify(all.filter(m => m.id !== id)));
    loadData(); toast.success('Material deleted.');
  };

  const handleDownload = (material) => {
    const link = document.createElement('a');
    link.href = material.fileData; link.download = material.fileName;
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const filtered = materials.filter(m => {
    if (!searchTerm) return true;
    const t = searchTerm.toLowerCase();
    return m.title.toLowerCase().includes(t) || m.batchName.toLowerCase().includes(t) || m.fileName.toLowerCase().includes(t);
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      <div><h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Upload Materials</h1>
        <p className="mt-2 text-gray-600">Share PDFs and resources with your batches.</p></div>

      {/* Upload Form */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-5"><h2 className="text-lg font-bold text-white">Upload New Material</h2></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select Batch*</label>
              <select name="batchId" value={formData.batchId} onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required>
                <option value="">-- Choose a Batch --</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.batchName} ({b.batchNo})</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Title*</label>
              <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. React Basics Cheatsheet"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows="2" placeholder="Brief description of this material..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">PDF File* (max 5MB)</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer px-6 py-3 border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center gap-2 text-indigo-600 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                {selectedFile ? selectedFile.name : 'Choose PDF'}
                <input id="file-input" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              </label>
              {selectedFile && <span className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</span>}
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isUploading}
              className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isUploading ? 'Uploading...' : 'Upload Material'}
            </button>
          </div>
        </form>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div><h3 className="font-bold text-gray-800 text-lg">Uploaded Materials</h3><p className="text-sm text-gray-500">{materials.length} files</p></div>
          <div className="relative w-full sm:w-64">
            <input type="text" placeholder="Search materials..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold">
              <tr><th className="px-6 py-4">Title</th><th className="px-6 py-4">Batch</th><th className="px-6 py-4">File</th><th className="px-6 py-4">Uploaded</th><th className="px-6 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length > 0 ? filtered.map(m => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4"><div className="font-bold text-gray-800">{m.title}</div>{m.description && <div className="text-xs text-gray-400 mt-0.5">{m.description}</div>}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{m.batchName}</td>
                  <td className="px-6 py-4"><div className="flex items-center gap-2"><svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12a2 2 0 002-2V6l-4-4H6a2 2 0 00-2 2v12a2 2 0 002 2zm4-10h4v4H8V8z" /></svg><span className="text-sm text-gray-600">{m.fileName}</span></div></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(m.uploadedAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleDownload(m)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors" title="Download">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                  <svg className="w-12 h-12 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                  {searchTerm ? 'No materials match your search.' : 'No materials uploaded yet.'}
                </td></tr>
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

export default UploadMaterials;

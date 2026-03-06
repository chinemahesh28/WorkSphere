import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/ToastContext';

const ClassUpdate = ({ setActivePage }) => {
  const toast = useToast();
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    batchId: '',
    date: new Date().toISOString().split('T')[0],
    topic: '',
    description: '',
    status: 'completed'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [materialTitle, setMaterialTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.id;

  useEffect(() => {
    const allBatches = JSON.parse(localStorage.getItem('batches')) || [];
    const assignments = JSON.parse(localStorage.getItem('batchTrainerAssignments')) || [];
    const myBatchIds = assignments.filter(a => a.trainerId === trainerId).map(a => a.batchId);
    setBatches(allBatches.filter(b => myBatchIds.includes(b.id)));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) { toast.error('File size must be under 5MB.'); return; }
      setSelectedFile(file);
    } else {
      toast.error('Please select a PDF file.');
      e.target.value = '';
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setMaterialTitle('');
    const fileInput = document.getElementById('class-update-file-input');
    if (fileInput) fileInput.value = '';
  };

  const saveUpdate = (fileData, fileName) => {
    const updates = JSON.parse(localStorage.getItem('classUpdates')) || [];
    const newUpdate = {
      id: Date.now().toString(),
      trainerId,
      batchId: formData.batchId,
      date: formData.date,
      topic: formData.topic,
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString()
    };

    if (fileData) {
      newUpdate.fileData = fileData;
      newUpdate.fileName = fileName;
      newUpdate.materialTitle = materialTitle || fileName;
    }

    updates.push(newUpdate);

    try {
      localStorage.setItem('classUpdates', JSON.stringify(updates));
      toast.success('Class update logged successfully!');
      setFormData({ batchId: '', date: new Date().toISOString().split('T')[0], topic: '', description: '', status: 'completed' });
      setSelectedFile(null);
      setMaterialTitle('');
      const fileInput = document.getElementById('class-update-file-input');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      toast.error('Save failed — attached file may be too large for storage.');
    }
    setIsSubmitting(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.batchId || !formData.date || !formData.topic) {
      toast.warning('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        saveUpdate(reader.result, selectedFile.name);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      saveUpdate(null, null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Log Class Update</h2>
          <p className="text-indigo-100 mt-1">Record what was covered in your latest session.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Select Batch*</label>
              <select name="batchId" value={formData.batchId} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required>
                <option value="">-- Choose a Batch --</option>
                {batches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchName} ({b.batchNo}) — {b.domain}</option>
                ))}
              </select>
              {batches.length === 0 && <p className="text-xs text-amber-600">No batches assigned to you.</p>}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Class Date*</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
            </div>
          </div>

          {/* Topic */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Topic Covered*</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange}
              placeholder="e.g. Introduction to React Hooks"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description / Notes</label>
            <textarea name="description" value={formData.description} onChange={handleChange}
              rows="4" placeholder="Detailed notes about the class session..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Session Status*</label>
            <div className="flex gap-4">
              {['completed', 'cancelled'].map(s => (
                <label key={s} className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all ${
                  formData.status === s
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-300 text-gray-600'
                }`}>
                  <input type="radio" name="status" value={s} checked={formData.status === s} onChange={handleChange} className="hidden" />
                  <span className="capitalize font-medium">{s}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Upload Material (Optional) */}
          <div className="space-y-4 p-5 bg-gradient-to-br from-indigo-50/60 to-purple-50/60 rounded-xl border border-indigo-100">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
              <label className="block text-sm font-semibold text-gray-700">Attach Material <span className="text-gray-400 font-normal">(optional, PDF only, max 5MB)</span></label>
            </div>

            {!selectedFile ? (
              <label className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-indigo-300 rounded-xl bg-white hover:bg-indigo-50 transition-colors text-indigo-600 font-medium">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                <span>Choose a PDF file</span>
                <input id="class-update-file-input" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
              </label>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-indigo-200">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <svg className="w-8 h-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M4 18h12a2 2 0 002-2V6l-4-4H6a2 2 0 00-2 2v12a2 2 0 002 2zm4-10h4v4H8V8z" /></svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{selectedFile.name}</p>
                    <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button type="button" onClick={handleRemoveFile} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0" title="Remove file">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}

            {selectedFile && (
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Material Title</label>
                <input type="text" value={materialTitle} onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g. React Basics Cheatsheet"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white" />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button type="submit" disabled={isSubmitting}
              className="px-10 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? 'Saving...' : 'Log Class Update'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ClassUpdate;

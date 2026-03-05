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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const trainerId = user?.id;

  useEffect(() => {
    // Load only batches assigned to this trainer
    const allBatches = JSON.parse(localStorage.getItem('batches')) || [];
    const assignments = JSON.parse(localStorage.getItem('batchTrainerAssignments')) || [];
    const myBatchIds = assignments.filter(a => a.trainerId === trainerId).map(a => a.batchId);
    setBatches(allBatches.filter(b => myBatchIds.includes(b.id)));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.batchId || !formData.date || !formData.topic) {
      toast.warning('Please fill all required fields.');
      return;
    }

    setIsSubmitting(true);

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

    updates.push(newUpdate);
    localStorage.setItem('classUpdates', JSON.stringify(updates));

    toast.success('Class update logged successfully!');
    setFormData({ batchId: '', date: new Date().toISOString().split('T')[0], topic: '', description: '', status: 'completed' });
    setIsSubmitting(false);
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

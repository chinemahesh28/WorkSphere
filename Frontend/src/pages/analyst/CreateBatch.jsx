import React, { useState } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const CreateBatch = ({ setActivePage }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    batchName: '',
    batchNo: '',
    domain: '',
    startDate: '',
    endDate: '',
    timing: '',
    status: 'scheduled'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const domains = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Cybersecurity',
    'Mobile App Development',
    'Cloud Computing'
  ];

  const statuses = [
    { value: 'scheduled', label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    { value: 'active', label: 'Active', color: 'bg-green-100 text-green-800' },
    { value: 'completed', label: 'Completed', color: 'bg-gray-100 text-gray-800' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.batchName.trim()) errors.batchName = 'Batch name is required';
    if (!formData.batchNo.trim()) errors.batchNo = 'Batch number is required';
    if (!formData.domain) errors.domain = 'Please select a domain';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      errors.endDate = 'End date must be after start date';
    }
    if (!formData.timing.trim()) errors.timing = 'Timing is required';
    return errors;
  };

  const hasErrors = (errors) => Object.values(errors).some(e => e !== '');

  const getFieldClass = (fieldError) => {
    const base = "w-full px-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all";
    if (fieldError) return `${base} border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50`;
    return `${base} border-gray-200 focus:ring-indigo-500 focus:border-indigo-500 hover:border-gray-300`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (hasErrors(errors)) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await api.post('/api/batches', formData);

      // Show success and redirect
      toast.success('Batch created successfully!');
      
      // Navigate back to manage batches
      if (setActivePage) {
        setActivePage('manage-batch');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(prev => ({ ...prev, ...err.response.data.errors }));
      }
      setApiError(err.response?.data?.message || 'Failed to save batch. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Create New Batch</h2>
          <p className="text-indigo-100 mt-1">Fill in the details to set up a new training batch.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-pulse">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Batch Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Batch Name*</label>
              <input
                type="text"
                name="batchName"
                value={formData.batchName}
                onChange={handleChange}
                placeholder="e.g. Full Stack Alpha"
                className={getFieldClass(formErrors.batchName)}
                required
              />
              {formErrors.batchName && <p className="mt-1 text-sm text-red-500">{formErrors.batchName}</p>}
            </div>

            {/* Batch Number */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Batch No*</label>
              <input
                type="text"
                name="batchNo"
                value={formData.batchNo}
                onChange={handleChange}
                placeholder="e.g. B2024-001"
                className={getFieldClass(formErrors.batchNo)}
                required
              />
              {formErrors.batchNo && <p className="mt-1 text-sm text-red-500">{formErrors.batchNo}</p>}
            </div>

            {/* Domain */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Domain*</label>
              <select
                name="domain"
                value={formData.domain}
                onChange={handleChange}
                className={getFieldClass(formErrors.domain)}
                required
              >
                <option value="">Select Domain</option>
                {domains.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              {formErrors.domain && <p className="mt-1 text-sm text-red-500">{formErrors.domain}</p>}
            </div>

            {/* Timing */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Timing*</label>
              <input
                type="text"
                name="timing"
                value={formData.timing}
                onChange={handleChange}
                placeholder="e.g. 10:00 AM - 12:00 PM"
                className={getFieldClass(formErrors.timing)}
                required
              />
              {formErrors.timing && <p className="mt-1 text-sm text-red-500">{formErrors.timing}</p>}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Start Date*</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={getFieldClass(formErrors.startDate)}
                required
              />
              {formErrors.startDate && <p className="mt-1 text-sm text-red-500">{formErrors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">End Date*</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className={getFieldClass(formErrors.endDate)}
                required
              />
              {formErrors.endDate && <p className="mt-1 text-sm text-red-500">{formErrors.endDate}</p>}
            </div>

            {/* Status */}
            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Status</label>
              <div className="flex flex-wrap gap-4">
                {statuses.map(s => (
                  <label key={s.value} className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="status"
                      value={s.value}
                      checked={formData.status === s.value}
                      onChange={handleChange}
                      className="text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${s.color} border-2 border-transparent group-hover:border-current transition-all`}>
                      {s.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => setActivePage('dashboard')}
              className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBatch;
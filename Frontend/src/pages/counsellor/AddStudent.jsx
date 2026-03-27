import React, { useState } from 'react';
import { useToast } from '../../components/ToastContext';
import api from '../../services/api';

const AddStudent = ({ setActivePage }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    domainInterest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState('');

  const qualifications = [
    'B.Tech / B.E.',
    'BCA',
    'MCA',
    'M.Tech / M.E.',
    'BSc Computer Science',
    'MSc Computer Science',
    'BBA',
    'MBA',
    'Diploma',
    'Other'
  ];

  const domains = [
    'Web Development',
    'Data Science',
    'UI/UX Design',
    'Cybersecurity',
    'Mobile App Development',
    'Cloud Computing',
    'Machine Learning',
    'DevOps'
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
    if (!formData.fullName.trim()) errors.fullName = 'Full name is required';
    else if (formData.fullName.trim().length < 2) errors.fullName = 'Full name must be at least 2 characters';

    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Please enter a valid email address';

    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[6-9]\d{9}$/.test(formData.phone)) errors.phone = 'Phone must start with 6-9 and be 10 digits';

    if (!formData.qualification) errors.qualification = 'Please select a qualification';
    if (!formData.domainInterest) errors.domainInterest = 'Please select a domain interest';
    return errors;
  };

  const hasErrors = (errors) => Object.values(errors).some(e => e !== '');

  const getFieldClass = (fieldError) => {
    const base = "w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all";
    if (fieldError) return `${base} border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50`;
    return `${base} border-gray-300 focus:ring-indigo-500 focus:border-indigo-500`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    setFormErrors(errors);
    if (hasErrors(errors)) return;

    setIsSubmitting(true);
    setApiError('');

    try {
      await api.post('/api/students', formData);
      toast.success('Student added successfully!');

      if (setActivePage) {
        setActivePage('manage-students');
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        setFormErrors(prev => ({ ...prev, ...err.response.data.errors }));
      }
      setApiError(err.response?.data?.message || 'Failed to save student. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all hover:shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6">
          <h2 className="text-2xl font-bold text-white">Add New Student</h2>
          <p className="text-indigo-100 mt-1">Fill in the details to register a new student.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-pulse">
              {apiError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name*</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className={getFieldClass(formErrors.fullName)}
                required
              />
              {formErrors.fullName && <p className="mt-1 text-sm text-red-500">{formErrors.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. john@example.com"
                className={getFieldClass(formErrors.email)}
                required
              />
              {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={getFieldClass(formErrors.phone)}
                required
              />
              {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
            </div>

            {/* Qualification */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Qualification*</label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className={getFieldClass(formErrors.qualification)}
                required
              >
                <option value="">Select Qualification</option>
                {qualifications.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
              {formErrors.qualification && <p className="mt-1 text-sm text-red-500">{formErrors.qualification}</p>}
            </div>

            {/* Domain Interest */}
            <div className="space-y-2 col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Domain Interest*</label>
              <div className="flex flex-wrap gap-3">
                {domains.map(d => (
                  <label
                    key={d}
                    className={`flex items-center space-x-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-all ${
                      formData.domainInterest === d
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-300 text-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="domainInterest"
                      value={d}
                      checked={formData.domainInterest === d}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{d}</span>
                  </label>
                ))}
              </div>
              {formErrors.domainInterest && <p className="mt-1 text-sm text-red-500">{formErrors.domainInterest}</p>}
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
              {isSubmitting ? 'Adding...' : 'Add Student'}
            </button>
          </div>
        </form>
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

export default AddStudent;

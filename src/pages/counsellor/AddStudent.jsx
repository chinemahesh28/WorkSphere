import React, { useState } from 'react';
import { useToast } from '../../components/ToastContext';

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
  const [error, setError] = useState('');

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
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.qualification || !formData.domainInterest) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      setIsSubmitting(false);
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      setIsSubmitting(false);
      return;
    }

    try {
      const existingStudents = JSON.parse(localStorage.getItem('students')) || [];

      // Check for duplicate email
      if (existingStudents.some(s => s.email.toLowerCase() === formData.email.toLowerCase())) {
        setError('A student with this email already exists.');
        setIsSubmitting(false);
        return;
      }

      const newStudent = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };

      const updatedStudents = [...existingStudents, newStudent];
      localStorage.setItem('students', JSON.stringify(updatedStudents));

      toast.success('Student added successfully!');

      if (setActivePage) {
        setActivePage('manage-students');
      }
    } catch (err) {
      setError('Failed to save student. Please try again.');
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
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-red-700 text-sm animate-pulse">
              {error}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              />
            </div>

            {/* Qualification */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Qualification*</label>
              <select
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                required
              >
                <option value="">Select Qualification</option>
                {qualifications.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
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

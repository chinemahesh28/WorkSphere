import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateBatch = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    batchName: "",
    batchNo: "",
    domain: "",
    timing: "",
    duration: "",
    createdAt: new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});

  const domainOptions = [
    "Web Development",
    "Data Science",
    "AI/ML",
    "Cloud Computing",
    "Cybersecurity",
  ];

  const timingOptions = [
    "Morning",
    "Afternoon",
    "Evening",
  ];

  const durationOptions = [
    "4 Weeks",
    "6 Weeks",
    "8 Weeks",
    "12 Weeks",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.batchName) newErrors.batchName = "Batch name is required";
    if (!formData.batchNo) newErrors.batchNo = "Batch number is required";
    if (!formData.domain) newErrors.domain = "Domain is required";
    if (!formData.timing) newErrors.timing = "Timing is required";
    if (!formData.duration) newErrors.duration = "Duration is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      const batches = JSON.parse(localStorage.getItem("batches")) || [];

      const newBatch = {
        id: Date.now().toString(),
        ...formData,
      };

      batches.push(newBatch);
      localStorage.setItem("batches", JSON.stringify(batches));

      setLoading(false);
      alert("Batch Created Successfully!");

      navigate("/analyst/manage");
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Create New Batch
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Batch Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Name
            </label>
            <input
              type="text"
              name="batchName"
              value={formData.batchName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.batchName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.batchName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.batchName}
              </p>
            )}
          </div>

          {/* Batch Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch Number
            </label>
            <input
              type="text"
              name="batchNo"
              value={formData.batchNo}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.batchNo ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.batchNo && (
              <p className="text-xs text-red-500 mt-1">
                {errors.batchNo}
              </p>
            )}
          </div>

          {/* Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Domain
            </label>
            <select
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.domain ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Domain</option>
              {domainOptions.map((domain) => (
                <option key={domain} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            {errors.domain && (
              <p className="text-xs text-red-500 mt-1">
                {errors.domain}
              </p>
            )}
          </div>

          {/* Timing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timing
            </label>
            <select
              name="timing"
              value={formData.timing}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.timing ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Timing</option>
              {timingOptions.map((timing) => (
                <option key={timing} value={timing}>
                  {timing}
                </option>
              ))}
            </select>
            {errors.timing && (
              <p className="text-xs text-red-500 mt-1">
                {errors.timing}
              </p>
            )}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none ${
                errors.duration ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Duration</option>
              {durationOptions.map((duration) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))}
            </select>
            {errors.duration && (
              <p className="text-xs text-red-500 mt-1">
                {errors.duration}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Batch"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBatch;
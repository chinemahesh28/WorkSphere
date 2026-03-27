// Shared validation helpers for all forms

export const validateRequired = (value, fieldName) => {
  if (!value || !String(value).trim()) return `${fieldName} is required`;
  return "";
};

export const validateEmail = (value) => {
  if (!value || !value.trim()) return "Email is required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return "Please enter a valid email address";
  return "";
};

export const validatePassword = (value, isRequired = true) => {
  if (isRequired && !value) return "Password is required";
  if (value && value.length < 6) return "Password must be at least 6 characters";
  return "";
};

export const validatePhone = (value) => {
  if (!value || !value.trim()) return "Phone number is required";
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(value)) return "Phone number must start with 6-9 and be 10 digits";
  return "";
};

export const validateAge = (value) => {
  if (!value) return ""; // optional
  const age = Number(value);
  if (isNaN(age) || age < 18 || age > 60) return "Age must be between 18 and 60";
  return "";
};

export const validateSalary = (value) => {
  if (!value || !String(value).trim()) return "Salary is required";
  const salary = Number(value);
  if (isNaN(salary) || salary <= 0) return "Salary must be a positive number";
  return "";
};

export const validateExperience = (value) => {
  if (!value) return ""; // optional
  const exp = Number(value);
  if (isNaN(exp) || exp < 0) return "Experience cannot be negative";
  if (exp > 50) return "Experience must be 50 years or less";
  return "";
};

export const validateUsername = (value) => {
  if (!value || !value.trim()) return "Username is required";
  if (value.trim().length < 3) return "Username must be at least 3 characters";
  return "";
};

export const validateFullName = (value) => {
  if (!value || !value.trim()) return "Full name is required";
  if (value.trim().length < 2) return "Full name must be at least 2 characters";
  return "";
};

// Validate the user form (trainers, analysts, counsellors) 
export const validateUserForm = (formData, isEdit = false) => {
  const errors = {};
  
  errors.fullName = validateFullName(formData.fullName);
  errors.username = validateUsername(formData.username);
  errors.email = validateEmail(formData.email);
  errors.password = validatePassword(formData.password, !isEdit);
  errors.phoneNo = validatePhone(formData.phoneNo);
  errors.salary = validateSalary(formData.salary);
  errors.age = validateAge(formData.age);
  errors.experience = validateExperience(formData.experience);
  
  return errors;
};

// Check if any errors exist
export const hasErrors = (errors) => {
  return Object.values(errors).some(error => error !== "");
};

// Get input class based on error state
export const getFieldClass = (fieldError, baseClass = "") => {
  const base = baseClass || "w-full px-4 py-2 border rounded-lg focus:ring-2 outline-none transition-all";
  if (fieldError) {
    return `${base} border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50`;
  }
  return `${base} border-gray-300 focus:ring-indigo-500 focus:border-indigo-500`;
};

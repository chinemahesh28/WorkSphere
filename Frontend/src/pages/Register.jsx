import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from '../components/ToastContext';
import api from '../services/api';

function Register() {
  const toast = useToast();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "" // Added fullName field
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Validation helpers
  const validateFullName = (value) => {
    if (!value.trim()) return "Full name is required";
    if (value.trim().length < 2) return "Full name must be at least 2 characters";
    if (value.trim().length > 100) return "Full name must be less than 100 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) return "Full name can only contain letters, spaces, hyphens, and apostrophes";
    return "";
  };

  const validateUsername = (value) => {
    if (!value.trim()) return "Username is required";
    if (value.trim().length < 3) return "Username must be at least 3 characters";
    if (value.trim().length > 50) return "Username must be less than 50 characters";
    if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) return "Username can only contain letters, numbers, and underscores";
    return "";
  };

  const validateEmail = (value) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleBlur = (field) => {
    let error = "";
    switch (field) {
      case "fullName": error = validateFullName(form.fullName); break;
      case "username": error = validateUsername(form.username); break;
      case "email": error = validateEmail(form.email); break;
      case "password": error = validatePassword(form.password); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate all fields
    const fullNameError = validateFullName(form.fullName);
    const usernameError = validateUsername(form.username);
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    const newErrors = {
      fullName: fullNameError,
      username: usernameError,
      email: emailError,
      password: passwordError
    };
    setErrors(newErrors);

    if (fullNameError || usernameError || emailError || passwordError) return;

    setIsLoading(true);
    setApiError("");

    try {
      await api.post("/api/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
        fullName: form.fullName, // Added fullName to API call
        role: "ADMIN"
      });

      toast.success("Admin Registration Successful!");
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.errors) {
          setErrors(prev => ({ ...prev, ...data.errors }));
        }
        if (data.message) {
          setApiError(data.message);
        }
      } else {
        setApiError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = form.fullName && form.username && form.email && form.password; // Updated to include fullName

  // Password strength checker
  const getPasswordStrength = () => {
    if (!form.password) return null;
    if (form.password.length < 4) return { text: "Weak", color: "bg-red-400", textColor: "text-red-600" };
    if (form.password.length < 6) return { text: "Fair", color: "bg-yellow-400", textColor: "text-yellow-600" };
    if (form.password.length < 8) return { text: "Good", color: "bg-blue-400", textColor: "text-blue-600" };
    return { text: "Strong", color: "bg-green-400", textColor: "text-green-600" };
  };

  const passwordStrength = getPasswordStrength();

  const getInputClass = (field) => {
    const base = "w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all duration-200 bg-gray-50 focus:bg-white";
    if (errors[field]) {
      return `${base} border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400`;
    }
    return `${base} border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">

        {/* Header with Icon */}
        <div className="text-center">
          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Create Admin Account
          </h2>
          <p className="text-gray-600">
            Register as Administrator
          </p>
        </div>

        {/* API Error Banner */}
        {apiError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start space-x-3 animate-shake">
            <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{apiError}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4" noValidate>

          {/* Full Name Field with Icon - NEW */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                onBlur={() => handleBlur("fullName")}
                className={getInputClass("fullName")}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
                {errors.fullName}
              </p>
            )}
          </div>

          {/* Username Field with Icon */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                onBlur={() => handleBlur("username")}
                className={getInputClass("username")}
              />
            </div>
            {errors.username && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Field with Icon */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleBlur("email")}
                className={getInputClass("email")}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field with Icon and Toggle */}
          <div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleBlur("password")}
                className={`${getInputClass("password")} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                </svg>
                {errors.password}
              </p>
            )}
          </div>

          {/* Password Strength Indicator */}
          {form.password && passwordStrength && (
            <div className="space-y-1 mt-1">
              <div className="flex space-x-1">
                <div className={`h-1 w-1/3 rounded-full ${form.password.length >= 4 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                <div className={`h-1 w-1/3 rounded-full ${form.password.length >= 6 ? passwordStrength.color : 'bg-gray-200'}`}></div>
                <div className={`h-1 w-1/3 rounded-full ${form.password.length >= 8 ? passwordStrength.color : 'bg-gray-200'}`}></div>
              </div>
              <p className={`text-xs ${passwordStrength.textColor}`}>
                Password Strength: {passwordStrength.text}
              </p>
            </div>
          )}

          {/* Password Hint */}
          {!errors.password && (
            <p className="text-xs text-gray-500 mt-1">
              Password must be at least 6 characters
            </p>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-start mt-4">
            <input
              id="terms"
              type="checkbox"
              className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              required
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
              I agree to the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Terms</a>{' '}
              and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">Privacy Policy</a>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Admin Account...
              </span>
            ) : (
              "Create Admin Account"
            )}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-500 hover:underline"
          >
            Sign In
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Register;
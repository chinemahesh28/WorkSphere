import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from '../services/api';

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validation helpers
  const validateIdentifier = (value) => {
    if (!value.trim()) return "Email or Username is required";
    if (value.trim().length < 3) return "Must be at least 3 characters";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateRole = (value) => {
    if (!value) return "Please select a role";
    return "";
  };

  // Handle field blur for inline validation
  const handleBlur = (field) => {
    let error = "";
    switch (field) {
      case "identifier": error = validateIdentifier(identifier); break;
      case "password": error = validatePassword(password); break;
      case "role": error = validateRole(role); break;
      default: break;
    }
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Handle field change - clear error on change
  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (errors.identifier) setErrors(prev => ({ ...prev, identifier: "" }));
    if (apiError) setApiError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
    if (apiError) setApiError("");
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    if (errors.role) setErrors(prev => ({ ...prev, role: "" }));
    if (apiError) setApiError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate all fields
    const identifierError = validateIdentifier(identifier);
    const passwordError = validatePassword(password);
    const roleError = validateRole(role);

    const newErrors = {
      identifier: identifierError,
      password: passwordError,
      role: roleError
    };
    setErrors(newErrors);

    // If any errors, stop
    if (identifierError || passwordError || roleError) return;

    setIsLoading(true);
    setApiError("");

    try {
      const response = await api.post("/api/auth/login", {
        identifier,
        password,
        role
      });

      const foundUser = response.data;

      if (foundUser) {
        localStorage.setItem("currentUser", JSON.stringify(foundUser));
        login(foundUser);

        if (foundUser.role === "ADMIN") navigate("/admin");
        else if (foundUser.role === "TRAINER") navigate("/trainer");
        else if (foundUser.role === "ANALYST") navigate("/analyst");
        else if (foundUser.role === "COUNSELLOR") navigate("/counsellor");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (data.errors) {
          // Field-level errors from backend validation
          setErrors(prev => ({ ...prev, ...data.errors }));
        }
        if (data.message) {
          setApiError(data.message);
        }
      } else {
        setApiError("Login failed. Please check your credentials and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = identifier && password && role;

  const getInputClass = (field) => {
    const base = "w-full pl-10 pr-4 py-3 rounded-lg border outline-none transition-all duration-200 bg-gray-50 focus:bg-white";
    if (errors[field]) {
      return `${base} border-red-400 focus:ring-2 focus:ring-red-400 focus:border-red-400`;
    }
    return `${base} border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-600 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        
        {/* Left Side - WorkSphere Info Card */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-12 flex-col justify-between relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200/30 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-200/30 rounded-full -ml-30 -mb-30"></div>
          
          {/* Logo and Title */}
          <div className="relative z-10">
            
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome Back! 👋</h2>
            <p className="text-gray-600 text-lg mb-12">
              Your comprehensive workforce management solution. Streamline operations, enhance productivity, and empower your team.
            </p>
          </div>

          {/* Features Grid */}
          <div className="relative z-10 grid grid-cols-2 gap-4 mb-12">
            {[
              { icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", text: "Smart Analytics", color: "from-blue-500 to-cyan-500" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Secure Access", color: "from-green-500 to-emerald-500" },
              { icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z", text: "Role Management", color: "from-purple-500 to-pink-500" },
              { icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z", text: "Task Scheduling", color: "from-orange-500 to-red-500" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-gray-100">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-2`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={feature.icon} />
                  </svg>
                </div>
                <p className="text-gray-700 text-sm font-medium">{feature.text}</p>
              </div>
            ))}
          </div>

          
          {/* Stats */}
          <div className="relative z-10 flex justify-between mt-8 text-gray-600 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-indigo-600">10k+</p>
              <p>Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">500+</p>
              <p>Companies</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">99.9%</p>
              <p>Uptime</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 bg-white p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to continue to WorkSphere</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600 mt-2">Access your WorkSphere account</p>
            </div>

            {/* API Error Banner */}
            {apiError && (
              <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start space-x-3 animate-shake">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700 font-medium">{apiError}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5" noValidate>
              {/* Email or Username Field */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1">
                  Email or Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or username"
                    value={identifier}
                    onChange={handleIdentifierChange}
                    onBlur={() => handleBlur("identifier")}
                    className={getInputClass("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                    </svg>
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={handlePasswordChange}
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

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <select
                    id="role"
                    value={role}
                    onChange={handleRoleChange}
                    onBlur={() => handleBlur("role")}
                    className={`${getInputClass("role")} pl-10 pr-10 appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      Choose your role
                    </option>
                    <option value="ADMIN" className="py-2">Admin</option>
                    <option value="TRAINER" className="py-2">Trainer</option>
                    <option value="ANALYST" className="py-2">Analyst</option>
                    <option value="COUNSELLOR" className="py-2">Counsellor</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 pointer-events-none">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
                    </svg>
                    {errors.role}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:ring-4 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>

              {/* Register Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors duration-200"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
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
};

export default Login;
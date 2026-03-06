import React from 'react'
import { Link } from 'react-router-dom'
function Header() {
  return (
    <div>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="WorkSphere" className="w-9 h-9 rounded-lg object-cover animate-logo-glow shadow-md" />
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-brand-shimmer bg-[length:200%_auto] hidden sm:block">WorkSphere</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-indigo-600 transition">Home</a>
              <a href="#features" className="text-gray-700 hover:text-indigo-600 transition">Features</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 transition">About</a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition">Contact</a>
            </div>

            {/* Login Button */}
            <Link
              to="/login"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Header

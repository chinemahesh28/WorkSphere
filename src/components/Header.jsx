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
              <div className="bg-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">WorkSphere</span>
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

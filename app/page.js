"use client"

import { useState, useEffect } from "react"
import AuthModal from "./components/AuthModal"
import Dashboard from "./components/Dashboard"
import LoadingSpinner from "./components/LoadingSpinner"

export default function Home() {
  const [user, setUser] = useState(null)
  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    try {
      const savedUser = localStorage.getItem("currentUser")
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      localStorage.removeItem("currentUser")
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("currentUser", JSON.stringify(userData))
    setShowAuth(false)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black opacity-20"></div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            TASK TRACKING PLATFORM
            <br />
            <span className="text-3xl md:text-4xl font-normal">FOR TEAMS & PROJECTS</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamlined task management, flexible collaboration, and efficient project tracking. Enhanced productivity
            and seamless teamwork for modern organizations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setAuthMode("signup")
                setShowAuth(true)
              }}
              className="btn-primary text-lg px-8 py-3 transform hover:scale-105 transition-transform"
            >
              GET STARTED
            </button>
            <button
              onClick={() => {
                setAuthMode("login")
                setShowAuth(true)
              }}
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 font-medium py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              SIGN IN
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-red-600 p-6 rounded-lg text-white max-w-sm hidden lg:block shadow-2xl">
          <h3 className="text-xl font-bold mb-4">Get started today, or contact us for a demo</h3>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Contact Person"
                className="flex-1 px-3 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <input
                type="tel"
                placeholder="Phone"
                className="flex-1 px-3 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-3 py-2 text-black rounded focus:outline-none focus:ring-2 focus:ring-red-300"
            />
            <button className="w-full bg-red-700 hover:bg-red-800 py-2 rounded font-medium transition-colors">
              Contact us
            </button>
            <p className="text-xs opacity-90">
              By clicking submit, you accept our terms and privacy policy regarding the collection and use of your data.
            </p>
          </div>
        </div>
      </div>

      {showAuth && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuth(false)}
          onLogin={handleLogin}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}
    </div>
  )
}

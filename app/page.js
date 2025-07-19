"use client"

import { useState, useEffect, startTransition } from "react"
import AuthModal from "./components/AuthModal"
// import Dashboard from "./components/Dashboard"
import LoadingSpinner from "./components/LoadingSpinner"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const [showAuth, setShowAuth] = useState(false)
  const [authMode, setAuthMode] = useState("login")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setShowAuth(false)
    setTimeout(() => {
      window.location.href = "/tasks";
    }, 100)
  }

  if (loading) {
    return <LoadingSpinner />
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
            <span className="text-3xl md:text-4xl font-normal">One place for every task, every team.</span>
          </h1>

          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Simplify your workflow and never miss a deadline—your ultimate task tracking companion
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

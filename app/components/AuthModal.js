"use client"

import { useState } from "react"

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (mode === "signup") {
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match")
          return
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters")
          return
        }
        if (!formData.name.trim()) {
          setError("Name is required")
          return
        }
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate authentication
      const userData = {
        id: Date.now(),
        name: formData.name || formData.email.split("@")[0],
        email: formData.email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || formData.email)}&background=3b82f6&color=fff`,
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage (in real app, this would be handled by backend)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      if (mode === "signup") {
        // Check if user already exists
        const existingUser = users.find((u) => u.email === formData.email)
        if (existingUser) {
          setError("User with this email already exists")
          return
        }
        users.push({ ...userData, password: formData.password })
        localStorage.setItem("users", JSON.stringify(users))
      } else {
        // Login validation
        const existingUser = users.find((u) => u.email === formData.email && u.password === formData.password)
        if (!existingUser) {
          setError("Invalid email or password")
          return
        }
      }

      onLogin(userData)
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{mode === "login" ? "Sign In" : "Create Account"}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              disabled={loading}
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
              <input
                type="password"
                required
                className="input-field"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          <button type="submit" className="btn-primary w-full flex items-center justify-center" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {mode === "login" ? "Signing In..." : "Creating Account..."}
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onSwitchMode(mode === "login" ? "signup" : "login")}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            disabled={loading}
          >
            {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}

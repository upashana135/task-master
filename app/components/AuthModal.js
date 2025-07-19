"use client"

import { useState } from "react"
import httpRequest from "@/lib/axiosInstance"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

export default function AuthModal({ mode, onClose, onLogin, onSwitchMode }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
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
        httpRequest.post('/users/register', formData, { withCredentials: true })
        .then((res)=>{
          if(res.data.success){
            toast.success(res.data.message)
            onClose()
          }
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        })
        .finally(() => {
          setLoading(false)
          
        });
      }

      //login
      if (mode === "login") {
        httpRequest.post('/login', formData)
          .then((res) => {
            if (res.data.success) {
              onClose();
              onLogin()
            } else {
              toast.error("Login failed");
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message || "Something went wrong");
          })
          .finally(() => {
            setLoading(false);
          });
      }
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
          <button onClick={onClose} disabled={loading}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input type="text" required className="input-field" value={formData.name} disabled={loading}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required className="input-field" value={formData.email} disabled={loading}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input type="password" required className="input-field" value={formData.password} disabled={loading}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                <input type="password" required className="input-field" value={formData.confirmPassword} disabled={loading}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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

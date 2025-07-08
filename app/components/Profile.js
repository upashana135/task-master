"use client"

import { useState } from "react"

export default function Profile({ user }) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    bio: "",
    department: "",
    phone: "",
    location: "",
    timezone: "",
  })

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would update the user in the backend
      console.log("Saving profile:", formData)

      // Update localStorage
      const updatedUser = { ...user, ...formData }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile</h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            <img
              src={user.avatar || "/placeholder.svg?height=120&width=120"}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
            />
            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
            <p className="text-gray-600 mb-4">{user.email}</p>

            <div className="text-sm text-gray-500 space-y-1">
              <p>Member since {new Date(user.createdAt || Date.now()).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Personal Information</h3>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="btn-primary">
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="input-field"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      disabled={loading}
                      placeholder="e.g., Engineering, Marketing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      className="input-field"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      className="input-field"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={loading}
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                    <select
                      className="input-field"
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      disabled={loading}
                    >
                      <option value="">Select timezone</option>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="CET">Central European Time</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    rows={4}
                    className="input-field"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    disabled={loading}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setIsEditing(false)} className="btn-secondary" disabled={loading}>
                    Cancel
                  </button>
                  <button onClick={handleSave} className="btn-primary flex items-center" disabled={loading}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Department</h4>
                  <p className="text-gray-600">{formData.department || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Phone</h4>
                  <p className="text-gray-600">{formData.phone || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                  <p className="text-gray-600">{formData.location || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Timezone</h4>
                  <p className="text-gray-600">{formData.timezone || "Not set"}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-1">Bio</h4>
                  <p className="text-gray-600">{formData.bio || "No bio added yet"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

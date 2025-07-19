"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../components/context/AuthContext"
import Header from "../components/layouts/Header";
import httpRequest from "@/lib/axiosInstance";
import { toast } from "react-toastify";

export default function Profile() {
  const {user} = useAuth();
  const [existingUser, setExistingUser] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState([])
  
  const getUserProfile = () =>{
    httpRequest.get(`/users/${user.userId}`)
      .then((res)=>{
        if(res.data.success) {
          setFormData(res.data.data)
          setExistingUser(res.data.data)
        }
      })
  }

  useEffect(()=>{
    getUserProfile()
  }, [])

  const handleSave = () => {
    setLoading(true)
    try {
      httpRequest.put(`/users/${user.userId}`, formData)
        .then((res)=>{
          if(res.data.success) {
            toast.success(res.data.message)
            setIsEditing(false)
            getUserProfile()
          }
        })
        .catch((err) => {
          if (err.response?.data?.message) {
            toast.error(err.response.data.message);
          } else {
            toast.error("Something went wrong");
          }
        })
    } catch (error) {
      toast.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <Header/>
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div>
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Profile</h2>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card text-center">
            {/* <img
              src={user.avatar || "/placeholder.svg?height=120&width=120"}
              alt={existingUser.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200"
            /> */}
            <h3 className="text-xl font-semibold mb-2">{existingUser.name}</h3>
            <p className="text-gray-600 mb-4">{existingUser.email}</p>
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
                    <input type="text" className="input-field" value={formData.name} disabled={loading}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" className="input-field" value={formData.email} disabled
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No</label>
                    <input type="tel" className="input-field" value={formData.mobile_no} disabled={loading} placeholder="Enter mobile no"
                      onChange={(e) => setFormData({ ...formData, mobile_no: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input type="text" className="input-field" value={formData.address} disabled={loading} placeholder="Enter address"
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <input type="text" className="input-field" value={formData.role} disabled={loading} placeholder="Enter role"
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea rows={4} className="input-field" value={formData.bio} disabled={loading} placeholder="Tell us about yourself..."
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
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
                  <h4 className="font-medium text-gray-900 mb-1">Role</h4>
                  <p className="text-gray-600">{existingUser.role || "Not specified"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Mobile No</h4>
                  <p className="text-gray-600">{existingUser.mobile_no || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">{existingUser.address || "Not specified"}</p>
                </div>
                <div className="md:col-span-2">
                  <h4 className="font-medium text-gray-900 mb-1">Bio</h4>
                  <p className="text-gray-600">{existingUser.bio || "No bio added yet"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
    </main>
    </div>
  )
}

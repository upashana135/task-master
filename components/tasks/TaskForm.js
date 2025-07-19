"use client"

import { useState } from "react"
import httpRequest from "@/lib/axiosInstance"
import { toast } from "react-toastify"

export default function TaskForm({ onClose, onSubmit, projects, currentUser }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    assignedTo: "",
    projectId: "",
    teamId: "",
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [teams, setTeams] = useState([])
  const [teamMembers, setTeamMembers] = useState([])

  const onProjectChange = (projectId) => {
    formData.teamId = ""
    const project = projects.find(p => p.id === projectId);
    const teams = project.project_teams.map(pt => pt.team);
    setTeams(teams)
  }

  const getTeamMember = (teamId) => {
    httpRequest.get(`/team-member/${teamId}`)
      .then((res)=>{
        setTeamMembers(res.data.data)
      })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.due_date) {
      newErrors.due_date = "Due date is required"
    } else if (new Date(formData.due_date) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.due_date = "Due date cannot be in the past"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      httpRequest.post('/tasks', formData)
        .then((res) => {
          if(res.data.success){
            toast.success(res.data.message)
            onSubmit()
          } 
        })
        .catch((err) => {
          
        })
        .finally(() => setLoading(false));
    } catch (error) {
      console.error("Error creating task:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Task</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
            disabled={loading}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={formData.title} disabled={loading}
              className={`input-field ${errors.title ? "border-red-500" : ""}`}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description * </label>
            <textarea rows={3} className="input-field" value={formData.description} disabled={loading} placeholder="Describe the task..."
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
            <input type="date" required value={formData.due_date} disabled={loading} min={new Date().toISOString().split("T")[0]}
              className={`input-field ${errors.due_date ? "border-red-500" : ""}`}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            />
            {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
          </div>

          {projects.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <select className="input-field" value={formData.projectId} disabled={loading}
                onChange={(e) => {onProjectChange(e.target.value); setFormData({ ...formData, projectId: e.target.value }); }}
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {teams.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team *</label>
              <select className="input-field" value={formData.teamId} disabled={loading}
                onChange={(e) => {setFormData({ ...formData, teamId: e.target.value }); getTeamMember(e.target.value)}}
              >
                <option value="">Select a team</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {teamMembers && teamMembers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To </label>
              <select className="input-field" value={formData.assignedTo} disabled={loading}
                onChange={(e) => {setFormData({ ...formData, assignedTo: e.target.value });}}
              >
                <option value="">Select a member</option>
                {teamMembers.map((member) => (
                  <option key={member.member_email} value={member.member_email}>
                    {member.member_email}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

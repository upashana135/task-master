"use client"

import { useState } from "react"

export default function TeamManagement({ user, teams, setTeams, onNotification }) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", description: "" })
  const [inviteEmail, setInviteEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const createTeam = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const team = {
        id: Date.now(),
        name: newTeam.name,
        description: newTeam.description,
        createdBy: user.id,
        members: [user],
        createdAt: new Date().toISOString(),
        invitations: [],
      }

      const updatedTeams = [...teams, team]
      setTeams(updatedTeams)
      localStorage.setItem("teams", JSON.stringify(updatedTeams))

      onNotification(`Team "${newTeam.name}" created successfully`, "team_created")

      setNewTeam({ name: "", description: "" })
      setShowCreateForm(false)
    } catch (error) {
      console.error("Error creating team:", error)
    } finally {
      setLoading(false)
    }
  }

  const inviteMember = async (teamId) => {
    if (inviteEmail.trim()) {
      try {
        // In a real app, this would send an invitation
        const updatedTeams = teams.map((team) => {
          if (team.id === teamId) {
            return {
              ...team,
              invitations: [
                ...(team.invitations || []),
                {
                  email: inviteEmail,
                  invitedBy: user.id,
                  invitedAt: new Date().toISOString(),
                  status: "pending",
                },
              ],
            }
          }
          return team
        })

        setTeams(updatedTeams)
        localStorage.setItem("teams", JSON.stringify(updatedTeams))

        onNotification(`Invitation sent to ${inviteEmail}`, "invitation_sent")
        setInviteEmail("")
      } catch (error) {
        console.error("Error sending invitation:", error)
      }
    }
  }

  const removeTeam = (teamId) => {
    const updatedTeams = teams.filter((team) => team.id !== teamId)
    setTeams(updatedTeams)
    localStorage.setItem("teams", JSON.stringify(updatedTeams))
    onNotification("Team removed successfully", "team_removed")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Teams & Projects</h2>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary">
          + Create Team
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div key={team.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{team.name}</h3>
              {team.createdBy === user.id && (
                <button onClick={() => removeTeam(team.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )}
            </div>

            <p className="text-gray-600 mb-4">{team.description}</p>

            <div className="mb-4">
              <h4 className="font-medium mb-2">Members ({team.members.length})</h4>
              <div className="flex -space-x-2 mb-2">
                {team.members.slice(0, 5).map((member, index) => (
                  <img
                    key={index}
                    src={member.avatar || "/placeholder.svg?height=32&width=32"}
                    alt={member.name}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    title={member.name}
                  />
                ))}
                {team.members.length > 5 && (
                  <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs">
                    +{team.members.length - 5}
                  </div>
                )}
              </div>
            </div>

            {team.invitations && team.invitations.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-sm text-gray-600">
                  Pending Invitations ({team.invitations.length})
                </h4>
                <div className="space-y-1">
                  {team.invitations.slice(0, 3).map((invitation, index) => (
                    <div key={index} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {invitation.email}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Invite by email"
                className="input-field flex-1 text-sm"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <button
                onClick={() => inviteMember(team.id)}
                className="btn-primary text-sm px-3 py-1"
                disabled={!inviteEmail.trim()}
              >
                Invite
              </button>
            </div>

            <div className="mt-3 text-xs text-gray-500">Created {new Date(team.createdAt).toLocaleDateString()}</div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <p className="text-gray-500 text-lg">No teams created yet</p>
          <p className="text-gray-400 text-sm">Create your first team to start collaborating</p>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Team</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={newTeam.name}
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                  disabled={loading}
                  placeholder="Enter team name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={newTeam.description}
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                  disabled={loading}
                  placeholder="Describe your team's purpose..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Team"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

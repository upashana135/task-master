"use client"

import { useEffect, useState } from "react"
import Header from "../components/layouts/Header"
import httpRequest from "@/lib/axiosInstance"
import { toast } from "react-toastify"
import { useAuth } from "../components/context/AuthContext"
import { Mails, Users, UsersIcon } from "lucide-react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Pagination from "@/components/helper/Pagination"

export default function TeamManagement({ onNotification }) {
  const {user} = useAuth()
  const [teams, setTeams] = useState([])
  const [showMembers, setShowMembers] = useState(null)
  const [showInvitedMembers, setShowInvitedMembers] = useState(null)
  const [showAcceptedMembers, setShowAcceptedMembers] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTeam, setNewTeam] = useState({ name: "", description: "" })
  const [inviteEmail, setInviteEmail] = useState({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [teamType, setTeamType] = useState("owned")

  useEffect(()=>{
    getTeams(currentPage, teamType)
  }, [currentPage, teamType])

  const getTeams = (page = 1, type='owned') => {
    setLoading(true)
    try{
      httpRequest.get(`/teams?page=${page}&limit=6`)
      .then((res)=>{
        if(res.data.success) {
          setTeams(res.data.data)
          setCurrentPage(res.data.data.pagination.currentPage)
          if(type === 'owned'){
            setTotalPages(res.data.data.pagination.totalTeamPages)
          }else{
            setTotalPages(res.data.data.pagination.totalInvitedTeamPages)
          }
          setLoading(false)
        }
      })
      .catch((err)=>{
        setLoading(false)
      })
    }catch (error) {
      console.error("Error creating team:", error)
    }
  }

  const createTeam = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      httpRequest.post("/teams", newTeam)
      .then((res)=>{
        if(res.data.success){
          toast.success('Team created successfully')
          setShowCreateForm()
          getTeams()
          setNewTeam({ name: "", description: "" })
        }
      })

      // onNotification(`Team "${newTeam.name}" created successfully`, "team_created")
      
    } catch (error) {
      console.error("Error creating team:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInviteEmailChange = (teamId, value) => {
    setInviteEmail((prev) => ({ ...prev, [teamId]: value }));
  };

  const inviteMember = async (teamId) => {
      try {
        httpRequest.post(`/team-member/${teamId}`, {
          member_email: inviteEmail[teamId]
        })
        .then((res)=>{
          if(res.data.success){
            toast.success(res.data.message)
            handleInviteEmailChange(teamId, "")     
            getTeams()    
          }
        })
        .catch((error)=>{
          toast.error(error.response.data.message)
        })

        // onNotification(`Invitation sent to ${inviteEmail}`, "invitation_sent")
      } catch (error) {
        toast.error(error.response.data.message)
      }
    }
  

  const removeTeam = (teamId) => {
    httpRequest.delete(`/teams/${teamId}`)
      .then((res)=>{
        if(res.data.success){
          toast.success(res.data.message)
          getTeams()
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
    // onNotification("Team removed successfully", "team_removed")
  }

  const memberInvitationStatus = (memberId, status) => {
    httpRequest.patch(`/team-member/${memberId}`, {invitation_status : status})
      .then((res)=>{
        if(res.data.success){
          toast.success(res.data.message)
          getTeams()
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message)
      })
    // onNotification("Team removed successfully", "team_removed")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Teams</h2>
        <select className="input-field w-auto" value={teamType} onChange={(e) => {setTeamType(e.target.value); getTeams(currentPage, e.target.value)}}>
            <option value="owned">Owned Teams</option>
            <option value="collaborated">Collaborating Teams</option>
        </select>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary">
          + Create Team
        </button>
      </div>

      {teamType==='owned' ? 
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading && [1,2,3].map((index)=>(
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <Skeleton height={30} width={'50%'}/>
                <Skeleton className="mt-3" height={10} width={'100%'}/>
                <Skeleton className="mt-3" height={100} width={'100%'}/>
                <Skeleton className="mt-3" height={10} width={'40%'}/>
              </div>
            ))}
            {!loading && teams.teamWithUsers && teams.teamWithUsers.map((team) => (
              <div key={team.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  {/* {Number(team.created_by) === user.userId && (
                    <button onClick={() => removeTeam(team.id)} className="text-red-500 hover:text-red-700 text-sm">
                      Remove
                    </button>
                  )} */}
                </div>

                <p className="text-gray-600 mb-4">{team.description}</p>
                  
                <button
                  onClick={() => setShowMembers(showMembers === team.id ? null : team.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                <Users/> Team Members ({team.teamMembers.length})
                </button>

                {showMembers === team.id && (
                    <div className="border-t pt-4">
                      <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                        {team.teamMembers.length === 0 ? (
                          <p className="text-gray-500 text-sm">No members yet</p>
                        ) : (
                          team.teamMembers.map((member) => (
                            <div key={member.id} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-900">{member.member_email}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                )}

                <button
                  onClick={() => setShowInvitedMembers(showInvitedMembers === team.id ? null : team.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                <Mails/> Pending Invitations ({team.invitedMembers.length})
                </button>

                {showInvitedMembers === team.id && (
                    <div className="border-t pt-4">
                      <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                        {team.invitedMembers.length === 0 ? (
                          <p className="text-gray-500 text-sm">No invitations yet</p>
                        ) : (
                          team.invitedMembers.map((member) => (
                            <div key={member.id} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-900">{member.member_email}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                )}

                <div className="flex mt-3 gap-2">
                  <select className="input-field" value={inviteEmail[team.id] || ""} disabled={loading}
                    onChange={(e) => handleInviteEmailChange(team.id, e.target.value)}
                  >
                    <option value="" disabled>--select email--</option>
                    {team.notInvitedUsers && team.notInvitedUsers.map((user) => (
                      <option key={user.id} value={user.email}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                  <button onClick={() => inviteMember(team.id)} className="btn-primary text-sm px-3 py-1"
                    disabled={!inviteEmail[team.id]}
                  >
                    Invite
                  </button>
                </div>

                <div className="mt-3 text-xs text-gray-500">Created {new Date(team.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>

          {!loading && teams.teamWithUsers && teams.teamWithUsers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4 flex justify-center">
                <UsersIcon size={64}/>
              </div>
              <p className="text-gray-500 text-lg">No team created yet</p>
              <p className="text-gray-400 text-sm">Create your first team to start collaborating</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      :
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading && [1,2,3].map((index)=>(
              <div key={index} className="card hover:shadow-lg transition-shadow">
                <Skeleton height={30} width={'50%'}/>
                <Skeleton className="mt-3" height={100} width={'100%'}/>
              </div>
            ))}
            {!loading && teams.invitedTeams && teams.invitedTeams.map((team) => (
              <div key={team.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold">{team.name}</h3>
                  {team.currentUserInvitationStatus === 'invited' && (
                    <>
                      <button onClick={() => memberInvitationStatus(team.member_id, 'accepted')} className="text-green-500 hover:text-green-700 text-sm">
                        Accept
                      </button>
                      <button onClick={() => memberInvitationStatus(team.member_id, 'rejected')} className="text-red-500 hover:text-red-700 text-sm">
                        Reject
                      </button>
                    </>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{team.description}</p>

                <button
                  onClick={() => setShowAcceptedMembers(showAcceptedMembers === team.id ? null : team.id)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
                >
                <Users/> Members ({team.acceptedMembers.length})
                </button>

                {showAcceptedMembers === team.id && (
                    <div className="border-t pt-4">
                      <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                        {team.acceptedMembers.length === 0 ? (
                          <p className="text-gray-500 text-sm">No members yet</p>
                        ) : (
                          team.acceptedMembers.map((member) => (
                            <div key={member.id} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-gray-900">{member.email}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                )}

                <div className="mt-3 text-xs text-gray-500">Created {new Date(team.created_at).toLocaleDateString()}</div>

                <div className="mt-3 text-xs text-gray-500">Created By : { team.created_by }</div>
              </div>
            ))}
          </div>

          {!loading && teams && teams.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4 flex justify-center">
                <UsersIcon size={64}/>
              </div>
              <p className="text-gray-500 text-lg">No teams collaborated yet</p>
            </div>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      }

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Team</h2>
              <button onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={createTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Name *</label>
                <input type="text" required className="input-field" value={newTeam.name} disabled={loading} placeholder="Enter team name"
                  onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="input-field" value={newTeam.description} disabled={loading} placeholder="Describe your team's purpose..."
                  onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-secondary flex-1" disabled={loading}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center" disabled={loading}>
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
      </main>
    </div>
  )
}

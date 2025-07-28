"use client"

import { useEffect, useState } from "react"
import Header from "../components/layouts/Header"
import httpRequest from "@/lib/axiosInstance"
import { toast } from "react-toastify"
import Select from 'react-select'
import { BookCopy, Users } from "lucide-react"
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function ProjectManagement({ onNotification }) {
  const [teams, setTeams] = useState([])
  const [showTeams, setShowTeams] = useState(null)
  const [showCollaboratingTeams, setShowCollaboratingTeams] = useState(null)
  const [projects, setProjects] = useState([])
  const [collaboratingProjects, setCollaboratingProjects] = useState([])
  const [selectedTeams, setSelectedTeams] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newProject, setNewProject] = useState({ name: "", description: "" })
  const [loading, setLoading] = useState(true)

  const getProjects = () => {
    try{
      httpRequest.get("/projects")
      .then((res)=>{
        if(res.data.success) {
          setProjects(res.data.data.projects)
          setCollaboratingProjects(res.data.data.collaboratingProjects)
          const options = res.data.data.teams.map((team) => ({
            value: team.id,
            label: team.name,
          }))
          setTeams(options)
          setLoading(false)
        }
      })
      .catch((error) => {
        setLoading(false)
      })
    }
    catch (error) {
      console.error("Something went wrong!")
    }
  }

  useEffect(()=>{
    getProjects()
  }, [])

  const createProject = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      httpRequest.post("/projects", {project : newProject, teams: selectedTeams})
      .then((res)=>{
        if(res.data.success){
          toast.success(res.data.message)
          setShowCreateForm()
          getProjects()
          setNewProject({ name: "", description: "" })
          setSelectedTeams([])
        }
      })
      .catch((error)=>{
        toast.error(error.response.data.message)
      })

      // onNotification(`Team "${newTeam.name}" created successfully`, "team_created")
      
    } catch (error) {
      console.error("Something went wrong!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header/>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Owned Projects</h2>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary">
          + Create Project
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && [1,2,3].map((index)=>(
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <Skeleton height={30} width={'50%'}/>
            <Skeleton className="mt-3" height={10} width={'100%'}/>
            <Skeleton className="mt-3" height={100} width={'100%'}/>
            <Skeleton className="mt-3" height={10} width={'40%'}/>
          </div>
        ))}
        {projects && projects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              {/* {Number(team.created_by) === user.userId && (
                <button onClick={() => removeTeam(team.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )} */}
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="text-gray-600 mb-4">Created {new Date(project.created_at).toLocaleDateString()}</p>

            <button
              onClick={() => setShowTeams(showTeams === project.id ? null : project.id)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
            <Users/> Teams ({project.project_teams.length})
            </button>

            {showTeams === project.id && (
                <div className="border-t pt-4">
                  <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                    {project.project_teams.length === 0 ? (
                      <p className="text-gray-500 text-sm">No teams yet</p>
                    ) : (
                      project.project_teams.map((team) => (
                        <div key={team.team.name} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{team.team.name}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {!loading && projects && projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 flex justify-center">
            <BookCopy size={64}/>
          </div>
          <p className="text-gray-500 text-lg">No projects created yet</p>
          <p className="text-gray-400 text-sm">Create your first project to start collaborating</p>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Project</h2>
              <button onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input type="text" required className="input-field" value={newProject.name} disabled={loading} placeholder="Enter project name"
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="input-field" value={newProject.description} disabled={loading} placeholder="Describe your project's purpose..."
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team *</label>
                <Select required
                  options={teams}
                  isMulti
                  value={selectedTeams}
                  onChange={setSelectedTeams}
                  className="text-sm"
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
                    "Create Project"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>

      <div>
      <div className="flex justify-between items-center mb-6 mt-6">
        <h2 className="text-3xl font-bold text-gray-900">Collaborating Projects</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading && [1,2,3].map((index)=>(
          <div key={index} className="card hover:shadow-lg transition-shadow">
            <Skeleton height={30} width={'50%'}/>
            <Skeleton className="mt-3" height={10} width={'100%'}/>
            <Skeleton className="mt-3" height={100} width={'100%'}/>
            <Skeleton className="mt-3" height={10} width={'40%'}/>
          </div>
        ))}
        {collaboratingProjects && collaboratingProjects.map((project) => (
          <div key={project.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{project.name}</h3>
              {/* {Number(team.created_by) === user.userId && (
                <button onClick={() => removeTeam(team.id)} className="text-red-500 hover:text-red-700 text-sm">
                  Remove
                </button>
              )} */}
            </div>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <p className="text-gray-600 mb-4">Created {new Date(project.created_at).toLocaleDateString()}</p>     

            <button
              onClick={() => setShowCollaboratingTeams(showCollaboratingTeams === project.id ? null : project.id)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
            >
            <Users/> Teams ({project.project_teams.length})
            </button>

            {showCollaboratingTeams === project.id && (
                <div className="border-t pt-4">
                  <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
                    {project.project_teams.length === 0 ? (
                      <p className="text-gray-500 text-sm">No teams yet</p>
                    ) : (
                      project.project_teams.map((team) => (
                        <div key={team.team.name} className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-medium text-gray-900">{team.team.name}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>

      {!loading && collaboratingProjects && collaboratingProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4 flex justify-center">
            <BookCopy size={64}/>
          </div>
          <p className="text-gray-500 text-lg">No projects collaborated yet</p>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Create New Project</h2>
              <button onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                disabled={loading}
              >
                ×
              </button>
            </div>

            <form onSubmit={createProject} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                <input type="text" required className="input-field" value={newProject.name} disabled={loading} placeholder="Enter project name"
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="input-field" value={newProject.description} disabled={loading} placeholder="Describe your project's purpose..."
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team *</label>
                <Select 
                  options={teams}
                  isMulti
                  value={selectedTeams}
                  onChange={setSelectedTeams}
                  className="text-sm"
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
                    "Create Project"
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

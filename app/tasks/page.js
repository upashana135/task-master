"use client"

import { useState, useEffect } from "react"
import TaskForm from "../../components/tasks/TaskForm"
import Header from "../components/layouts/Header"
import TaskList from "../../components/tasks/TaskList"
import { useAuth } from "../components/context/AuthContext"
import httpRequest from "@/lib/axiosInstance"
import { toast } from "react-toastify"

export default function Dashboard() {
  const {user} = useAuth();
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)

  const getTask = () => {
    httpRequest.get('/tasks')
    .then((res)=>{
        setTasks(res.data.data.tasks)
        setProjects(res.data.data.projects)
      })
  }

  useEffect(() => {
    try {
      const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")

      getTask()
      setNotifications(savedNotifications)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  const addTaskSuccess = () => {
    getTask()
    setShowTaskForm(false)
    // Add notification
    // if (taskData.assignedTo && taskData.assignedTo !== user.email) {
    //   addNotification(`New task "${taskData.title}" has been assigned to you`, "task_assigned")
    // }
  }

  const updateTask = (taskId, updates) => {
    httpRequest.patch(`/tasks/${taskId}`, updates)
    .then((res)=>{
        if(res.data.success) {
          toast.success("Status updated successfully!")
          getTask()

        // // Add notification for status changes
        // if (updates.status && updates.status !== task.status) {
        //   addNotification(`Task "${task.title}" status changed to ${updates.status}`, "task_updated")
        // }
        }
      })
  }

  const deleteTask = (taskId) => {
    httpRequest.delete(`/tasks/${taskId}`)
      .then((res)=>{
        getTask()
      })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
              <button onClick={() => setShowTaskForm(true)} className="btn-primary">
                + New Task
              </button>
            </div>
            <TaskList tasks={tasks} currentUser={user} onUpdateTask={updateTask} onDeleteTask={deleteTask} projects={projects}/>
          </div>
      </main>

      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} onSubmit={addTaskSuccess} projects={projects} currentUser={user} />
      )}
    </div>
  )
}

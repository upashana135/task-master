"use client"

import { useState, useEffect } from "react"
import TaskList from "./TaskList"
import TaskForm from "./TaskForm"
import Profile from "./Profile"
import TeamManagement from "./TeamManagement"
import NotificationCenter from "./NotificationCenter"

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("tasks")
  const [tasks, setTasks] = useState([])
  const [teams, setTeams] = useState([])
  const [notifications, setNotifications] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  useEffect(() => {
    // Load data from localStorage
    try {
      const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
      const savedTeams = JSON.parse(localStorage.getItem("teams") || "[]")
      const savedNotifications = JSON.parse(localStorage.getItem("notifications") || "[]")

      setTasks(savedTasks)
      setTeams(savedTeams)
      setNotifications(savedNotifications)
    } catch (error) {
      console.error("Error loading data:", error)
    }
  }, [])

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      status: "open",
      comments: [],
      attachments: [],
    }

    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Add notification
    if (taskData.assignedTo && taskData.assignedTo !== user.email) {
      addNotification(`New task "${taskData.title}" has been assigned to you`, "task_assigned")
    }

    setShowTaskForm(false)
  }

  const updateTask = (taskId, updates) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedTask = { ...task, ...updates }

        // Add notification for status changes
        if (updates.status && updates.status !== task.status) {
          addNotification(`Task "${task.title}" status changed to ${updates.status}`, "task_updated")
        }

        return updatedTask
      }
      return task
    })

    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))
  }

  const addNotification = (message, type) => {
    const notification = {
      id: Date.now(),
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
    }

    const updatedNotifications = [notification, ...notifications]
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const markNotificationAsRead = (notificationId) => {
    const updatedNotifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    setNotifications(updatedNotifications)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">TaskTracker</h1>
            </div>

            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("tasks")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "tasks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("teams")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "teams"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Teams
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  activeTab === "profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <NotificationCenter
                    notifications={notifications}
                    onMarkAsRead={markNotificationAsRead}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>

              <img
                src={user.avatar || "/placeholder.svg?height=32&width=32"}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
              <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "tasks" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">My Tasks</h2>
              <button onClick={() => setShowTaskForm(true)} className="btn-primary">
                + New Task
              </button>
            </div>
            <TaskList tasks={tasks} currentUser={user} onUpdateTask={updateTask} onDeleteTask={deleteTask} />
          </div>
        )}

        {activeTab === "teams" && (
          <TeamManagement user={user} teams={teams} setTeams={setTeams} onNotification={addNotification} />
        )}

        {activeTab === "profile" && <Profile user={user} />}
      </main>

      {showTaskForm && (
        <TaskForm onClose={() => setShowTaskForm(false)} onSubmit={addTask} teams={teams} currentUser={user} />
      )}
    </div>
  )
}

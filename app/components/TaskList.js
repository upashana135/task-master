"use client"

import { useState } from "react"
import TaskCard from "./TaskCard"

export default function TaskList({ tasks, currentUser, onUpdateTask, onDeleteTask }) {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")

  const filteredTasks = tasks
    .filter((task) => {
      const matchesFilter = filter === "all" || task.status === filter
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesFilter && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate":
          return new Date(a.dueDate) - new Date(b.dueDate)
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

  const taskStats = {
    total: tasks.length,
    open: tasks.filter((t) => t.status === "open").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    overdue: tasks.filter((t) => new Date(t.dueDate) < new Date() && t.status !== "completed").length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{taskStats.total}</div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{taskStats.open}</div>
          <div className="text-sm text-gray-600">Open</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{taskStats.overdue}</div>
          <div className="text-sm text-gray-600">Overdue</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All ({taskStats.total})
          </button>
          <button
            onClick={() => setFilter("open")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "open" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Open ({taskStats.open})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Completed ({taskStats.completed})
          </button>
        </div>

        <div className="flex gap-4 flex-1">
          <input
            type="text"
            placeholder="Search tasks..."
            className="input-field flex-1 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select className="input-field w-auto" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="createdAt">Sort by Created</option>
            <option value="dueDate">Sort by Due Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="title">Sort by Title</option>
          </select>
        </div>
      </div>

      {/* Task Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            currentUser={currentUser}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <p className="text-gray-500 text-lg">No tasks found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}

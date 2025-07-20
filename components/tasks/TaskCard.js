"use client"

import httpRequest from "@/lib/axiosInstance"
import { useState } from "react"
import { toast } from "react-toastify"

export default function TaskCard({ task, currentUser, onUpdate, onDelete }) {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const toggleComplete = () => {
    onUpdate(task.id, {
      status: task.status === "completed" ? "open" : "completed",
      completed_date: task.status === "completed" ? null : new Date().toISOString(),
    })
  }

  const addComment = (taskId) => {
    if (newComment.trim()) {
      const comment = {
        commentText: newComment,
        commentDate: new Date().toISOString(),
      }
      httpRequest.post(`/tasks/comments/${taskId}`, comment)
        .then((res)=>{
          if(res.data.success) {
            toast.success(res.data.message)
            setNewComment("")
          }
        })
      // onUpdate(task.id, {
      //   comments: [...task.comments, comment],
      // })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const isOverdue = new Date(task.due_date) < new Date() && task.status !== "completed"

  return (
    <div
      className={`card transition-all duration-200 hover:shadow-md ${isOverdue ? "border-l-4 border-l-red-500" : ""}`}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-lg text-gray-900">{task.title}</h3>
          <h5 className="font-semibold text-sm text-gray-900">Project : {task.project.name} </h5>
          <h5 className="font-semibold text-sm text-gray-900">Team : {task.team.name} </h5>
        </div>
        <div className="flex gap-2 ml-2">
          <span className={`status-badge ${task.status === "completed" ? "status-completed" : "status-open"}`}>
            {task.status === "open" ? "Open" : "Completed"}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>

      <div className="text-sm text-gray-500 mb-3 space-y-1">
        <p>Start Date: {formatDate(task.start_date)}</p>
        <p className={isOverdue ? "text-red-600 font-medium" : ""}>
          Due Date: {formatDate(task.due_date)} {isOverdue && "(Overdue)"}
        </p>
        {task.assigned_to_user && <p>Assigned to: {task.assigned_to_user}</p>}
      </div>

      <div className="flex justify-between items-center mb-3">
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          💬 Comments ({task.taskComments.length})
        </button>

        <div className="flex gap-2">
          <button
            onClick={toggleComplete}
            className={`text-sm px-3 py-1 rounded transition-colors ${
              task.status === "completed"
                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {task.status === "completed" ? "Reopen" : "Complete"}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-500 hover:text-red-700 text-sm transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t pt-4">
          <div className="space-y-3 mb-3 max-h-32 overflow-y-auto">
            {task.taskComments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet</p>
            ) : (
              task.taskComments.map((comment) => (
                <div key={comment.id} className="text-sm bg-gray-50 p-3 rounded">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-900">{comment.commenter_email}</span>
                    <span className="text-xs text-gray-500">{formatDate(comment.comment_date)}</span>
                  </div>
                  <p className="text-gray-700">{comment.comment_text}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="input-field flex-1 text-sm"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button onClick={() => addComment(task.id)} className="btn-primary text-sm px-3 py-1" disabled={!newComment.trim()}>
              Add
            </button>
          </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Delete Task</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{task.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={() => {
                  onDelete(task.id)
                  setShowDeleteConfirm(false)
                }}
                className="btn-danger flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

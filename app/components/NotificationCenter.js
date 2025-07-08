"use client"

import { useEffect, useRef } from "react"

export default function NotificationCenter({ notifications, onMarkAsRead, onClose }) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No notifications yet</div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.read ? "bg-blue-50" : ""
              }`}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-900 flex-1">{notification.message}</p>
                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>}
              </div>
              <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

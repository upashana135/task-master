import { useState } from "react"
import NotificationCenter from "../NotificationCenter"
import { useAuth } from "../context/AuthContext"
import { usePathname } from "next/navigation"
import Link from "next/link"


export default function Header(){
    const [notifications, setNotifications] = useState([])
    const unreadCount = notifications.filter((n) => !n.read).length
    const [showNotifications, setShowNotifications] = useState(false)
    const pathName = usePathname()
    const {logout} = useAuth()
    const onLogout = () => {
      logout()
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

    return <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Master</h1>
            </div>

            <nav className="flex space-x-8">
              <Link href="/tasks"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathName === "/tasks"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Tasks
              </Link>
              <Link href="/team"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathName === "/team"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Teams
              </Link>
              <Link href="/projects"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathName === "/projects"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Projects
              </Link>
              <Link href="/profile"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  pathName === "/profile"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Profile
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {/* <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)}
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
              </div> */}

             
              {/* <img
                src={user.avatar || "/placeholder.svg?height=32&width=32"}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="text-sm font-medium text-gray-700">{user.name}</span> */}
              
              <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
}
import ToastProvider from "@/components/ToastProvider"
import { AuthProvider } from "./components/context/AuthContext"
import "./globals.css"

export const metadata = {
  title: "TaskMaster - Task Management Platform",
  description: "A comprehensive task tracking platform for teams and projects",
  keywords: "task management, team collaboration, productivity",
  authors: [{ name: "Upashana Baruah" }],
  viewport: "width=device-width, initial-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </head>
      <body className="bg-gray-50 min-h-screen antialiased">
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

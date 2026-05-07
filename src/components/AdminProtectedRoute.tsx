import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContexts'
import { ReactNode } from 'react'

export default function AdminProtectedRoute({
  children,
}: {
  children: ReactNode
}) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 animate-spin">
            <div className="w-8 h-8 rounded-full border-3 border-blue-300 border-t-blue-600"></div>
          </div>
          <p className="text-slate-700 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // User exists but profile still loading → show loading screen
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4 animate-spin">
            <div className="w-8 h-8 rounded-full border-3 border-blue-300 border-t-blue-600"></div>
          </div>
          <p className="text-slate-700 font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (String(profile.role || '').toLowerCase() === 'admin') {
    return children
  }

  return <Navigate to="/home" replace />
}

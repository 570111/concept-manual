import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useContent } from '../lib/ContentContext'

export default function RequireAuth() {
  const { data, loading } = useContent()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-400 dark:text-slate-500">
        加载中…
      </div>
    )
  }

  if (!data) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

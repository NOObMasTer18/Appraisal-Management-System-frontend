import { Outlet, Navigate } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NotificationPanel } from './NotificationPanel'
import { UserProfile } from './UserProfile'
import { useAuth } from '../context/AuthContext'

export function Layout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="flex h-screen w-full text-slate-900 font-sans tracking-tight">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="sticky top-0 z-20 glass border-b border-slate-200/50 pl-8 pr-6 py-4 flex items-center justify-end gap-4 shadow-sm animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <NotificationPanel />
          <UserProfile />
        </header>
        <main className="flex-1 overflow-y-auto p-8 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

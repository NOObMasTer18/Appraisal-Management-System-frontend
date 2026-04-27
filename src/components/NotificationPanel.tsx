import { useState, useRef, useEffect } from 'react'
import { Bell, Check } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../api/notifications'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { Button } from './ui/button'

export function NotificationPanel() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data: count = 0 } = useQuery({
    queryKey: ['unread-count', user?.id],
    queryFn: () => getUnreadCount(user!.id),
    enabled: !!user,
    refetchInterval: 30000,
  })

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => getNotifications(user!.id),
    enabled: !!user && open,
  })

  const markOne = useMutation({
    mutationFn: (id: number) => markAsRead(id, user!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }) },
  })

  const markAll = useMutation({
    mutationFn: () => markAllAsRead(user!.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notifications'] }); qc.invalidateQueries({ queryKey: ['unread-count'] }) },
  })

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(o => !o)} className="relative p-2.5 text-blue-600 bg-white hover:bg-slate-50 rounded-[20px] transition-all shadow-sm border border-slate-200 focus:outline-none">
        <Bell size={20} className={count > 0 ? "animate-pulse-slow text-blue-600" : ""} />
        {count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] rounded-full w-[18px] h-[18px] flex items-center justify-center font-bold shadow-sm border-2 border-white">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-200/60 z-50 overflow-hidden transform origin-top-right transition-all animate-fade-in-up">
          <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <span className="font-bold text-slate-900 tracking-tight text-lg">Notifications</span>
            {count > 0 && (
              <Button size="sm" variant="ghost" onClick={() => markAll.mutate()} className="text-xs text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg h-8">
                <Check size={14} className="mr-1" /> Mark all read
              </Button>
            )}
          </div>
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <Bell size={24} className="text-slate-300" />
                </div>
                <p className="text-slate-500 text-sm font-medium">All caught up!</p>
                <p className="text-slate-400 text-xs mt-1">No new notifications right now.</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((n, i) => (
                <div
                  key={n.id}
                  onClick={() => !n.isRead && markOne.mutate(n.id)}
                  className={`p-4 border-b border-slate-50 cursor-pointer transition-all duration-200 group ${!n.isRead ? 'bg-indigo-50/40 hover:bg-indigo-50/70' : 'hover:bg-slate-50'}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm tracking-tight truncate ${!n.isRead ? 'font-bold text-indigo-950' : 'font-medium text-slate-700 group-hover:text-slate-900'}`}>{n.title}</p>
                      <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${!n.isRead ? 'text-indigo-800/80' : 'text-slate-500 group-hover:text-slate-600'}`}>{n.message}</p>
                    </div>
                    {!n.isRead && <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />}
                  </div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mt-2">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

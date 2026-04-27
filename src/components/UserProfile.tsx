import { useAuth } from '../context/AuthContext'
import { Badge } from './ui/badge'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { LogOut, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const roleVariant: Record<string, 'destructive' | 'blue' | 'success'> = {
  HR: 'destructive',
  MANAGER: 'blue',
  EMPLOYEE: 'success',
}

const roleLabel: Record<string, string> = {
  HR: 'HR',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employee',
}

export function UserProfile() {
  const { user, activeRole, logout, switchRole } = useAuth()
  const navigate = useNavigate()
  
  if (!user || !activeRole) return null

  const otherRole = user.secondaryRole && user.secondaryRole !== activeRole
    ? user.secondaryRole
    : user.role !== activeRole
      ? user.role
      : null

  const handleSwitch = () => {
    if (!otherRole) return
    switchRole(otherRole)
    const dest = otherRole === 'HR' ? '/hr/dashboard' : otherRole === 'MANAGER' ? '/manager/dashboard' : '/employee/dashboard'
    navigate(dest)
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="flex items-center gap-3 relative z-10 p-2 rounded-full hover:bg-slate-50 transition-colors justify-end cursor-pointer outline-none">
          <div className="min-w-0 flex flex-col items-end">
            <p className="text-sm font-bold text-slate-900 truncate leading-tight">{user.fullName}</p>
            <Badge 
              variant={roleVariant[activeRole]} 
              className="text-[9px] mt-0.5 shadow-none border-blue-100 bg-emerald-50 text-emerald-600 px-1.5 py-0 uppercase tracking-wider"
            >
              {activeRole}
            </Badge>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-full border-[1.5px] border-blue-600 bg-white flex items-center justify-center text-sm font-extrabold text-blue-600 shadow-sm">
              {user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-[1.5px] border-white rounded-full" />
          </div>
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content 
          align="end" 
          sideOffset={8}
          className="z-50 w-56 bg-white rounded-xl shadow-lg border border-slate-100 p-2 text-sm text-slate-700 data-[state=open]:animate-fade-in-up"
        >
          <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Logged in as <span className="text-slate-700 font-bold">{roleLabel[activeRole]}</span>
          </div>
          <DropdownMenu.Separator className="h-px bg-slate-100 my-1 mx-2" />
          
          {otherRole && (
            <>
              <DropdownMenu.Item 
                className="flex items-center gap-2 px-3 py-2.5 outline-none cursor-pointer rounded-lg hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors font-medium group"
                onSelect={handleSwitch}
              >
                <RefreshCw size={15} className="text-slate-400 group-hover:text-indigo-50 transition-colors" />
                Switch to {roleLabel[otherRole]}
              </DropdownMenu.Item>
              <DropdownMenu.Separator className="h-px bg-slate-100 my-1 mx-2" />
            </>
          )}

          <DropdownMenu.Item 
            className="flex items-center gap-2 px-3 py-2.5 outline-none cursor-pointer rounded-lg hover:bg-rose-50 hover:text-rose-600 text-slate-700 transition-colors font-medium group"
            onSelect={logout}
          >
            <LogOut size={16} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            Sign Out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

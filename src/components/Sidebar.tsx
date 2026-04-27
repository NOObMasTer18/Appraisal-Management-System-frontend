import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, Users, Building2, ClipboardList, 
  Target, BarChart2, ClipboardCheck, BookOpen, 
  ChevronDown 
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { cn } from '../lib/utils'

const hrLinks = [
  { to: '/hr/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hr/users', label: 'Users', icon: Users },
  { to: '/hr/departments', label: 'Departments', icon: Building2 },
  { to: '/hr/appraisals', label: 'All Appraisals', icon: ClipboardCheck },
  { to: '/hr/appraisals/create', label: 'Create Appraisal', icon: ClipboardList },
]

const managerLinks = [
  { to: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/manager/team', label: 'My Team', icon: Users },
  { to: '/manager/team-appraisals', label: 'Team Appraisals', icon: ClipboardCheck },
  { to: '/manager/goals', label: 'Goals', icon: Target },
]

const employeeLinks = [
  { 
    label: 'Appraisal Guide', 
    icon: BookOpen,
    subLinks: [
      { to: '/employee/guidelines', label: 'Writing Manual' },
      { to: '/employee/guidelines/samples', label: 'Sample Appraisals' },
    ]
  },
  { to: '/employee/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employee/appraisals', label: 'My Appraisals', icon: ClipboardList },
  { to: '/employee/goals', label: 'My Goals', icon: Target },
  { to: '/employee/report', label: 'Appraisal Report', icon: BarChart2 },
]



export function Sidebar() {
  const { user, activeRole } = useAuth()
  const location = useLocation()
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Appraisal Guide': location.pathname.includes('/employee/guidelines')
  })

  // Auto-close section when navigating away
  useEffect(() => {
    if (!location.pathname.includes('/employee/guidelines')) {
      setOpenSections(prev => ({ ...prev, 'Appraisal Guide': false }))
    }
  }, [location.pathname])

  if (!user || !activeRole) return null

  const toggleSection = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }))
  }

  const links = activeRole === 'HR' ? hrLinks : activeRole === 'MANAGER' ? managerLinks : employeeLinks

  return (
    <aside className="w-72 bg-[#0F172A] text-slate-300 flex flex-col h-screen sticky top-0 border-r border-slate-800 shadow-xl z-30">
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-1">
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Building2 size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Appraisal System</h1>
        </div>
        <p className="text-slate-500 text-[11px] ml-11 font-medium uppercase tracking-widest">Performance</p>
      </div>

      <nav className="flex-1 p-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {links.map((link: any) => {
          if (link.subLinks) {
            const isOpen = openSections[link.label]
            return (
              <div key={link.label} className="space-y-1">
                <NavLink 
                  to={link.subLinks[0].to}
                  onClick={() => setOpenSections(prev => ({ ...prev, [link.label]: true }))}
                  className={({ isActive }) => cn(
                    "w-full flex items-center justify-between px-4 py-2 rounded-lg group transition-colors",
                    (isActive || isOpen) ? "bg-slate-800/30" : "hover:bg-slate-800/50"
                  )}
                >
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-[0.1em]">
                    <link.icon size={14} className={cn("transition-colors", (isOpen || location.pathname.startsWith('/employee/guidelines')) ? "text-indigo-500" : "text-slate-600 group-hover:text-slate-400")} />
                    {link.label}
                  </div>
                  <ChevronDown size={14} className={cn("text-slate-600 transition-transform duration-200", isOpen && "rotate-180")} />
                </NavLink>
                
                {isOpen && (
                  <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                     {link.subLinks.map((sub: any) => (
                        <NavLink
                          key={sub.to}
                          to={sub.to}
                          end
                          className={({ isActive }) => cn(
                            'group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ml-4 border-l-2 border-transparent',
                            isActive 
                              ? 'text-white bg-slate-800/50 border-indigo-500' 
                              : 'hover:text-white hover:bg-slate-800/30 text-slate-400'
                          )}
                        >
                          <span>{sub.label}</span>
                        </NavLink>
                     ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={({ isActive }) => cn(
                'group flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                isActive 
                  ? 'text-white bg-slate-800' 
                  : 'hover:text-white hover:bg-slate-800/50'
              )}
            >
              {({ isActive }) => {
                const Icon = link.icon
                return (
                  <>
                    <Icon size={18} className={cn("transition-colors", isActive ? "text-indigo-500" : "text-slate-500 group-hover:text-slate-300")} />
                    <span>{link.label}</span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
                    )}
                  </>
                )
              }}
            </NavLink>
          )
        })}
      </nav>

    </aside>
  )
}

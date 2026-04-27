import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getMyAppraisals } from '../../api/appraisals'
import { getMyGoals } from '../../api/goals'

import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import { ClipboardList, Target } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../lib/utils'

export function EmployeeDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: appraisals = [] } = useQuery({
    queryKey: ['my-appraisals', user?.id],
    queryFn: () => getMyAppraisals(user!.id),
    enabled: !!user,
  })

  const { data: goals = [] } = useQuery({
    queryKey: ['my-goals', user?.id],
    queryFn: () => getMyGoals(user!.id),
    enabled: !!user,
  })



  const activeAppraisals = appraisals.filter(a => a.appraisalStatus !== 'ACKNOWLEDGED').length
  const goalsInProgress = goals.filter(g => g.status === 'IN_PROGRESS').length

  const getActionLabel = (status: string) => {
    if (status === 'PENDING') return 'Submit Self Assessment'
    if (status === 'APPROVED') return 'Acknowledge'
    return 'View Details'
  }

  const getActionVariant = (status: string): 'default' | 'outline' => {
    if (status === 'PENDING' || status === 'APPROVED') return 'default'
    return 'outline'
  }

  const getActionPath = (id: number, status: string) => {
    if (status === 'PENDING') return `/employee/appraisals/${id}/self-assessment`
    return `/employee/appraisals/${id}`
  }

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Hello, <span className="text-indigo-600">{user?.fullName.split(' ')[0]}</span>
        </h1>
        <p className="text-slate-500 font-medium text-sm">Welcome back to your performance portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Active Appraisals', value: activeAppraisals, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Goals In Progress', value: goalsInProgress, icon: Target, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-none shadow-sm shadow-slate-200/60 transition-all hover:shadow-md hover:translate-y-[-2px] duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{value}</p>
                </div>
                <div className={`${bg} p-3.5 rounded-2xl`}>
                  <Icon size={24} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm shadow-slate-200/60 overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <CardTitle className="text-lg font-bold text-slate-900">My Appraisals</CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">Track your current and past appraisal cycles</p>
        </div>
        <CardContent className="p-0">
          {appraisals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                <ClipboardList size={32} className="text-slate-200" />
              </div>
              <p className="text-slate-400 font-medium text-sm italic">No appraisals assigned yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {appraisals.map(a => (
                <div key={a.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 hover:bg-slate-50/40 transition-colors">
                  <div className="space-y-1.5">
                    <p className="font-bold text-slate-900 text-lg tracking-tight">{a.cycleName}</p>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] uppercase font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/50">{a.managerName}</span>
                       <span className="text-xs text-slate-400 font-medium">{format(new Date(a.cycleStartDate), 'MMM d')} — {format(new Date(a.cycleEndDate), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                    <StatusBadge status={a.appraisalStatus} />
                    <Button
                      className={cn(
                        "rounded-xl font-bold text-xs h-10 px-6 transition-all",
                        a.appraisalStatus === 'PENDING' ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20" : ""
                      )}
                      size="sm"
                      variant={getActionVariant(a.appraisalStatus)}
                      onClick={() => navigate(getActionPath(a.id, a.appraisalStatus))}
                    >
                      {getActionLabel(a.appraisalStatus)}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

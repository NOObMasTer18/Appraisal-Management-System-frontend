import { useQuery } from '@tanstack/react-query'
import { getTeamAppraisals } from '../../api/appraisals'
import { getTeamMembers } from '../../api/users'
import { Card, CardContent } from '../../components/ui/card'
import { Users, ClipboardList, Clock, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function ManagerDashboard() {
  const { user } = useAuth()

  const { data: appraisals = [] } = useQuery({
    queryKey: ['team-appraisals', user?.id],
    queryFn: () => getTeamAppraisals(user!.id),
    enabled: !!user,
  })

  const { data: team = [] } = useQuery({
    queryKey: ['team', user?.id],
    queryFn: () => getTeamMembers(user!.id),
    enabled: !!user,
  })

  const active = appraisals.filter(a => a.appraisalStatus !== 'ACKNOWLEDGED').length
  const awaitingReview = appraisals.filter(a => a.appraisalStatus === 'SELF_SUBMITTED').length
  const completed = appraisals.filter(a => a.appraisalStatus === 'ACKNOWLEDGED').length

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Manager Dashboard</h1>
        <p className="text-slate-500 font-medium text-sm">Overview of your team's performance appraisals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Team Size', value: team.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Appraisals', value: active, icon: ClipboardList, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Awaiting Review', value: awaitingReview, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-none shadow-sm shadow-slate-200/60 transition-all hover:shadow-md hover:translate-y-[-2px] duration-300 pointer-events-none">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-400 uppercase">{label}</p>
                  <p className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">{value}</p>
                </div>
                <div className={`${bg} p-3.5 rounded-2xl`}>
                  <Icon size={24} className={color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

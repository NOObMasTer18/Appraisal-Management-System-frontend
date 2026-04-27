import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUsers } from '../../api/users'
import { getAllAppraisals } from '../../api/appraisals'
import { getCycleSummary } from '../../api/reports'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { Users, ClipboardCheck, Clock, CheckCircle } from 'lucide-react'
import { cn } from '../../lib/utils'


export function HRDashboard() {
  const [selectedCycle, setSelectedCycle] = useState<string>('')

  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: getUsers })

  const { data: appraisals = [] } = useQuery({
    queryKey: ['all-appraisals'],
    queryFn: getAllAppraisals,
  })

  // Set default cycle once appraisals load
  if (!selectedCycle && appraisals.length > 0) {
    setSelectedCycle(appraisals[0].cycleName)
  }

  const { data: cycleSummary } = useQuery({
    queryKey: ['cycleSummary', selectedCycle],
    queryFn: () => getCycleSummary(selectedCycle),
    enabled: !!selectedCycle,
  })

  const activeEmployees = users.filter(u => (u.role === 'EMPLOYEE' || u.role === 'MANAGER') && u.isActive).length
  const pendingApproval = appraisals.filter(a => a.appraisalStatus === 'MANAGER_REVIEWED').length
  const completed = appraisals.filter(a => a.appraisalStatus === 'ACKNOWLEDGED').length
  const uniqueCycles = Array.from(new Set(appraisals.map(a => a.cycleName)))

  return (
    <div className="space-y-10 animate-fade-in-up">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 italic-0">Organization Overview</h1>
        <p className="text-slate-500 font-medium text-sm">Real-time performance metrics and appraisal cycles</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Employees', value: activeEmployees, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Total Appraisals', value: appraisals.length, icon: ClipboardCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending Approval', value: pendingApproval, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <Card key={label} className="border-none shadow-sm shadow-slate-200/60 transition-all hover:shadow-md hover:translate-y-[-2px] duration-300">
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

      <Card className="border-none shadow-sm shadow-slate-200/60 overflow-hidden bg-white">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Appraisal Cycle Performance</CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">Summary of progress for the current timeframe</p>
          </div>
          <select 
            className="bg-white border border-slate-200 text-xs font-semibold rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all cursor-pointer"
            value={selectedCycle}
            onChange={e => setSelectedCycle(e.target.value)}
          >
            {uniqueCycles.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <CardContent className="p-8">
          {cycleSummary ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { label: 'Completion', value: `${cycleSummary.completionPercentage}%`, sub: 'Overall progress' },
                { label: 'Pending', value: cycleSummary.pendingCount, sub: 'Needs attention' },
                { label: 'Completed', value: cycleSummary.completedCount, sub: 'Archived cases' },
                { label: 'Avg Rating', value: cycleSummary.averageRating?.toFixed(1) || '—', sub: 'Performance score', highlight: true },
              ].map((item, i) => (
                <div key={i} className={cn(
                  "p-6 rounded-2xl border border-slate-50 transition-all",
                  item.highlight ? "bg-indigo-50/40 border-indigo-100" : "bg-white"
                )}>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</p>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <p className={cn("text-3xl font-black tracking-tight", item.highlight ? "text-indigo-600" : "text-slate-900")}>
                      {item.value}
                    </p>
                    {item.highlight && <span className="text-xs font-bold text-indigo-300">/ 5.0</span>}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">{item.sub}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic">
              Select a cycle to view details
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getTeamAppraisals } from '../../api/appraisals'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/StatusBadge'
import { RatingStars } from '../../components/RatingStars'
import { Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export function TeamAppraisalsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data: appraisals = [] } = useQuery({
    queryKey: ['team-appraisals', user?.id],
    queryFn: () => getTeamAppraisals(user!.id),
    enabled: !!user,
  })

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Team Appraisals</h1>
        <p className="text-slate-500 font-medium">Manage and review performance appraisals for your team members</p>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/40 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-6 flex items-center justify-between">
          <CardTitle className="text-xl">All Team Appraisals</CardTitle>
        </div>
        <CardContent className="p-0">
          {appraisals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Users size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No appraisals found for your team.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-wider text-[11px] font-bold text-slate-500">
                  <tr>
                    {['Employee', 'Cycle', 'Status', 'Self Rating', 'My Rating', 'Actions'].map(h => (
                      <th key={h} className="py-4 px-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {appraisals.map((a, i) => (
                    <tr key={a.id} className="hover:bg-indigo-50/30 transition-colors animate-fade-in-up" autoFocus style={{animationDelay: `${i * 0.05}s`}}>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{a.employeeName}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">{a.cycleName}</td>
                      <td className="py-4 px-6"><StatusBadge status={a.appraisalStatus} /></td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <RatingStars value={a.selfRating || 0} readonly />
                          {a.selfRating && <span className="font-semibold text-slate-700">{a.selfRating}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <RatingStars value={a.managerRating || 0} readonly />
                          {a.managerRating && <span className="font-semibold text-slate-700">{a.managerRating}</span>}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <Button
                          size="sm"
                          className={`shadow-sm transition-all focus:ring-2 ${a.appraisalStatus === 'SELF_SUBMITTED' ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-500/20 text-white' : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'}`}
                          variant={a.appraisalStatus === 'SELF_SUBMITTED' ? 'default' : 'outline'}
                          onClick={() => navigate(
                            a.appraisalStatus === 'SELF_SUBMITTED'
                              ? `/manager/appraisals/${a.id}/review`
                              : `/manager/appraisals/${a.id}`
                          )}
                        >
                          {a.appraisalStatus === 'SELF_SUBMITTED' ? 'Review' : 'View'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getMyAppraisals } from '../../api/appraisals'
import { useAuth } from '../../context/AuthContext'
import { Card, CardContent } from '../../components/ui/card'
import { format } from 'date-fns'
import { RatingStars } from '../../components/RatingStars'

import { BarChart2, User, Users, Shield } from 'lucide-react'

const RATED_STATUSES = ['SELF_SUBMITTED', 'MANAGER_REVIEWED', 'APPROVED', 'ACKNOWLEDGED']


export function AppraisalReportPage() {
  const { user } = useAuth()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [tab, setTab] = useState<'self' | 'manager'>('self')

  const { data: appraisals = [], isLoading } = useQuery({
    queryKey: ['my-appraisals', user?.id],
    queryFn: () => getMyAppraisals(user!.id),
    enabled: !!user,
  })

  const completedAppraisals = appraisals.filter(a => RATED_STATUSES.includes(a.appraisalStatus))

  // Auto-select first completed appraisal
  const effectiveId = selectedId ?? (completedAppraisals[0]?.id ?? null)
  const appraisal = completedAppraisals.find(a => a.id === effectiveId) ?? null



  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="bg-indigo-500/10 p-2 rounded-xl">
            <BarChart2 size={24} className="text-indigo-600" />
          </div>
          My Appraisal Report
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">Loading reports...</div>
      ) : completedAppraisals.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <BarChart2 size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium">No completed appraisals yet.</p>
            <p className="text-slate-400 text-sm">Your report will appear here once an appraisal is submitted.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cycle Selector */}
          <Card className="border-none shadow-md shadow-slate-200/50">
            <CardContent className="p-4 flex flex-wrap items-center gap-3">
              <label className="text-sm font-semibold text-slate-600">Appraisal Cycle:</label>
              <select
                className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 min-w-[220px]"
                value={effectiveId ?? ''}
                onChange={e => setSelectedId(Number(e.target.value))}
              >
                {completedAppraisals.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.cycleName} ({format(new Date(a.cycleStartDate), 'dd/MM/yyyy')} - {format(new Date(a.cycleEndDate), 'dd/MM/yyyy')})
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {appraisal && (
            <>
              {/* Self / Manager Tabs */}
              <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
                <button
                  onClick={() => setTab('self')}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === 'self'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <User size={15} />
                  Self
                </button>
                <button
                  onClick={() => setTab('manager')}
                  disabled={!['MANAGER_REVIEWED', 'APPROVED', 'ACKNOWLEDGED'].includes(appraisal.appraisalStatus)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${tab === 'manager'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  <Users size={15} />
                  Manager
                </button>
              </div>

              {/* Review Content */}
              <Card className="border-none shadow-lg shadow-slate-200/40 overflow-hidden">
                <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 px-6 py-4">
                  <p className="text-sm text-slate-500">
                    {tab === 'self' ? (
                      <>Self Review by — <span className="text-indigo-600 font-semibold">{appraisal.employeeName}</span></>
                    ) : (
                      <>Manager Review by — <span className="text-indigo-600 font-semibold">{appraisal.managerName}</span></>
                    )}
                  </p>
                </div>
                <CardContent className="p-6 space-y-4">
                  {tab === 'self' ? (
                    <>
                      <InfoBlock label="Achievements" text={appraisal.achievements} color="bg-green-50 border-green-200" labelColor="text-green-800" />
                      <InfoBlock label="What To Improve" text={appraisal.whatToImprove} color="bg-amber-50 border-amber-200" labelColor="text-amber-800" />
                      <InfoBlock label="What Went Well" text={appraisal.whatWentWell} color="bg-blue-50 border-blue-200" labelColor="text-blue-800" />
                      <InfoBlock label="Skills / Notes" text={null} color="bg-purple-50 border-purple-200" labelColor="text-purple-800" placeholder="No skills noted." />
                    </>
                  ) : (
                    <>
                      <InfoBlock label="Strengths" text={appraisal.managerStrengths} color="bg-green-50 border-green-200" labelColor="text-green-800" />
                      <InfoBlock label="Areas for Improvement" text={appraisal.managerImprovements} color="bg-amber-50 border-amber-200" labelColor="text-amber-800" />
                      <InfoBlock label="Overall Comments" text={appraisal.managerComments} color="bg-blue-50 border-blue-200" labelColor="text-blue-800" />
                    </>
                  )}
                </CardContent>
              </Card>

              {/* HR Final Verdict Section */}
              {['APPROVED', 'ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && appraisal.hrComments && (
                <Card className="border-none shadow-lg shadow-indigo-200/30 overflow-hidden bg-indigo-600">
                  <div className="px-6 py-4 flex items-center gap-3">
                    <Shield size={20} className="text-indigo-100" />
                    <h3 className="text-white font-bold tracking-tight">HR Final Verdict & Calibration</h3>
                  </div>
                  <CardContent className="px-6 pb-6 pt-2">
                    <p className="text-indigo-50 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap">
                      {appraisal.hrComments}
                    </p>
                  </CardContent>
                </Card>
              )}



              {/* Rating Footer */}
              <Card className="border-none shadow-md shadow-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {tab === 'self' ? 'Self Rating' : 'Manager Rating'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <RatingStars value={tab === 'self' ? (appraisal.selfRating ?? 0) : (appraisal.managerRating ?? 0)} readonly />
                      <span className="text-3xl font-extrabold text-indigo-600 tracking-tight">
                        {tab === 'self'
                          ? (appraisal.selfRating?.toFixed(1) ?? '—')
                          : (appraisal.managerRating?.toFixed(1) ?? '—')
                        }
                        <span className="text-base font-normal text-slate-400 ml-1">/ 5</span>
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 bg-white/70 px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                    <span className="font-semibold text-slate-700">Cycle:</span> {appraisal.cycleName}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  )
}

// Helper component for colored info blocks
function InfoBlock({
  label,
  text,
  color,
  labelColor,
  placeholder = 'Not provided.',
}: {
  label: string
  text: string | null
  color: string
  labelColor: string
  placeholder?: string
}) {
  return (
    <div className={`rounded-xl border p-4 ${color}`}>
      <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>{label}</p>
      <p className="text-slate-700 text-sm leading-relaxed">{text || placeholder}</p>
    </div>
  )
}

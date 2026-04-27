import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppraisalById, acknowledgeAppraisal } from '../../api/appraisals'
import { getGoalsByAppraisal, updateGoalProgress } from '../../api/goals'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/StatusBadge'
import { RatingStars } from '../../components/RatingStars'

import { Dialog } from '../../components/ui/dialog'
import { Select } from '../../components/ui/select'
import { format } from 'date-fns'
import { ArrowLeft, CheckCircle, FileEdit, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import type { Goal } from '../../types'

const goalStatusColor: Record<string, string> = {
  NOT_STARTED: 'bg-slate-100 text-slate-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export function EmployeeAppraisalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const appraisalId = Number(id)

  const [progressGoal, setProgressGoal] = useState<Goal | null>(null)
  const [progressForm, setProgressForm] = useState({ progressPercent: 0, status: 'IN_PROGRESS' })

  const { data: appraisal, isLoading } = useQuery({
    queryKey: ['appraisal', appraisalId],
    queryFn: () => getAppraisalById(appraisalId, user!.id),
    enabled: !!user,
  })

  const { data: goals = [] } = useQuery({
    queryKey: ['goals', appraisalId],
    queryFn: () => getGoalsByAppraisal(appraisalId),
  })


  const acknowledge = useMutation({
    mutationFn: () => acknowledgeAppraisal(appraisalId, user!.id),
    onSuccess: () => {
      toast.success('Appraisal acknowledged')
      qc.invalidateQueries({ queryKey: ['appraisal', appraisalId] })
      qc.invalidateQueries({ queryKey: ['my-appraisals'] })
    },
    onError: () => toast.error('Failed to acknowledge'),
  })

  const updateProgress = useMutation({
    mutationFn: () => updateGoalProgress(progressGoal!.id, user!.id, progressForm),
    onSuccess: () => {
      toast.success('Progress updated')
      setProgressGoal(null)
      qc.invalidateQueries({ queryKey: ['goals', appraisalId] })
    },
    onError: () => toast.error('Failed to update progress'),
  })

  const openProgress = (g: Goal) => {
    setProgressGoal(g)
    setProgressForm({ progressPercent: g.progressPercent, status: g.status })
  }

  if (isLoading) return <div className="text-slate-500 p-6">Loading...</div>
  if (!appraisal) return <div className="text-slate-500 p-6">Appraisal not found.</div>

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /></Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{appraisal.cycleName}</h1>
          <p className="text-slate-500 text-sm">Manager: {appraisal.managerName}</p>
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cycle Period</p>
            <p className="font-semibold text-slate-900">
              {format(new Date(appraisal.cycleStartDate), 'MMM d')} — {format(new Date(appraisal.cycleEndDate), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
            <div className="mt-1"><StatusBadge status={appraisal.appraisalStatus} /></div>
          </div>
          {appraisal.submittedAt && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Submitted</p>
              <p className="text-sm text-slate-700">{format(new Date(appraisal.submittedAt), 'MMM d, yyyy')}</p>
            </div>
          )}
          {appraisal.approvedAt && (
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Approved</p>
              <p className="text-sm text-slate-700">{format(new Date(appraisal.approvedAt), 'MMM d, yyyy')}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Draft / Pending action — continue self-assessment */}
      {['PENDING', 'EMPLOYEE_DRAFT'].includes(appraisal.appraisalStatus) && (
        <Card className="border-indigo-200 bg-indigo-50/50">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                {appraisal.appraisalStatus === 'EMPLOYEE_DRAFT'
                  ? <FileEdit size={18} className="text-indigo-600" />
                  : <Clock size={18} className="text-indigo-600" />}
              </div>
              <div>
                <p className="font-semibold text-indigo-900">
                  {appraisal.appraisalStatus === 'EMPLOYEE_DRAFT' ? 'Draft saved — not yet submitted' : 'Self-assessment not started'}
                </p>
                <p className="text-sm text-indigo-600">
                  {appraisal.appraisalStatus === 'EMPLOYEE_DRAFT'
                    ? 'Your draft has been saved. Click below to continue editing and submit when ready.'
                    : 'Click below to start your self-assessment for this appraisal cycle.'}
                </p>
              </div>
            </div>

            {/* Show draft preview if available */}
            {appraisal.appraisalStatus === 'EMPLOYEE_DRAFT' && appraisal.whatWentWell && (
              <div className="grid grid-cols-1 gap-2 pt-2 border-t border-indigo-200">
                {appraisal.whatWentWell && (
                  <div><p className="text-xs text-indigo-500 font-medium">What Went Well (draft)</p><p className="text-sm text-slate-700 bg-white rounded p-2 mt-0.5">{appraisal.whatWentWell}</p></div>
                )}
                {appraisal.achievements && (
                  <div><p className="text-xs text-indigo-500 font-medium">Achievements (draft)</p><p className="text-sm text-slate-700 bg-white rounded p-2 mt-0.5">{appraisal.achievements}</p></div>
                )}
              </div>
            )}

            <Button
              className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => navigate(`/employee/appraisals/${appraisalId}/self-assessment`)}
            >
              <FileEdit size={16} />
              {appraisal.appraisalStatus === 'EMPLOYEE_DRAFT' ? 'Continue & Edit Draft' : 'Start Self-Assessment'}
            </Button>
          </CardContent>
        </Card>
      )}

      {['SELF_SUBMITTED','MANAGER_REVIEWED','APPROVED','ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && (
        <Card>
          <CardHeader><CardTitle>Your Self Assessment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">What Went Well</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.whatWentWell || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">What To Improve</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.whatToImprove || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Achievements</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.achievements || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Self Rating</p>
              <RatingStars value={appraisal.selfRating || 0} readonly />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manager Review */}
      {['MANAGER_REVIEWED','APPROVED','ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && (
        <Card>
          <CardHeader><CardTitle>Manager Review</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Strengths</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.managerStrengths || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Areas for Improvement</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.managerImprovements || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Overall Comments</p>
              <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.managerComments || '—'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-700 mb-1">Manager Rating</p>
              <RatingStars value={appraisal.managerRating || 0} readonly />
            </div>
          </CardContent>
        </Card>
      )}

      {/* HR Final Comments */}
      {['APPROVED', 'ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && appraisal.hrComments && (
        <Card className="border-indigo-100 bg-indigo-50/30">
          <CardHeader><CardTitle className="text-indigo-900">HR Final Review & Comments</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-700 bg-white border border-indigo-100 rounded-lg p-4 text-sm leading-relaxed shadow-sm">
              {appraisal.hrComments}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Goals */}
      <Card>
        <CardHeader><CardTitle>Goals ({goals.length})</CardTitle></CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No goals set yet.</p>
          ) : (
            <div className="space-y-3">
              {goals.map(g => (
                <div key={g.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900">{g.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{g.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {format(new Date(g.dueDate), 'MMM d, yyyy')}</p>
                      {g.managerRemarks && (
                        <div className="mt-3 p-2 bg-blue-50/50 border border-blue-100 rounded text-sm text-slate-700">
                          <span className="font-medium text-blue-800 text-xs uppercase mr-2">Manager:</span> {g.managerRemarks}
                        </div>
                      )}
                      {g.employeeRemarks && (
                        <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded text-sm text-slate-600">
                          <span className="font-medium text-slate-500 text-xs uppercase mr-2">You:</span> {g.employeeRemarks}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${goalStatusColor[g.status]}`}>{g.status.replace('_', ' ')}</span>
                      {g.status !== 'COMPLETED' && g.status !== 'CANCELLED' && (
                        <Button size="sm" variant="outline" onClick={() => openProgress(g)}>Update</Button>
                      )}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Acknowledge */}
      {appraisal.appraisalStatus === 'APPROVED' && (
        <div className="flex justify-end">
          <Button onClick={() => acknowledge.mutate()} disabled={acknowledge.isPending} className="gap-2">
            <CheckCircle size={16} />
            {acknowledge.isPending ? 'Acknowledging...' : 'Acknowledge Appraisal'}
          </Button>
        </div>
      )}

      {/* Progress Update Dialog */}
      <Dialog open={!!progressGoal} onClose={() => setProgressGoal(null)} title={`Update Progress — ${progressGoal?.title ?? ''}`}>
          <form onSubmit={e => { e.preventDefault(); updateProgress.mutate() }} className="space-y-4">

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <Select value={progressForm.status} onChange={e => setProgressForm(f => ({ ...f, status: e.target.value }))}>
                <option value="NOT_STARTED">Not Started</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </Select>
            </div>
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={() => setProgressGoal(null)}>Cancel</Button>
              <Button type="submit" disabled={updateProgress.isPending}>Save</Button>
            </div>
          </form>
      </Dialog>
    </div>
  )
}

import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppraisalById, approveAppraisal } from '../../api/appraisals'
import { getGoalsByAppraisal } from '../../api/goals'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/StatusBadge'
import { RatingStars } from '../../components/RatingStars'

import { format } from 'date-fns'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { Textarea } from '../../components/ui/textarea'

export function HRAppraisalDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const appraisalId = Number(id)
  const [hrComments, setHrComments] = useState('')

  const { data: appraisal, isLoading } = useQuery({
    queryKey: ['appraisal', appraisalId],
    queryFn: () => getAppraisalById(appraisalId, user!.id),
    enabled: !!user,
  })

  const { data: goals = [] } = useQuery({
    queryKey: ['goals', appraisalId],
    queryFn: () => getGoalsByAppraisal(appraisalId),
    enabled: !!appraisalId,
  })


  const approve = useMutation({
    mutationFn: () => approveAppraisal(appraisalId, hrComments),
    onSuccess: () => { toast.success('Appraisal approved'); qc.invalidateQueries({ queryKey: ['appraisal', appraisalId] }) },
    onError: () => toast.error('Failed to approve'),
  })

  if (isLoading) return <div className="text-slate-500 p-6">Loading...</div>
  if (!appraisal) return <div className="text-slate-500 p-6">Appraisal not found.</div>

  const goalStatusColor: Record<string, string> = {
    NOT_STARTED: 'bg-slate-100 text-slate-700',
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700',
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /></Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appraisal Detail</h1>
          <p className="text-slate-500 text-sm">HR read-only view</p>
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="pt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Employee</p>
            <p className="font-semibold text-slate-900">{appraisal.employeeName}</p>
            <p className="text-sm text-slate-500">{appraisal.employeeJobTitle} {appraisal.employeeDepartment ? `· ${appraisal.employeeDepartment}` : ''}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Manager</p>
            <p className="font-semibold text-slate-900">{appraisal.managerName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cycle</p>
            <p className="font-semibold text-slate-900">{appraisal.cycleName}</p>
            <p className="text-sm text-slate-500">
              {format(new Date(appraisal.cycleStartDate), 'MMM d, yyyy')} — {format(new Date(appraisal.cycleEndDate), 'MMM d, yyyy')}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Status</p>
            <div className="mt-1"><StatusBadge status={appraisal.appraisalStatus} /></div>
          </div>
        </CardContent>
      </Card>

      {/* Self Assessment */}
      {['SELF_SUBMITTED','MANAGER_REVIEWED','APPROVED','ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && (
        <Card>
          <CardHeader><CardTitle>Self Assessment</CardTitle></CardHeader>
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

      {/* HR Final Comments (Read-only if approved) */}
      {['APPROVED', 'ACKNOWLEDGED'].includes(appraisal.appraisalStatus) && appraisal.hrComments && (
        <Card>
          <CardHeader><CardTitle>HR Final Comments</CardTitle></CardHeader>
          <CardContent>
            <p className="text-slate-600 bg-slate-50 rounded p-3 text-sm">{appraisal.hrComments}</p>
          </CardContent>
        </Card>
      )}

      {/* Goals */}
      <Card>
        <CardHeader><CardTitle>Goals ({goals.length})</CardTitle></CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">No goals set for this appraisal.</p>
          ) : (
            <div className="space-y-3">
              {goals.map(g => (
                <div key={g.id} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-900">{g.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{g.description}</p>
                      <p className="text-xs text-slate-400 mt-1">Due: {format(new Date(g.dueDate), 'MMM d, yyyy')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${goalStatusColor[g.status]}`}>{g.status.replace('_', ' ')}</span>
                  </div>

                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Approve Action */}
      {appraisal.appraisalStatus === 'MANAGER_REVIEWED' && (
        <Card className="border-indigo-200 bg-indigo-50">
          <CardHeader><CardTitle className="text-indigo-900">Final Approval</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HR Final Comments / Recommendation *</label>
              <Textarea 
                placeholder="Add any final notes, promotion recommendations, or calibration comments here..."
                value={hrComments}
                onChange={(e) => setHrComments(e.target.value)}
                rows={3}
                className="bg-white"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={() => approve.mutate()} disabled={approve.isPending || !hrComments.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                <CheckCircle size={16} />
                {approve.isPending ? 'Approving...' : 'Approve & Finalize'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

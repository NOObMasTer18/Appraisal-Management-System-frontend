import { useState } from 'react'
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAppraisalById, submitSelfAssessment, saveSelfAssessmentDraft } from '../../api/appraisals'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Textarea } from '../../components/ui/textarea'
import { RatingStars } from '../../components/RatingStars'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'

export function SelfAssessmentPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const appraisalId = Number(id)

  const [form, setForm] = useState({ whatWentWell: '', whatToImprove: '', achievements: '', selfRating: 0 })

  const { data: appraisal, isLoading } = useQuery({
    queryKey: ['appraisal', appraisalId],
    queryFn: () => getAppraisalById(appraisalId, user!.id),
    enabled: !!user,
  })

  useEffect(() => {
    if (appraisal) {
      setForm({
        whatWentWell: appraisal.whatWentWell || '',
        whatToImprove: appraisal.whatToImprove || '',
        achievements: appraisal.achievements || '',
        selfRating: appraisal.selfRating || 0,
      })
    }
  }, [appraisal])

  const submit = useMutation({
    mutationFn: () => submitSelfAssessment(appraisalId, user!.id, form),
    onSuccess: () => {
      toast.success('Self assessment submitted')
      qc.invalidateQueries({ queryKey: ['my-appraisals'] })
      qc.invalidateQueries({ queryKey: ['appraisal', appraisalId] })
      navigate(`/employee/appraisals/${appraisalId}`)
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to submit'),
  })

  const saveDraft = useMutation({
    mutationFn: () => saveSelfAssessmentDraft(appraisalId, user!.id, form),
    onSuccess: () => {
      toast.success('Draft saved successfully')
      qc.invalidateQueries({ queryKey: ['my-appraisals'] })
      qc.invalidateQueries({ queryKey: ['appraisal', appraisalId] })
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to save draft'),
  })

  if (isLoading) return <div className="text-slate-500 p-6">Loading...</div>
  if (!appraisal) return <div className="text-slate-500 p-6">Appraisal not found.</div>
  if (appraisal.appraisalStatus !== 'PENDING' && appraisal.appraisalStatus !== 'EMPLOYEE_DRAFT') {
    navigate(`/employee/appraisals/${appraisalId}`)
    return null
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}><ArrowLeft size={16} /></Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Self Assessment</h1>
          <p className="text-slate-500 text-sm">{appraisal.cycleName} · Manager: {appraisal.managerName}</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Cycle</p>
            <p className="font-medium text-slate-900">{appraisal.cycleName}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide">Period</p>
            <p className="font-medium text-slate-900">
              {format(new Date(appraisal.cycleStartDate), 'MMM d')} — {format(new Date(appraisal.cycleEndDate), 'MMM d, yyyy')}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Fill Your Self Assessment</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); submit.mutate() }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What Went Well *</label>
              <Textarea
                value={form.whatWentWell}
                onChange={e => setForm(f => ({ ...f, whatWentWell: e.target.value }))}
                required rows={4}
                placeholder="Describe your key contributions and successes..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">What Could I Improve *</label>
              <Textarea
                value={form.whatToImprove}
                onChange={e => setForm(f => ({ ...f, whatToImprove: e.target.value }))}
                required rows={4}
                placeholder="Be honest about areas where you could have done better..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Key Achievements *</label>
              <Textarea
                value={form.achievements}
                onChange={e => setForm(f => ({ ...f, achievements: e.target.value }))}
                required rows={4}
                placeholder="List specific achievements, metrics, projects completed..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Self Rating *</label>
              <RatingStars value={form.selfRating} onChange={v => setForm(f => ({ ...f, selfRating: v }))} />
              {form.selfRating === 0 && <p className="text-xs text-slate-400 mt-1">Click a star to rate yourself</p>}
            </div>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => saveDraft.mutate()} 
                disabled={saveDraft.isPending || submit.isPending} 
                className="w-1/2"
              >
                {saveDraft.isPending ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button 
                type="submit" 
                disabled={submit.isPending || saveDraft.isPending || form.selfRating === 0} 
                className="w-1/2"
              >
                {submit.isPending ? 'Submitting...' : 'Submit Self Assessment'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

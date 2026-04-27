import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getDepartments } from '../../api/departments'
import { createBulkCycle } from '../../api/appraisals'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Select } from '../../components/ui/select'
import { toast } from 'sonner'

export function CreateAppraisalPage() {
  const navigate = useNavigate()

  const { data: departments = [] } = useQuery({ queryKey: ['departments'], queryFn: getDepartments })

  const [form, setForm] = useState({ cycleName: '', cycleStartDate: '', cycleEndDate: '', departmentId: '' })

  const createBulk = useMutation({
    mutationFn: () => createBulkCycle({
      cycleName: form.cycleName,
      cycleStartDate: form.cycleStartDate,
      cycleEndDate: form.cycleEndDate,
      departmentId: form.departmentId ? Number(form.departmentId) : undefined
    }),
    onSuccess: (data) => {
      toast.success(`Bulk cycle created for ${data.count || 'all'} employees. ${data.skippedAlreadyExists > 0 ? `Skipped ${data.skippedAlreadyExists} existing.` : ''}`);
      navigate('/hr/dashboard')
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create bulk cycle'),
  })

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create Appraisal</h1>
        <p className="text-slate-500 text-sm mt-1">Start a new appraisal cycle for the company or a specific department</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 mb-4 pb-4">
          <CardTitle>Cycle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={e => { e.preventDefault(); createBulk.mutate() }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cycle Name *</label>
              <Input placeholder="e.g. Q1 2026" value={form.cycleName} onChange={e => setForm(f => ({ ...f, cycleName: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date *</label>
                <Input type="date" value={form.cycleStartDate} onChange={e => setForm(f => ({ ...f, cycleStartDate: e.target.value }))} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">End Date *</label>
                <Input type="date" value={form.cycleEndDate} onChange={e => setForm(f => ({ ...f, cycleEndDate: e.target.value }))} required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Group *</label>
              <Select value={form.departmentId} onChange={e => setForm(f => ({ ...f, departmentId: e.target.value }))}>
                <option value="">All Employees</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name} Department</option>)}
              </Select>
            </div>

            <Button type="submit" disabled={createBulk.isPending} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {createBulk.isPending ? 'Generating Appraisals...' : 'Generate Appraisals'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMyGoals, updateGoalProgress } from '../../api/goals'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Select } from '../../components/ui/select'
import { format, isPast } from 'date-fns'
import { toast } from 'sonner'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle, Clock, PlayCircle, XCircle } from 'lucide-react'
import type { Goal } from '../../types'

export function EmployeeGoalsPage() {
  const { user } = useAuth()
  const qc = useQueryClient()

  // Track the local status and remarks state for each row. Key is goal ID.
  const [localStatus, setLocalStatus] = useState<Record<number, string>>({})
  const [localRemarks, setLocalRemarks] = useState<Record<number, string>>({})
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['my-goals', user?.id],
    queryFn: () => getMyGoals(user!.id),
    enabled: !!user,
  })

  const update = useMutation({
    mutationFn: ({ id, status, employeeRemarks }: { id: number, status: string, employeeRemarks?: string }) =>
      updateGoalProgress(id, user!.id, { status, employeeRemarks }),
    onSuccess: () => {
      toast.success('Action saved successfully')
      qc.invalidateQueries({ queryKey: ['my-goals'] })
      setUpdatingId(null)
    },
    onError: () => {
      toast.error('Failed to update')
      setUpdatingId(null)
    },
  })

  const handleStatusChange = (id: number, status: string) => {
    setLocalStatus(prev => ({ ...prev, [id]: status }))
  }

  const handleRemarksChange = (id: number, remarks: string) => {
    setLocalRemarks(prev => ({ ...prev, [id]: remarks }))
  }

  const handleSave = (goal: Goal) => {
    const currentLocalStatus = localStatus[goal.id] || goal.status
    const currentLocalRemarks = localRemarks[goal.id] ?? goal.employeeRemarks ?? ''

    if (currentLocalStatus === goal.status && currentLocalRemarks === (goal.employeeRemarks ?? '')) {
      toast.info('No changes made')
      return
    }
    setUpdatingId(goal.id)
    update.mutate({ id: goal.id, status: currentLocalStatus, employeeRemarks: currentLocalRemarks })
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <span className="flex items-center gap-1 text-green-700 bg-green-100/50 px-2.5 py-1 rounded-md text-xs font-semibold"><CheckCircle size={14} /> Completed</span>
      case 'IN_PROGRESS': return <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-semibold"><PlayCircle size={14} /> In Progress</span>
      case 'CANCELLED': return <span className="flex items-center gap-1 text-red-700 bg-red-100/50 px-2.5 py-1 rounded-md text-xs font-semibold"><XCircle size={14} /> Cancelled</span>
      default: return <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md text-xs font-semibold"><Clock size={14} /> Not Started</span>
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Goals</h1>
        <p className="text-slate-500 text-sm mt-1"> Targets Assigned </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-12 bg-slate-100 rounded-lg"></div>
          <div className="h-24 bg-slate-100 rounded-lg"></div>
          <div className="h-24 bg-slate-100 rounded-lg"></div>
        </div>
      ) : goals.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="text-center py-16 text-slate-400">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <CheckCircle className="text-slate-300" />
            </div>
            <p className="text-lg font-medium text-slate-600">No targets assigned yet</p>
            <p className="text-sm mt-1">Your manager will assign goals to you for your upcoming appraisal.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th scope="col" className="px-4 py-4 font-semibold w-12 text-center">No.</th>
                  <th scope="col" className="px-4 py-4 font-semibold min-w-[200px]">Description</th>
                  <th scope="col" className="px-4 py-4 font-semibold text-center whitespace-nowrap">Target Date</th>
                  <th scope="col" className="px-4 py-4 font-semibold min-w-[150px]">Manager Remarks</th>
                  <th scope="col" className="px-4 py-4 font-semibold text-center">Status</th>
                  <th scope="col" className="px-4 py-4 font-semibold min-w-[200px]">Employee Remarks</th>
                  <th scope="col" className="px-4 py-4 font-semibold text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {goals.map((g, idx) => {
                  const overdue = isPast(new Date(g.dueDate)) && g.status !== 'COMPLETED' && g.status !== 'CANCELLED'
                  const currentStatus = localStatus[g.id] || g.status
                  const currentRemarks = localRemarks[g.id] ?? g.employeeRemarks ?? ''
                  const isCompleted = currentStatus === 'COMPLETED'

                  return (
                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-5 text-center text-slate-500 font-medium align-top">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-5 align-top">
                        <div className="font-semibold text-slate-900 bg-slate-100/50 inline-block px-2.5 py-1 rounded text-sm mb-2 border border-slate-200/60 shadow-sm">
                          {g.title}
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{g.description}</p>
                      </td>
                      <td className="px-4 py-5 text-center whitespace-nowrap align-top">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`font-medium ${overdue ? 'text-red-600' : 'text-slate-700'}`}>
                            {format(new Date(g.dueDate), 'yyyy-MM-dd')}
                          </span>
                          {overdue && (
                            <span className="flex items-center text-[10px] uppercase font-bold tracking-wider text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                              Overdue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 align-top">
                        {g.managerRemarks ? (
                          <div className="bg-blue-50/50 border border-blue-100 rounded text-sm p-3 text-slate-700">
                            {g.managerRemarks}
                          </div>
                        ) : (
                          <div className="text-slate-400 text-sm italic">No remarks</div>
                        )}
                      </td>
                      <td className="px-4 py-5 text-center align-top">
                        <div className="flex flex-col items-center gap-3">
                          {g.status === 'COMPLETED' || g.status === 'CANCELLED' ? (
                            getStatusDisplay(g.status)
                          ) : (
                            <Select
                              value={currentStatus}
                              onChange={e => handleStatusChange(g.id, e.target.value)}
                              className={`h-9 text-sm font-medium w-[130px] focus:ring-indigo-500 focus:border-indigo-500 ${isCompleted ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                            >
                              <option value="NOT_STARTED">Not Started</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </Select>
                          )}
                          {(currentStatus === 'COMPLETED' && g.status !== 'COMPLETED') && (
                            <div className="animate-in fade-in slide-in-from-top-1">
                              {getStatusDisplay('COMPLETED')}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-5 align-top">
                        {g.status === 'COMPLETED' || g.status === 'CANCELLED' ? (
                          <div className="bg-slate-50 border border-slate-200 rounded text-sm p-3 text-slate-600">
                            {g.employeeRemarks || <span className="italic text-slate-400">No remarks</span>}
                          </div>
                        ) : (
                          <textarea
                            className="w-full text-sm border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                            placeholder="Add your remarks..."
                            value={currentRemarks}
                            onChange={e => handleRemarksChange(g.id, e.target.value)}
                          />
                        )}
                      </td>
                      <td className="px-4 py-5 text-center align-top">
                        {g.status === 'COMPLETED' || g.status === 'CANCELLED' ? (
                          <div className="inline-flex items-center justify-center px-4 py-2 border border-slate-200 bg-slate-100 text-slate-400 text-xs font-medium rounded-md shadow-sm w-full opacity-70 cursor-not-allowed">
                            Submitted
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            className={`w-full text-xs font-medium transition-all ${(currentStatus !== g.status || currentRemarks !== (g.employeeRemarks ?? ''))
                              ? 'bg-indigo-600 hover:bg-indigo-700 shadow-md text-white'
                              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'}`}
                            onClick={() => handleSave(g)}
                            disabled={updatingId === g.id || (currentStatus === g.status && currentRemarks === (g.employeeRemarks ?? ''))}
                          >
                            {updatingId === g.id ? 'Saving...' : 'Submit'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getAllAppraisals } from '../../api/appraisals'
import { Card, CardContent, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { StatusBadge } from '../../components/StatusBadge'
import { format } from 'date-fns'
import { ClipboardCheck } from 'lucide-react'

export function AllAppraisalsPage() {
  const navigate = useNavigate()

  const { data: appraisals = [] } = useQuery({
    queryKey: ['all-appraisals'],
    queryFn: getAllAppraisals,
  })

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">All Appraisals</h1>
        <p className="text-slate-500 font-medium">View and manage all employee appraisals across the company.</p>
      </div>

      <Card className="border-none shadow-lg shadow-slate-200/40 overflow-hidden animate-fade-in-up">
        <div className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-xl">All Appraisals</CardTitle>
          <Button onClick={() => navigate('/hr/appraisals/create')} className="bg-indigo-600 hover:bg-indigo-700 shadow-md">
            Create Appraisal
          </Button>
        </div>
        <CardContent className="p-0">
          {appraisals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <ClipboardCheck size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No appraisals found.</p>
              <p className="text-slate-400 text-sm mt-1">Create an appraisal to kickstart the cycle.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full custom-scrollbar">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-wider text-[11px] font-bold text-slate-500">
                  <tr>
                    {['Employee', 'Department', 'Manager', 'Cycle', 'Status', 'Actions'].map(h => (
                      <th key={h} className="py-4 px-6">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {appraisals.map((a, i) => (
                    <tr key={a.id} className="hover:bg-indigo-50/30 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className="py-4 px-6">
                        <div className="font-bold text-slate-900">{a.employeeName}</div>
                        <div className="text-[11px] text-slate-500 mt-1">{format(new Date(a.createdAt), 'MMM d, yyyy')}</div>
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-600">
                        {a.employeeDepartment ? <span className="text-indigo-600/80 bg-indigo-50 px-2 py-0.5 rounded-md">{a.employeeDepartment}</span> : '—'}
                      </td>
                      <td className="py-4 px-6 text-slate-700 font-medium">{a.managerName}</td>
                      <td className="py-4 px-6 text-slate-700">{a.cycleName}</td>
                      <td className="py-4 px-6"><StatusBadge status={a.appraisalStatus} /></td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                            onClick={() => navigate(`/hr/appraisals/${a.id}`)}
                          >
                            View
                          </Button>
                        </div>
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

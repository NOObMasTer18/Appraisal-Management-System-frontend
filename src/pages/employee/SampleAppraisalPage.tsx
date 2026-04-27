
import { Card, CardContent} from '../../components/ui/card'
import { RatingStars } from '../../components/RatingStars'
import { BookOpen } from 'lucide-react'

const template = {
  whatWentWell: `I successfully led the migration of our authentication module to JWT-based security, completing it within the sprint timeline. I collaborated closely with the backend team to ensure zero downtime during the transition. I also mentored two junior developers on REST API best practices, which improved our team's code review turnaround by 30%.`,
  whatToImprove: `I struggled with time estimation on complex tasks — I underestimated the database migration by 2 days, which caused a minor delay. Going forward, I plan to break large tasks into smaller sub-tasks and add a 20% buffer to my estimates. I also want to improve my documentation habits, as I received feedback that my code comments were sparse.`,
  achievements: `• Delivered JWT authentication module on time (Q1 sprint goal)
• Reduced API response time by 35% through query optimization
• Completed AWS Cloud Practitioner certification
• Resolved 12 critical bugs from the backlog, improving app stability
• Onboarded and mentored 2 new team members`,
  selfRating: 4,
}

export function SampleAppraisalPage() {
  

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-zinc-400" />
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Sample Self Appraisal</h1>
        </div>
        <p className="text-zinc-500 text-sm">
          A high-quality example of how to document your contributions and reflect on your growth.
        </p>
      </div>

      <Card className="overflow-hidden border-none shadow-xl shadow-zinc-200/50">
        <div className="bg-zinc-900 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-400">Sample Template</p>
              <h2 className="text-xl font-bold mt-1">Software Engineer (L2)</h2>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
              <RatingStars value={template.selfRating} readonly />
              <span className="text-sm font-semibold">4 / 5</span>
            </div>
          </div>
        </div>

        <CardContent className="p-8 space-y-8 bg-white">
          <div className="bg-blue-50/50 rounded-xl p-4 text-xs text-blue-700 border border-blue-100 flex items-start gap-3">
            <span className="bg-blue-100 p-1 rounded">ℹ️</span>
            <p className="leading-relaxed">
              This sample demonstrates the ideal level of detail, specificity, and tone expected in a self-appraisal. 
              Notice the use of <strong>metrics</strong>, <strong>goal alignment</strong>, and <strong>honest self-reflection</strong>.
            </p>
          </div>

          <div className="grid gap-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-indigo-500 rounded-full" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Goal Progress Summary</h3>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <p className="text-xs font-bold text-emerald-600 uppercase mb-2">Completed</p>
                  <ul className="text-sm text-zinc-700 space-y-1">
                    <li>• Lead JWT Migration (100%)</li>
                    <li>• API Query Optimization (100%)</li>
                  </ul>
                </div>
                <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100">
                  <p className="text-xs font-bold text-blue-600 uppercase mb-2">In Progress</p>
                  <ul className="text-sm text-zinc-700 space-y-1">
                    <li>• Unit Test Coverage 80% (Currently 65%)</li>
                    <li>• Documentation Overhaul (40%)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-emerald-500 rounded-full" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">What Went Well</h3>
              </div>
              <p className="text-zinc-700 leading-relaxed bg-zinc-50 rounded-xl p-6 border border-zinc-100 whitespace-pre-line text-sm">
                {template.whatWentWell}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-amber-500 rounded-full" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">What Could I Improve</h3>
              </div>
              <p className="text-zinc-700 leading-relaxed bg-zinc-50 rounded-xl p-6 border border-zinc-100 whitespace-pre-line text-sm">
                {template.whatToImprove}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-1 bg-blue-500 rounded-full" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">Key Achievements</h3>
              </div>
              <p className="text-zinc-700 leading-relaxed bg-zinc-50 rounded-xl p-6 border border-zinc-100 whitespace-pre-line text-sm">
                {template.achievements}
              </p>
            </section>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tips Side Note */}
      <div className="rounded-2xl border border-zinc-200 p-8 bg-gradient-to-br from-zinc-50 to-white">
        <h3 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
            Professional Tip
        </h3>
        <ul className="space-y-3 text-sm text-zinc-600">
          <li className="flex gap-2">
            <span className="text-zinc-900 font-bold">•</span>
            <span><strong>Use the "STAR" Method:</strong> Situation, Task, Action, Result for your achievements.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-900 font-bold">•</span>
            <span><strong>Quantify Impact:</strong> "Improved speed" (Okay) vs "Improved speed by 40%" (Great).</span>
          </li>
          <li className="flex gap-2">
            <span className="text-zinc-900 font-bold">•</span>
            <span><strong>Be Balanced:</strong> Too much praise looks arrogant; too much criticism looks unconfident.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

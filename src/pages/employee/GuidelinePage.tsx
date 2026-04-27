
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { RatingStars } from '../../components/RatingStars'
import {
  BookOpen, CheckCircle, AlertCircle, Lightbulb,
  Star, ArrowRight
} from 'lucide-react'
 
const tips = [
  {
    icon: CheckCircle,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    title: 'Be specific, not vague',
    desc: 'Instead of "I worked hard", write "I delivered the payment module 2 days ahead of schedule, reducing integration blockers for the team."',
  },
  {
    icon: Lightbulb,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    title: 'Use numbers when possible',
    desc: 'Metrics make your contributions tangible. "Reduced API response time by 40%" is stronger than "improved performance".',
  },
  {
    icon: AlertCircle,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Be honest about improvements',
    desc: 'Managers respect self-awareness. Acknowledging a real weakness and how you plan to address it shows maturity.',
  },
  {
    icon: Star,
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    title: 'Rate yourself fairly',
    desc: 'A 5/5 with no supporting evidence looks overconfident. A 3/5 with strong examples is more credible and opens a better conversation.',
  },
]
 
const steps = [
  { num: '01', title: 'Update Goal Progress', desc: 'Go to "My Appraisals" detail page and update the status of your active goals for this cycle.' },
  { num: '02', title: 'Review your work', desc: 'Look back at your tasks, commits, tickets, or notes from the cycle period.' },
  { num: '03', title: 'Fill What Went Well', desc: 'List your top 2-3 contributions. Focus on impact and goal attainment.' },
  { num: '04', title: 'Fill What Could I Improve', desc: 'Pick 1-2 honest areas. Show you understand the gap and have a plan.' },
  { num: '05', title: 'List Key Achievements', desc: 'Specific wins — projects shipped, problems solved, skills gained.' },
  { num: '06', title: 'Choose your rating', desc: 'Rate yourself 1-5 based on how well you met expectations this cycle.' },
  { num: '07', title: 'Save draft first', desc: 'Use "Save Draft" to save progress. Only click "Submit" when you\'re ready.' },
]
 
 
export function GuidelinePage() {
  const navigate = useNavigate()
  
 
  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-zinc-400" />
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Self Appraisal Guide</h1>
        </div>
        <p className="text-zinc-500 text-sm">
          Everything you need to write a strong, honest self-appraisal that helps your manager understand your contributions.
        </p>
      </div>
 
 
      {/* The 3 sections explained */}
      <Card>
        <CardHeader><CardTitle>The 3 Sections Explained</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                label: 'What Went Well',
                color: 'bg-emerald-50 border-emerald-200',
                labelColor: 'text-emerald-700',
                desc: 'Describe your key contributions, successes, and how you met your goals during this cycle.',
                prompts: [
                  'Which assigned goals did you complete?',
                  'What positive feedback did you get?',
                  'Where did you go above and beyond?',
                ],
              },
              {
                label: 'What Could I Improve',
                color: 'bg-amber-50 border-amber-200',
                labelColor: 'text-amber-700',
                desc: 'Honestly reflect on goals that were missed or areas where you could have done better.',
                prompts: [
                  'Which goals are still in progress and why?',
                  'What skills do you wish you developed?',
                  'What would you do differently?',
                ],
              },
              {
                label: 'Key Achievements',
                color: 'bg-blue-50 border-blue-200',
                labelColor: 'text-blue-700',
                desc: 'List concrete wins — certifications, features shipped, or specific goal milestones.',
                prompts: [
                  'What are you most proud of?',
                  'Did you complete any training?',
                  'What measurable results did you hit?',
                ],
              },
            ].map(({ label, color, labelColor, desc, prompts }) => (
              <div key={label} className={`rounded-xl border p-5 ${color} flex flex-col h-full`}>
                <p className={`text-[10px] font-bold uppercase tracking-wider mb-2 ${labelColor}`}>{label}</p>
                <p className="text-sm text-zinc-700 mb-4 leading-relaxed">{desc}</p>
                <div className="mt-auto space-y-2">
                  {prompts.map(p => (
                    <div key={p} className="flex items-start gap-2 text-xs text-zinc-600">
                      <span className="mt-0.5 shrink-0">→</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
 
      {/* How to rate yourself */}
      <Card>
        <CardHeader><CardTitle>How to Rate Yourself (1–5)</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { stars: 1, label: 'Below Expectations', desc: 'Missed most goals, significant gaps in performance.' },
              { stars: 2, label: 'Needs Improvement', desc: 'Partially met expectations, clear areas needing development.' },
              { stars: 3, label: 'Meets Expectations', desc: 'Delivered what was expected. Solid, reliable performance.' },
              { stars: 4, label: 'Exceeds Expectations', desc: 'Went beyond the role in several areas, strong contributions.' },
              { stars: 5, label: 'Outstanding', desc: 'Exceptional impact, exceeded all goals, role model performance.' },
            ].map(({ stars, label, desc }) => (
              <div key={stars} className="flex items-center gap-4">
                <RatingStars value={stars} readonly />
                <div>
                  <p className="text-sm font-medium text-zinc-900">{label}</p>
                  <p className="text-xs text-zinc-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
 
      {/* Tips */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-700 uppercase tracking-wider mb-3">Writing Tips</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tips.map(({ icon: Icon, color, bg, title, desc }) => (
            <div key={title} className={`rounded-xl border border-zinc-100 p-4 ${bg}`}>
              <div className="flex items-start gap-3">
                <Icon size={18} className={`${color} shrink-0 mt-0.5`} />
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Step by step */}
      <Card>
        <CardHeader><CardTitle>Step-by-Step Process</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {num}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900">{title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
 
 
      {/* CTA */}
      <div className="flex items-center justify-between bg-zinc-900 rounded-xl p-8 mt-4 shadow-lg shadow-zinc-200/50">
        <div>
          <p className="text-white font-semibold">Ready to write yours?</p>
          <p className="text-zinc-400 text-xs mt-0.5">Go to My Appraisals and click "Submit Self Assessment"</p>
        </div>
        <Button
          onClick={() => navigate('/employee/appraisals')}
          className="bg-white text-zinc-900 hover:bg-zinc-100 gap-2 shrink-0"
        >
          My Appraisals <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  )
}

import { cn } from '../../lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'purple' | 'blue'
  className?: string
}

const variantClasses = {
  default: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  secondary: 'bg-slate-50 text-slate-600 border-slate-200',
  destructive: 'bg-rose-50 text-rose-700 border-rose-100',
  outline: 'border border-slate-200 text-slate-600 bg-white',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  warning: 'bg-amber-50 text-amber-700 border-amber-100',
  purple: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  blue: 'bg-blue-50 text-blue-700 border-blue-100',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center rounded-lg px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border transition-colors', variantClasses[variant], className)}>
      {children}
    </span>
  )
}

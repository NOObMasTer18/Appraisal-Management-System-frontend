import { cn } from '../../lib/utils'

export function Progress({ value = 0, className }: { value?: number; className?: string }) {
  return (
    <div className={cn('w-full bg-slate-200 rounded-full h-2', className)}>
      <div
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

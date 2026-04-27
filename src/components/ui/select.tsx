import { cn } from '../../lib/utils'
import type { SelectHTMLAttributes } from 'react'

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 bg-white',
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

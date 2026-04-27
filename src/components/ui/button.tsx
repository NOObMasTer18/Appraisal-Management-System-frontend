import { cn } from '../../lib/utils'
import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses = {
  default: 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5',
  outline: 'border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900',
  ghost: 'text-slate-700 hover:bg-indigo-50 hover:text-indigo-700',
  destructive: 'bg-rose-500 text-white shadow-md shadow-rose-500/20 hover:bg-rose-600 hover:shadow-lg hover:-translate-y-0.5',
  secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 shadow-sm',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-[13px]',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({ variant = 'default', size = 'md', className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200 ease-in-out active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none cursor-pointer',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

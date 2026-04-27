import { Star } from 'lucide-react'
import { cn } from '../lib/utils'

interface RatingStarsProps {
  value: number
  onChange?: (v: number) => void
  readonly?: boolean
}

export function RatingStars({ value, onChange, readonly = false }: RatingStarsProps) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn('transition-colors', readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110')}
        >
          <Star
            size={20}
            className={cn(star <= value ? 'fill-amber-400 text-amber-400' : 'text-slate-300')}
          />
        </button>
      ))}
    </div>
  )
}

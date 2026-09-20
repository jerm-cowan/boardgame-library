import type { GameCategory } from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface CategoryKeyProps {
  categories: GameCategory[]
  className?: string
}

// Icon + name legend for charts (like CategoryMosaic) that identify categories by
// color/icon alone in the visualization itself, so names never need to be truncated.
export default function CategoryKey({ categories, className = '' }: CategoryKeyProps) {
  return (
    <div className={`flex flex-col gap-2.5 ${className}`}>
      {categories.map((category) => {
        const Icon = CATEGORY_ICON[category]
        const color = CATEGORY_ACCENT[category]
        return (
          <div key={category} className="flex items-center gap-1.5 text-sm">
            <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
            <span className="font-medium text-foreground">{category}</span>
          </div>
        )
      })}
    </div>
  )
}

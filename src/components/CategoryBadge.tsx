import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'
import type { GameCategory } from '../types/game'

interface CategoryBadgeProps {
  category: GameCategory
  /** 'dot' = small colored dot + icon + label (default). 'icon-only' omits the label. */
  variant?: 'dot' | 'icon-only'
  className?: string
}

// Shared category presentation (accent color + line icon) so the table, filters,
// detail drawer, chart legend, and neglected shelf all render categories identically.
export default function CategoryBadge({ category, variant = 'dot', className = '' }: CategoryBadgeProps) {
  const color = CATEGORY_ACCENT[category]
  const Icon = CATEGORY_ICON[category]

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
      {variant === 'dot' && <span>{category}</span>}
    </span>
  )
}

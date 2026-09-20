import type { CategoryCount } from '../lib/story'
import CategoryMosaic from './CategoryMosaic'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface TabletCategoryChartProps {
  breakdown: CategoryCount[]
}

// Tablet fallback: the same icon-only mosaic used on desktop, in the same mosaic-left,
// key-right order and spacing — just paired with a compact legend (label and value
// packed as close together as possible) instead of the desktop's wider side key.
export default function TabletCategoryChart({ breakdown }: TabletCategoryChartProps) {
  return (
    <div className="flex gap-5" aria-hidden="true">
      <div className="min-w-0 flex-1">
        <CategoryMosaic breakdown={breakdown} showValues={false} />
      </div>
      <div className="flex shrink-0 flex-col gap-3">
        {breakdown.map((entry) => {
          const Icon = CATEGORY_ICON[entry.category]
          const color = CATEGORY_ACCENT[entry.category]
          return (
            <div key={entry.category} className="flex items-center gap-1.5 text-sm">
              <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
              <span className="font-medium text-foreground">{entry.category}</span>
              <span className="tabular-nums text-muted-foreground">
                {Math.round(entry.percent)}% ({entry.count})
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
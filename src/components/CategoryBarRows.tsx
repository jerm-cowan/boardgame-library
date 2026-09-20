import type { CategoryCount } from '../lib/story'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface CategoryBarRowsProps {
  breakdown: CategoryCount[]
}

// Mobile fallback: one plain horizontal bar per category (mirrors the "Owned" rows in
// CollectVsPlayChart) rather than a single stacked bar — easier to read at small widths.
export default function CategoryBarRows({ breakdown }: CategoryBarRowsProps) {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {breakdown.map((entry) => {
        const Icon = CATEGORY_ICON[entry.category]
        const color = CATEGORY_ACCENT[entry.category]
        return (
          <div key={entry.category}>
            <div className="mb-1 flex items-center gap-1.5 text-sm font-medium text-foreground">
              <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
              {entry.category}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-popover">
                <div
                  className="h-3 rounded-full"
                  style={{ width: `${entry.percent}%`, backgroundColor: color }}
                />
              </div>
              <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
                {Math.round(entry.percent)}% ({entry.count})
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

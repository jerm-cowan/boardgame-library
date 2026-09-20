import { useMemo, useState } from 'react'
import type { CategoryShare } from '../lib/story'
import type { GameCategory } from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

type ViewMode = 'owned' | 'played'

interface CollectVsPlayChartProps {
  shares: CategoryShare[]
  highlighted: GameCategory | null
  onHighlightChange: (category: GameCategory | null) => void
}

const VIEW_LABELS: Record<ViewMode, string> = {
  owned: 'Owned Games',
  played: 'Played Games',
}

function BarRow({
  label,
  percent,
  emphasized,
  striped,
}: {
  label: string
  percent: number
  emphasized: boolean
  striped: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-popover">
        <div
          className={`h-3 rounded-full transition-opacity ${emphasized ? 'bg-foreground/80' : 'bg-foreground/40'}`}
          style={{
            width: `${percent}%`,
            backgroundImage: striped
              ? 'repeating-linear-gradient(45deg, currentColor 0 4px, transparent 4px 8px)'
              : undefined,
            backgroundSize: striped ? '8px 8px' : undefined,
          }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-xs text-muted-foreground">
        {Math.round(percent)}%
      </span>
    </div>
  )
}

export default function CollectVsPlayChart({ shares, highlighted, onHighlightChange }: CollectVsPlayChartProps) {
  const [view, setView] = useState<ViewMode>('owned')

  const sorted = useMemo(() => {
    const key = view === 'owned' ? 'collectionShare' : 'playShare'
    return [...shares].sort((a, b) => b[key] - a[key])
  }, [shares, view])

  return (
    <div className="space-y-4">
      <div className="inline-flex gap-1" role="group" aria-label="Chart view">
        {(Object.keys(VIEW_LABELS) as ViewMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={view === mode}
            onClick={() => setView(mode)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              view === mode
                ? 'bg-foreground/10 text-foreground shadow-sm shadow-black/40'
                : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
            }`}
          >
            {VIEW_LABELS[mode]}
          </button>
        ))}
      </div>

      <div className="space-y-2" role="group" aria-label="Categories — select one to highlight it">
        {sorted.map((share) => {
          const isHighlighted = highlighted === share.category
          const isDimmed = highlighted !== null && !isHighlighted
          const Icon = CATEGORY_ICON[share.category]
          const color = CATEGORY_ACCENT[share.category]
          return (
            <button
              key={share.category}
              type="button"
              aria-pressed={isHighlighted}
              aria-label={`${share.category}: ${Math.round(share.collectionShare)}% of collection, ${Math.round(share.playShare)}% of play share.${
                isHighlighted ? ' Highlighted.' : ''
              }`}
              onClick={() => onHighlightChange(highlighted === share.category ? null : share.category)}
              style={{ borderLeft: `3px solid ${color}` }}
              className={`w-full cursor-pointer rounded-lg border p-3 pl-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60 ${
                isHighlighted
                  ? 'border-y-border border-r-border bg-popover'
                  : 'border-y-transparent border-r-transparent bg-card hover:border-y-border hover:border-r-border hover:bg-popover/70'
              } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
                {share.category}
                {isHighlighted && <span className="text-xs font-normal text-muted-foreground">(selected)</span>}
              </div>
              <div className="space-y-1">
                <BarRow
                  label="Owned"
                  percent={share.collectionShare}
                  emphasized={view === 'owned'}
                  striped={false}
                />
                <BarRow
                  label="Played"
                  percent={share.playShare}
                  emphasized={view === 'played'}
                  striped
                />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

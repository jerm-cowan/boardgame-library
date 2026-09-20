import { useMemo } from 'react'
import type { CategoryShare } from '../lib/story'
import { GAME_CATEGORIES, type GameCategory } from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface CollectVsPlayChartProps {
  shares: CategoryShare[]
  highlighted: GameCategory | null
  onHighlightChange: (category: GameCategory | null) => void
}

function BarRow({
  label,
  percent,
  count,
  striped,
}: {
  label: string
  percent: number
  count: number
  striped: boolean
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-xs text-muted-foreground">{label}</span>
      <div className="h-3 flex-1 overflow-hidden rounded-full bg-popover">
        <div
          className="h-3 rounded-full bg-foreground/70"
          style={{
            width: `${percent}%`,
            backgroundImage: striped
              ? 'repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 4px)'
              : undefined,
          }}
        />
      </div>
      <span className="w-20 shrink-0 text-right text-xs text-muted-foreground">
        {Math.round(percent)}% ({count})
      </span>
    </div>
  )
}

export default function CollectVsPlayChart({ shares, highlighted, onHighlightChange }: CollectVsPlayChartProps) {
  const sorted = useMemo(() => {
    return [...shares].sort(
      (a, b) => GAME_CATEGORIES.indexOf(a.category) - GAME_CATEGORIES.indexOf(b.category),
    )
  }, [shares])

  return (
    <div className="space-y-4">
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
              style={
                isHighlighted
                  ? {
                      borderLeftWidth: '3px',
                      borderLeftColor: color,
                      borderTopColor: color,
                      borderRightColor: color,
                      borderBottomColor: color,
                    }
                  : undefined
              }
              className={`w-full cursor-pointer rounded-lg border border-border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60 ${
                isHighlighted ? 'bg-popover' : 'bg-card hover:bg-popover/70'
              } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
                <Icon size={14} strokeWidth={2} style={{ color }} aria-hidden="true" />
                {share.category}
                {isHighlighted && <span className="text-xs font-normal text-muted-foreground">(selected)</span>}
              </div>
              <div className="space-y-1">
                <BarRow label="Owned" percent={share.collectionShare} count={share.gameCount} striped={false} />
                <BarRow label="Played" percent={share.playShare} count={share.totalPlays} striped />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

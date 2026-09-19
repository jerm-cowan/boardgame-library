import { useMemo, useState } from 'react'
import type { CategoryShare } from '../lib/story'
import type { GameCategory } from '../types/game'

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
      <div className="inline-flex rounded-md bg-popover p-1" role="group" aria-label="Chart view">
        {(Object.keys(VIEW_LABELS) as ViewMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            aria-pressed={view === mode}
            onClick={() => setView(mode)}
            className={`rounded px-3 py-1.5 text-sm transition-colors ${
              view === mode ? 'bg-hover text-foreground' : 'text-muted-foreground hover:text-foreground'
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
          return (
            <button
              key={share.category}
              type="button"
              aria-pressed={isHighlighted}
              aria-label={`${share.category}: ${Math.round(share.collectionShare)}% of collection, ${Math.round(share.playShare)}% of play share.${
                isHighlighted ? ' Highlighted.' : ''
              }`}
              onClick={() => onHighlightChange(highlighted === share.category ? null : share.category)}
              className={`w-full rounded-lg p-3 text-left transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/60 ${
                isHighlighted ? 'bg-card' : 'bg-transparent hover:bg-card/60'
              } ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
            >
              <div className="mb-1.5 text-sm font-medium">{share.category}</div>
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

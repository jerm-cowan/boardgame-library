import type { Game } from '../types/game'
import { computeKpis, RECENTLY_PLAYED_WINDOW_DAYS } from '../lib/kpis'

interface DashboardKpisProps {
  games: Game[]
}

export default function DashboardKpis({ games }: DashboardKpisProps) {
  const kpis = computeKpis(games)

  const tiles = [
    { label: 'Total games', value: kpis.totalGames },
    { label: 'Never played', value: kpis.neverPlayedCount },
    {
      label: `Recently played (${RECENTLY_PLAYED_WINDOW_DAYS}d)`,
      value: kpis.recentlyPlayedCount,
    },
    {
      label: 'Most-played category',
      value: kpis.mostPlayedCategory ? kpis.mostPlayedCategory.category : '—',
      hint: kpis.mostPlayedCategory ? `${kpis.mostPlayedCategory.totalPlays} plays` : undefined,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="rounded-lg bg-card p-4">
          <p className="text-sm text-muted-foreground">{tile.label}</p>
          <p className="mt-1 text-2xl font-semibold">{tile.value}</p>
          {tile.hint && <p className="mt-0.5 text-xs text-muted-foreground">{tile.hint}</p>}
        </div>
      ))}
    </div>
  )
}

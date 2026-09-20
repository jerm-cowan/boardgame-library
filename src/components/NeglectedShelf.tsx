import type { Game } from '../types/game'
import CategoryBadge from './CategoryBadge'

interface NeglectedShelfProps {
  games: Game[]
  emptyMessage: string
}

function formatLastPlayed(value: string | null) {
  if (!value) return 'never played'
  return `last played ${new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`
}

// "0 plays" next to "never played" is redundant — play count only adds information
// once there's at least one play to report.
function formatPlayHistory(game: Game) {
  if (game.playCount === 0) return 'never played'
  return `${game.playCount} play${game.playCount === 1 ? '' : 's'} · ${formatLastPlayed(game.lastPlayedDate)}`
}

export default function NeglectedShelf({ games, emptyMessage }: NeglectedShelfProps) {
  if (games.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-2">
      {games.map((game) => {
        return (
          <li key={game.id} className="rounded-lg bg-popover p-3">
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="font-medium">{game.title}</span>
              <CategoryBadge category={game.category} className="text-xs text-muted-foreground" />
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {game.personalRating}/10 rating · {formatPlayHistory(game)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

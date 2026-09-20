import type { Game } from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

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

export default function NeglectedShelf({ games, emptyMessage }: NeglectedShelfProps) {
  if (games.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyMessage}</p>
  }

  return (
    <ul className="space-y-2">
      {games.map((game) => {
        const Icon = CATEGORY_ICON[game.category]
        const color = CATEGORY_ACCENT[game.category]
        return (
          <li
            key={game.id}
            style={{ borderLeft: `3px solid ${color}` }}
            className="rounded-lg bg-popover p-3 pl-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <span className="font-medium">{game.title}</span>
              <span
                style={{ boxShadow: `inset 0 0 0 1px ${color}` }}
                className="inline-flex items-center gap-1 rounded-full bg-hover px-2 py-0.5 text-xs text-muted-foreground"
              >
                <Icon size={12} strokeWidth={2} style={{ color }} aria-hidden="true" />
                {game.category}
              </span>
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {game.personalRating}/10 rating · {game.playCount} play
              {game.playCount === 1 ? '' : 's'} · {formatLastPlayed(game.lastPlayedDate)}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

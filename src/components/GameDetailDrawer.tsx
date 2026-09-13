import { useEffect } from 'react'
import type { Game } from '../types/game'

interface GameDetailDrawerProps {
  game: Game | null
  onClose: () => void
}

function formatLastPlayed(value: string | null) {
  if (!value) return 'Never'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function GameDetailDrawer({ game, onClose }: GameDetailDrawerProps) {
  useEffect(() => {
    if (!game) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [game, onClose])

  if (!game) return null

  const fields: [string, string][] = [
    ['Category', game.category],
    [
      'Players',
      game.playerMin === game.playerMax
        ? `${game.playerMin}`
        : `${game.playerMin}–${game.playerMax}`,
    ],
    ['Playtime', `${game.playtimeMinutes} min`],
    ['Complexity', `${game.complexity} / 5`],
    ['Play count', `${game.playCount}`],
    ['Last played', formatLastPlayed(game.lastPlayedDate)],
    ['Rating', `${game.personalRating} / 10`],
  ]

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close detail panel"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-surface p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-xl font-semibold">{game.title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-muted-foreground hover:bg-hover hover:text-foreground"
          >
            Close
          </button>
        </div>

        {/* Reserved for a future cover image slot — intentionally empty in MVP. */}
        <div className="mt-4 flex h-32 items-center justify-center rounded-lg bg-card text-sm text-muted-foreground">
          No image yet
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-y-4">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  )
}

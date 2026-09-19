import type { Game } from '../types/game'

interface NeglectedShelfProps {
  games: Game[]
}

function formatLastPlayed(value: string | null) {
  if (!value) return 'never played'
  return `last played ${new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`
}

export default function NeglectedShelf({ games }: NeglectedShelfProps) {
  return (
    <section aria-labelledby="beat-neglected-heading" className="space-y-4">
      <h2 id="beat-neglected-heading" className="text-lg font-semibold">
        The neglected shelf
      </h2>
      <p className="text-muted-foreground">
        These games are rated at or above your collection's average — you liked them enough to
        say so — yet they've seen the fewest plays. They're the clearest case of collecting
        outpacing playing.
      </p>
      <ul className="space-y-2">
        {games.map((game) => (
          <li
            key={game.id}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-lg bg-card p-4"
          >
            <span className="font-medium">{game.title}</span>
            <span className="text-sm text-muted-foreground">
              {game.personalRating}/10 rating · {game.playCount} play
              {game.playCount === 1 ? '' : 's'} · {formatLastPlayed(game.lastPlayedDate)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

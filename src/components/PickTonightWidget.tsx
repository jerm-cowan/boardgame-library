import { useMemo, useState } from 'react'
import type { Game } from '../types/game'
import {
  AUDIENCE_LABELS,
  MOOD_LABELS,
  recommend,
  type AudienceSelection,
  type Mood,
} from '../lib/recommend'

interface PickTonightWidgetProps {
  games: Game[]
  onSelectGame: (game: Game) => void
}

const AUDIENCE_OPTIONS: AudienceSelection[] = ['family', 'adults', 'mixed']
const MOOD_OPTIONS: Mood[] = ['familiar', 'new', 'surprise']

export default function PickTonightWidget({ games, onSelectGame }: PickTonightWidgetProps) {
  const [groupSize, setGroupSize] = useState(4)
  const [audience, setAudience] = useState<AudienceSelection>('mixed')
  const [mood, setMood] = useState<Mood>('familiar')

  const result = useMemo(
    () => recommend(games, groupSize, audience, mood),
    [games, groupSize, audience, mood],
  )

  return (
    <section className="rounded-xl border border-border bg-popover p-6 shadow-lg shadow-black/20">
      <div>
        <h2 className="text-xl font-semibold">Pick Tonight's Game</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us who's playing — we'll recommend from what you already own.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Group size</span>
          <input
            type="number"
            min={1}
            max={12}
            value={groupSize}
            onChange={(event) => setGroupSize(Math.max(1, Number(event.target.value) || 1))}
            className="w-24 rounded-md bg-hover px-2 py-1.5 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Who's playing</span>
          <select
            value={audience}
            onChange={(event) => setAudience(event.target.value as AudienceSelection)}
            className="rounded-md bg-hover px-2 py-1.5 focus:outline-none"
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {AUDIENCE_LABELS[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Mood</span>
          <select
            value={mood}
            onChange={(event) => setMood(event.target.value as Mood)}
            className="rounded-md bg-hover px-2 py-1.5 focus:outline-none"
          >
            {MOOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {MOOD_LABELS[option]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6">
        {result.candidateCount === 0 ? (
          <div className="rounded-lg bg-hover p-4 text-sm text-muted-foreground">
            No owned games fit {groupSize} player{groupSize === 1 ? '' : 's'} and{' '}
            {AUDIENCE_LABELS[audience].toLowerCase()}. Try a different group size or audience, or
            add a game that matches.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {result.recommendations.map(({ game, why }) => (
              <button
                key={game.id}
                type="button"
                onClick={() => onSelectGame(game)}
                className="flex flex-col gap-1 rounded-lg bg-hover p-4 text-left transition hover:bg-card"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">{game.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {game.category} · {game.complexity}/5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{why}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

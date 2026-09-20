import { useMemo, useState } from 'react'
import type { Game } from '../types/game'
import {
  AUDIENCE_LABELS,
  MOOD_LABELS,
  recommend,
  type AudienceSelection,
  type Mood,
} from '../lib/recommend'
import NumberStepper from './NumberStepper'
import Select from './Select'
import { CATEGORY_ACCENT } from '../lib/categoryStyle'

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
  const [hasCustomized, setHasCustomized] = useState(false)

  const result = useMemo(
    () => recommend(games, groupSize, audience, mood),
    [games, groupSize, audience, mood],
  )

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-lg shadow-black/20">
      <div>
        <h2 className="text-xl font-semibold">Pick Today's Game</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us who's playing — we'll recommend from what you already own.
        </p>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Group size</span>
          <NumberStepper
            value={groupSize}
            onChange={(value) => {
              setGroupSize(value ?? 1)
              setHasCustomized(true)
            }}
            min={1}
            max={12}
            ariaLabel="group size"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Who's playing</span>
          <Select
            value={audience}
            onChange={(event) => {
              setAudience(event.target.value as AudienceSelection)
              setHasCustomized(true)
            }}
          >
            {AUDIENCE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {AUDIENCE_LABELS[option]}
              </option>
            ))}
          </Select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Mood</span>
          <Select
            value={mood}
            onChange={(event) => {
              setMood(event.target.value as Mood)
              setHasCustomized(true)
            }}
          >
            {MOOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {MOOD_LABELS[option]}
              </option>
            ))}
          </Select>
        </label>
      </div>

      {!hasCustomized && (
        <p className="mt-3 text-[11px] italic text-muted-foreground/60">
          Showing defaults (4 players · mixed group · familiar favorite) — adjust above to
          personalize.
        </p>
      )}

      <div className="mt-6">
        {result.candidateCount === 0 ? (
          <div className="rounded-lg bg-popover p-4 text-sm text-muted-foreground">
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
                className="flex flex-col gap-1 rounded-lg bg-popover p-4 text-left transition hover:brightness-110"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{game.title}</span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: CATEGORY_ACCENT[game.category] }}
                      aria-hidden="true"
                    />
                    {game.category} · {game.complexity}/5
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {why.map((segment, index) =>
                    segment.emphasis ? (
                      <strong key={index} className="font-semibold text-foreground">
                        {segment.text}
                      </strong>
                    ) : (
                      <span key={index}>{segment.text}</span>
                    ),
                  )}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

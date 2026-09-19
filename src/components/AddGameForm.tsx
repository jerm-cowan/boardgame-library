import { useState } from 'react'
import {
  COMPLEXITY_BOUNDS,
  GAME_CATEGORIES,
  type Game,
  type GameAudience,
  type GameCategory,
} from '../types/game'
import { AUDIENCE_LABELS } from '../lib/recommend'

const AUDIENCE_OPTIONS: GameAudience[] = ['family', 'adults', 'mixed']

interface AddGameFormProps {
  onAdd: (game: Game) => void
  onClose: () => void
}

type DraftState = {
  title: string
  category: GameCategory
  playerMin: string
  playerMax: string
  playtimeMinutes: string
  complexity: string
  audience: GameAudience
}

const emptyDraft: DraftState = {
  title: '',
  category: 'Strategy',
  playerMin: '',
  playerMax: '',
  playtimeMinutes: '',
  complexity: '',
  audience: 'mixed',
}

export default function AddGameForm({ onAdd, onClose }: AddGameFormProps) {
  const [draft, setDraft] = useState<DraftState>(emptyDraft)

  function update<K extends keyof DraftState>(key: K, value: DraftState[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    const playerMin = Number(draft.playerMin)
    const playerMax = Number(draft.playerMax)
    const playtimeMinutes = Number(draft.playtimeMinutes)
    const complexity = Number(draft.complexity)

    const newGame: Game = {
      id: `g-${Date.now()}`,
      title: draft.title.trim(),
      category: draft.category,
      playerMin,
      playerMax,
      playtimeMinutes,
      complexity,
      coverImage: null,
      playCount: 0,
      lastPlayedDate: null,
      personalRating: 0,
      audience: draft.audience,
    }

    onAdd(newGame)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="Close add game form"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <div className="relative w-full max-w-md rounded-lg bg-surface p-6 shadow-xl">
        <h2 className="text-lg font-semibold">Add a game</h2>
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Title</span>
            <input
              required
              type="text"
              value={draft.title}
              onChange={(event) => update('title', event.target.value)}
              className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Category</span>
            <select
              value={draft.category}
              onChange={(event) => update('category', event.target.value as GameCategory)}
              className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            >
              {GAME_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-4">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Min players</span>
              <input
                required
                type="number"
                min={1}
                value={draft.playerMin}
                onChange={(event) => update('playerMin', event.target.value)}
                className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm">
              <span className="text-muted-foreground">Max players</span>
              <input
                required
                type="number"
                min={1}
                value={draft.playerMax}
                onChange={(event) => update('playerMax', event.target.value)}
                className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Playtime (minutes)</span>
            <input
              required
              type="number"
              min={1}
              value={draft.playtimeMinutes}
              onChange={(event) => update('playtimeMinutes', event.target.value)}
              className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Complexity</span>
            <select
              required
              value={draft.complexity}
              onChange={(event) => update('complexity', event.target.value)}
              className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            >
              <option value="" disabled>
                Select complexity
              </option>
              {Array.from(
                { length: COMPLEXITY_BOUNDS.max - COMPLEXITY_BOUNDS.min + 1 },
                (_, i) => COMPLEXITY_BOUNDS.min + i,
              ).map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="text-muted-foreground">Best fit for</span>
            <select
              value={draft.audience}
              onChange={(event) => update('audience', event.target.value as GameAudience)}
              className="rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            >
              {AUDIENCE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {AUDIENCE_LABELS[option]}
                </option>
              ))}
            </select>
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-hover hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-popover px-3 py-1.5 text-sm font-medium hover:bg-hover"
            >
              Add game
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

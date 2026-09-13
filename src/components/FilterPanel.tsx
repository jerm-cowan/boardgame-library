import {
  DEFAULT_FILTERS,
  GAME_CATEGORIES,
  PLAYTIME_BOUNDS,
  COMPLEXITY_BOUNDS,
  type FilterState,
} from '../types/game'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value })
  }

  return (
    <div className="rounded-lg bg-card p-4">
      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Player count</span>
          <input
            type="number"
            min={1}
            placeholder="Any"
            value={filters.playerCount ?? ''}
            onChange={(event) =>
              update('playerCount', event.target.value === '' ? null : Number(event.target.value))
            }
            className="w-24 rounded-md bg-popover px-2 py-1.5 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Playtime (min)</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={PLAYTIME_BOUNDS.min}
              max={filters.playtimeMax}
              value={filters.playtimeMin}
              onChange={(event) => update('playtimeMin', Number(event.target.value))}
              className="w-20 rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="number"
              min={filters.playtimeMin}
              max={PLAYTIME_BOUNDS.max}
              value={filters.playtimeMax}
              onChange={(event) => update('playtimeMax', Number(event.target.value))}
              className="w-20 rounded-md bg-popover px-2 py-1.5 focus:outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Max complexity</span>
          <select
            value={filters.maxComplexity}
            onChange={(event) => update('maxComplexity', Number(event.target.value))}
            className="w-24 rounded-md bg-popover px-2 py-1.5 focus:outline-none"
          >
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
          <span className="text-muted-foreground">Category</span>
          <select
            value={filters.category}
            onChange={(event) =>
              update('category', event.target.value as FilterState['category'])
            }
            className="w-32 rounded-md bg-popover px-2 py-1.5 focus:outline-none"
          >
            <option value="All">All</option>
            {GAME_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <div className="flex overflow-hidden rounded-md bg-popover">
            <button
              type="button"
              onClick={() => update('neverPlayedOnly', false)}
              className={`px-3 py-1.5 ${!filters.neverPlayedOnly ? 'bg-hover' : ''}`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => update('neverPlayedOnly', true)}
              className={`px-3 py-1.5 ${filters.neverPlayedOnly ? 'bg-hover' : ''}`}
            >
              Never played
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="ml-auto text-sm text-muted-foreground hover:text-foreground"
        >
          Reset filters
        </button>
      </div>
    </div>
  )
}

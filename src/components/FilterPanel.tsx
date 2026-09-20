import {
  DEFAULT_FILTERS,
  GAME_CATEGORIES,
  PLAYTIME_BOUNDS,
  COMPLEXITY_BOUNDS,
  type FilterState,
} from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export default function FilterPanel({ filters, onChange }: FilterPanelProps) {
  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: value })
  }

  function toggleCategory(category: FilterState['categories'][number]) {
    const isActive = filters.categories.includes(category)
    update(
      'categories',
      isActive
        ? filters.categories.filter((c) => c !== category)
        : [...filters.categories, category],
    )
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

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Category</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category (select any number)">
            <button
              type="button"
              onClick={() => update('categories', [])}
              aria-pressed={filters.categories.length === 0}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                filters.categories.length === 0 ? 'bg-hover text-foreground' : 'bg-popover text-muted-foreground hover:text-foreground'
              }`}
            >
              All
            </button>
            {GAME_CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICON[category]
              const isActive = filters.categories.includes(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  aria-pressed={isActive}
                  style={isActive ? { boxShadow: `inset 0 0 0 1px ${CATEGORY_ACCENT[category]}` } : undefined}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    isActive ? 'bg-hover text-foreground' : 'bg-popover text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon size={14} strokeWidth={2} style={{ color: CATEGORY_ACCENT[category] }} aria-hidden="true" />
                  {category}
                </button>
              )
            })}
          </div>
        </div>

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

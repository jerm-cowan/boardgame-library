import {
  DEFAULT_FILTERS,
  GAME_CATEGORIES,
  PLAYTIME_BOUNDS,
  COMPLEXITY_BOUNDS,
  type FilterState,
} from '../types/game'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'
import NumberStepper from './NumberStepper'
import Select from './Select'
import { X } from 'lucide-react'

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function FilterPanel({ filters, onChange, searchTerm, onSearchChange }: FilterPanelProps) {
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
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Filters</h2>
        <button
          type="button"
          onClick={() => onChange(DEFAULT_FILTERS)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Reset filters
        </button>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Search</span>
          <div className="relative w-48">
            <input
              type="text"
              placeholder="Search by title…"
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              className="w-full rounded-md bg-popover px-3 py-2 pr-8 text-sm focus:outline-none"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            )}
          </div>
        </label>

        <div className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Category</span>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category (select any number)">
            <button
              type="button"
              onClick={() => update('categories', [])}
              aria-pressed={filters.categories.length === 0}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.categories.length === 0
                  ? 'bg-foreground/10 text-foreground shadow-sm shadow-black/40'
                  : 'bg-popover text-muted-foreground hover:text-foreground'
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
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <div className="inline-flex gap-1" role="group" aria-label="Status">
            <button
              type="button"
              aria-pressed={!filters.neverPlayedOnly}
              onClick={() => update('neverPlayedOnly', false)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                !filters.neverPlayedOnly
                  ? 'bg-foreground/10 text-foreground shadow-sm shadow-black/40'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              All
            </button>
            <button
              type="button"
              aria-pressed={filters.neverPlayedOnly}
              onClick={() => update('neverPlayedOnly', true)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                filters.neverPlayedOnly
                  ? 'bg-foreground/10 text-foreground shadow-sm shadow-black/40'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
              }`}
            >
              Never played
            </button>
          </div>
        </div>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Player count</span>
          <NumberStepper
            value={filters.playerCount}
            onChange={(value) => update('playerCount', value)}
            min={1}
            allowClear
            placeholder="Any"
            ariaLabel="player count"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Playtime (min)</span>
          <div className="flex items-center gap-2">
            <NumberStepper
              value={filters.playtimeMin}
              onChange={(value) => update('playtimeMin', value ?? PLAYTIME_BOUNDS.min)}
              min={PLAYTIME_BOUNDS.min}
              max={filters.playtimeMax}
              ariaLabel="minimum playtime"
            />
            <span className="text-muted-foreground">to</span>
            <NumberStepper
              value={filters.playtimeMax}
              onChange={(value) => update('playtimeMax', value ?? PLAYTIME_BOUNDS.max)}
              min={filters.playtimeMin}
              max={PLAYTIME_BOUNDS.max}
              ariaLabel="maximum playtime"
            />
          </div>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-muted-foreground">Max complexity</span>
          <Select
            wrapperClassName="w-24"
            value={filters.maxComplexity}
            onChange={(event) => update('maxComplexity', Number(event.target.value))}
          >
            {Array.from(
              { length: COMPLEXITY_BOUNDS.max - COMPLEXITY_BOUNDS.min + 1 },
              (_, i) => COMPLEXITY_BOUNDS.min + i,
            ).map((value) => (
              <option key={value} value={value}>
                {value} / 5
              </option>
            ))}
          </Select>
        </label>
      </div>
    </div>
  )
}

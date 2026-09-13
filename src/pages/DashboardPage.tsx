import { useMemo, useState } from 'react'
import type { SortingState } from '@tanstack/react-table'
import gamesData from '../data/games.json'
import GameTable from '../components/GameTable'
import FilterPanel from '../components/FilterPanel'
import GameDetailDrawer from '../components/GameDetailDrawer'
import AddGameForm from '../components/AddGameForm'
import { DEFAULT_FILTERS, type FilterState, type Game } from '../types/game'

function matchesFilters(game: Game, filters: FilterState): boolean {
  if (filters.playerCount !== null) {
    if (game.playerMin > filters.playerCount || game.playerMax < filters.playerCount) {
      return false
    }
  }
  if (game.playtimeMinutes < filters.playtimeMin || game.playtimeMinutes > filters.playtimeMax) {
    return false
  }
  if (game.complexity > filters.maxComplexity) return false
  if (filters.category !== 'All' && game.category !== filters.category) return false
  if (filters.neverPlayedOnly && game.playCount !== 0) return false
  return true
}

export default function DashboardPage() {
  const [games, setGames] = useState<Game[]>(gamesData as Game[])
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [sorting, setSorting] = useState<SortingState>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)

  const filteredGames = useMemo(
    () => games.filter((game) => matchesFilters(game, filters)),
    [games, filters],
  )

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Your collection at a glance — search, filter, and open a game for details.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddFormOpen(true)}
          className="shrink-0 rounded-md bg-popover px-4 py-2 text-sm font-medium hover:bg-hover"
        >
          Add a game
        </button>
      </div>

      <div className="mt-6">
        <input
          type="text"
          placeholder="Search by title…"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full max-w-sm rounded-md bg-popover px-3 py-2 text-sm focus:outline-none sm:w-72"
        />
      </div>

      <div className="mt-4">
        <FilterPanel filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-6">
        <GameTable
          games={filteredGames}
          searchTerm={searchTerm}
          sorting={sorting}
          onSortingChange={setSorting}
          onSelectGame={setSelectedGame}
        />
      </div>

      <GameDetailDrawer game={selectedGame} onClose={() => setSelectedGame(null)} />

      {isAddFormOpen && (
        <AddGameForm
          onAdd={(game) => setGames((prev) => [...prev, game])}
          onClose={() => setIsAddFormOpen(false)}
        />
      )}
    </main>
  )
}

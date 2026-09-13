import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import type { Game } from '../types/game'

const columnHelper = createColumnHelper<Game>()

function formatLastPlayed(value: string | null) {
  if (!value) return 'Never'
  return new Date(value).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const columns = [
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor('category', { header: 'Category' }),
  columnHelper.display({
    id: 'playerRange',
    header: 'Players',
    cell: (info) => {
      const game = info.row.original
      return game.playerMin === game.playerMax
        ? `${game.playerMin}`
        : `${game.playerMin}–${game.playerMax}`
    },
  }),
  columnHelper.accessor('playtimeMinutes', {
    header: 'Playtime',
    cell: (info) => `${info.getValue()} min`,
  }),
  columnHelper.accessor('complexity', {
    header: 'Complexity',
    cell: (info) => `${info.getValue()} / 5`,
  }),
  columnHelper.accessor('playCount', { header: 'Play count' }),
  columnHelper.accessor('lastPlayedDate', {
    header: 'Last played',
    cell: (info) => formatLastPlayed(info.getValue()),
  }),
  columnHelper.accessor('personalRating', { header: 'Rating' }),
]

interface GameTableProps {
  games: Game[]
  searchTerm: string
  sorting: SortingState
  onSortingChange: (sorting: SortingState) => void
  onSelectGame: (game: Game) => void
}

export default function GameTable({
  games,
  searchTerm,
  sorting,
  onSortingChange,
  onSelectGame,
}: GameTableProps) {
  const table = useReactTable({
    data: games,
    columns,
    state: { sorting, globalFilter: searchTerm },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater
      onSortingChange(next)
    },
    globalFilterFn: (row, _columnId, filterValue: string) => {
      const title = row.original.title.toLowerCase()
      return title.includes(filterValue.toLowerCase())
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="overflow-hidden rounded-lg bg-card">
      <table className="w-full text-left">
        <thead className="bg-popover">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sortDirection = header.column.getIsSorted()
                return (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-sm font-medium text-muted-foreground"
                  >
                    {canSort ? (
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="flex items-center gap-1 hover:text-foreground"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="w-3 text-xs">
                          {sortDirection === 'asc' ? '▲' : sortDirection === 'desc' ? '▼' : ''}
                        </span>
                      </button>
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                No games match the current filters.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={row.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectGame(row.original)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelectGame(row.original)
                  }
                }}
                className="cursor-pointer bg-card hover:bg-hover focus:outline-none focus:bg-hover"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

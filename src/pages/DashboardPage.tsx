import { useMemo } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

// Trivial smoke-test row shape — confirms TanStack Table renders inside our
// theme before the real collection grid is built.
type PlaceholderRow = {
  title: string
  status: string
}

const placeholderData: PlaceholderRow[] = [
  { title: 'TanStack Table', status: 'installed' },
  { title: 'Routing', status: 'wired' },
]

const columnHelper = createColumnHelper<PlaceholderRow>()

const columns = [
  columnHelper.accessor('title', { header: 'Check' }),
  columnHelper.accessor('status', { header: 'Status' }),
]

export default function DashboardPage() {
  const data = useMemo(() => placeholderData, [])
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">
        Placeholder route for the "Pick Tonight's Game" dashboard. Table
        rendering below confirms TanStack Table is installed and working.
      </p>

      <div className="mt-8 overflow-hidden rounded-lg bg-card">
        <table className="w-full text-left">
          <thead className="bg-popover">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 text-sm font-medium text-muted-foreground">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-hover">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

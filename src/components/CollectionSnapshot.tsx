import type { CategoryCount, ComplexitySummary } from '../lib/story'

interface CollectionSnapshotProps {
  totalGames: number
  breakdown: CategoryCount[]
  complexity: ComplexitySummary
}

// Purely decorative bars — the accessible summary lives in the sr-only paragraph below,
// which states every category's share in plain language.
function CategoryBreakdownChart({ breakdown }: { breakdown: CategoryCount[] }) {
  return (
    <div className="space-y-2" aria-hidden="true">
      {breakdown.map((entry) => (
        <div key={entry.category} className="flex items-center gap-3">
          <span className="w-24 shrink-0 text-sm text-muted-foreground">{entry.category}</span>
          <div className="h-3 flex-1 rounded-full bg-popover">
            <div
              className="h-3 rounded-full bg-foreground/70"
              style={{ width: `${entry.percent}%` }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-sm text-muted-foreground">
            {Math.round(entry.percent)}%
          </span>
        </div>
      ))}
    </div>
  )
}

export default function CollectionSnapshot({
  totalGames,
  breakdown,
  complexity,
}: CollectionSnapshotProps) {
  const topCategory = breakdown[0]
  const summary = breakdown
    .map((entry) => `${entry.category} ${Math.round(entry.percent)}%`)
    .join(', ')

  return (
    <section aria-labelledby="beat-snapshot-heading" className="space-y-4">
      <h2 id="beat-snapshot-heading" className="text-lg font-semibold">
        The shelf, at a glance
      </h2>
      <p className="text-muted-foreground">
        Your library holds <strong className="text-foreground">{totalGames} games</strong>,
        spread across {breakdown.length} categories
        {topCategory ? (
          <>
            {' '}
            with <strong className="text-foreground">{topCategory.category}</strong> leading the
            shelf at {Math.round(topCategory.percent)}%
          </>
        ) : null}
        . Complexity leans{' '}
        {complexity.average >= 3 ? 'toward the heavier side' : 'toward the lighter, easy-to-teach side'}
        , averaging {complexity.average.toFixed(1)}/5 — {complexity.lightCount} light,{' '}
        {complexity.mediumCount} medium, and {complexity.heavyCount} heavy games in the mix.
      </p>
      <div className="rounded-lg bg-card p-4">
        <p className="sr-only">Category breakdown of your collection: {summary}.</p>
        <CategoryBreakdownChart breakdown={breakdown} />
      </div>
    </section>
  )
}

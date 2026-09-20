import type { CategoryCount, ComplexitySummary } from '../lib/story'
import CategoryMosaic from './CategoryMosaic'
import CategoryBarRows from './CategoryBarRows'
import TabletCategoryChart from './TabletCategoryChart'
import CategoryKey from './CategoryKey'

interface CollectionSnapshotProps {
  totalGames: number
  breakdown: CategoryCount[]
  complexity: ComplexitySummary
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
      <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
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
          <div className="md:hidden">
            <CategoryBarRows breakdown={breakdown} />
          </div>
          <div className="hidden md:block lg:hidden">
            <TabletCategoryChart breakdown={breakdown} />
          </div>
          <div className="hidden lg:flex lg:gap-5">
            <div className="min-w-0 flex-1">
              <CategoryMosaic breakdown={breakdown} />
            </div>
            <CategoryKey categories={breakdown.map((entry) => entry.category)} className="shrink-0" />
          </div>
        </div>
      </div>
    </section>
  )
}

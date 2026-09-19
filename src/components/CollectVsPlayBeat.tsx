import { useMemo } from 'react'
import CollectVsPlayChart from './CollectVsPlayChart'
import type { CategoryShare } from '../lib/story'

interface CollectVsPlayBeatProps {
  shares: CategoryShare[]
}

export default function CollectVsPlayBeat({ shares }: CollectVsPlayBeatProps) {
  const { biggestGap, summary } = useMemo(() => {
    const withGap = shares.map((share) => ({
      ...share,
      gap: share.collectionShare - share.playShare,
    }))
    const biggest = [...withGap].sort((a, b) => b.gap - a.gap)[0] ?? null
    const summaryText = shares
      .map(
        (share) =>
          `${share.category} ${Math.round(share.collectionShare)}% of collection, ${Math.round(share.playShare)}% of play share`,
      )
      .join('; ')
    return { biggestGap: biggest, summary: summaryText }
  }, [shares])

  return (
    <section aria-labelledby="beat-collect-vs-play-heading" className="space-y-4">
      <h2 id="beat-collect-vs-play-heading" className="text-lg font-semibold">
        What I collect vs. what I actually play
      </h2>
      <p className="text-muted-foreground">
        {biggestGap && biggestGap.gap > 0 ? (
          <>
            <strong className="text-foreground">{biggestGap.category}</strong> games make up{' '}
            <strong className="text-foreground">{Math.round(biggestGap.collectionShare)}%</strong>{' '}
            of your shelf but only{' '}
            <strong className="text-foreground">{Math.round(biggestGap.playShare)}%</strong> of
            your actual play time — the widest gap between what's collected and what gets played.
          </>
        ) : (
          "Your collection and your play sessions are fairly evenly matched across categories, though a few still pull slightly ahead."
        )}{' '}
        Toggle the view below to compare shelf share against play share, and click a category to
        isolate it.
      </p>
      <div className="rounded-lg bg-card p-4">
        <p className="sr-only">
          Collection share versus play share by category: {summary}.
        </p>
        <CollectVsPlayChart shares={shares} />
      </div>
    </section>
  )
}

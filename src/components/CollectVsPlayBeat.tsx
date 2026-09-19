import { useMemo, useState } from 'react'
import CollectVsPlayChart from './CollectVsPlayChart'
import NeglectedShelf from './NeglectedShelf'
import { getNeglectedShelf, type CategoryShare } from '../lib/story'
import type { Game, GameCategory } from '../types/game'

interface CollectVsPlayBeatProps {
  shares: CategoryShare[]
  games: Game[]
}

interface GapDescription {
  gap: number
  balanced: boolean
  magnitude: string
  ownedPct: number
  playedPct: number
}

// Magnitude wording is relative to the whole collection so the same numeric gap can read
// as "modest" in one dataset and "the widest" in another, rather than a fixed threshold.
function describeGap(share: CategoryShare, allShares: CategoryShare[]): GapDescription {
  const gap = share.collectionShare - share.playShare
  const absGap = Math.abs(gap)
  const maxAbsGap = Math.max(...allShares.map((s) => Math.abs(s.collectionShare - s.playShare)))
  const balanced = absGap < 5
  const isWidest = maxAbsGap > 0 && absGap >= maxAbsGap - 0.01

  let magnitude: string
  if (balanced) magnitude = 'close to balanced'
  else if (isWidest) magnitude = 'the widest gap in your collection'
  else if (absGap >= 10) magnitude = 'one of the wider gaps in your collection'
  else magnitude = 'a modest gap'

  return {
    gap,
    balanced,
    magnitude,
    ownedPct: Math.round(share.collectionShare),
    playedPct: Math.round(share.playShare),
  }
}

export default function CollectVsPlayBeat({ shares, games }: CollectVsPlayBeatProps) {
  const [selected, setSelected] = useState<GameCategory | null>(null)

  const summary = useMemo(
    () =>
      shares
        .map(
          (share) =>
            `${share.category} ${Math.round(share.collectionShare)}% of collection, ${Math.round(share.playShare)}% of play share`,
        )
        .join('; '),
    [shares],
  )

  const selectedShare = selected ? shares.find((share) => share.category === selected) ?? null : null
  const neglected = useMemo(
    () => getNeglectedShelf(games, 5, selected ?? undefined),
    [games, selected],
  )

  return (
    <section aria-labelledby="beat-collect-vs-play-heading" className="space-y-4">
      <h2 id="beat-collect-vs-play-heading" className="text-lg font-semibold">
        What I collect vs. what I actually play
      </h2>
      <p className="text-muted-foreground">
        {selectedShare ? (
          (() => {
            const { gap, balanced, magnitude, ownedPct, playedPct } = describeGap(selectedShare, shares)
            return (
              <>
                <strong className="text-foreground">{selectedShare.category}</strong> games make up{' '}
                <strong className="text-foreground">{ownedPct}%</strong> of your shelf{' '}
                {balanced ? 'and' : gap > 0 ? 'but only' : 'yet'}{' '}
                <strong className="text-foreground">{playedPct}%</strong> of your actual play time
                {!balanced && gap < 0 ? ', punching above its weight' : ''} — {magnitude}.
                {neglected.length > 0 ? ' See below.' : ''}
              </>
            )
          })()
        ) : (
          "Your play time doesn't track your shelf evenly — some categories get played far more than their share, others far less. Click a category below to see its specific gap."
        )}
      </p>
      <div className="rounded-lg bg-card p-4">
        <p className="sr-only">
          Collection share versus play share by category: {summary}.
        </p>
        <div className="grid gap-6 md:grid-cols-[2fr_3fr]">
          <div>
            <CollectVsPlayChart shares={shares} highlighted={selected} onHighlightChange={setSelected} />
          </div>
          <div>
            <div className="mb-4 flex h-10 items-center justify-center">
              <h3 className="text-sm text-muted-foreground">Neglected shelf</h3>
            </div>
            <NeglectedShelf
              games={neglected}
              emptyMessage={
                selected
                  ? `Nothing neglected here — you play your ${selected} games!`
                  : 'Nothing neglected here.'
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}


import { useMemo } from 'react'
import gamesData from '../data/games.json'
import CollectionSnapshot from '../components/CollectionSnapshot'
import CollectVsPlayBeat from '../components/CollectVsPlayBeat'
import StoryTakeaway from '../components/StoryTakeaway'
import {
  computeCategoryBreakdown,
  computeCategoryShares,
  computeComplexitySummary,
  getNeglectedShelf,
} from '../lib/story'
import type { Game } from '../types/game'

export default function CollectionStoryPage() {
  const games = gamesData as Game[]

  const breakdown = useMemo(() => computeCategoryBreakdown(games), [games])
  const complexity = useMemo(() => computeComplexitySummary(games), [games])
  const shares = useMemo(() => computeCategoryShares(games), [games])
  const neglected = useMemo(() => getNeglectedShelf(games, 5), [games])

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold">Collection Story</h1>
        <p className="mt-2 text-muted-foreground">
          A short tour through what your library actually looks like — and what your play history
          says about it.
        </p>
      </div>

      <div className="space-y-14">
        <CollectionSnapshot totalGames={games.length} breakdown={breakdown} complexity={complexity} />
        <CollectVsPlayBeat shares={shares} games={games} />
        <StoryTakeaway spotlightGame={neglected[0] ?? null} />
      </div>
    </main>
  )
}

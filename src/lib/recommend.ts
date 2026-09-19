import type { Game, GameAudience } from '../types/game'
import { daysSince } from './kpis'

export type Mood = 'familiar' | 'new' | 'surprise'
export type AudienceSelection = GameAudience

export const MOOD_LABELS: Record<Mood, string> = {
  familiar: 'Familiar favorite',
  new: 'Something new-to-us',
  surprise: 'Surprise me',
}

export const AUDIENCE_LABELS: Record<AudienceSelection, string> = {
  family: 'Family / kids-friendly',
  adults: 'Adults only',
  mixed: 'Mixed group',
}

export interface Recommendation {
  game: Game
  why: string
}

export interface RecommendationResult {
  candidateCount: number
  recommendations: Recommendation[]
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function mean(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

// A "mixed group" imposes no audience restriction; family/adults selections also accept
// games tagged 'mixed' since those fit either audience.
function matchesAudience(game: Game, selection: AudienceSelection): boolean {
  if (selection === 'mixed') return true
  return game.audience === selection || game.audience === 'mixed'
}

function matchesGroupSize(game: Game, groupSize: number): boolean {
  return game.playerMin <= groupSize && game.playerMax >= groupSize
}

function getCandidates(games: Game[], groupSize: number, audience: AudienceSelection): Game[] {
  return games.filter((game) => matchesGroupSize(game, groupSize) && matchesAudience(game, audience))
}

function describeRecency(lastPlayedDate: string | null, referenceDate: Date): string {
  if (lastPlayedDate === null) return "you've never played it"
  const days = daysSince(lastPlayedDate, referenceDate)
  if (days <= 0) return 'you played it today'
  if (days < 30) return `you last played it ${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.round(days / 30)
  return `you haven't played it in ${months} month${months === 1 ? '' : 's'}`
}

function playerRangeText(game: Game): string {
  return game.playerMin === game.playerMax
    ? `${game.playerMin}-player`
    : `${game.playerMin}\u2013${game.playerMax} player`
}

const PLAYTIME_RANGE_MINUTES = 165 // matches PLAYTIME_BOUNDS spread (15–180)
const COMPLEXITY_RANGE = 4 // matches COMPLEXITY_BOUNDS spread (1–5)

function describeCategory(game: Game, comparative: boolean): string {
  return comparative
    ? `it's the only ${game.category} pick in this batch`
    : `it's a ${game.category} game`
}

function describePlaytime(game: Game, comparative: boolean): string {
  const length =
    game.playtimeMinutes <= 45
      ? `a quick ${game.playtimeMinutes}-minute game`
      : game.playtimeMinutes >= 120
        ? `a longer ${game.playtimeMinutes}-minute sit`
        : `about ${game.playtimeMinutes} minutes`
  return comparative ? `it runs ${length} compared to the others here` : `it's ${length}`
}

function describeComplexity(game: Game, comparative: boolean): string {
  const weight =
    game.complexity <= 2
      ? `light, ${game.complexity}/5 complexity`
      : game.complexity >= 4
        ? `heavier, ${game.complexity}/5 complexity`
        : `medium, ${game.complexity}/5 complexity`
  return comparative ? `it's the ${weight} option of the bunch` : `it's ${weight}`
}

// Picks whichever secondary trait most sets this game apart from the other recommended
// games (falling back to whichever trait is notable in isolation for a single result).
function buildDistinguishingClause(game: Game, others: Game[]): string {
  const comparative = others.length > 0

  if (comparative) {
    const uniqueCategory = others.every((other) => other.category !== game.category)
    if (uniqueCategory) return describeCategory(game, true)

    const avgPlaytime = mean(others.map((other) => other.playtimeMinutes))
    const avgComplexity = mean(others.map((other) => other.complexity))
    const playtimeGap = Math.abs(game.playtimeMinutes - avgPlaytime) / PLAYTIME_RANGE_MINUTES
    const complexityGap = Math.abs(game.complexity - avgComplexity) / COMPLEXITY_RANGE

    if (playtimeGap >= complexityGap && playtimeGap >= 0.12) return describePlaytime(game, true)
    if (complexityGap > playtimeGap && complexityGap >= 0.2) return describeComplexity(game, true)
  }

  // No standout gap versus the other picks (or nothing to compare against) — describe
  // whichever trait is most notable for this game on its own.
  if (game.complexity <= 2 || game.complexity >= 4) return describeComplexity(game, false)
  if (game.playtimeMinutes <= 45 || game.playtimeMinutes >= 120) return describePlaytime(game, false)
  return describeCategory(game, false)
}

function buildWhy(game: Game, mood: Mood, referenceDate: Date, group: Game[]): string {
  const range = playerRangeText(game)
  const recency = describeRecency(game.lastPlayedDate, referenceDate)
  const others = group.filter((other) => other.id !== game.id)
  const distinguisher = buildDistinguishingClause(game, others)

  if (mood === 'familiar') {
    return `Your highest-rated ${range} game among the ones you play often (${game.personalRating}/10, played ${game.playCount} times), but ${recency}. Plus, ${distinguisher}.`
  }

  if (mood === 'new') {
    if (game.playCount === 0) {
      return `You've never tried this one, and it fits your group size — ${distinguisher}.`
    }
    return `Only played ${game.playCount} time${game.playCount === 1 ? '' : 's'} so far — still fresh, and it fits your group size (rated ${game.personalRating}/10). Also, ${distinguisher}.`
  }

  // surprise
  return `Rated ${game.personalRating}/10 — one of your best — but ${recency}. A genuine neglected-shelf pick, and ${distinguisher}.`
}


export function recommend(
  games: Game[],
  groupSize: number,
  audience: AudienceSelection,
  mood: Mood,
  referenceDate: Date = new Date(),
): RecommendationResult {
  const candidates = getCandidates(games, groupSize, audience)
  if (candidates.length === 0) {
    return { candidateCount: 0, recommendations: [] }
  }

  let pool: Game[]
  let sorted: Game[]

  if (mood === 'familiar') {
    const frequentThreshold = median(candidates.map((game) => game.playCount))
    const frequent = candidates.filter((game) => game.playCount >= frequentThreshold)
    pool = frequent.length > 0 ? frequent : candidates
    sorted = [...pool].sort(
      (a, b) => b.personalRating - a.personalRating || b.playCount - a.playCount,
    )
  } else if (mood === 'new') {
    sorted = [...candidates].sort(
      (a, b) => a.playCount - b.playCount || b.personalRating - a.personalRating,
    )
  } else {
    const avgRating = mean(candidates.map((game) => game.personalRating))
    const highlyRated = candidates.filter((game) => game.personalRating >= avgRating)
    pool = highlyRated.length > 0 ? highlyRated : candidates
    sorted = [...pool].sort(
      (a, b) => a.playCount - b.playCount || b.personalRating - a.personalRating,
    )
  }

  const topGames = sorted.slice(0, 3)
  const recommendations = topGames.map((game) => ({
    game,
    why: buildWhy(game, mood, referenceDate, topGames),
  }))

  return { candidateCount: candidates.length, recommendations }
}

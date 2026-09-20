import type { Game, GameAudience } from '../types/game'
import { daysSince, mean } from './kpis'

export type Mood = 'familiar' | 'new' | 'surprise'
export type AudienceSelection = GameAudience

export const MOOD_LABELS: Record<Mood, string> = {
  familiar: 'Familiar favorite',
  new: 'Something new',
  surprise: 'Surprise me',
}

export const AUDIENCE_LABELS: Record<AudienceSelection, string> = {
  family: 'Kid friendly',
  adults: 'Adults only',
  mixed: 'Mixed group',
}

export interface WhySegment {
  text: string
  emphasis?: boolean
}

export interface Recommendation {
  game: Game
  why: WhySegment[]
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

// Same neglect concept the Collection Story's neglected-shelf beat reuses: games rated at
// or above the pool's average rating, so a mediocre pool doesn't surface middling games.
export function highRatedPool(games: Game[]): Game[] {
  const avgRating = mean(games.map((game) => game.personalRating))
  const highlyRated = games.filter((game) => game.personalRating >= avgRating)
  return highlyRated.length > 0 ? highlyRated : games
}

export function sortByFewestPlaysThenRating(games: Game[]): Game[] {
  return [...games].sort((a, b) => a.playCount - b.playCount || b.personalRating - a.personalRating)
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

function daysSincePhrase(days: number, seed: number): string {
  const options = [
    `you last played it ${days} day${days === 1 ? '' : 's'} ago`,
    `your last session was just ${days} day${days === 1 ? '' : 's'} back`,
    `it's only been ${days} day${days === 1 ? '' : 's'} since you played it`,
  ]
  return pick(options, seed)
}

function monthsSincePhrase(months: number, seed: number): string {
  const options = [
    `you haven't played it in ${months} month${months === 1 ? '' : 's'}`,
    `it's been ${months} month${months === 1 ? '' : 's'} since your last game`,
    `your last session was ${months} month${months === 1 ? '' : 's'} back`,
  ]
  return pick(options, seed)
}

function describeRecency(lastPlayedDate: string | null, referenceDate: Date, seed: number): string {
  if (lastPlayedDate === null) return "you've never played it"
  const days = daysSince(lastPlayedDate, referenceDate)
  if (days <= 0) return 'you played it today'
  if (days < 30) return daysSincePhrase(days, seed)
  return monthsSincePhrase(Math.round(days / 30), seed)
}

function playerRangeText(game: Game): string {
  return game.playerMin === game.playerMax
    ? `${game.playerMin}-player`
    : `${game.playerMin}\u2013${game.playerMax} player`
}

const PLAYTIME_RANGE_MINUTES = 165 // matches PLAYTIME_BOUNDS spread (15–180)
const COMPLEXITY_RANGE = 4 // matches COMPLEXITY_BOUNDS spread (1–5)

function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

function pick<T>(options: T[], seed: number): T {
  return options[seed % options.length]
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1)
}

// Standalone noun-phrase fragments describing one trait of a game — written so they read
// naturally whether they land mid-sentence or open the sentence (via capitalize()).
function describeCategory(game: Game, comparative: boolean, seed: number): string {
  const options = comparative
    ? [
        `your only ${game.category.toLowerCase()} option today`,
        `nothing else on the list matches that ${game.category.toLowerCase()} vibe`,
        `the lone ${game.category.toLowerCase()} game in the mix`,
      ]
    : [`a ${game.category.toLowerCase()} game`, `leaning into the ${game.category.toLowerCase()} category`]
  return pick(options, seed)
}

function describePlaytime(game: Game, comparative: boolean, seed: number): string {
  const minutes = game.playtimeMinutes
  if (minutes <= 45) {
    const options = comparative
      ? [
          `the quick one today at ${minutes} minutes`,
          `a lighter time commitment — just ${minutes} minutes`,
          `done in about ${minutes} minutes, faster than the rest`,
        ]
      : [`a quick ${minutes}-minute game`, `over in about ${minutes} minutes`]
    return pick(options, seed)
  }
  if (minutes >= 120) {
    const options = comparative
      ? [
          `the longer sit today at ${minutes} minutes`,
          `worth blocking off real time for — about ${minutes} minutes`,
          `a bigger commitment than the others at ${minutes} minutes`,
        ]
      : [`a longer ${minutes}-minute sit`, `settling in for about ${minutes} minutes`]
    return pick(options, seed)
  }
  const options = comparative
    ? [`a mid-length pick at ${minutes} minutes`, `right in the middle at ${minutes} minutes`]
    : [`about ${minutes} minutes long`, `a solid ${minutes}-minute game`]
  return pick(options, seed)
}

function describeComplexity(game: Game, comparative: boolean, seed: number): string {
  const level = game.complexity
  if (level <= 2) {
    const options = comparative
      ? [
          `the easiest one to teach today`,
          `noticeably lighter at ${level}/5 complexity`,
          `the breeziest pick of the bunch`,
        ]
      : [`light, ${level}/5 complexity`, `easy to teach at ${level}/5 complexity`]
    return pick(options, seed)
  }
  if (level >= 4) {
    const options = comparative
      ? [
          `the heaviest game on the list at ${level}/5 complexity`,
          `bringing more crunch than the others at ${level}/5`,
          `the meatiest pick of the three`,
        ]
      : [`hefty, ${level}/5 complexity`, `a heavier ${level}/5-complexity game`]
    return pick(options, seed)
  }
  const options = comparative
    ? [`middle-of-the-road at ${level}/5 complexity`]
    : [`medium complexity (${level}/5)`]
  return pick(options, seed)
}

type Dimension = 'category' | 'playtime' | 'complexity'
interface DimensionAssignment {
  dimension: Dimension
  comparative: boolean
}

// Assigns each game in a recommended set its own distinguishing trait so no two cards lean
// on the same attribute (e.g. two games both being described by "time" even though only one
// can genuinely be the standout on time). Unique categories are claimed first since that's a
// binary fact; playtime/complexity are then handed out exclusively, most-extreme game first.
function assignDistinguishers(group: Game[]): Map<string, DimensionAssignment> {
  const assignments = new Map<string, DimensionAssignment>()
  if (group.length <= 1) return assignments

  const claimed = new Set<string>()
  for (const game of group) {
    const uniqueCategory = group.every((other) => other.id === game.id || other.category !== game.category)
    if (uniqueCategory) {
      assignments.set(game.id, { dimension: 'category', comparative: true })
      claimed.add(game.id)
    }
  }

  const groupAvgPlaytime = mean(group.map((g) => g.playtimeMinutes))
  const groupAvgComplexity = mean(group.map((g) => g.complexity))
  const remaining = group.filter((g) => !claimed.has(g.id))
  const scored = remaining
    .map((game) => ({
      game,
      playtimeGap: Math.abs(game.playtimeMinutes - groupAvgPlaytime) / PLAYTIME_RANGE_MINUTES,
      complexityGap: Math.abs(game.complexity - groupAvgComplexity) / COMPLEXITY_RANGE,
    }))
    .sort((a, b) => Math.max(b.playtimeGap, b.complexityGap) - Math.max(a.playtimeGap, a.complexityGap))

  const usedDimensions = new Set<Dimension>()
  for (const { game, playtimeGap, complexityGap } of scored) {
    const preference: Dimension[] =
      playtimeGap >= complexityGap ? ['playtime', 'complexity'] : ['complexity', 'playtime']
    const chosen = preference.find((dimension) => !usedDimensions.has(dimension))
    if (chosen) {
      assignments.set(game.id, { dimension: chosen, comparative: true })
      usedDimensions.add(chosen)
    } else {
      // Every exclusive slot is taken — describe the game plainly rather than repeating
      // another game's "stands out" claim.
      assignments.set(game.id, { dimension: 'category', comparative: false })
    }
  }

  return assignments
}

function describeDimension(game: Game, assignment: DimensionAssignment, seed: number): string {
  if (assignment.dimension === 'category') return describeCategory(game, assignment.comparative, seed)
  if (assignment.dimension === 'playtime') return describePlaytime(game, assignment.comparative, seed)
  return describeComplexity(game, assignment.comparative, seed)
}

// Solo fallback when there's nothing else in the set to compare against — describe
// whichever trait is most notable for this game on its own.
function buildSoloDistinguishingText(game: Game, seed: number): string {
  if (game.complexity <= 2 || game.complexity >= 4) return describeComplexity(game, false, seed)
  if (game.playtimeMinutes <= 45 || game.playtimeMinutes >= 120) return describePlaytime(game, false, seed)
  return describeCategory(game, false, seed)
}

function buildPrimaryText(game: Game, mood: Mood, referenceDate: Date, seed: number): string {
  const range = playerRangeText(game)

  if (mood === 'familiar') {
    const recency = describeRecency(game.lastPlayedDate, referenceDate, seed)
    const options = [
      `Your highest-rated ${range} game, rated ${game.personalRating}/10 after ${game.playCount} plays, though ${recency}`,
      `You've rated this ${game.personalRating}/10 and played it ${game.playCount} times, but ${recency}`,
      `Among your regulars for a ${range} game, this ${game.personalRating}/10 favorite has gone quiet — ${recency}`,
    ]
    return pick(options, seed)
  }

  if (mood === 'new') {
    if (game.playCount === 0) {
      const options = [
        `You've never gotten this one to the table`,
        `This is a fresh pick — zero plays so far`,
        `Untouched so far — a clean slate`,
      ]
      return pick(options, seed)
    }
    const plays = `${game.playCount} play${game.playCount === 1 ? '' : 's'}`
    const options = [
      `Only ${plays} on record, so it's still mostly new territory`,
      `You've barely touched this one — just ${plays} in — and it's rated ${game.personalRating}/10`,
      `With just ${plays} so far, there's plenty left to discover`,
    ]
    return pick(options, seed)
  }

  // surprise
  const recency = describeRecency(game.lastPlayedDate, referenceDate, seed)
  const options = [
    `Rated ${game.personalRating}/10 — one of your best — yet ${recency}`,
    `This ${game.personalRating}/10 favorite has quietly sat on the shelf; ${recency}`,
    `You loved this enough to rate it ${game.personalRating}/10, but ${recency}`,
  ]
  return pick(options, seed)
}

const CONNECTORS_PRIMARY_FIRST = [", and it's ", ' — ', "; it's "]
const CONNECTORS_DISTINGUISHING_FIRST = [' — ', ', and ']

function buildWhy(
  game: Game,
  mood: Mood,
  referenceDate: Date,
  assignment: DimensionAssignment | undefined,
): WhySegment[] {
  const seedBase = hashString(`${game.id}:${mood}`)

  const primaryText = buildPrimaryText(game, mood, referenceDate, seedBase)
  const distinguishingText = assignment
    ? describeDimension(game, assignment, seedBase + 7)
    : buildSoloDistinguishingText(game, seedBase + 7)
  const distinguishingFirst = seedBase % 2 === 1

  if (distinguishingFirst) {
    const connector = pick(CONNECTORS_DISTINGUISHING_FIRST, seedBase + 3)
    return [
      { text: capitalize(distinguishingText), emphasis: true },
      { text: `${connector}${lowerFirst(primaryText)}.` },
    ]
  }

  const connector = pick(CONNECTORS_PRIMARY_FIRST, seedBase + 3)
  return [
    { text: `${primaryText}${connector}` },
    { text: distinguishingText, emphasis: true },
    { text: '.' },
  ]
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
    pool = highRatedPool(candidates)
    sorted = sortByFewestPlaysThenRating(pool)
  }

  const topGames = sorted.slice(0, 3)
  const distinguishers = assignDistinguishers(topGames)
  const recommendations = topGames.map((game) => ({
    game,
    why: buildWhy(game, mood, referenceDate, distinguishers.get(game.id)),
  }))

  return { candidateCount: candidates.length, recommendations }
}

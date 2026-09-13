export type GameCategory = 'Strategy' | 'Family' | 'Party' | 'Cooperative' | 'Abstract'

export const GAME_CATEGORIES: GameCategory[] = [
  'Strategy',
  'Family',
  'Party',
  'Cooperative',
  'Abstract',
]

// Mirrors the shape of src/data/games.json — one dominant category per game.
export interface Game {
  id: string
  title: string
  category: GameCategory
  playerMin: number
  playerMax: number
  playtimeMinutes: number
  complexity: number
  coverImage: string | null
  playCount: number
  lastPlayedDate: string | null
  personalRating: number
}

export interface FilterState {
  playerCount: number | null
  playtimeMin: number
  playtimeMax: number
  maxComplexity: number
  category: GameCategory | 'All'
  neverPlayedOnly: boolean
}

export const PLAYTIME_BOUNDS = { min: 15, max: 180 } as const
export const COMPLEXITY_BOUNDS = { min: 1, max: 5 } as const

export const DEFAULT_FILTERS: FilterState = {
  playerCount: null,
  playtimeMin: PLAYTIME_BOUNDS.min,
  playtimeMax: PLAYTIME_BOUNDS.max,
  maxComplexity: COMPLEXITY_BOUNDS.max,
  category: 'All',
  neverPlayedOnly: false,
}

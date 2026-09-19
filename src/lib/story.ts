import { GAME_CATEGORIES, type Game, type GameCategory } from '../types/game'
import { mean } from './kpis'
import { highRatedPool, sortByFewestPlaysThenRating } from './recommend'

export interface CategoryCount {
  category: GameCategory
  count: number
  percent: number
}

export function computeCategoryBreakdown(games: Game[]): CategoryCount[] {
  const total = games.length
  return GAME_CATEGORIES.map((category) => {
    const count = games.filter((game) => game.category === category).length
    return { category, count, percent: total > 0 ? (count / total) * 100 : 0 }
  })
    .filter((entry) => entry.count > 0)
    .sort((a, b) => b.count - a.count)
}

export interface ComplexitySummary {
  average: number
  lightCount: number
  mediumCount: number
  heavyCount: number
}

export function computeComplexitySummary(games: Game[]): ComplexitySummary {
  return {
    average: mean(games.map((game) => game.complexity)),
    lightCount: games.filter((game) => game.complexity <= 2).length,
    mediumCount: games.filter((game) => game.complexity === 3).length,
    heavyCount: games.filter((game) => game.complexity >= 4).length,
  }
}

export interface CategoryShare {
  category: GameCategory
  gameCount: number
  totalPlays: number
  collectionShare: number
  playShare: number
}

// Play share denominator is total plays across the whole collection, so a never-played
// game simply contributes 0 to its category's numerator rather than being excluded.
export function computeCategoryShares(games: Game[]): CategoryShare[] {
  const totalGames = games.length
  const totalPlays = games.reduce((sum, game) => sum + game.playCount, 0)

  return GAME_CATEGORIES.map((category) => {
    const inCategory = games.filter((game) => game.category === category)
    const totalCategoryPlays = inCategory.reduce((sum, game) => sum + game.playCount, 0)
    return {
      category,
      gameCount: inCategory.length,
      totalPlays: totalCategoryPlays,
      collectionShare: totalGames > 0 ? (inCategory.length / totalGames) * 100 : 0,
      playShare: totalPlays > 0 ? (totalCategoryPlays / totalPlays) * 100 : 0,
    }
  }).filter((entry) => entry.gameCount > 0)
}

// Same neglect concept as the recommender's "Surprise me": rated at/above the pool's
// average rating, ranked by fewest plays first, then highest rating.
export function getNeglectedShelf(games: Game[], limit = 5): Game[] {
  return sortByFewestPlaysThenRating(highRatedPool(games)).slice(0, limit)
}

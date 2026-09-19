import type { Game } from '../types/game'

export const RECENTLY_PLAYED_WINDOW_DAYS = 30

export function daysSince(dateStr: string, referenceDate: Date = new Date()): number {
  const played = new Date(dateStr)
  return Math.floor((referenceDate.getTime() - played.getTime()) / (1000 * 60 * 60 * 24))
}

export interface DashboardKpiSummary {
  totalGames: number
  neverPlayedCount: number
  recentlyPlayedCount: number
  mostPlayedCategory: { category: string; totalPlays: number } | null
}

export function computeKpis(games: Game[], referenceDate: Date = new Date()): DashboardKpiSummary {
  const totalGames = games.length
  const neverPlayedCount = games.filter((game) => game.playCount === 0).length
  const recentlyPlayedCount = games.filter(
    (game) =>
      game.lastPlayedDate !== null &&
      daysSince(game.lastPlayedDate, referenceDate) <= RECENTLY_PLAYED_WINDOW_DAYS,
  ).length

  const playsByCategory = new Map<string, number>()
  for (const game of games) {
    playsByCategory.set(game.category, (playsByCategory.get(game.category) ?? 0) + game.playCount)
  }

  let mostPlayedCategory: DashboardKpiSummary['mostPlayedCategory'] = null
  for (const [category, totalPlays] of playsByCategory) {
    if (totalPlays > 0 && (mostPlayedCategory === null || totalPlays > mostPlayedCategory.totalPlays)) {
      mostPlayedCategory = { category, totalPlays }
    }
  }

  return { totalGames, neverPlayedCount, recentlyPlayedCount, mostPlayedCategory }
}

export interface TreemapRect {
  xPct: number
  yPct: number
  widthPct: number
  heightPct: number
}

// Layout is computed in a fixed virtual coordinate space and returned as percentages,
// so it works at any rendered size without measuring the DOM.
const VIRTUAL_WIDTH = 1000
const VIRTUAL_HEIGHT = 600

function worstRatio(areas: number[], length: number): number {
  const sum = areas.reduce((s, v) => s + v, 0)
  const rmax = Math.max(...areas)
  const rmin = Math.min(...areas)
  return Math.max((length * length * rmax) / (sum * sum), (sum * sum) / (length * length * rmin))
}

/**
 * Squarified treemap. Always bands across the full width (rather than alternating
 * row/column orientation per recursion) so smaller shares land in short, wide strips
 * instead of tall, narrow slivers — landscape tiles fit an icon + label lockup better.
 * Items should already be sorted descending by value for the expected layout.
 */
export function squarify<T extends { value: number }>(items: T[]): (T & TreemapRect)[] {
  const total = items.reduce((sum, item) => sum + item.value, 0)
  if (total <= 0) return []

  const areaScale = (VIRTUAL_WIDTH * VIRTUAL_HEIGHT) / total
  const results: (T & TreemapRect)[] = []

  function layout(remaining: { item: T; area: number }[], x: number, y: number, w: number, h: number) {
    if (remaining.length === 0) return
    if (remaining.length === 1) {
      const { item } = remaining[0]
      results.push({
        ...item,
        xPct: (x / VIRTUAL_WIDTH) * 100,
        yPct: (y / VIRTUAL_HEIGHT) * 100,
        widthPct: (w / VIRTUAL_WIDTH) * 100,
        heightPct: (h / VIRTUAL_HEIGHT) * 100,
      })
      return
    }

    const side = w
    let row = [remaining[0]]
    let i = 1
    while (i < remaining.length) {
      const testRow = [...row, remaining[i]]
      if (
        worstRatio(row.map((r) => r.area), side) >=
        worstRatio(testRow.map((r) => r.area), side)
      ) {
        row = testRow
        i++
      } else break
    }

    const rowArea = row.reduce((sum, r) => sum + r.area, 0)
    const rowThickness = rowArea / side
    let cx = x
    row.forEach(({ item, area }) => {
      const itemWidth = area / rowThickness
      results.push({
        ...item,
        xPct: (cx / VIRTUAL_WIDTH) * 100,
        yPct: (y / VIRTUAL_HEIGHT) * 100,
        widthPct: (itemWidth / VIRTUAL_WIDTH) * 100,
        heightPct: (rowThickness / VIRTUAL_HEIGHT) * 100,
      })
      cx += itemWidth
    })

    layout(remaining.slice(row.length), x, y + rowThickness, w, h - rowThickness)
  }

  layout(
    items.map((item) => ({ item, area: item.value * areaScale })),
    0,
    0,
    VIRTUAL_WIDTH,
    VIRTUAL_HEIGHT,
  )

  return results
}

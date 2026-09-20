import type { CategoryCount } from '../lib/story'
import { squarify } from '../lib/treemap'
import { CATEGORY_ACCENT, CATEGORY_ICON } from '../lib/categoryStyle'

interface CategoryMosaicProps {
  breakdown: CategoryCount[]
  /** When false, tiles show only the icon — for use alongside a legend that already holds the values. */
  showValues?: boolean
}

// Mosaic/squarified-treemap view of the category breakdown: tile area = share of the
// collection, subtle tint fill (not a solid color), and an icon + percentage stacked in
// the center. Category names live in the CategoryKey legend rather than the tile itself —
// labels inside tiles this narrow truncate too easily to be reliable.
export default function CategoryMosaic({ breakdown, showValues = true }: CategoryMosaicProps) {
  const tiles = squarify(breakdown.map((entry) => ({ ...entry, value: entry.percent })))

  return (
    <div className="relative aspect-[7/5] w-full overflow-hidden rounded-lg" aria-hidden="true">
      {tiles.map((tile) => {
        const Icon = CATEGORY_ICON[tile.category]
        const color = CATEGORY_ACCENT[tile.category]

        return (
          <div
            key={tile.category}
            className="absolute flex flex-col items-center justify-center gap-1 rounded-md border"
            style={{
              left: `${tile.xPct}%`,
              top: `${tile.yPct}%`,
              width: `calc(${tile.widthPct}% - 3px)`,
              height: `calc(${tile.heightPct}% - 3px)`,
              backgroundColor: `${color}1f`,
              borderColor: `${color}55`,
            }}
          >
            <Icon size={18} strokeWidth={2} style={{ color }} aria-hidden="true" />
            {showValues && (
              <>
                <span className="text-xl font-bold" style={{ color }}>
                  {Math.round(tile.percent)}%
                </span>
                <span className="text-[11px] font-medium" style={{ color: `${color}cc` }}>
                  ({tile.count})
                </span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}

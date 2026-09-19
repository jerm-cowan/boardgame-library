import { Link } from 'react-router-dom'
import type { Game } from '../types/game'

interface StoryTakeawayProps {
  spotlightGame: Game | null
}

export default function StoryTakeaway({ spotlightGame }: StoryTakeawayProps) {
  return (
    <section aria-labelledby="beat-takeaway-heading" className="space-y-4">
      <h2 id="beat-takeaway-heading" className="text-lg font-semibold">
        The takeaway
      </h2>
      <p className="text-muted-foreground">
        {spotlightGame ? (
          <>
            You don't need to buy anything new tonight —{' '}
            <strong className="text-foreground">{spotlightGame.title}</strong> is already on your
            shelf, already rated {spotlightGame.personalRating}/10, and overdue for a rematch.
          </>
        ) : (
          "You don't need to buy anything new — your shelf already holds games worth revisiting."
        )}{' '}
        Next time you're not sure what to play, try the "Surprise me" option on the dashboard's
        picker — it's built to surface exactly these overlooked favorites.
      </p>
      <Link
        to="/dashboard"
        className="inline-block rounded-md bg-popover px-4 py-2 text-sm font-medium hover:bg-hover"
      >
        Go pick tonight's game
      </Link>
    </section>
  )
}

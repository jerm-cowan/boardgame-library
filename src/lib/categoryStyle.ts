import { Handshake, PartyPopper, Shapes, Swords, Users, type LucideIcon } from 'lucide-react'
import type { GameCategory } from '../types/game'

// One accent + icon per category, signed off in the Phase 6 polish pass.
// Used sparingly (border strips, dots, badge outlines) — never as full fills.
export const CATEGORY_ACCENT: Record<GameCategory, string> = {
  Strategy: '#5B8DEF',
  Family: '#6BBF6B',
  Party: '#F2A94A',
  Cooperative: '#4FBDBA',
  Abstract: '#A78BFA',
}

export const CATEGORY_ICON: Record<GameCategory, LucideIcon> = {
  Strategy: Swords,
  Family: Users,
  Party: PartyPopper,
  Cooperative: Handshake,
  Abstract: Shapes,
}

# BRIEF.md — Personal Board Game Library

## Project
A single-repo Protogen capstone combining a **P301 operational dashboard** and a **P302 interactive data story**, sharing one fabricated dataset, visual system, and codebase. Two distinct routes, one product.

- `/dashboard` — the acting layer
- `/collection-story` — the understanding layer

Inspired by boardgamegeek.com, but reimagined to be genuinely insightful rather than a raw data dump.

## Persona
A board game collector with a sizable library (40–80 games) who:
1. Wants to quickly decide what to play right now, for a specific group.
2. Occasionally wants to notice patterns in what they collect vs. what they actually play.

No genre assumptions — the design must feel neutral enough to fit strategy, party, family, and cooperative games alike.

## Purpose

### P301 — Dashboard: "What's in my collection, and what should I play right now?"
The dashboard is the acting layer. Its centerpiece is not a chart — it's a decision.

**Collection table/card view fields (7):**
Title · Category · Player-count range · Playtime · Complexity · Play count · Last played · Rating

**KPIs (4):**
Total games · Never played · Recently played · Most-played category

**Filters (1 consolidated panel):**
Player count · Playtime · Complexity · Category (status shown as a toggle, not a separate filter)

**Flagship widget — "Pick Tonight's Game":**
- Input 1: Group size (number of players)
- Input 2: Who's playing — Family/kids-friendly · Adults only · Mixed group
- Input 3: Mood — Familiar favorite · Something new-to-us · Surprise me (neglected pick)
- Output: 1–3 recommended games, each already owned, each with a **one-line "why"** generated from the data (e.g., *"Your highest-rated 4-player game, but you haven't played it in 6 months"*). This is where the P302 insight (collect vs. play, neglected shelf) surfaces inside the dashboard's core action, without needing a separate page.

**Interactions:** search by title, sort, filter panel, open game detail (no photo required for MVP), add a game via lightweight form.

### P302 — Collection Story: "What does my collection and play behavior reveal that the picker doesn't say out loud?"
The story is the understanding layer — a curated narrative over the full dataset, not a restatement of dashboard numbers.

**Thesis:** *The games I collect are not always the games I actually play.*

**Narrative sequence (4 beats):**
1. **Snapshot** — size and character of the collection
2. **What I collect vs. what I actually play** — the core contradiction
3. **The neglected shelf** — highly-rated, rarely-played games
4. **The takeaway** — a nudge back to the dashboard (e.g., "Next time, try the Surprise Me picker")

**Interactions (2, kept purposeful):** toggle Owned Games / Played Games, highlight one category. No dashboard-filter handoff or time-period selector for MVP — explicitly deferred.

## Visual Identity
- Clean, minimal, data-table-first. No genre-specific styling.
- **Dark palette** with elevation via lightening, not heavy shadows: base `#121212` → surface `#1a1a1a` → card/raised `#212121` → hover/popover `#2a2a2a`.
- Borders used judiciously — prefer surface/fill separation over line dividers; reserve borders for where two same-toned surfaces genuinely meet.
- Stack: **React + Vite + Tailwind**, **TanStack Table** for the collection grid (headless, so it inherits the design system instead of fighting a pre-styled grid), shadcn-style semantic tokens (`background`, `card`, `popover`, `muted`, `accent`) for theming.

## Data
One fabricated dataset with two parts:
- **Collection metadata** — static per game (title, category, player range, playtime, complexity, cover image field reserved but unused in MVP)
- **Behavioral data** — play count, last played date, rating (drives the contradiction/neglected-shelf story and the recommender's "why" lines)

## Out of Scope for MVP
Cover images/photos · real BoardGameGeek integration · barcode scanning · authentication · cloud persistence · social features · purchase recommendations · marketplace functionality · AI-generated art · complex NL querying · fully dynamic AI-written stories · real-time collaboration · dashboard-filter-to-story handoff · time-period selector in story

## Definition of Success
1. User can understand and filter their collection.
2. User can get a suitable game recommendation from games they already own, with a data-backed reason.
3. User can visit a distinct Collection Story experience.
4. The story reveals at least one meaningful pattern or contradiction, not just restated KPIs.
5. Dashboard and story feel connected (shared data, shared visual system, one nudge linking them) but clearly serve different purposes.
6. Both flows work end to end and match this brief.

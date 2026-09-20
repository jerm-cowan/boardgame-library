# BRIEF.md — Board Room

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
Player count · Playtime · Complexity · Category (status shown as a toggle, not a separate filter). Search by title lives inside this panel too rather than in a separate row above the KPIs — search and the filter panel are both mechanisms for narrowing what's visible in the collection table, so they're grouped as one adjacent cluster next to the table instead of requiring a scroll past unrelated sections (KPIs, recommender) to reach the rest of the narrowing controls. Within the panel, controls are grouped by role rather than by strict order: Search and Category sit together in the first row as the two primary "locate a game" mechanisms (by name, or by browsing type), given room to breathe; Status, Player count, Playtime, and Complexity sit together in a second row as secondary refinement controls that further narrow within whatever search/category is already selected — Status is grouped there since it's a compact toggle similar in visual weight to the numeric range/stepper controls. "Reset filters" lives in the panel header (top-right, next to the "Filters" title) rather than at the bottom of the controls, since it's a persistent, low-frequency action that shouldn't require scrolling past every filter to reach.

**Flagship widget — "Pick Today's Game":**
- Input 1: Group size (number of players)
- Input 2: Who's playing — Family/kids-friendly · Adults only · Mixed group
- Input 3: Mood — Familiar favorite · Something new-to-us · Surprise me (neglected pick). The recommender stays at these 3 inputs; playtime is not a 4th input — it's a recurring through-line fact used inside the why-line (see below).
- Output: 1–3 recommended games, each already owned, each with a **one-line "why"**. Each why-line is assembled from a small phrase bank per game rather than one fixed template per mood, so connector phrasing and sentence order vary across cards instead of reading like a mail-merge. Why-lines are written as standalone statements about that specific game — they avoid meta-language like "in this batch" or "compared to the others here." Formatting: one sentence per card, no bullets; bold is applied only to that card's distinguishing attribute (playtime, complexity, or category framing), while the shared ranking rationale (rating, play count, recency) stays in normal weight. "Surprise me" surfaces neglected picks using a rating-vs.-play-count comparison against the candidate pool's averages (games rated at or above the pool's average rating, ranked by fewest plays first, then highest rating) rather than a single fixed neglect-score formula. This is where the P302 insight (collect vs. play, neglected games) surfaces inside the dashboard's core action, without needing a separate page.

**Interactions:** search by title, sort, filter panel, open game detail (no photo required for MVP), add a game via lightweight form.

### P302 — Collection Story: "What does my collection and play behavior reveal that the picker doesn't say out loud?"
The story is the understanding layer — a curated narrative over the full dataset, not a restatement of dashboard numbers.

**Thesis:** *The games I collect are not always the games I actually play.*

**Narrative sequence (3 beats):**
1. **Snapshot** — size and character of the collection
2. **What I collect vs. what I actually play** — the core contradiction, merged with the neglected games list into one two-column section: an owned/played comparison chart (left) and a list of specific highly-rated, rarely-played games (right). Clicking a category in the chart filters the neglected-games list to that category's own neglected games (or shows a brief empty state if it has none), so the aggregate gap and its specific games stay next to each other rather than requiring separate scroll-past beats.
3. **The takeaway** — a nudge back to the dashboard (e.g., "Next time, try the 'Surprise me' mood in Pick Today's Game")

**Interactions (1, kept purposeful):** click a category to both highlight it in the chart and filter the neglected-games list beside it. No dashboard-filter handoff or time-period selector for MVP — explicitly deferred. (A separate Owned Games / Played Games toggle was removed after review — the paired Owned%/Played% bars already display both distributions simultaneously per category, so a view toggle had no filtering effect and was redundant.)

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

## Stretch / Post-MVP Enhancements
Ideas surfaced during Phase 3 work, explicitly deferred and not part of current phase scope:

- **Cover images (deferred):** Use DiceBear's free, open-source, MIT-licensed HTTP API (no API key, no signup) to generate a placeholder SVG image per game, seeded by the game's `id` so each game gets a consistent image across sessions. Background color should tie to that game's category accent color once category color-coding exists (planned for the Phase 6 polish pass). This approach avoids needing to source real cover art or use image-generation tools.
- **User notes field (deferred):** Add a `userNotes: string | null` field to the game data model, surfaced in the detail drawer as a free-text section distinct from the existing stat fields. Intent is to capture personal, non-systematic content — house rules the user plays with, a specific memorable game-night moment, or their own reasoning for a complexity/rating choice — not a restatement of table data. When implemented, roughly half the fabricated games should have populated notes and half should be `null`, so the UI must handle an empty state gracefully (e.g., "No notes yet" rather than a blank gap).

## Definition of Success
1. User can understand and filter their collection.
2. User can get a suitable game recommendation from games they already own, with a data-backed reason.
3. User can visit a distinct Collection Story experience.
4. The story reveals at least one meaningful pattern or contradiction, not just restated KPIs.
5. Dashboard and story feel connected (shared data, shared visual system, one nudge linking them) but clearly serve different purposes.
6. Both flows work end to end and match this brief.

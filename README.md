# Board Game Library

A single-repo Protogen capstone combining a **P301 operational dashboard** and a **P302 interactive data story**, sharing one fabricated dataset, visual system, and codebase.

- `/dashboard` — the acting layer: filter your collection and get a data-backed recommendation for what to play tonight.
- `/collection-story` — the understanding layer: a curated narrative revealing the gap between what you collect and what you actually play.

See [BRIEF.md](./BRIEF.md) for the full product brief (persona, scope, data model, and success criteria) and [docs/phase-prompts/](./docs/phase-prompts/) for the phased build prompts used with GitHub Copilot.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4 (dark theme via CSS variable tokens, see `src/index.css`)
- React Router
- TanStack Table (headless, for the collection grid)

## Getting started

```bash
npm install
npm run dev
```

## Data

The collection is a fabricated dataset of ~50 games at `src/data/games.json`, combining static collection metadata (title, category, player range, playtime, complexity) with behavioral data (play count, last played date, personal rating). The data is intentionally shaped to surface a contradiction between highly-rated/owned games and actually-played games — see BRIEF.md for details.

Each game also carries an `audience: 'family' | 'adults' | 'mixed'` tag (added in Phase 3, since the original data model had no audience/age field) used by the "Pick Tonight's Game" recommender's "who's playing" input. It's heuristically derived from category + complexity (Family/Party at complexity ≤3 → `family`; Strategy/Abstract at complexity ≥4 → `adults`; everything else → `mixed`).

## Recommendation logic ("Pick Tonight's Game")

Logic lives in `src/lib/recommend.ts`; dashboard KPI math lives in `src/lib/kpis.ts`. Rationale for the choices below:

**Candidate pool.** Filters to owned games whose player range includes the requested group size, matching the audience selection ("mixed" imposes no restriction; "family"/"adults" also accept `mixed`-tagged games, since those work for either).

**Ranking per mood:**
- *Familiar favorite* — restricts to games at/above the pool's median play count ("frequently played"), then sorts by rating. The median is computed live from the candidate pool rather than a fixed threshold so it adapts as the collection and play history grow.
- *Something new-to-us* — sorts by play count ascending (never-played first), tie-broken by rating. No rating floor, since the point is exposure, not quality.
- *Surprise me* — restricts to games at/above the pool's average rating ("highly-rated"), then sorts by play count ascending. This is the deliberate "neglected shelf" pattern: good games you're not playing.
- All three fall back to the full candidate pool if the mood-specific filter (frequent/highly-rated) empties it out, so a small collection never returns zero results when candidates exist.

**Why-line generation.** Each line combines two parts so it reads as a specific, non-generic sentence rather than a restated stat:
1. A **primary clause** (rating, play count, recency) picked from a 2–3 option phrase bank per mood, so repeated moods don't read identically.
2. A **distinguishing clause** — a second attribute (category rarity, playtime, or complexity) that sets this game apart from the *other* recommended games in the same result, not just from the dataset at large.

Sentence order (primary-first vs. distinguishing-first) and connector wording are also picked from small phrase banks. All choices are seeded deterministically from the game id + mood (not `Math.random()`), so the same game/mood combination always reads the same way on re-render, while different games in the list still read differently from each other.

**Why the distinguishing attribute is assigned across the whole set, not per-game:** an early version computed each game's "standout" trait independently (comparing itself to the others), which let two games in the same set both claim the same attribute (e.g. both described by playtime) — undermining the "this is what makes it different" premise. `assignDistinguishers()` fixes this with one allocation pass per result set: unique categories are claimed first (a binary fact, so it can't collide), then playtime/complexity are handed out exclusively — the most extreme game claims a trait first, and the rest are forced to find a different one. If a set of 3 games runs out of distinct traits, the leftover game gets a plain, non-comparative mention instead of a false "stands out" claim.

**Empty state.** If no owned game matches the group size + audience combination, the widget shows an explicit message rather than an empty list or silently falling back to unrelated games.

**KPI: "Recently played" window.** Fixed at 30 days from today (`RECENTLY_PLAYED_WINDOW_DAYS` in `src/lib/kpis.ts`), matching the brief's suggested window.

## Project status

Actively developed in phases; see `docs/phase-prompts/` for the prompt history.

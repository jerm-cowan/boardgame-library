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

## Project status

Actively developed in phases; see `docs/phase-prompts/` for the prompt history.

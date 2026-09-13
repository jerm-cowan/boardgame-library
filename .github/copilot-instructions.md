# Copilot instructions — Board Game Library

Read [BRIEF.md](../BRIEF.md) at the repo root first; it is the source of truth for persona, scope, data model, and success criteria for this capstone.

- Two routes, one product: `/dashboard` (P301, acting layer) and `/collection-story` (P302, understanding layer).
- Dark theme tokens are fixed per BRIEF.md's elevation ramp (`background` `#121212` → `surface` `#1a1a1a` → `card` `#212121` → `hover`/`popover` `#2a2a2a`). Don't introduce new base colors without asking.
- Fabricated dataset lives at `src/data/games.json`; its distribution is intentional (neglected-shelf, comfort-food, and never-played clusters) — don't "fix" it into random noise.
- See `docs/phase-prompts/` for the phased build history and prompts already run.

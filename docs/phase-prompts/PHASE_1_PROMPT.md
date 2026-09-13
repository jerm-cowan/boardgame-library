# Phase 1 Prompt — Setup + Data Model
Reference copy for `/docs/phase-prompts/` (posterity only — not a Copilot slash-command file).
Paste the text below directly into a fresh GitHub Copilot Chat (Sonnet) session in VS Code, in your empty repo folder.

---

I'm building a Protogen capstone: a personal board game library combining a P301 operational dashboard and a P302 interactive data story in one repo, two routes. Full context is in the BRIEF.md I'm about to add — read it fully before doing anything else.

**Do this in order:**

1. **Scaffold the project**: React + Vite + Tailwind. Set up TanStack Table as a dependency for the collection grid later (don't build the table yet, just get it installed and confirmed working with a placeholder). Set up client-side routing with two routes: `/dashboard` and `/collection-story`, each rendering a placeholder page for now.

2. **Set up the dark theme tokens** in Tailwind config / a CSS variables file, using this elevation ramp — do not deviate without asking me:
   - `background` (base): `#121212`
   - `surface`: `#1a1a1a`
   - `card` / raised: `#212121`
   - `hover` / `popover`: `#2a2a2a`
   - Borders should be a subtle, low-opacity token (not a fixed color), used sparingly — only where two same-toned surfaces need separation. Prefer fill/elevation differences over border lines everywhere else.

3. **Build the fabricated dataset** as a local JSON file (or a small set of JSON files) with two parts:
   - **Collection metadata** (static): `id`, `title`, `category`, `playerMin`, `playerMax`, `playtimeMinutes`, `complexity` (1–5 scale), and a `coverImage` field reserved but left null/unused for now.
   - **Behavioral data** (per game): `playCount`, `lastPlayedDate`, `personalRating` (1–10).
   - Generate **~50 fabricated games** with realistic variation: some high-rated but rarely played (for the "neglected shelf" story beat later), some frequently played regardless of rating, a spread of categories (strategy, family, party, cooperative, abstract), player ranges, and complexity levels. Make sure the data actually supports a visible contradiction between "what's owned/highly-rated" and "what's actually played" — don't make it random noise.

4. **Set up the repo scaffolding required for AI scaffolding + submission**: `README.md` and a placeholder `LICENSE` in the root, a `.copilot` or context-docs folder if useful, and confirm `BRIEF.md` sits at the root (I'll add it, just make sure nothing else is dumped loosely alongside it).

5. **Commit in logical, descriptive steps** as you go (e.g., "scaffold Vite+Tailwind+routing", "add dark theme tokens", "add fabricated collection dataset") rather than one giant commit at the end.

**Before you write any code**, tell me your plan for the folder structure and confirm the dataset shape back to me in plain language — I want to sign off on both before you generate files.

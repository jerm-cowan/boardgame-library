# Phase 2 Prompt — Dashboard Core
Reference copy for `/docs/phase-prompts/` (posterity only — not a Copilot slash-command file).
Paste the text below directly into a fresh GitHub Copilot Chat (Sonnet) session in VS Code, in your existing repo (after Phase 1 is committed).
Suggested effort: **Medium** (well-specified UI work over a known dataset; bump to High only if TanStack Table integration or the add-game form logic gets genuinely tangled).

---

Continuing the Personal Board Game Library capstone — BRIEF.md is still the source of truth, and Phase 1 (routing, dark theme tokens, fabricated dataset, repo scaffolding) is already committed. This phase builds the `/dashboard` route's core experience only — no KPIs, no recommender, no story page yet, those come later.

**One dataset clarification carried over from Phase 1**: every game has exactly one dominant `category` (Strategy, Family, Party, Cooperative, or Abstract). Don't add multi-category support — the filter and table logic should assume single-select category per game.

**Do this in order:**

1. **Build the collection table/card view** as the centerpiece of `/dashboard`, using TanStack Table. Display these fields: Title, Category, Player range (min–max), Playtime, Complexity, Play count, Last played, Rating. No cover image column for MVP. Use the dark elevation tokens from Phase 1 (`background`/`surface`/`card`/`hover`) for row and header styling — rows should feel like subtly raised surfaces, not boxed-in cells with heavy borders.

2. **Add search by title** — a simple text input that filters the table live as the user types.

3. **Add sorting** — clickable column headers for at least Title, Complexity, Play count, Last played, and Rating, using TanStack Table's built-in sorted row model rather than custom sort logic.

4. **Add one consolidated filter panel** (not scattered individual filters) covering: player count, playtime range, complexity, and category. Include a simple status toggle (e.g., "Never played" vs. "All") — this is a toggle, not a fifth filter field.

5. **Add a game detail view** — clicking a row/card opens a detail panel or modal with the full record for that game. No photo/image slot needed yet; leave a reserved but empty area if you want the layout to anticipate it later.

6. **Add a lightweight "Add a Game" form** — the same fields as the dataset shape (title, category, player range, playtime, complexity; rating and play count can default to 0/null since it's unplayed). Keep validation minimal — required fields only, no elaborate error states yet.

7. **Commit in logical, descriptive steps** as each piece lands (e.g., "add TanStack Table with sorting", "add search and filter panel", "add game detail view and add-game form") rather than one big commit.

**Before you write any code**, confirm back to me: (a) how you're structuring the filter panel state (one shared filter object vs. separate state per filter), and (b) whether the detail view will be a modal or a side panel/drawer. I want to sign off on both before you generate files.

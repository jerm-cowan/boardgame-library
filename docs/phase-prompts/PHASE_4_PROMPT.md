# Phase 4 Prompt — Collection Story Build
Reference copy for `/docs/phase-prompts/` (posterity only — not a Copilot slash-command file).
Paste the text below directly into a fresh GitHub Copilot Chat (Sonnet) session in VS Code, in your existing repo (after Phase 3 is committed and pushed, and BRIEF.md is updated).

**Suggested effort: Medium.** Most of this phase is presentational — narrative layout and charts over data you already have. If the "collect vs. play" comparison math or neglected-shelf detection comes out shallow, generic, or miscalculated, bump just that piece to **High**. This isn't a long-horizon or architecturally ambiguous task, so don't start at High across the board.

---

Continuing the Personal Board Game Library capstone — BRIEF.md is the source of truth (now updated with the Phase 3 recommender refinements and the Stretch Enhancements section — read it fully before starting). Phases 1–3 are committed and pushed: routing, dark theme, fabricated dataset, dashboard table/filters/detail drawer/add-game form, KPI strip, and the "Pick Tonight's Game" recommender. This phase builds the `/collection-story` route — a curated narrative, not a second dashboard. No dashboard-filter handoff and no time-period selector for this phase — those are explicitly out of scope per BRIEF.md.

**Do this in order, building all 4 beats as a single scrollable/sequential narrative on `/collection-story`:**

1. **Beat 1 — Snapshot.** Establish collection size and general character: total games, spread across categories, rough complexity distribution. This should read as a brief scene-setting intro, not a KPI repeat of the dashboard — use a sentence-driven layout with one supporting visual (e.g., a simple category breakdown chart), not another table.

2. **Beat 2 — What I collect vs. what I actually play.** This is the core contradiction and the heart of the story. Compute and compare **collection share** (percentage of owned games per category) against **play share** (percentage of total play sessions per category, using `playCount`). Visualize the gap — a paired bar chart or similar comparison, not a data table. The accompanying narrative text should name the pattern in plain language (e.g., "Strategy games make up 40% of your shelf but only 22% of your actual play time").

3. **Beat 3 — The neglected shelf.** Surface games with high `personalRating` but low `playCount` (or long-ago `lastPlayedDate`) — same neglect-score concept used in the recommender's "Surprise me" logic, reused here for the story rather than duplicated with different logic. Show 3–5 specific games by name, not just a stat.

4. **Beat 4 — The takeaway.** A short closing nudge that links back to the dashboard — e.g., suggesting the reader try the recommender's "Surprise me"/neglected-pick option on one of the games surfaced in Beat 3. Include a visible CTA button/link back to `/dashboard`.

5. **Add exactly 2 interactions, no more:**
   - A toggle between "Owned Games" and "Played Games" views on the Beat 2 comparison chart.
   - The ability to highlight a single category (e.g., click a legend item) to isolate it across the Beat 2 visualization.

6. **Style using the existing dark elevation tokens** — this page should feel visually continuous with the dashboard (same palette, same surface/card treatment), but its layout should read as a narrative flow (sequential sections) rather than a grid of widgets.

7. **Commit in logical, descriptive steps** (e.g., "add collection story route and snapshot beat", "add collect-vs-play comparison chart", "add neglected shelf beat", "add takeaway beat and dashboard CTA", "add owned/played toggle and category highlight").

**Before you write any code**, confirm back to me: (a) what charting approach/library you plan to use for the Beat 2 comparison visualization, and (b) how you're calculating "play share" — specifically whether a never-played game counts as 0% or gets excluded from the denominator. I want to sign off on both before you generate files.

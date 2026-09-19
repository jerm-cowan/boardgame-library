# Phase 3 Prompt — Dashboard KPIs + "Pick Tonight's Game" Recommender
Reference copy for `/docs/phase-prompts/` (posterity only — not a Copilot slash-command file).
Paste the text below directly into a fresh GitHub Copilot Chat (Sonnet) session in VS Code, in your existing repo (after Phase 2 is committed and pushed).

**Suggested effort: Medium to start.** The KPI widgets are simple aggregation — stay at Medium for those. But the recommender's "why" line generation is closer to a genuine reasoning/design problem (ranking logic + templated explanation over multiple data dimensions), so if Sonnet's first pass at the "why" logic feels shallow, generic, or it skips edge cases (e.g., no games match the filters), bump to **High** for just that piece rather than the whole phase. Don't jump to Max — this isn't a long-horizon or architecturally ambiguous task.

---

Continuing the Personal Board Game Library capstone — BRIEF.md is still the source of truth. Phases 1 and 2 are committed and pushed (routing, dark theme, fabricated dataset, collection table with search/sort/filter, detail drawer, add-game form). This phase adds the dashboard's KPI strip and its flagship widget: the "Pick Tonight's Game" recommender.

**Do this in order:**

1. **Add four KPI summary widgets** above or alongside the collection table: Total games, Never played, Recently played (e.g., played within the last 30 days — confirm the exact window with me if ambiguous), and Most-played category. These should read live from the same dataset already powering the table — no separate data source.

2. **Build the "Pick Tonight's Game" recommender** as a distinct, prominent widget on `/dashboard`. Inputs:
   - **Group size** — number of players (numeric input or stepper)
   - **Who's playing** — Family/kids-friendly · Adults only · Mixed group (single-select)
   - **Mood** — Familiar favorite · Something new-to-us · Surprise me (single-select)

   Logic: filter to games the user already owns that fit the player count, then rank/select based on mood:
   - *Familiar favorite* → highest personal rating among frequently-played games
   - *Something new-to-us* → lowest play count (including never-played) among games that still fit player count and audience
   - *Surprise me* → a highly-rated game with a notably low play count relative to its rating (the "neglected shelf" pattern) — this is the one that should feel like a genuine insight, not just a random pick

3. **Generate a one-line "why" for each recommended game** (1–3 results), written from the actual data — e.g., "Your highest-rated 4-player game, but you haven't played it in 6 months" or "You've never tried this one, and it fits your group size and skews easy." Avoid generic filler like "This is a great choice!" — the line must reference a real attribute (rating, play count, last played, complexity) from that specific game's record.

4. **Handle the empty/edge case explicitly**: if no owned game matches the player count and audience combination, show a clear, non-broken empty state rather than silently returning nothing — this matters for the "Go further" rubric criterion on edge cases.

5. **Style both the KPI strip and the recommender widget** using the existing dark elevation tokens — the recommender should feel like the dashboard's most prominent surface (highest elevation / most visual weight), since it's the primary action, not a secondary widget.

6. **Commit in logical, descriptive steps** (e.g., "add KPI summary widgets", "add Pick Tonight's Game recommender inputs", "add recommendation ranking and why-line logic", "handle empty recommendation state").

**Before you write any code**, walk me through your ranking logic for each mood option in plain language, and confirm the "Recently played" KPI's time window with me. I want to sign off on the recommendation logic specifically — this is the part of the app most likely to feel generic if it's not grounded in the actual data.

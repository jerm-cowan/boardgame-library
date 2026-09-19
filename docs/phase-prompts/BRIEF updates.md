# BRIEF.md Update Prompt — Phase 3 Recap + Stretch Enhancements
Reference copy for `/docs/phase-prompts/` (posterity only — not a Copilot slash-command file).
Paste the text below into your active Phase 3 chat (or a fresh one — Sonnet just needs to read BRIEF.md and the recommender code).
Suggested effort: **Low** (documentation-only, no code changes).

---

Please update BRIEF.md — this is a documentation-only change, don't touch any component code.

**1. Update the "Pick Tonight's Game" section to reflect what was actually built in Phase 3:**
- Describe the current why-line generation approach: a small phrase bank per game (not one fixed template per mood) that varies connector phrasing and sentence order across cards, and avoids meta-language like "in this batch" or "compared to the others here" in favor of standalone statements about that specific game.
- Note the formatting rule: one sentence per card, no bullets, bold applied only to the distinguishing attribute (playtime, complexity, or category framing), with the shared ranking rationale left in normal weight.
- Confirm playtime is used as a recurring through-line fact in the why-line rather than a 4th recommender input — the recommender stays at 3 inputs (group size, who's playing, mood).
- If the "Surprise me" mood's underlying logic or label changed at all during refinement (e.g., the neglect-score formula weighting rating vs. play count), update the description to match the actual current implementation, not the original spec.

**2. Add a new "Stretch / Post-MVP Enhancements" section**, placed directly after the existing "Out of Scope for MVP" section, documenting two ideas that came up during Phase 3 work but are explicitly deferred — not part of current phase scope:

- **Cover images (deferred):** Use DiceBear's free, open-source, MIT-licensed HTTP API (no API key, no signup) to generate a placeholder SVG image per game, seeded by the game's `id` so each game gets a consistent image across sessions. Background color should tie to that game's category accent color once category color-coding exists (planned for the Phase 6 polish pass). This approach avoids needing to source real cover art or use image-generation tools.
- **User notes field (deferred):** Add a `userNotes: string | null` field to the game data model, surfaced in the detail drawer as a free-text section distinct from the existing stat fields. Intent is to capture personal, non-systematic content — house rules the user plays with, a specific memorable game-night moment, or their own reasoning for a complexity/rating choice — not a restatement of table data. When implemented, roughly half the fabricated games should have populated notes and half should be `null`, so the UI must handle an empty state gracefully (e.g., "No notes yet" rather than a blank gap).

Keep both stretch items clearly labeled as deferred — do not implement either now. This section exists purely so the ideas aren't lost before Phase 6 wraps.

Show me the diff/updated sections before finalizing so I can confirm accuracy against what was actually built.

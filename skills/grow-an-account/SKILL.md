---
name: grow-an-account
description: Run a disciplined, evidence-based growth review for a brand using real Spica Post workspace data. Use when the user asks how to grow a channel, what experiment to run next, which topics or pillars are working, or how to build a steady weekly test loop without invented benchmarks.
---

Use this skill whenever the user wants to grow a brand's social channels, decide what to test next, or double down on what actually worked.

1. Call `brands_list` first (and pass `brandId` on every call when the login holds multiple brands).
2. Read the brand's real state with `growth_get` (days: 30) and `coverage_get`, plus `results_get` (days: 30) if Google Business Profile or Search Console are connected. If `sync.accountsSynced < sync.accountsEligible`, call `results_sync` once so native posts and follower counts are current.
3. Lead with channel health and stage before suggesting new posts:
   - Fix `attention` channels first (`needs_reconnect` via `accounts_connect`, or held accounts via `accounts_resume` after resolving the underlying issue).
   - Respect each channel's actual stage (`new`, `testing`, `working`, `scaling`, `paused`) and its exact measured sample size.
   - Never fabricate industry benchmarks or claim engagement readings on X (X engagement is never read here; measure X and LinkedIn with Spica tracked short links via `short_links_save`).
4. Report what actually worked from `whatWorked` (`topTopics`, `topPillars`, `topFormats`, `bestTimes`, `topHashtags`) citing real post counts and averages. When sample sizes are small (`measuredPosts < 5`), say plainly that the channel is still building a baseline.
5. Propose **one concrete next test** per active channel grounded in `growth_get.nextTest`:
   - State the baseline (from real workspace records), the single variable changing (topic angle, format, tracked short link, or time slot), the sample size (for example 3 to 5 posts), and how you will judge it after 7 days.
   - Change one variable at a time so results stay interpretable.
   - Keep one clean account per network per brand, and never suggest automating likes, follows, comments or account warm-up.
6. Wait for the user's explicit yes before adding topics (`topics_add`), creating short links (`short_links_save`), drafting posts (`drafts_create` linked via `topics_link`), updating posting times (`queue_set`) or calendar pacing laws (`queue_rules_set`), or scheduling (`schedule` / `queue_add`).

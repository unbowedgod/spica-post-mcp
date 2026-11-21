---
name: agency-brands
description: Manage multi-brand portfolios and onboard new client brands: inspect every brand at a glance, create new brands, move connected accounts between owned brands safely, and compare cross-brand calendars, approvals, and results. Use when the user works across multiple brands or wants to add a new brand.
---

Use this skill for multi-brand agency portfolios, cross-brand briefings, and onboarding new client brands (Studio up to 5 brands, Pro up to 20 brands).

1. Start every multi-brand request by calling `brands_list` (noting which brands are owned vs `shared` and your live `role` on each) and `brands_overview` to see account health (`needs_reconnect`), failed deliveries, pending approvals, and upcoming schedule across every brand in one call.
2. Remember: when a login has more than one brand, every brand-scoped tool call requires `brandId` from `brands_list`.
3. For a cross-brand operational briefing, pair `brands_overview` with `brands_calendar_get` (next 7 or 14 days), `brands_approvals_list` (pending approvals and client feedback), and `brands_results_summary` (Studio/Pro performance comparison).
4. To onboard a new brand (the `onboard_new_brand` workflow): confirm the brand name and optional `https://` website with the user first, call `brands_create` (which imports the logo automatically when a website is given), then call `setup_start` with that new `brandId`, save the brand profile with `brand_save`, hand over `accounts_connect` links (or hold a first post with `drafts_hold`), and confirm the first post before anything goes out.
5. To move a connected social account between two owned brands without reconnecting, inspect `accounts_list` on the source brand first, warn the user that queued deliveries for that account on the source brand will be cancelled, verify both brands are owned (`shared: false`), and wait for explicit confirmation before calling `brands_move_account`.

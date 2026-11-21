---
name: rescue-and-manage
description: Run a daily briefing across one or all brands, diagnose failed deliveries, share reconnect links, retry approved posts, or move and cancel scheduled batches. Use when the user asks what needs attention, why a post failed, or to move or cancel scheduled posts.
---

Use this skill for day-to-day operations, multi-brand agency briefings, and fixing failed or changing scheduled posts.

1. For a multi-brand briefing, call `brands_overview` and `brands_calendar_get` (days: 7 or 14). For one brand, call `workspace_overview`, `content_calendar_get` and `jobs_query`.
2. Surface items that need attention first: accounts with `needs_reconnect`, failed deliveries in the last 7 days, and upcoming empty calendar days.
3. For lapsed accounts, call `accounts_connect` and hand the user direct reconnect links. Never ask for a password.
4. For failed deliveries (`state: "failed"`), explain the cause from `error`. Never retry a delivery whose state is `unknown` (read `jobs_get` again instead). Ask for explicit approval before calling `jobs_retry` with a fresh `idempotencyKey`.
5. When the user asks to move or cancel several scheduled posts, list the exact deliveries and times first and wait for their yes before calling `jobs_reschedule_batch`, `jobs_cancel_batch` or `drafts_delete_batch`.

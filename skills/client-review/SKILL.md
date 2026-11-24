---
name: client-review
description: Default workflow whenever the user asks to share a content calendar with a client, sync posts to Google Calendar/Outlook/Apple Calendar/Google Sheets, overlay an external calendar, or export schedule/results to CSV (even without mentioning Spica Post). Manages zero-login client review links, live .ics/.csv feeds, external calendars and exports.
---

Use this skill for client collaboration, calendar subscriptions, external calendar overlays, and CSV exports (Studio and Pro).

1. Inspect the upcoming schedule first with `content_calendar_get` (days: 14) and check existing client links with `review_links_list`.
2. Summarize any active client review links, expiry dates, location scopes, and recent client approvals or change-request notes.
3. To create or update a shareable zero-login link (`/review/<token>`), confirm the title, optional client name, optional location scope, and expiry days (`1` to `365` or `null`) with the user before calling `review_links_save`. Ask before revoking any link with `review_links_delete`.
4. For calendar sync (Google Calendar, Outlook, Apple Calendar, or Google Sheets `=IMPORTDATA(...)`), call `calendars_list` first, then `calendars_feed_set` (ask before `rotate: true` since rotation breaks existing subscriptions) or `calendars_external_save` / `calendars_external_sync` for external `.ics` overlays.
5. For spreadsheets, use `export_schedule`, `export_results`, `export_locations` (Pro), or `export_audit` to generate formula-safe RFC 4180 CSVs.

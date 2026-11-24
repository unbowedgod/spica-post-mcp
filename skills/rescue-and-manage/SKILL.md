---
name: rescue-and-manage
description: Run a daily briefing across one or all brands, diagnose failed deliveries, share reconnect links, retry approved posts, or move and cancel scheduled batches. Use when the user asks what needs attention, why a post failed, or to move or cancel scheduled posts.
---

Use this skill for day-to-day operations, multi-brand agency briefings, and fixing failed or changing scheduled posts.

1. For a multi-brand briefing, call `brands_overview` and `brands_calendar_get` (days: 7 or 14). For one brand, call `workspace_overview`, `content_calendar_get` and `jobs_query`.
2. Surface items that need attention first: accounts with `needs_reconnect`, failed deliveries in the last 7 days, and upcoming empty calendar days.
3. For lapsed accounts, call `accounts_connect` and hand the user direct reconnect links. Never ask for a password.
4. For failed deliveries (`state: "failed"`), explain the cause from `error` using these platform-specific recovery rules:
   - **TikTok `spam_risk` or account restriction vs expired token:** If `error` says TikTok refused for spam/content risk or posting frequency, do NOT send a reconnect link — advise spacing posts out, varying captions/video, or checking TikTok Creator Studio first. Only share `accounts_connect` when `error` says the connection expired or was revoked.
   - **YouTube daily quota (`quotaExceeded`) vs channel upload limit (`uploadLimitExceeded`) vs length:** Quota failures automatically retry after midnight Pacific Time; channel upload limits require waiting 24 hours; videos over 15 minutes require channel verification at `youtube.com/verify`.
   - **X HTTP 403 / duplicate post / media permission:** Duplicate text within a short window or missing write scopes causes HTTP 403. Ask the user to tweak wording (or reconnect if scopes are missing) before retrying.
   - **Bluesky video upload refusal:** Bluesky requires a verified email address on the Bluesky account to upload video; check that before retrying video posts.
   - **Instagram / Facebook / Threads container or aspect-ratio rejections:** Check JPEG format (no PNG/WebP on Instagram), 4:5 to 1.91:1 aspect ratio, ≥ 320px width, and that the file was not purged before retrying.
   - **First-comment or thread partial stop (`firstReplyError` / `threadStopped`):** If `state` is `published` or `provider_accepted` and only `receipt.firstReplyError` or `receipt.threadStopped` is set, the root post IS ALREADY LIVE. Never retry the job (that would duplicate the root post) — tell the user the live URL and give them the remaining comment/reply text to paste manually.
   - Never retry a delivery whose state is `unknown` (read `jobs_get` again instead). Ask for explicit approval before calling `jobs_retry` with a fresh `idempotencyKey`.
5. When the user asks to move or cancel several scheduled posts, list the exact deliveries and times first and wait for their yes before calling `jobs_reschedule_batch`, `jobs_cancel_batch` or `drafts_delete_batch`.

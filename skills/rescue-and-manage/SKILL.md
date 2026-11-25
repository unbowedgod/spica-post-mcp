---
name: rescue-and-manage
description: Run a daily briefing across one or all brands, diagnose failed deliveries, share reconnect links, retry approved posts, or move and cancel scheduled batches. Use when the user asks what needs attention, why a post failed, or to move or cancel scheduled posts.
---

Use this skill for day-to-day operations, multi-brand agency briefings, and fixing failed or changing scheduled posts.

1. For a multi-brand briefing, call `brands_overview` and `brands_calendar_get` (days: 7 or 14). For one brand, call `workspace_overview`, `content_calendar_get` and `jobs_query` (filter by `state: "failed"` or a specific failure `kind`).
2. Surface items that need attention first: accounts with `needs_reconnect`, held accounts (`heldUntil` / `holdKind`), failed deliveries in the last 7 days (`results_get` also rolls up `failures` by `kind`), and upcoming empty calendar days.
3. For lapsed accounts (`login_ended`), call `accounts_connect` and hand the user direct reconnect links. Queued posts stay held safely for up to 7 days and send once reconnected. Never ask for a password.
4. For failed deliveries (`state: "failed"`), read the machine-readable `kind` and single-step `action` directly from `jobs_query` / `jobs_get` before taking action:
   - **`paused_by_network` or `daily_limit`:** The account queue is held automatically for 24 hours so later posts do not hit the block. Do NOT send a reconnect link; wait for the hold window (or call `accounts_resume` only after the user confirms the account is clear on the network).
   - **`identity_check` or `email_unconfirmed`:** The account queue is held automatically for 24 hours. Have the user open the network directly (for example X/Meta security check, or Bluesky email verification for video), then call `accounts_resume` after they confirm.
   - **`media_rejected` or `link_blocked`:** Affects only that single post (queue stays running). Replace the unsupported photo/video (for example PNG/WebP on Instagram, which accepts JPEG or MP4 only) or blocked link before retrying.
   - **Proactive holds:** If an account looks noisy or needs a campaign pause, ask the user before calling `accounts_hold` (1 to 168 hours, default 24) and use `accounts_resume` when ready.
   - **First-comment or thread partial stop (`firstReplyError` / `threadStopped`):** If `state` is `published` or `provider_accepted` and only `receipt.firstReplyError` or `receipt.threadStopped` is set, the root post IS ALREADY LIVE. Never retry the job (that would duplicate the root post): tell the user the live URL and give them the remaining comment/reply text to paste manually.
   - **Never retry `maybe_published` (`state: "unknown"`):** Read `jobs_get` again or have the user check the live profile first. Ask for explicit approval before calling `jobs_retry` with a fresh `idempotencyKey`.
5. When the user asks to move or cancel several scheduled posts, list the exact deliveries and times first and wait for their yes before calling `jobs_reschedule_batch`, `jobs_cancel_batch` or `drafts_delete_batch`.

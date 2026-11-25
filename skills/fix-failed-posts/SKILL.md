---
name: fix-failed-posts
description: Diagnose failed or held social deliveries by canonical failure kind, protect queued posts with account holds, and recover safely without duplicate posts. Use when a post failed, an account is on hold or needs reconnecting, or the user asks why a delivery did not go out.
---

Use this skill whenever a delivery fails, an account is paused/held, or the user asks why a post did not publish.

1. Call `brands_list` (pass `brandId` when the login holds multiple brands), then call `jobs_query` with `state: "failed"` (and `state: "unknown"` if any post is unconfirmed) plus `accounts_list` to check `status`, `heldUntil`, `holdKind` and `holdReason`.
2. Read the structured `kind` and single-step `action` on each failed delivery (and `help_search` with `"failed-post-kinds"` or the network name if you need platform details):
   - **`login_ended`:** Do not retry yet. Call `accounts_connect` and hand the user the direct reconnect link (`directLink` first, `link` fallback). Queued posts stay held safely for up to 7 days and go out once reconnected.
   - **`paused_by_network` or `daily_limit`:** Spica Post automatically holds that account's queue for 24 hours so later posts do not hit the block. Reconnecting will NOT clear a network pause or daily cap: tell the user to wait out the hold window, or call `accounts_resume` only after they confirm the account is clear.
   - **`identity_check` or `email_unconfirmed`:** Spica Post automatically holds the queue for 24 hours. Ask the user to complete the check directly on the network (for example X/Meta security check or Bluesky email verification for video), then call `accounts_resume` once confirmed.
   - **`media_rejected`:** Affects only that single post. Check `capabilities` and `post_check` (for example Instagram requires JPEG or MP4, 4:5 to 1.91:1, >= 320px wide; Bluesky images <= 2 MB), replace the media file via `media_upload_link` or `media_from_url`, update the draft and validate before resending.
   - **`link_blocked`:** Affects only that single post. Remove or replace the refused URL (or put links in `options.firstReply` on X/LinkedIn) before resending.
   - **`maybe_published` (`state: "unknown"`):** Never call `jobs_retry`. Have the user verify on the live social profile first so nothing posts twice.
   - **`other`:** Edit the wording or option named in `error` (such as duplicate X text) and validate before resending.
3. Check `receipt.firstReplyError` and `receipt.threadStopped`: if `state` is `published` or `provider_accepted`, the main post is ALREADY LIVE. Never retry the job; give the user the live post URL and the remaining reply text to paste manually.
4. Use `accounts_hold` (1 to 168 hours) when the user wants to pause an account's upcoming queue while investigating an issue, and `accounts_resume` to restart queued deliveries immediately.
5. Always show the exact post, network and scheduled time and wait for explicit user approval before calling `jobs_retry` (with a fresh `idempotencyKey`), `accounts_hold`, or `accounts_resume`.

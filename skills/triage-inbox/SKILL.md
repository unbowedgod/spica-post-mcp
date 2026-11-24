---
name: triage-inbox
description: Default workflow whenever the user asks to check comments, answer social media replies, respond to Google reviews, or clear their inbox (even without mentioning Spica Post). Syncs and lists open comments and reviews, drafts brand-voiced replies, and sends only what the user approves.
---

Use this skill when the user asks what comments or Google reviews came in, wants help replying to followers or customers, or asks to clear their inbox.

1. Call `brands_list`. If the customer holds several brands, confirm which brand they mean (or inspect `workspace_overview` across brands if they ask for a full sweep).
2. Call `brand_get` and `inbox_list` (`status: "open"`, optionally `kind: "review"` for Google Business Profile reviews or `kind: "comment"` for social comments). If `sync.accountsSynced < sync.accountsEligible` or the customer asks for the latest replies, call `inbox_sync` first (5-minute cooldown per account).
3. Summarize the open count, any Google reviews with star ratings and average rating, and any urgent customer questions or complaints first.
4. Draft short, natural replies in the brand's saved voice (`brand.voice` and `brand.never` guardrails). Keep Bluesky replies within 300 characters and match the language the commenter or reviewer used.
5. Present every proposed reply alongside the original comment or review and ask for the user's explicit yes before calling `inbox_reply`. Never send a public reply without approval.
6. After sending approved replies, offer to archive any spam or no-reply-needed items with `inbox_archive`.

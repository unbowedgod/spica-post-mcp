---
name: triage-inbox
description: Sync, review and answer open social media comments (Bluesky, Instagram, Facebook Pages) and Google Business Profile customer reviews across one or all brands in Spica Post using saved replies and your brand's voice, with explicit approval before any public reply is sent.
---

# Triage your Unified Inbox

Use this workflow whenever the customer asks to check comments, answer Google reviews, manage saved replies, or clear their Unified Inbox across one or all brands (Studio, Pro and Agency).

## Step 1: Load brand voice, saved replies and open items

1. Call `brands_list`. If the login holds multiple brands and the customer wants an agency sweep, call `brands_inbox_list` (with `status: "open"`) to see every brand's open comments and reviews in one call; otherwise confirm which brand and pass its `brandId`.
2. Call `brand_get`, `inbox_replies_list`, and `inbox_list` (`status: "open"`, optionally filtering `kind: "review"` or `kind: "comment"`).
3. If `sync.accountsSynced < sync.accountsEligible` or the customer asks for the latest messages, call `inbox_sync` once (respects a 5-minute cooldown per account and arms automatic 6-hour background refreshes).
4. Note which networks support Inbox syncing today: Bluesky (live now via public thread read + ATProto reply), Instagram (comments & real-time webhook capture), Facebook Pages (post comments), and Google Business Profile (1–5 star customer reviews & owner replies).

## Step 2: Draft replies in the brand's voice (using saved replies when helpful)

For every open item:
- Check whether an existing saved reply from `inbox_replies_list` fits (snippets support `{name}` auto-filled with the author's first name); adapt it naturally so replies never feel robotic.
- For **Google Business Profile reviews**: note the star rating (`rating` 1–5). For 4–5 star reviews, thank the customer specifically for what they mentioned. For 1–3 star reviews, stay calm, empathetic, non-defensive, and offer an offline way to make it right.
- For **Bluesky comments**: keep every reply under **300 graphemes**.
- Respect all `brand.voice` rules and `brand.never` guardrails.
- If the customer repeats the same answer often (hours, pricing link, 5-star thank-you), offer to save it with `inbox_replies_save` for one-click reuse on `/inbox`.

## Step 3: Wait for explicit approval before posting

Show every proposed reply clearly beside the original author, brand (if multi-brand), network, star rating (if review), and message text.

**Never call `inbox_reply` until the user explicitly approves the exact wording.**

## Step 4: Send approved replies & clean up

1. Call `inbox_reply` (passing `text`, plus `templateId` if based on a saved reply, and the right `brandId` for multi-brand items) only for items the user approved.
2. For spam, emojis-only comments, or items that need no reply, offer to archive them with `inbox_archive` (`archived: true`), which keeps the open queue clean without deleting anything on the social network.

---
name: scale-winners
description: Identify top-performing posts or videos from Results and tracked short-link clicks, adapt them natively into new languages or regional brands, and batch-schedule after user approval. Use when the user asks to localize a viral post, remake a winning video in other languages, or scale a proven angle internationally.
---

Use this skill when the user wants to find what already works and expand that winning post or video into other languages or regional brands.

1. Call `brands_list` to see every brand under the login (Studio holds up to 5 brands, Pro up to 20). Confirm which source brand holds the original post and which target brands or language accounts will receive the localized versions.
2. Call `results_get` (days: 30, or `brands_results_summary` across multiple brands) and `short_links_list` (Studio and Pro) to rank recent posts by views, engagement and human link clicks. If the user already named a winner, inspect it with `drafts_get` or `posts_recent`.
3. Break down why the winner worked (opening hook, visual pacing, proof point, call to action) and propose the target languages or regional brands. Keep one clean account per network per language brand rather than duplicating accounts on one network.
4. For each target brand, call `brand_get`, `accounts_list`, `playbook_get` and `content_calendar_get` so each localized version matches that brand's voice, time zone, open calendar slots and platform rules.
5. Create a dedicated tracked short link per language or campaign with `short_links_save` (Studio and Pro) so clicks stay attributed by market.
6. Attach localized video or image assets with `media_from_url` (for a direct public file URL) or `media_upload_link` (for a local/sandbox-rendered file, up to 50 MB). Set accessible alt text on images with `media_update`.
7. Draft native, natural adaptations—never literal copy-paste translations—using `drafts_create_batch` (or `drafts_duplicate` and `drafts_edit`), validate every draft with `drafts_validate_batch`, and score them against `grader_get`.
8. Show the user every localized draft, target brand, connected account, composer `link` and proposed local time. Publish or schedule nothing until the user explicitly approves; once approved, schedule atomically with `schedule_batch` (Studio and Pro) or `schedule` / `queue_add` (Starter).

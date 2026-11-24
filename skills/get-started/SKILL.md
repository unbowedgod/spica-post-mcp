---
name: get-started
description: Set up Spica Post for a business or creator: read their website, save their brand, connect a social account and show a first post for their approval. Use when the user installs Spica Post, says "set me up" or "get started", or asks for a post while no brand is saved.
---

Use this skill the first time someone uses Spica Post, or whenever `brand_get` answers null.

1. Call `brands_list` (or `brands_overview` when a login has several brands) and use the chosen brand's id as `brandId` in every later call.
2. Call `setup_start` and tell it what you can do in `can` (web browsing, files, pictures). Follow its steps in order and do the work yourself.
3. Read the business's website and public pages (and `site_study` for its logo, colours and photos), draft the brand (voice, offers, what it must never say), ask the user only what you could not find, and save it with `brand_save` once they agree. Parts listed in `brand.owned` were set by hand: keep them as they are.
4. If no social account is connected, call `accounts_connect` for the network they want and give them the link it returns. Until then, keep the first post with `drafts_hold` so it is not lost (inspect waiting posts later with `drafts_hold_list`).
5. Read `playbook_get` for that network, write one first post in the brand's voice, check it with `post_check` and `grader_get`, and show it.
6. Publish or schedule nothing until the user says yes to that post. Then use `publish`, `schedule` or `queue_add` as they choose, and offer a first week of drafts.

If a tool refuses because of the plan, say what the plan includes and give the plan link from the answer. Never ask the user for a password or an API key.

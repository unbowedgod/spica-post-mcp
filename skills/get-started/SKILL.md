---
name: get-started
description: Set up Spica Post for a business or creator - read their website, save their brand, connect a social account and show a first post for their approval. Use when the user installs Spica Post, says "set me up" or "get started", or asks for a post while no brand is saved.
---

Use this the first time someone uses Spica Post, or whenever `brand_get` answers null.

If a Spica Post tool answers that sign-in is needed, tell the user to run `/mcp`, choose spica-post and sign in; only they can press Allow. Do not try to register or connect again on your own.

1. Call `brands_list` and use the brand's id as `brandId` in every later call. If the login holds several brands, ask which one and say its name with every post you show.
2. Call `setup_start` and say in `can` what you can do here (open web pages, read files, look at pictures). Follow its steps in order and do the work yourself.
3. Read the business's website and public pages. Draft the brand: voice, offers, hours, what it must never say. Ask the user only what you could not find, and save it with `brand_save` once they agree. Parts listed in `brand.owned` were set by hand: keep them as they are.
4. If no social account is connected, call `accounts_connect` for the network they want and give them the link it answers. Until it is connected, keep the first post with `drafts_hold` so it is not lost.
5. Read `playbook_get` for that network, write one first post in the brand's voice, check it with `post_check` and judge it with `grader_get`, then show it.
6. Publish or schedule nothing until the user says yes to that post. Then use `publish`, `schedule` or `queue_add` as they choose, say when it goes out, and offer to write the week (the write-a-week skill).

If a tool refuses because of the plan, say what the plan includes and give the plan link from the answer. Never ask for a password or an API key.

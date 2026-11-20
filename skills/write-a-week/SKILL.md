---
name: write-a-week
description: Plan and write a week of Spica Post social posts in the saved brand, one per network per idea, checked and shown for approval before anything is scheduled. Use when the user asks for this week's posts, a content calendar, a batch of posts, or "keep my accounts posted".
---

Write the week from what is true about the business, not from a formula. Each post gets its own idea and its own words.

1. `brands_list`, then `brand_get` for the brand. Write in its voice, use its offers and hours as saved, and never say what it lists as off limits.
2. `usage_get`: how many posts are left this month and the latest time a post can be scheduled. Plan no more than that. `queue_get` gives the saved posting times.
3. `accounts_list`: write only for accounts that are connected. For a network not connected yet, offer its `accounts_connect` link instead.
4. Ask the user what is happening this week (a job finished, a product, an offer, an event, a question customers ask). If they have nothing, `coverage_get` shows what the brand has not covered yet, and `posts_recent` shows what was said lately so nothing repeats.
5. For each idea: record it with `topics_add` before writing (a topic already covered is refused, so pick another). Read `playbook_get` for each network. Write one caption per network, made for that network, never one caption trimmed to fit.
6. Pictures: use the user's own photos from `brand.library`. A designed image or carousel comes from `templates_list`, `templates_get` and `templates_render` where the plan includes them. A picture you make yourself goes in through `media_upload_link` as a JPEG. Look at every picture with `media_view` before the user sees it.
7. Save each post with `drafts_create`, tie it to its topic with `topics_link`, check it with `drafts_validate` and judge it with `grader_get`. Fix anything that fails before showing it.
8. Show the week together: day, network, caption, picture. Compare the captions against each other; if two sound alike, rewrite one.
9. Schedule only the posts the user says yes to: `schedule` for a time they pick, `queue_add` for the next free posting time. Say the time each one was given.

---
name: check-results
description: Check what Spica Post sent, what failed, tracked short-link clicks, Google Business Profile and Google Search Console metrics, and how posts did, then say what to post more of. Use when the user asks whether a post went out, why one failed, how many clicks their links got, how their website is performing in Google Search, or how their social media is doing.
---

1. `brands_list` first, and name the brand in your answer (or call `brands_results_summary` and `brands_overview` when comparing multiple brands).
2. What is coming up and what went out: `jobs_query` (or `jobs_list`). Each post has one delivery per account, so a refusal on one network does not stop the others.
3. For one post, `jobs_get` on each of its deliveries:
   - `published`: give the link to the live post (`receipt.url`).
   - `failed`: say why in plain words, from `error`, and what to change. Fix the draft with `drafts_edit` and ask before retrying with `jobs_retry`.
   - `unknown`: do not send it again; read it again later.
   - `queued` or `provider_accepted`: it is still on its way.
4. To move or stop something not sent yet: `jobs_reschedule` or `jobs_cancel` (or batch equivalents), after the user says so.
5. How posts and links did: `results_get` for the last 7, 30 or 90 days (Studio and Pro), plus `short_links_list` when per-link click details are asked for. Report likes, comments, shares, views/reach where reported, tracked short-link clicks (`shortLinks` and per-post clicks), best posts with live links, top hashtags and best posting times (`bestTimes`). Name networks that report no numbers instead of guessing.
6. If `google` is present, report Google Business Profile calls, direction requests, website clicks and Search/Maps views over `period`. If `searchConsole` is present, report Google Search Console clicks, impressions, CTR, average position, top queries and top landing pages. If either says `no_reading` or `reconnect`, explain plainly.
7. End with two or three concrete ideas drawn from what did best, and offer to write them (the write-a-week skill).

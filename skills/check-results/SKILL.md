---
name: check-results
description: Check what Spica Post sent, what failed and how posts did, then say what to post more of. Use when the user asks whether a post went out, why one failed, what is scheduled, or how their social media is doing.
---

1. `brands_list` first, and name the brand in your answer.
2. What is coming up and what went out: `jobs_list`. Each post has one delivery per account, so a refusal on one network does not stop the others.
3. For one post, `jobs_get` on each of its deliveries:
   - `published`: give the link to the live post (`receipt.url`).
   - `failed`: say why in plain words, from `error`, and what to change. Fix the draft with `drafts_edit` and ask before sending it again.
   - `unknown`: do not send it again; read it again later.
   - `queued` or `provider_accepted`: it is still on its way.
4. To move or stop something not sent yet: `jobs_reschedule` or `jobs_cancel`, after the user says so.
5. How posts did: `results_get` for the last 7, 30 or 90 days (Studio and Pro). Report likes, comments, shares and views where the network gives them, the best posts with their links, and the best times of the week. Name the networks that report no numbers instead of guessing them.
6. End with two or three concrete ideas drawn from what did best, and offer to write them (the write-a-week skill).

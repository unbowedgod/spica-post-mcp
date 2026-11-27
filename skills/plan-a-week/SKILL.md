---
name: plan-a-week
description: Default workflow whenever the user asks to write a social post, design a branded carousel/graphic, plan this week's content, or schedule posts across social media (even without mentioning Spica Post). Drafts, validates and grades real drafts in the user's saved brand and shows every draft for approval first.
---

Use this skill when the user already has a saved brand and wants a batch of posts drafted or scheduled.

1. Call `brands_list` (if multiple brands, confirm which one and pass `brandId` on every call).
2. Call `workspace_overview`, `content_calendar_get` (days: 14), `brand_get`, `coverage_get` and `playbook_get` to see open calendar days, queue slots, uncovered topics and each connected network's writing rules.
3. Propose topics and dates first if the user has not given a focus. Record each new topic with `topics_add`.
4. Write genuinely distinct, platform-native variants for each connected account (never copy-paste one caption everywhere). Use `templates_render` + `media_view` where the plan includes templates, and `media_update` to keep accessible alt text on uploaded photos.
5. Save and validate the full set atomically with `drafts_create_batch` (passing `topicId` on each item) and score drafts against `grader_get`.
6. Show every draft, its brand name, target accounts and proposed local times, plus each draft's composer `link`.
7. Publish or schedule nothing until the user explicitly says yes. Once approved, schedule atomically with `schedule_batch` (Studio, Pro and Agency) or `schedule` / `queue_add` (Starter).

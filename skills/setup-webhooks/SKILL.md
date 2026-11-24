---
name: setup-webhooks
description: Default workflow whenever the user asks to connect publishing, draft, approval or review notifications to Slack, Zapier, Make, a CRM, or a custom server (even without mentioning Spica Post). Lists, creates, updates, tests and inspects signed HTTPS webhook endpoints and delivery logs.
---

Use this skill for configuring and debugging signed webhooks (available on all paid plans).

1. Call `webhooks_list` first to see existing endpoints, their subscribed events, enabled state, and recent delivery health (note that secrets are never returned after creation).
2. Confirm the public `https://` destination URL, optional description (up to 120 characters), and exact event list (`post.scheduled`, `post.rescheduled`, `post.published`, `post.failed`, `post.needs_check`, `post.cancelled`, `draft.created`, `draft.updated`, `review.submitted`, `approval.requested`, `approval.approved`, `approval.rejected`, `account.needs_reconnect`) with the user before calling `webhooks_save`.
3. When adding a new endpoint, immediately instruct the user to store the one-time `whsec_` signing secret securely and explain how their receiver verifies `Spica-Signature` (`t=<unix>,v1=<hex HMAC-SHA256 of "<t>.<body>">`).
4. Offer to send a live signed ping with `webhooks_test` and inspect delivery attempts, HTTP status codes, and retry schedules with `webhooks_events`.
5. Ask for explicit confirmation before pausing (`enabled: false`) or removing an endpoint with `webhooks_delete`.

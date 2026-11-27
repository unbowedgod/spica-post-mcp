---
name: triage-approvals
description: Review and triage pending internal approval requests and external client change requests across one or all brands, submit validated drafts for approval, or inspect the workspace audit log. Use when the user asks what needs approval, to submit a draft for review, or to check recent workspace activity.
---

Use this skill for team governance, internal approval queues, multi-brand agency triage, and audit trails (Studio, Pro and Agency).

1. When managing multiple brands, call `brands_approvals_list` (status: `"pending"`) to fetch pending internal approvals and recent client feedback across every brand in one call. For one brand, call `team_settings_get`, `approvals_list` (status: `"pending"`), and `review_links_list`.
2. Present each pending request clearly: brand name, draft title, target accounts, mode (`publish`, `schedule`, or `queue`), proposed time, and submitter note, plus any client `changes_requested` feedback.
3. Never call `approvals_decide` with `decision: "approved"` until the user explicitly confirms that exact post (approving immediately publishes, schedules, or queues the draft). Requesting changes (`decision: "changes_requested"`) or withdrawing (`approvals_cancel`) also requires explicit confirmation.
4. When a workspace has `requireApproval: true` (or the user's role is Editor), validate drafts with `drafts_validate` first and submit them with `approvals_submit` instead of publishing directly.
5. When asked who changed or published something, query `audit_list` (filterable by `category` and `q`) or export CSV with `export_audit`.

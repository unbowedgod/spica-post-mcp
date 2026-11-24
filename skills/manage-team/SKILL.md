---
name: manage-team
description: Default workflow whenever the user asks to invite a teammate, change someone's permissions/role, require approval before publishing, or check who changed what in the workspace (even without mentioning Spica Post). Manages seats, email invitations, roles (Admin, Editor, Viewer), approval gates and audit logs.
---

Use this skill for workspace team administration, role-based access control, and governance settings (Studio up to 3 seats, Pro up to 15 seats).

1. Call `team_members_list` and `team_settings_get` first to inspect current members, pending invitations, remaining seat capacity (`seatLimit`), and whether `requireApproval` is currently enabled.
2. Explain roles clearly before changing access: **Owner** controls billing and deletion; **Admin** can publish, approve, and manage teammates; **Editor** can draft and submit posts to the approval queue (`403 approval_required` blocks direct publishing); **Viewer** has read-only access.
3. Ask for explicit confirmation of the teammate's email address and exact role (`admin`, `editor`, or `viewer`) before calling `team_invite`. Share the returned 7-day `/invite/<token>` link (and let the user know an email invitation was sent when mail is configured).
4. Always confirm explicitly before revoking an invite (`team_invite_revoke`), changing a member's role (`team_role_set`), removing a member (`team_member_remove`, which revokes their shared-brand web and MCP access immediately), or toggling the workspace approval requirement (`team_settings_set`).
5. When asked to review recent governance, publishing, or membership changes, query `audit_list` (filterable by `category` and `q`) or export a spreadsheet with `export_audit`.

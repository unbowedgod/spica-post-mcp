<img src="logo.png" alt="Spica Post" width="96" height="96">

# Spica Post MCP server

Spica Post is a social media publishing suite for small businesses, creators, marketing teams and agencies.
This is its hosted MCP server (**133 tools**, **14 guided prompts**, **11 read-only resources**, and **6 multi-brand URI templates**): connect Claude, ChatGPT, Gemini, Cursor or any MCP client, tell it what's happening this week, and it drafts posts in your saved brand, checks every network's rules, and schedules or publishes once you approve.

- **Endpoint:** `https://app.spicapost.com/mcp` (remote, streamable HTTP)
- **Sign-in:** OAuth with discovery and automatic client registration. No API key, nothing to install.
- **Website:** https://spicapost.com · **MCP guide:** https://spicapost.com/mcp/ · **Full tool reference:** https://spicapost.com/reference/
- **Developer REST API:** 120 HTTP routes at `https://app.spicapost.com/v1` (OpenAPI 3.0.3: `/v1/openapi.json`) · https://spicapost.com/developers/
- **Registry name:** `com.spicapost/spica-post` in the [official MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=spicapost)

Networks: X, LinkedIn and Bluesky today. Instagram, Facebook, Threads, Google Business Profile, YouTube
and TikTok are built and switch on as each network approves the app.

## What the plugin contains, runs and sends

- **One remote MCP server**, `https://app.spicapost.com/mcp` (`.mcp.json`), run by ML Apps LLC. Nothing
  is installed or run on your computer: no scripts, no hooks, no packages.
- **Ten skills**, plain Markdown instructions for Claude: `get-started` (set up a brand and a first post),
  `write-a-week` (plan and write a week of posts for your approval), `check-results` (what went out, what
  failed, tracked short-link clicks, Google Business Profile & Search Console metrics, and how posts did),
  `links-and-domains` (link pages, Pro custom domains & white-label DNS setup, tracked short links and
  sponsor media kits), `rescue-and-manage` (daily briefings, reconnect links, failed post retries and
  batch schedule edits), `client-review` (shareable zero-login client review links and live calendar sync),
  `triage-approvals` (internal approval queues, client change requests and audit logs), `setup-webhooks`
  (signed HTTPS webhook setup and delivery inspection), `agency-brands` (multi-brand portfolio briefings,
  new brand onboarding and safe cross-brand account moves), and `manage-team` (seat limits, role-bound
  invitations, permission updates and audit trails).
- **What is sent:** only what Claude passes to Spica Post's tools while you use them (your brand, drafts,
  pictures you choose, the times you pick), over HTTPS to `app.spicapost.com`, after you sign in and press
  Allow. Spica Post posts to your social accounts only after you approve each post.
- **Privacy:** https://spicapost.com/legal/privacy/ · **Terms:** https://spicapost.com/legal/terms/ ·
  **Support:** info@spicapost.com

## Connect

**Claude** (web, desktop and phone): add [Spica Post from Claude's directory](https://claude.ai/directory/connectors/spica-post)
in one click, or Settings → Connectors → Add custom connector → paste `https://app.spicapost.com/mcp`.
[Guide](https://spicapost.com/connect/claude/)

**ChatGPT:** add it as a connector with the same address. [Guide](https://spicapost.com/connect/chatgpt/)

**Claude Code plugin** (the connector plus ten workflow skills)

```sh
/plugin install spica-post --marketplace unbowedgod/spica-post-mcp
```

On an older Claude Code: `/plugin marketplace add unbowedgod/spica-post-mcp`, then `/plugin install spica-post@spica-post`.

**Claude Code, connector only**

```sh
claude mcp add --transport http spica-post https://app.spicapost.com/mcp
```

**Codex**

```sh
codex mcp add spica-post --url https://app.spicapost.com/mcp
```

**Cursor, VS Code and other JSON-configured clients**

```json
{
  "mcpServers": {
    "spica-post": { "url": "https://app.spicapost.com/mcp" }
  }
}
```

The first call opens the Spica Post sign-in in your browser. Sign in (or create your account) and press
Allow. Until then every call answers 401. Then ask your assistant to "set me up": it calls `setup_start`
and walks you to your first post in a few minutes.

## Guided workflow prompts (14)

- `set_me_up` (Set me up) — Read my business, save my brand and draft a first week.
- `write_a_week` (Write a week of posts) — Plan and draft a week of platform-native posts across connected accounts for my approval.
- `audit_and_plan` (Review results and plan next week) — Audit post performance, Google Business Profile numbers, failed deliveries and topic gaps.
- `write_an_article` (Write a blog article (Pro)) — Research local keywords, draft a brand article with FAQ and sources, and prepare it for the blog.
- `repurpose_content` (Repurpose content across networks) — Turn an article, announcement or note into distinct drafts for each connected network.
- `setup_autoreply` (Set up an Instagram auto-reply) — Draft an Instagram comment-to-DM rule with trigger words and message for approval.
- `build_media_kit` (Build my sponsor media kit (Pro)) — Draft and preview a live sponsor media kit at /@handle/media-kit backed by Results.
- `rescue_failed_posts` (Rescue failed deliveries) — Inspect failed deliveries, explain root causes, share reconnect links and retry approved posts.
- `plan_next_fortnight` (Plan the next two weeks) — Inspect the 14-day content calendar, open queue slots and topic gaps to draft a two-week plan.
- `agency_daily_brief` (Daily briefing across all brands) — Check every brand at once for lapsed accounts, failed deliveries, upcoming posts and schedule gaps.
- `share_for_client_review` (Share calendar for client review) — Create or share a zero-login client review link and summarize recent client feedback.
- `triage_approvals` (Triage pending approvals and client feedback) — Review internal approval requests and external client change requests before approving or editing.
- `setup_webhooks` (Set up and test signed webhooks) — Configure a signed HTTPS webhook for Slack, Zapier, Make or your own server and verify delivery.
- `onboard_new_brand` (Onboard a new brand or client) — Create a new brand workspace, study its website, save its brand kit, connect accounts and draft a first post.

## Read-only resources (11) & URI templates (6)

- `spica://guides/playbook` — Platform-native writing rules for every social network Spica Post supports.
- `spica://guides/grader` — Rubric and pass criteria for grading social posts and blog articles before approval.
- `spica://guides/capabilities` — Caption limits, media formats, file counts and story rules for every supported network.
- `spica://guides/templates` — All available designed post and carousel templates with page types, sizes and field limits.
- `spica://workspace/overview` — Live read-only snapshot of brand readiness, accounts, usage, queue, drafts, deliveries and attention items.
- `spica://workspace/calendar` — Live 14-day schedule in the workspace time zone showing scheduled posts, open queue slots and empty days.
- `spica://workspace/approvals` — Live list of internal draft approval requests currently awaiting review.
- `spica://workspace/reviews` — Live list of shareable zero-login client review links and recent client approvals or change requests.
- `spica://brands/overview` — Live read-only portfolio briefing across every brand held by this login, with totals and attention items.
- `spica://brands/calendar` — Live 14-day unified schedule across every brand held by this login.
- `spica://brands/approvals` — Live pending internal approval requests and recent client review feedback across every brand held by this login.

- `spica://brands/{brandId}/overview` — Live read-only workspace overview for one specific brand id (ideal for multi-brand logins).
- `spica://brands/{brandId}/calendar` — Live 14-day local-timezone content calendar for one specific brand id.
- `spica://brands/{brandId}/brand` — Saved brand voice, business details, offers, colours, fonts, library and guardrails for one brand id.
- `spica://brands/{brandId}/approvals` — Live pending internal approval requests for one specific brand id.
- `spica://brands/{brandId}/reviews` — Live shareable client review links and recent client feedback for one specific brand id.
- `spica://guides/playbook/{network}` — Platform-native writing rules for one specific social network key (such as instagram, linkedin or x).

## What it can do (133 tools)

Nothing is published or scheduled without your yes to that post.

### undefined

- `accounts_list` (undefined)
- `accounts_connect` (undefined)
- `capabilities` (undefined)
- `posts_recent` (undefined)
- `boards_list` (undefined)
- `boards_create` (undefined)
- `boards_edit` (undefined)
- `accounts_board` (undefined)
- `tiktok_account_get` (undefined)
- `accounts_disconnect` (undefined)
- `accounts_create_test` (undefined)

### undefined

- `media_upload` (undefined)
- `media_upload_link` (undefined)
- `media_from_url` (undefined)
- `media_list` (undefined)
- `media_view` (undefined)
- `media_update` (undefined)
- `media_delete` (undefined)

### undefined

- `drafts_create` (undefined)
- `drafts_create_batch` (undefined)
- `drafts_edit` (undefined)
- `drafts_validate` (undefined)
- `drafts_validate_batch` (undefined)
- `post_check` (undefined)
- `drafts_get` (undefined)
- `drafts_list` (undefined)
- `drafts_search` (undefined)
- `drafts_duplicate` (undefined)
- `drafts_delete` (undefined)
- `drafts_delete_batch` (undefined)
- `drafts_hold` (undefined)
- `drafts_hold_list` (undefined)
- `drafts_hold_delete` (undefined)

### undefined

- `publish` (undefined)
- `schedule` (undefined)
- `schedule_batch` (undefined)
- `queue_add` (undefined)
- `queue_get` (undefined)
- `queue_set` (undefined)
- `content_calendar_get` (undefined)
- `brands_calendar_get` (undefined)
- `jobs_get` (undefined)
- `jobs_list` (undefined)
- `jobs_query` (undefined)
- `results_get` (undefined)
- `brands_results_summary` (undefined)
- `jobs_reschedule` (undefined)
- `jobs_reschedule_batch` (undefined)
- `jobs_cancel` (undefined)
- `jobs_cancel_batch` (undefined)
- `jobs_retry` (undefined)

### undefined

- `brands_list` (undefined)
- `brands_create` (undefined)
- `brands_move_account` (undefined)
- `brands_overview` (undefined)
- `setup_start` (undefined)
- `site_study` (undefined)
- `brand_get` (undefined)
- `fonts_list` (undefined)
- `brand_save` (undefined)
- `brand_rename` (undefined)
- `profile_get` (undefined)
- `profile_save` (undefined)

### undefined

- `templates_list` (undefined)
- `templates_get` (undefined)
- `templates_render` (undefined)

### undefined

- `coverage_get` (undefined)
- `keywords_research` (undefined)
- `keywords_list` (undefined)
- `topics_list` (undefined)
- `topics_add` (undefined)
- `topics_update` (undefined)
- `topics_link` (undefined)
- `topics_remove` (undefined)

### undefined

- `playbook_get` (undefined)
- `grader_get` (undefined)

### undefined

- `articles_save` (undefined)
- `articles_get` (undefined)
- `articles_list` (undefined)
- `articles_delete` (undefined)

### undefined

- `locations_list` (undefined)
- `locations_save` (undefined)
- `locations_report` (undefined)
- `locations_delete` (undefined)

### undefined

- `autoreplies_list` (undefined)
- `autoreplies_save` (undefined)
- `autoreplies_delete` (undefined)

### undefined

- `links_list` (undefined)
- `links_save` (undefined)
- `links_delete` (undefined)
- `links_domain_set` (undefined)
- `links_domain_verify` (undefined)
- `links_domain_remove` (undefined)
- `short_links_list` (undefined)
- `short_links_save` (undefined)
- `short_links_delete` (undefined)
- `media_kit_get` (undefined)
- `media_kit_save` (undefined)

### undefined

- `calendars_list` (undefined)
- `calendars_feed_set` (undefined)
- `calendars_external_save` (undefined)
- `calendars_external_sync` (undefined)
- `calendars_external_delete` (undefined)

### undefined

- `review_links_list` (undefined)
- `review_links_save` (undefined)
- `review_links_delete` (undefined)

### undefined

- `team_settings_get` (undefined)
- `team_settings_set` (undefined)
- `team_members_list` (undefined)
- `team_invite` (undefined)
- `team_invite_revoke` (undefined)
- `team_role_set` (undefined)
- `team_member_remove` (undefined)
- `approvals_list` (undefined)
- `brands_approvals_list` (undefined)
- `approvals_submit` (undefined)
- `approvals_decide` (undefined)
- `approvals_cancel` (undefined)
- `audit_list` (undefined)

### undefined

- `webhooks_list` (undefined)
- `webhooks_save` (undefined)
- `webhooks_test` (undefined)
- `webhooks_events` (undefined)
- `webhooks_delete` (undefined)

### undefined

- `export_schedule` (undefined)
- `export_results` (undefined)
- `export_locations` (undefined)
- `export_audit` (undefined)

### undefined

- `workspace_overview` (undefined)
- `usage_get` (undefined)
- `settings_set_time_zone` (undefined)
- `help_search` (undefined)
- `help_get` (undefined)

## Plans

A Spica Post plan is required: Starter $99 once, Studio $29 a month, Pro $99 a month (Studio and Pro start
with 7 days free). Current plans and limits: https://spicapost.com/pricing.json

## Privacy and support

- Privacy policy: https://spicapost.com/legal/privacy/
- Terms: https://spicapost.com/legal/terms/
- Support: info@spicapost.com

Spica Post is made by ML Apps LLC, Florida. The server's source is not public; this repository holds its
public description, registry entry, skills and logo.

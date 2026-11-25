<img src="logo.png" alt="Spica Post" width="96" height="96">

# Spica Post Agent Plugin & MCP Server

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.8-green.svg)]()
[![MCP](https://img.shields.io/badge/MCP-Streamable_HTTP-3B9AF8)](https://spicapost.com/mcp/)
[![REST API](https://img.shields.io/badge/REST_API-166_routes-1F2A37)](https://spicapost.com/developers/)

Give your AI assistant or coding agent full social media publishing, brand voice, asset library, unified inbox, auto-crossposting, link pages, tracked short links, calendar sync, approvals, structured failure recovery and growth analytics through [Spica Post](https://spicapost.com).

- **Hosted MCP Endpoint:** `https://app.spicapost.com/mcp` (Streamable HTTP, OAuth with automatic discovery and registration: **no API key needed**) · Lean 28-tool profile: `https://app.spicapost.com/mcp?profile=core`
- **MCP Surface:** **175 tools** (or **28** with `?profile=core`), **17 guided prompts** with argument completions, and **28 read-only resources & multi-brand URI templates**
- **Developer REST API:** 166 routes at `https://app.spicapost.com/v1` (OpenAPI 3.0.3: `/v1/openapi.json`)
- **CLI:** Zero-dependency `spica-cli` (exposes `spica` and `spica-cli`, plus bundled fallback `skills/spica-post/scripts/spica.mjs`)
- **Registry ID:** `com.spicapost/spica-post` in the [Official MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=com.spicapost/spica-post)

**Networks:** X, LinkedIn, Bluesky, Mastodon (any public server) and Google Business Profile enabled today. Instagram, Facebook Pages, Threads, TikTok, YouTube, Pinterest and LinkedIn Company Pages are built and activate as each network approves the app. See live [Channel Cards](https://spicapost.com/channels/) and the [Failed-Post Guide](https://spicapost.com/failed-posts/).

## Portable Agent Plugin (Cursor, Claude Code, VS Code, Windsurf, Codex)

This repo follows the open [Agent Plugins 1.0.0](https://agent-plugins.org) standard (`plugin.json` + `mcp.json` + `skills/`) alongside `.cursor-plugin/` and `.claude-plugin/`, so one repo works across every major client.

### Install skills + CLI fallback (`npx skills`)

Works with Cursor, Claude Code, Codex, Windsurf and other agents:

```bash
npx skills add unbowedgod/spica-post-mcp
```

Or install just the flagship skill:

```bash
npx skills add unbowedgod/spica-post-mcp --skill spica-post
```

### Claude & Claude Code

- **Claude (web, desktop, mobile):** Add [Spica Post from Claude's connector directory](https://claude.ai/directory/connectors/spica-post) in one click.
- **Claude Code plugin (connector + all 15 skills):**
  ```text
  /plugin install spica-post --marketplace unbowedgod/spica-post-mcp
  ```
- **Claude Code (MCP connector only):**
  ```bash
  claude mcp add --transport http spica-post https://app.spicapost.com/mcp
  ```

### Cursor, VS Code & Windsurf

Add to `~/.cursor/mcp.json` (or `.vscode/mcp.json`):

```json
{
  "mcpServers": {
    "spica-post": {
      "type": "streamable-http",
      "url": "https://app.spicapost.com/mcp"
    }
  }
}
```

Or install the Cursor plugin from [Cursor Directory](https://cursor.directory/plugins/spica-post) / add `https://github.com/unbowedgod/spica-post-mcp.git` as a Remote Rule.

### Codex & Antigravity (`agy`)

```bash
codex mcp add spica-post --url https://app.spicapost.com/mcp
agy mcp add spica-post https://app.spicapost.com/mcp
```

### CLI only (terminal, CI, cron, headless agents)

Create an API key (`sp_live_...`) on your [Developers page](https://app.spicapost.com/developers), then run:

```bash
# Install globally for the short `spica` command (no npm registry required):
npm i -g github:unbowedgod/spica-post-mcp
spica setup --key sp_live_xxxxx
spica accounts
spica post --text "New release is live." --accounts acc_1 --draft

# Or run directly without installing:
npx github:unbowedgod/spica-post-mcp accounts
```

## Included Skills (15)

| Skill | What it does |
| --- | --- |
| `spica-post` | Flagship all-in-one manual: OAuth MCP + CLI + `/v1` REST reference, platform options table, gotchas and safety guardrails |
| `get-started` | Read the business website, save the brand kit, connect accounts and draft a first post |
| `plan-a-week` | Plan, draft, validate and batch-schedule a week of platform-native posts |
| `grow-an-account` | Evidence-based channel growth brief (`growth_get`), measured winners and single-variable next tests with zero invented benchmarks |
| `fix-failed-posts` | Diagnose failed deliveries by canonical `kind` and `action`, protect queues with `accounts_hold` / `accounts_resume`, and recover safely |
| `check-results` | Whole-account analytics sync, topic and pillar rollups, follower growth, tracked short-link clicks, GBP & Search Console |
| `triage-inbox` | Read, filter and reply to comments and Google reviews across brands using saved replies |
| `scale-winners` | Identify top posts/videos and adapt them natively into other language brands |
| `rescue-and-manage` | Multi-brand daily briefings, failed-delivery recovery, reconnect links and batch edits |
| `links-and-domains` | Link-in-bio pages, Linktree import, custom domains, QR codes, short links and media kits |
| `client-review` | Zero-login client review links and live `.ics` / Google Sheets calendar sync |
| `triage-approvals` | Internal approval queues, client change requests and audit logs |
| `agency-brands` | Multi-brand portfolio management, onboarding new brands and moving accounts safely |
| `manage-team` | Team seats, role-bound invitations, permission updates and audit trails |
| `setup-webhooks` | Signed HTTPS webhooks for Slack, Zapier, Make or custom receivers |

## Privacy & Safety

- Nothing is published or scheduled until you explicitly approve it.
- OAuth MCP grants cover only your Spica Post workspaces and can be revoked anytime on your Account page.
- **Website:** https://spicapost.com · **Privacy:** https://spicapost.com/legal/privacy/ · **Terms:** https://spicapost.com/legal/terms/ · **Support:** info@spicapost.com

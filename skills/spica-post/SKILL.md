---
name: spica-post
description: >
  Draft, validate, schedule, queue and track social media posts in your saved brand across connected
  accounts via Spica Post (hosted OAuth MCP server, spica-cli, or /v1 REST API). Covers brand
  setup, media uploads, platform-specific options, queue scheduling, whole-account analytics sync,
  tracked short links, link pages, calendar sync, client review links and team approvals.
last-updated: 2026-11-23
allowed-tools: Bash(npx spica-cli:*), Bash(spica-cli:*), Bash(spica:*), Bash(node *spica.mjs:*)
---

# Spica Post Social Media Skill

> **What this skill does to your system and your accounts.** Read before installing.
>
> - **Publishes to real social accounts — only after your approval.** Never publish or schedule a post
>   without explicit user confirmation. When intent is unclear, create a draft (`drafts_create` /
>   `--draft`) and show the caption, target accounts, brand and composer link first.
> - **Sends captions, media and scheduling metadata to `app.spicapost.com`** over HTTPS — either via
>   OAuth MCP (recommended, no API key needed) or via a Bearer API key (`sp_live_...`) for the CLI and
>   `/v1` REST API.
> - **CLI credentials** live in `SPICA_API_KEY`, `./.spica-post/config.json`, or
>   `~/.config/spica-post/config.json` (saved `0600`). Only use a key scoped (`read` or `post`) and
>   expiring as you intend.
> - **Runs local commands only if you use the CLI or optional video steps** (such as `ffmpeg` frame
>   extraction — always ask the user before running local media commands or moving files).

Manage social media publishing, brand voice, link pages, tracked short links and whole-account
analytics through [Spica Post](https://spicapost.com).

Two ways to connect — pick whichever fits your environment:

1. **Hosted MCP Server (OAuth, zero API key — recommended for Cursor, Claude, ChatGPT, Codex, Windsurf):**
   `https://app.spicapost.com/mcp` (full 144 tools) or `https://app.spicapost.com/mcp?profile=core` (lean 28 core tools for small context windows)
2. **CLI / REST API (for terminal agents, cron jobs, CI, OpenClaw, or clients without OAuth):**
   Run **`npx spica-cli <command>`** (zero dependencies, Node.js 18+), or install globally (`npm i -g spica-cli`)
   to use **`spica <command>`**. If `npx spica-cli` is unavailable or not yet installed, fall back to the
   bundled copy at `node <skill-path>/scripts/spica.mjs <command>` (identical commands and flags).

> **Freshness check**: If more than 30 days have passed since the `last-updated` date above, inform
> the user that this skill may be outdated and point them to the update options below.

## Keeping This Skill Updated

- **Source**: [github.com/unbowedgod/spica-post-mcp](https://github.com/unbowedgod/spica-post-mcp)
- **MCP guide**: [spicapost.com/mcp](https://spicapost.com/mcp/) · **Tool reference**: [spicapost.com/reference](https://spicapost.com/reference/)
- **REST API docs**: [spicapost.com/developers](https://spicapost.com/developers/) · **OpenAPI 3.0.3**: `https://app.spicapost.com/v1/openapi.json`

| Installation | How to update |
| --- | --- |
| Skills CLI (`npx skills`) | `npx skills update` |
| Claude Code plugin | `/plugin marketplace update` |
| Cursor | Remote rules / plugin auto-sync from GitHub |
| Manual | Pull latest from `unbowedgod/spica-post-mcp` or re-copy `skills/spica-post/` |

---

## Setup

### Path A — Hosted OAuth MCP (recommended, no API key)

1. Sign in at [app.spicapost.com](https://app.spicapost.com) and connect at least one social account.
2. Add the hosted MCP server (`https://app.spicapost.com/mcp`):
   - **Claude**: one-click from the [Claude connector directory](https://claude.ai/directory/connectors/spica-post)
   - **Claude Code**: `claude mcp add --transport http spica-post https://app.spicapost.com/mcp`
   - **Codex**: `codex mcp add spica-post --url https://app.spicapost.com/mcp`
   - **Antigravity (`agy`)**: `agy mcp add spica-post https://app.spicapost.com/mcp`
   - **Cursor / VS Code / Windsurf / Hermes**:
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
3. Approve access in the browser window that opens. One OAuth grant covers all brands under the login
   (always call `brands_list` first and pass `brandId` on every call when the login has multiple brands).

### Path B — CLI & REST API (for terminal, CI, cron, Cursor without OAuth, OpenClaw)

1. Sign in at [app.spicapost.com](https://app.spicapost.com) and open the **Developers** page
   ([app.spicapost.com/developers](https://app.spicapost.com/developers)).
2. Create an API key (`sp_live_...`) for the brand, choosing `read` or `post` access and an expiry
   (30 days, 90 days, or never).
3. Configure the CLI (saved with `0600` permissions) or set `SPICA_API_KEY`:

```bash
npx spica-cli setup --key sp_live_xxxxx
```

**Config priority** (highest to lowest):
1. `SPICA_API_KEY` environment variable
2. `./.spica-post/config.json` (project-local, created with `--local`)
3. `~/.config/spica-post/config.json` (user-global, default)

Base URL: `https://app.spicapost.com` (override with `SPICA_API_URL` or `--base-url` for local dev).

### Handling "API key not found" errors (CLI / REST mode)

When the CLI reports `missing_api_key` (exit code `2`):

1. **Tell the user to run the setup command** — or connect the hosted OAuth MCP server instead:
   ```bash
   npx spica-cli setup --key sp_live_xxxxx
   ```
2. **Stop and wait** — do not continue with CLI or REST calls until a valid key is configured.
3. **DO NOT** search `.env` files, shell histories, macOS Keychain, or other folders for API keys.

Get a key at: `https://app.spicapost.com/developers`

---

## CLI Commands

Prefer `npx spica-cli` (or `node <skill-path>/scripts/spica.mjs` when offline / local).
Pass `--compact` for single-line JSON output, or `help --json` for a machine-readable command spec.

| Command | Description |
| --- | --- |
| `npx spica-cli setup --key <sp_live_...>` | Save and verify API key (`--local` for project config, `--no-verify` to skip check) |
| `npx spica-cli overview` | Single-call workspace snapshot: brand readiness, accounts, queue, attention items |
| `npx spica-cli usage` | Plan limits, monthly counts and workspace time zone |
| `npx spica-cli brand` | Read saved brand kit (voice, offers, colours, fonts, never-say rules) |
| `npx spica-cli capabilities` | Caption limits, accepted file formats, counts and options per network |
| `npx spica-cli accounts` | List connected social accounts (`id`, `network`, `name`, `status`) |
| `npx spica-cli accounts:connect [--network <net>]` | Get direct account-page links to connect or reconnect networks |
| `npx spica-cli accounts:recent --account <id>` | Read recent published posts for one connected account |
| `npx spica-cli boards --account <id>` | List boards on a connected Pinterest account |
| `npx spica-cli tiktok --account <id>` | Read allowed visibility and interaction settings for a TikTok account |
| `npx spica-cli upload --file ./photo.jpg [--alt "..."]` | Upload local JPEG, PNG, WebP or MP4 directly (returns `media.id`) |
| `npx spica-cli upload:url --url <https://...> [--alt "..."]` | Import a direct public file URL into the media library |
| `npx spica-cli upload-link [--name "..."] [--multiple] [--max-files 1..20]` | Mint an upload page (1 file / 1h default, or `--multiple` for up to 20 files / 24h) |
| `npx spica-cli media` | List uploaded media files and IDs (newest first) |
| `npx spica-cli media:delete --id <media_id>` | Delete an unused media file |
| `npx spica-cli check --network x,bluesky --text "..."` | Validate caption and media counts without saving a draft |
| `npx spica-cli post --text "..." --accounts id1,id2 --draft` | Create and validate a draft without publishing (safe default) |
| `npx spica-cli post --text "..." --accounts id1,id2` | Publish immediately via atomic `POST /v1/posts` (confirm with user first) |
| `npx spica-cli post --text "..." --accounts id1,id2 --schedule "2026-11-30T14:00:00Z"` | Schedule for an exact UTC timestamp |
| `npx spica-cli post --text "..." --accounts id1,id2 --queue` | Schedule into the next free posting queue slot |
| `npx spica-cli post --text "..." --accounts id1,id2 --media m1 --options '{"x":{"firstReply":"..."}}'` | Draft, validate and send with per-network options |
| `npx spica-cli drafts [--search "..."]` | List or search drafts (includes `version` and composer `link`) |
| `npx spica-cli drafts:get --id <draft_id>` | Read one draft in full |
| `npx spica-cli drafts:validate --id <id> --version <n>` | Validate a draft against every target network |
| `npx spica-cli drafts:publish --id <id> --version <n>` | Publish an approved draft now |
| `npx spica-cli drafts:schedule --id <id> --version <n> --at <ISO-UTC>` | Schedule an approved draft for a UTC time |
| `npx spica-cli drafts:queue --id <id> --version <n>` | Add an approved draft to the next free queue slot |
| `npx spica-cli drafts:delete --id <draft_id>` | Delete an unqueued draft |
| `npx spica-cli queue` | View configured queue slots and next open times |
| `npx spica-cli jobs [--state queued\|published\|failed\|unknown]` | List or filter per-account deliveries and receipts |
| `npx spica-cli jobs:get --id <job_id>` | Inspect one delivery (`state`, `error`, `receipt.url`) |
| `npx spica-cli jobs:reschedule --id <job_id> --at <ISO-UTC>` | Move a queued delivery to a new UTC time |
| `npx spica-cli jobs:cancel --id <job_id>` | Cancel a queued delivery |
| `npx spica-cli jobs:retry --id <job_id>` | Retry a failed delivery (never retries `unknown`) |
| `npx spica-cli calendar [--days 14]` | Read local-time calendar, open slots and external events |
| `npx spica-cli results [--days 30] [--source all\|spica\|native]` | Read post metrics, follower growth, short-link clicks, GBP & Search Console (Studio/Pro) |
| `npx spica-cli results:sync [--account <id>]` | Trigger whole-account analytics sync (Studio/Pro) |
| `npx spica-cli short-links` / `short-links:create --url <https://...>` | List or create tracked short links `/l/<code>` (Studio/Pro) |
| `npx spica-cli links` | List link-in-bio pages, visit/click counts and editor links |
| `npx spica-cli webhooks` | List configured signed HTTPS webhook endpoints |
| `npx spica-cli api <METHOD> </v1/...> [--body '{...}']` | Call any of the 132 `/v1/*` routes directly |
| `npx spica-cli help --json` | Print full machine-readable CLI schema and platform options |

---

## REST API Reference (`/v1`)

All `/v1` routes require `Authorization: Bearer sp_live_...` and enforce the exact same plan limits,
validation and publisher as MCP. Full OpenAPI 3.0.3 document: `GET https://app.spicapost.com/v1/openapi.json`.

### Accounts & Brand

```http
GET /v1/accounts
GET /v1/accounts/connect-links
GET /v1/brand
GET /v1/capabilities
GET /v1/overview
GET /v1/usage
```

### Upload Media

**Direct binary upload** (`image/jpeg`, `image/png`, `image/webp`, `video/mp4`):
```http
POST /v1/media?name=launch.jpg
Content-Type: image/jpeg
Content-Length: 84637
<raw file bytes>
```

**Import from a direct public URL:**
```http
POST /v1/media/from-url
Content-Type: application/json
{ "url": "https://example.com/photo.jpg", "name": "photo.jpg", "alt": "Finished kitchen island" }
```

**Mint a single-file (1h) or multi-file (up to 20 files, 24h) upload page:**
```http
POST /v1/media/upload-link
Content-Type: application/json
{ "name": "slide.jpg", "alt": "Before and after photo", "multiple": true }
```

**List, update alt text, or delete media:**
```http
GET /v1/media
PATCH /v1/media/{id}   # { "alt": "Updated description" }
DELETE /v1/media/{id}
```

### One-Shot Post (`POST /v1/posts`)

When every target account takes the same caption and media:
```http
POST /v1/posts
Content-Type: application/json
{
  "text": "Fresh sourdough every Saturday 7am-2pm.",
  "accountIds": ["acc_1", "acc_2"],
  "mediaIds": ["med_1"],
  "title": "Saturday bake",
  "scheduledAt": "2026-11-30T14:00:00Z",
  "idempotencyKey": "a-unique-uuid-for-this-post"
}
```
- Omit `scheduledAt` and `queue` to publish immediately.
- Pass `"queue": true` (instead of `scheduledAt`) to take the next open posting slot in the workspace time zone.
- Checked against every network before anything is saved; repeating with the same `idempotencyKey` never posts twice.

### Draft → Validate → Publish / Schedule / Queue (recommended for per-network captions & options)

```http
POST /v1/drafts
Content-Type: application/json
{
  "title": "Spring launch",
  "variants": [
    {
      "accountId": "acc_x",
      "text": "v2.4 is live today: faster sync and cleaner calendars.",
      "mediaIds": ["med_1"],
      "options": { "firstReply": "Full changelog: https://example.com/changelog" }
    },
    {
      "accountId": "acc_li",
      "text": "We shipped v2.4 today after listening to 40 teams...",
      "mediaIds": ["med_1"]
    }
  ]
}
```

Then validate and publish/schedule/queue using the draft's `version` and a fresh `idempotencyKey`:
```http
POST /v1/drafts/{id}/validate   # { "version": 1 }
POST /v1/drafts/{id}/publish    # { "version": 1, "idempotencyKey": "..." }
POST /v1/drafts/{id}/schedule   # { "version": 1, "scheduledAt": "2026-11-30T14:00:00Z", "idempotencyKey": "..." }
POST /v1/drafts/{id}/queue      # { "version": 1, "idempotencyKey": "..." }
```

### Deliveries, Calendar, Results & Growth Tools

```http
GET  /v1/jobs/query?state=failed&limit=20
POST /v1/jobs/{id}/reschedule   # { "scheduledAt": "2026-12-01T15:00:00Z" }
POST /v1/jobs/{id}/cancel       # {}
POST /v1/jobs/{id}/retry        # { "idempotencyKey": "..." }

GET  /v1/calendar?days=14
GET  /v1/results?days=30&source=all
POST /v1/results/sync           # {} or { "accountId": "acc_1" }

GET  /v1/short-links
POST /v1/short-links            # { "url": "https://example.com/offer", "label": "Spring promo" }
GET  /v1/links
GET  /v1/webhooks
```

---

## Hosted MCP Integration

When connected to `https://app.spicapost.com/mcp`, the assistant gets **144 tools**, **16 guided prompts**,
and **23 read-only resources/URI templates** under one OAuth login (covering all brands). For lightweight
or context-constrained clients, connect to `https://app.spicapost.com/mcp?profile=core` for the lean
**28-tool** daily publishing profile.

Core MCP tools you will use most often:

| Workflow | Tools |
| --- | --- |
| **Start & Brands** | `brands_list`, `brands_overview`, `setup_start`, `site_study`, `brand_get`, `brand_save`, `workspace_overview` |
| **Accounts** | `accounts_list`, `accounts_connect`, `capabilities`, `boards_list`, `tiktok_account_get` |
| **Media & Templates** | `media_upload`, `media_from_url`, `media_upload_link`, `media_list`, `media_view`, `media_update`, `templates_list`, `templates_render` |
| **Draft & Grade** | `playbook_get`, `coverage_get`, `topics_add`, `grader_get`, `post_check`, `drafts_create`, `drafts_create_batch`, `drafts_edit`, `drafts_validate`, `drafts_hold` |
| **Publish & Queue** | `publish`, `schedule`, `schedule_batch`, `queue_add`, `queue_get`, `jobs_query`, `jobs_get`, `jobs_reschedule`, `jobs_cancel`, `jobs_retry` |
| **Results & SEO** | `results_get`, `results_sync`, `brands_results_summary`, `search_console_status`, `keywords_research`, `short_links_save`, `links_list`, `links_save`, `links_qr` |
| **Agency & Teams** | `content_calendar_get`, `brands_calendar_get`, `review_links_save`, `approvals_list`, `approvals_submit`, `approvals_decide`, `webhooks_save`, `export_results` |

---

## Platform Options (`variants[].options` & `kind`)

Pass network-specific fields inside `variants[].options` (and `"kind": "story"` on the variant itself for stories).
Unknown keys or options sent to the wrong network are refused with a plain error sentence.

| Platform (`network`) | Field | Type / accepted values | What it does |
| --- | --- | --- | --- |
| **Instagram** (`instagram`) | `kind` *(variant)* | `"post"` \| `"story"` | `"story"` sends 1 JPEG/MP4 with empty text. |
| | `options.collaborators` | `string[]` (max 3) | Invite up to 3 Instagram usernames to co-author a photo, reel or carousel (not a story). Never guess usernames. |
| | `options.tags` | `Array<{ username, file?, x?, y? }>` | Tag up to 20 people per file (`file` 1-based; `x`/`y` 0–1 required on photos, omitted on video, optional on stories). |
| | `options.firstReply` | `string` (≤ 2,200 chars) | First comment posted right after publish (not a story). Non-fatal if comment fails (`firstReplyId` / `firstReplyError` on receipt). |
| | `options.aiGenerated` | `boolean` | `true` labels feed photo, reel or carousel as AI-generated media (`is_ai_generated`, not a story). |
| | `options.cover` | integer (seconds ≥ 0) | Frame timestamp in whole seconds for a reel cover (single video only). |
| | `options.reelsOnly` | `boolean` | `true` publishes a reel to the Reels tab only (hides from main grid). |
| | `options.trial` | `"manual"` \| `"auto"` | Trial reel shown to non-followers first (`"manual"` owner shares later, `"auto"` Instagram graduates on performance). |
| **X / Twitter** (`x`) | `options.thread` | `boolean` | `true` posts up to 10 pictures as a reply thread (1 picture per tweet) so X does not tile-crop carousels. |
| | `options.firstReply` | `string` (≤ 280 weighted chars) | Reply posted right under the main post — **put links here** so the main post stays clean and avoids X link limits. |
| | `options.threadPosts` | `string[]` (1–24 items, ≤ 280 weighted chars each) | Multi-post text thread chained as replies under the main tweet (combines cleanly with `firstReply` and `thread`). |
| **Threads** (`threads`) | `options.firstReply` | `string` (≤ 500 chars) | First reply posted right after publish. |
| | `options.threadPosts` | `string[]` (1–24 items, ≤ 500 chars each) | Multi-post text thread chained as replies under the main Threads post. |
| | `options.quotePostId` | numeric string | Numeric Threads post ID to quote. |
| | `options.replyToId` | numeric string | Numeric Threads post ID to reply to. |
| **LinkedIn** (`linkedin`) | `options.firstReply` | `string` (≤ 1,250 chars) | First comment posted right after publish (ideal for links without hurting feed reach). Text ≤ 3,000 chars, 1–20 PNG/JPEG or 1 MP4. |
| **Facebook Pages** (`facebook`) | `kind` *(variant)* | `"post"` \| `"story"` | `"story"` sends 1 PNG/JPEG or 1 MP4 (3–60s) with empty text. |
| | `options.firstReply` | `string` (≤ 2,200 chars) | First comment posted right after publish (not a story). |
| **YouTube** (`youtube`) | `options.visibility` | `"public"` \| `"unlisted"` \| `"private"` | Who can see the uploaded video. **Always ask the user**; drafts without it flag `ask`. First line of `text` is the title (≤ 100 chars, no `<` or `>`); rest is description (≤ 5,000 bytes). |
| | `options.videoTags` | `string[]` (1–30 tags, ≤ 500 total chars) | Keyword tags sent to `snippet.tags` (no `<` or `>`). |
| | `options.containsSyntheticMedia` | `boolean` | Declares whether the video contains altered or AI-generated realistic content. |
| | `options.publishAt` | future ISO 8601 UTC string | Native YouTube scheduled publish time (keeps video `private` until `publishAt`; cannot combine with `"public"` or `"unlisted"`). |
| **Pinterest** (`pinterest`) | `options.board` | `string` (≤ 180 chars) | Board name or ID from `boards_list` / `boards`. Omit to pin to the account's default board. |
| | `options.link` | `string` (`https://`, ≤ 2048) | Destination URL for the pin. Omit to use the first `https://` URL in the description. |
| | `options.cover` | integer (seconds ≥ 0) | Video cover frame in whole seconds (defaults to 1s; or attach an image alongside the video). First line of `text` is the title (≤ 100 chars); rest is description (≤ 800 chars). |
| **Google Business** (`google`) | `options.type` | `"update"` \| `"offer"` \| `"event"` | Post kind (default `"update"`). |
| | `options.language` | `string` (BCP-47, e.g. `"en"`, `"es"`) | Language code for the post. |
| | `options.button` | `{ action, url? }` | CTA button on `update` or `event` (not `offer`): `action` is `"book"`, `"order"`, `"shop"`, `"learn_more"`, `"sign_up"`, or `"call"` (`url` starting with `https://` required except `"call"`). |
| | `options.title` | `string` (≤ 58 chars) | Required for `"offer"` and `"event"`. |
| | `options.start` / `options.end` | `"YYYY-MM-DD"` or `"YYYY-MM-DDTHH:MM"` | Required for `"offer"` and `"event"`, in the business's local time (include time on both or neither). |
| | `options.offer` | `{ code?, url?, terms? }` | Optional redemption details for `"offer"` (`code` ≤ 58, `url` `https://`, `terms` ≤ 5,000). |
| **Bluesky** (`bluesky`) | — | — | Text ≤ 300 graphemes / 3,000 UTF-8 bytes, up to 4 PNG/JPEG/WebP (≤ 2 MB each) or 1 MP4 (≤ 100 MB). Bare domains automatically become links. |
| **TikTok** (`tiktok`) | *(none via API)* | Human `/tiktok` screen | Read account limits via `tiktok_account_get` / `tiktok`. Privacy, comments, duet, stitch and commercial choices **must** be chosen by the owner on the `/tiktok` link returned in `choose` — never send options here. |

**Example — multi-network draft with per-platform options (CLI):**
```bash
npx spica-cli post \
  --title "Spring menu launch" \
  --accounts acc_x,acc_li,acc_gbp \
  --text "Our spring menu starts Friday at 8am." \
  --media med_123 \
  --draft \
  --options '{
    "x": { "firstReply": "Full menu: https://example.com/menu" },
    "google": {
      "type": "offer",
      "title": "Spring menu tasting",
      "start": "2026-04-03",
      "end": "2026-04-12",
      "offer": { "code": "SPRING10", "url": "https://example.com/menu" }
    }
  }'
```

---

## Platform Gotchas (Important for Agents)

1. **Check which networks are live before promising a connect link.**
   X, LinkedIn (personal), Bluesky and Google Business Profile are enabled in production; Instagram,
   Facebook Pages, Threads, TikTok, YouTube, Pinterest and LinkedIn Company Pages switch on as each
   platform approval clears. Always check `accounts_connect` / `accounts:connect` — if `ready: false`,
   say so plainly instead of sending a broken link.
2. **Use `drafts_hold` when a network is not connected yet.**
   Do not lose the user's first post in chat history: `drafts_hold` keeps the caption and pictures on
   their account page beside that network's Connect button and turns it into a real draft automatically
   when they connect.
3. **Always make images JPEG when targeting multiple networks.**
   Instagram accepts **JPEG only** (refuses PNG and WebP), and no network accepts iPhone HEIC/HEIF.
   Every network that takes images accepts JPEG.
4. **Media-required vs. text-only networks:**
   - **Media required**: `instagram` (1–20 JPEG/MP4), `tiktok` (1 MP4, 3s–10m), `youtube` (1 MP4), `pinterest` (1–5 PNG/JPEG or 1 MP4, 4s–15m).
   - **Text-only allowed**: `x` (280 weighted chars; links count 23, emoji/CJK count 2), `bluesky` (300 graphemes; images ≤ 2 MB), `linkedin` (3,000 chars), `facebook` (63,206 chars), `threads` (500 chars), `google` (1,500 chars; 0 or 1 photo ≤ 5 MB, no video).
5. **For sandbox-generated images or files > 3 MB, use `media_upload_link` (or CLI `upload`) — never huge base64.**
   In browser chat apps like Claude, `media_upload_link` gives a one-time page (valid 1 hour) where
   the user drops the file or a sandbox PUTs raw bytes cleanly. In terminal/Cursor, `npx spica-cli upload --file ...`
   sends raw binary bytes straight to `POST /v1/media`.
6. **Optimistic locking & idempotency:**
   Draft edits require the latest `version` (409 on conflict — re-read with `drafts_get`). Every
   `publish`, `schedule`, `queue_add` and `jobs_retry` requires a unique `idempotencyKey` (8–200 chars);
   reuse the same key after a timeout so you never double-post.
7. **Never retry a delivery with `state: "unknown"`.**
   `unknown` means the network did not return a clear receipt and the post may already be live. Read
   `jobs_get` again later or ask the user to verify on the network before posting again.
8. **Diagnose failures by cause before asking the user to reconnect:**
   - **Dead / revoked token** (`needs_reconnect` or auth error) → hand over `accounts_connect` link.
   - **TikTok spam restriction** ("temporarily restricted") → reconnecting won't fix it; lower posting cadence and wait 24–48 hours.
   - **YouTube daily upload quota** → spread uploads across days; channel limits reset at midnight Pacific.
   - **X 403 / link ceiling** → move links into `options.firstReply` (or create a tracked `/l/<code>` short link on Studio/Pro) and avoid repetitive text.
   - **Bluesky video rejection** → verify the account's email is confirmed on Bluesky and the MP4 is ≤ 100 MB.
   - **Approval required (403 `approval_required`)** → workspace role is Editor or approval gate is on; submit via `approvals_submit` instead of direct publishing.

---

## Recommended Workflows

### Shipping a release or local video (Cursor / Claude Code / Codex)

1. Check connected accounts and brand voice (`overview` or `brand_get` + `accounts_list`).
2. *(Optional, ask user first)* Inspect a local video frame with `ffmpeg` before writing captions:
   ```bash
   ffmpeg -i demo.mp4 -ss 00:00:03 -frames:v 1 frame.jpg -y
   ```
3. Upload media (`npx spica-cli upload --file ./demo.mp4 --alt "..."`) or render branded carousel
   slides via MCP `templates_render` and inspect them with `media_view`.
4. *(Studio/Pro)* Create tracked short links (`short-links:create` / `short_links_save`) so clicks are
   attributed per post — even on X and LinkedIn.
5. Write platform-native copy for each network (never paste one identical caption everywhere), save as
   a draft (`--draft` or `drafts_create`), validate, and show the user the exact copy, target accounts,
   brand and composer link.
6. After explicit user approval, publish, schedule (`--schedule`), or queue (`--queue`).
7. Follow up with `jobs` / `results:sync` / `results` to confirm receipts and measure performance.

## Automation Guidelines

- **Confirm before publishing or scheduling.** Creating and validating drafts is safe; publishing is irreversible.
- **Always name the brand** when a login holds multiple brands (`brands_list` / `brandId`).
- **Write platform-native variants** grounded in `brand_get` (respect `brand.never` and only cite published prices).
- **Respect TikTok & YouTube user choices**: always ask YouTube `visibility` and always hand over the `/tiktok` screen link in `choose`.
- **Keep accounts healthy**: space posts naturally via the queue, avoid duplicate blasts across accounts, and check `jobs` receipts after every run.

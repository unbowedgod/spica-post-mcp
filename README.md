<img src="logo.png" alt="Spica Post" width="96" height="96">

# Spica Post MCP server

Spica Post is a social media scheduler for small businesses and creators. This is its hosted MCP
server: connect Claude, ChatGPT, Gemini, Cursor or any MCP client, tell it what's happening this week,
and it drafts a post for each of your social accounts, checks each against that network's rules, and
schedules or publishes it once you approve.

- **Endpoint:** `https://app.spicapost.com/mcp` (remote, streamable HTTP)
- **Sign-in:** OAuth with discovery and automatic client registration. No API key, nothing to install.
- **Website:** https://spicapost.com · **Full tool reference:** https://spicapost.com/reference/
- **Registry name:** `com.spicapost/spica-post` in the [official MCP Registry](https://registry.modelcontextprotocol.io/v0/servers?search=spicapost)

Networks: X, LinkedIn and Bluesky today. Instagram, Facebook, Threads, Google Business Profile, YouTube
and TikTok are built and switch on as each network approves the app.

## Connect

**Claude** (web and desktop): Settings → Connectors → Add custom connector → paste
`https://app.spicapost.com/mcp`. [Guide](https://spicapost.com/connect/claude/)

**ChatGPT:** add it as a connector with the same address. [Guide](https://spicapost.com/connect/chatgpt/)

**Claude Code**

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

## What it can do

Nothing is published or scheduled without your yes to that post.

### Accounts

- `accounts_list` (List connected accounts) · read only
- `accounts_connect` (Get a link to connect an account) · read only
- `capabilities` (What each network takes) · read only
- `posts_recent` (Recent posts on an account) · read only
- `boards_list` (List Pinterest boards) · read only
- `accounts_board` (Choose a Pinterest board)
- `tiktok_account_get` (What a TikTok account allows) · read only
- `accounts_disconnect` (Disconnect an account) · changes what is published
- `accounts_create_test` (Make a practice account)

### Media

- `media_upload` (Upload a photo or video)
- `media_from_url` (Add a photo or video from a link)
- `media_list` (List photos and videos) · read only
- `media_view` (Look at a photo or video) · read only
- `media_delete` (Delete a photo or video) · changes what is published

### Drafts

- `drafts_create` (Write a draft)
- `drafts_edit` (Edit a draft)
- `drafts_validate` (Check a draft) · read only
- `post_check` (Check a post against a network) · read only
- `drafts_get` (Read a draft) · read only
- `drafts_list` (List drafts) · read only
- `drafts_delete` (Delete a draft) · changes what is published
- `drafts_hold` (Keep a post until its account is connected)
- `drafts_hold_delete` (Drop a waiting post) · changes what is published

### Publishing

- `publish` (Publish now) · changes what is published
- `schedule` (Schedule a post) · changes what is published
- `queue_add` (Add a post to the queue) · changes what is published
- `queue_get` (Read the posting queue) · read only
- `queue_set` (Set the posting times)
- `jobs_get` (Read a scheduled post) · read only
- `jobs_list` (List scheduled and sent posts) · read only
- `results_get` (Read how posts did) · read only
- `jobs_reschedule` (Move a scheduled post) · changes what is published
- `jobs_cancel` (Cancel a scheduled post) · changes what is published

### Brand

- `setup_start` (Start setup) · read only
- `site_study` (Read a business website) · read only
- `brand_get` (Read the brand) · read only
- `brand_save` (Save the brand)
- `brand_rename` (Rename the brand)
- `profile_get` (Read the industry profile) · read only
- `profile_save` (Save the industry profile)

### Templates

- `templates_list` (List post designs) · read only
- `templates_get` (Read a post design) · read only
- `templates_render` (Make a designed post)

### Topics

- `coverage_get` (What topics are covered) · read only
- `keywords_research` (Research local keywords)
- `keywords_list` (List researched keywords) · read only
- `topics_list` (List topics) · read only
- `topics_add` (Add a topic)
- `topics_link` (Tie drafts to a topic)
- `topics_remove` (Remove a topic) · changes what is published

### Writing guides

- `playbook_get` (Read the writing playbook) · read only
- `grader_get` (Read the draft grader) · read only

### Articles

- `articles_save` (Save an article)
- `articles_get` (Read an article) · read only
- `articles_list` (List articles) · read only
- `articles_delete` (Delete an article) · changes what is published

### Locations

- `locations_list` (List locations) · read only
- `locations_save` (Save a location)
- `locations_report` (Report for a location) · read only
- `locations_delete` (Delete a location) · changes what is published

### Link page

- `links_list` (List link pages) · read only
- `links_save` (Save a link page)
- `links_delete` (Delete a link page) · changes what is published

### Plan and help

- `usage_get` (Plan and usage) · read only
- `settings_set_time_zone` (Set the time zone)
- `help_search` (Search help) · read only
- `help_get` (Read a help article) · read only

## Plans

A Spica Post plan is required: Starter $99 once, Studio $29 a month, Pro $99 a month (Studio and Pro start
with 7 days free). Current plans and limits: https://spicapost.com/pricing.json

## Privacy and support

- Privacy policy: https://spicapost.com/legal/privacy/
- Terms: https://spicapost.com/legal/terms/
- Support: info@spicapost.com

Spica Post is made by ML Apps LLC, Florida. The server's source is not public; this repository holds its
public description, registry entry and logo.

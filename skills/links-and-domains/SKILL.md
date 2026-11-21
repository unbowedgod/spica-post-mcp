---
name: links-and-domains
description: Set up and manage a brand's link page, Pro custom domain and white-label branding, tracked short links (/l/<code>) and sponsor media kit. Use when the user asks to configure a link-in-bio page, connect a custom domain, shorten links to track clicks, or publish a media kit.
---

Use this skill when the user wants to manage their public link page, attach a Pro custom domain, remove Spica Post branding, shorten links for click tracking, or publish a sponsor media kit.

1. Call `brands_list` first (when the login holds multiple brands, confirm which one and pass `brandId` on every call).
2. Inspect current state with `links_list` (and `short_links_list` or `media_kit_get` when relevant).
3. **Link page & white-label**: Use `links_save` to update the handle, name, bio, link buttons (`addLink` for adding one link), `showBlog`, or `hideBranding: true` (Pro white-label removing "Made with Spica Post" from the link page, blog and media kit). Ask the user before publishing (`published: true`) or deleting (`links_delete`).
4. **Pro custom domain**:
   - Call `links_domain_set` with the link page `id` and clean hostname (such as `links.yourbusiness.com` or `yourbusiness.com`). Ask the user before changing an already live custom domain.
   - Show the user the exact TXT record (`_spica-verify.<host>` → `spica-verify=<token>`) and CNAME record (`<host>` → `app.spicapost.com`, or ALIAS/ANAME/flattened A record for apex domains) to add at their registrar.
   - Once the user says DNS records are added, call `links_domain_verify`. Once verified, the domain serves `/`, `/blog`, `/blog/<slug>`, `/media-kit` and `/robots.txt` with white-label branding and canonical URLs.
   - Only call `links_domain_remove` after explicit confirmation.
5. **Tracked short links (Studio and Pro)**: Use `short_links_save` to create `/l/<code>` URLs tied to a `draftId`, `postId` or `autoreplyRuleId`, and `short_links_list` (or `results_get`) to report human click counts. Ask before calling `short_links_delete`.
6. **Sponsor media kit (Pro)**: Read `media_kit_get` and `results_get`, draft the headline, sponsor intro, contact link and optional self-reported audience or package rows without inventing numbers, show the full preview, and ask before saving `published: true` via `media_kit_save`.

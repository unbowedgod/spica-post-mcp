#!/usr/bin/env node
// Spica Post CLI (zero dependencies, Node.js 18+).
// Wraps the hosted Spica Post /v1 REST API (https://app.spicapost.com/v1).
// Works standalone via `npx spica-post-cli <command>` or directly as a bundled skill script.
import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const VERSION = '1.0.0';
const DEFAULT_BASE_URL = 'https://app.spicapost.com';
const DEVELOPERS_URL = 'https://app.spicapost.com/developers';
const MCP_URL = 'https://app.spicapost.com/mcp';

const MIME_BY_EXT = Object.freeze({
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
});

const KNOWN_NETWORKS = new Set([
  'instagram',
  'facebook',
  'threads',
  'x',
  'linkedin',
  'bluesky',
  'tiktok',
  'youtube',
  'pinterest',
  'google',
  'test',
]);

export const HELP_SPEC = Object.freeze({
  name: 'spica-post-cli',
  version: VERSION,
  apiBaseUrl: DEFAULT_BASE_URL,
  openApiUrl: `${DEFAULT_BASE_URL}/v1/openapi.json`,
  mcpUrl: MCP_URL,
  configPriority: [
    'SPICA_API_KEY environment variable',
    './.spica-post/config.json (project-local)',
    '~/.config/spica-post/config.json (user-global)',
  ],
  commands: [
    { name: 'setup', flags: ['--key <sp_live_...>', '--local', '--base-url <url>', '--no-verify'], description: 'Save and verify a Spica Post API key (0600 permissions).' },
    { name: 'overview', flags: [], description: 'Single-call workspace snapshot: brand readiness, accounts, usage, queue and attention items.' },
    { name: 'usage', flags: [], description: 'Plan limits, monthly usage counts and workspace time zone.' },
    { name: 'brand', flags: [], description: 'Read saved brand kit (voice, offers, colours, fonts, never-say rules).' },
    { name: 'capabilities', flags: [], description: 'Caption limits, file formats, counts and options for every network.' },
    { name: 'accounts', flags: [], description: 'List connected social accounts (id, network, name, status).' },
    { name: 'accounts:connect', flags: ['--network <name>'], description: 'Get account-page links to connect or reconnect social networks.' },
    { name: 'accounts:recent', flags: ['--account <id>'], description: 'Read recent published posts for a connected account.' },
    { name: 'boards', flags: ['--account <id>'], description: 'List boards on a connected Pinterest account.' },
    { name: 'tiktok', flags: ['--account <id>'], description: 'Read posting rules and limits for a connected TikTok account.' },
    { name: 'upload', flags: ['--file <path>', '--name <name>', '--alt <text>'], description: 'Upload a local JPEG, PNG, WebP or MP4 file directly to /v1/media.' },
    { name: 'upload:url', flags: ['--url <https://...>', '--name <name>', '--alt <text>'], description: 'Import a direct public image or video URL into the media library.' },
    { name: 'upload-link', flags: ['--name <name>', '--alt <text>', '--multiple', '--max-files <1..20>'], description: 'Create an upload link (1 file / 1h default, or --multiple / --max-files for up to 20 files / 24h).' },
    { name: 'media', flags: [], description: 'List uploaded media files and ids.' },
    { name: 'media:delete', flags: ['--id <media_id>'], description: 'Delete an unused media file.' },
    { name: 'check', flags: ['--network <net1,net2>', '--text <caption...>', '--images <n>', '--videos <n>', '--story'], description: 'Validate a caption and media counts against network rules without saving.' },
    {
      name: 'post',
      flags: [
        '--text <caption...>',
        '--caption <caption...>',
        '--accounts <id1,id2>',
        '--media <mid1,mid2>',
        '--title <name>',
        '--schedule <ISO-8601-UTC>',
        '--queue',
        '--draft',
        '--story',
        '--options <json>',
        '--variants <json>',
        '--idempotency-key <key>',
      ],
      description: 'Draft, publish now, schedule or queue a post across one or more connected accounts.',
    },
    { name: 'drafts', flags: ['--search <query>', '--network <net>', '--account <id>', '--limit <n>'], description: 'List or search saved drafts.' },
    { name: 'drafts:get', flags: ['--id <draft_id>'], description: 'Read one draft with its version, variants and composer link.' },
    { name: 'drafts:validate', flags: ['--id <draft_id>', '--version <n>'], description: 'Check a draft against every target network.' },
    { name: 'drafts:publish', flags: ['--id <draft_id>', '--version <n>', '--idempotency-key <key>'], description: 'Publish an approved draft now.' },
    { name: 'drafts:schedule', flags: ['--id <draft_id>', '--version <n>', '--at <ISO-8601-UTC>', '--idempotency-key <key>'], description: 'Schedule an approved draft for a UTC timestamp.' },
    { name: 'drafts:queue', flags: ['--id <draft_id>', '--version <n>', '--idempotency-key <key>'], description: 'Put an approved draft into the next free queue slot.' },
    { name: 'drafts:delete', flags: ['--id <draft_id>'], description: 'Delete a draft not currently queued.' },
    { name: 'queue', flags: [], description: 'Read configured posting queue slots and next open times.' },
    { name: 'jobs', flags: ['--state <state>', '--network <net>', '--account <id>', '--draft <id>', '--limit <n>'], description: 'List or filter scheduled, published, failed, unknown or cancelled deliveries.' },
    { name: 'jobs:get', flags: ['--id <job_id>'], description: 'Read one delivery and its receipt or error.' },
    { name: 'jobs:reschedule', flags: ['--id <job_id>', '--at <ISO-8601-UTC>'], description: 'Move a queued delivery to a new UTC time.' },
    { name: 'jobs:cancel', flags: ['--id <job_id>'], description: 'Cancel a queued delivery.' },
    { name: 'jobs:retry', flags: ['--id <job_id>', '--at <ISO-8601-UTC>', '--idempotency-key <key>'], description: 'Retry a failed delivery (never retries unknown deliveries).' },
    { name: 'calendar', flags: ['--days <n>', '--from <YYYY-MM-DD>'], description: 'Read local-time content calendar with open slots and external events.' },
    { name: 'results', flags: ['--days <7|30|90>', '--source <all|spica|native>'], description: 'Read post performance, audience growth, short-link clicks, GBP and Search Console stats (Studio/Pro).' },
    { name: 'results:sync', flags: ['--account <id>'], description: 'Trigger whole-account analytics sync for native posts and follower snapshots (Studio/Pro).' },
    { name: 'short-links', flags: [], description: 'List tracked short links and click counts (Studio/Pro).' },
    { name: 'short-links:create', flags: ['--url <https://...>', '--label <text>', '--draft <id>'], description: 'Create a tracked short link (Studio/Pro).' },
    { name: 'links', flags: [], description: 'List link-in-bio pages, stats and editor links.' },
    { name: 'webhooks', flags: [], description: 'List configured signed HTTPS webhook endpoints.' },
    { name: 'api', flags: ['<METHOD>', '<path>', '--body <json>'], description: 'Call any of the 132 /v1 REST routes directly.' },
    { name: 'help', flags: ['--json'], description: 'Show commands, flags and platform options (pass --json for machine-readable output).' },
  ],
  platformOptions: {
    instagram: {
      kind: '"post" | "story" (story = 1 photo/video, empty text)',
      collaborators: 'string[] (up to 3 usernames; feed/reel/carousel only)',
      tags: 'Array<{ username, file?: 1..20, x?: 0..1, y?: 0..1 }> (up to 20 per file)',
      firstReply: 'string <= 2200 chars (first comment posted right after; not on a story)',
      aiGenerated: 'boolean (true labels AI-generated media; not on a story)',
      cover: 'integer seconds into a reel',
      reelsOnly: 'boolean (true = Reels tab only)',
      trial: '"manual" | "auto" (trial reel shown to non-followers first)',
    },
    x: {
      thread: 'boolean (true = up to 10 pictures posted one per reply)',
      firstReply: 'string <= 280 weighted chars (put links here)',
      threadPosts: 'string[] (1 to 24 follow-up texts chained as replies, <= 280 weighted chars each)',
    },
    threads: {
      firstReply: 'string <= 500 chars (first reply posted right after)',
      threadPosts: 'string[] (1 to 24 follow-up texts chained as a thread, <= 500 chars each)',
      quotePostId: 'numeric Threads post id to quote',
      replyToId: 'numeric Threads post id to reply to',
    },
    linkedin: {
      firstReply: 'string <= 1250 chars (first comment posted right after; ideal for links)',
    },
    facebook: {
      kind: '"post" | "story" (story = 1 photo/video, empty text)',
      firstReply: 'string <= 2200 chars (first comment posted right after; not on a story)',
    },
    youtube: {
      visibility: '"public" | "unlisted" | "private" (first line of text is video title <= 100 chars)',
      videoTags: 'string[] (1 to 30 keyword tags, <= 500 combined chars, no < or >)',
      containsSyntheticMedia: 'boolean (declare altered or AI-generated content)',
      publishAt: 'future ISO 8601 timestamp for native YouTube scheduled publishing (sets privacy to private until then)',
    },
    pinterest: {
      board: 'string (board name or id from boards)',
      link: 'string (https:// URL)',
      cover: 'integer seconds into video (first line of text is pin title <= 100 chars)',
    },
    google: {
      type: '"update" | "offer" | "event"',
      language: 'string (e.g. "en" or "es")',
      button: '{ action: "book"|"order"|"shop"|"learn_more"|"sign_up"|"call", url?: "https://..." } (update/event only)',
      title: 'string <= 58 chars (required for offer/event)',
      start: '"YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" (business local time; offer/event)',
      end: '"YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" (business local time; offer/event)',
      offer: '{ code?: <=58, url?: "https://...", terms?: <=5000 } (offer only)',
    },
    tiktok: {
      note: 'Options are never sent via API/CLI; the owner sets privacy/duet/stitch/commercial choices on the /tiktok screen link returned in choose.',
    },
  },
});

class CliError extends Error {
  constructor(message, { exitCode = 1, code = 'cli_error', status = null, details = null } = {}) {
    super(message);
    this.exitCode = exitCode;
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function parseArgs(argv) {
  const positionals = [];
  const flags = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--') {
      positionals.push(...argv.slice(i + 1));
      break;
    }
    if (!arg.startsWith('--')) {
      if (arg === '-h') flags.help = true;
      else if (arg === '-v') flags.version = true;
      else positionals.push(arg);
      continue;
    }
    const eq = arg.indexOf('=');
    if (eq > 2) {
      const key = arg.slice(2, eq);
      flags[key] = arg.slice(eq + 1);
      continue;
    }
    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      flags[key] = next;
      i += 1;
    } else {
      flags[key] = true;
    }
  }
  return { positionals, flags };
}

function readJsonFile(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function validateBaseUrl(raw) {
  let url;
  try {
    url = new URL(raw);
  } catch {
    throw new CliError(`Invalid base URL: ${raw}`, { code: 'invalid_base_url' });
  }
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) {
    throw new CliError('Base URL must use https:// (or http://localhost / http://127.0.0.1 for local dev).', {
      code: 'insecure_base_url',
    });
  }
  return url.origin;
}

export function maskKey(key) {
  const s = String(key ?? '');
  if (s.length <= 14) return 'sp_live_****';
  return `${s.slice(0, 12)}…${s.slice(-4)}`;
}

export function resolveConfig({ cwd = process.cwd(), home = os.homedir(), env = process.env, baseUrlFlag } = {}) {
  const localPath = path.join(cwd, '.spica-post', 'config.json');
  const globalPath = path.join(home, '.config', 'spica-post', 'config.json');
  const localCfg = readJsonFile(localPath);
  const globalCfg = readJsonFile(globalPath);

  let apiKey = null;
  let source = null;
  if (typeof env.SPICA_API_KEY === 'string' && env.SPICA_API_KEY.trim()) {
    apiKey = env.SPICA_API_KEY.trim();
    source = 'SPICA_API_KEY';
  } else if (typeof localCfg?.apiKey === 'string' && localCfg.apiKey.trim()) {
    apiKey = localCfg.apiKey.trim();
    source = localPath;
  } else if (typeof globalCfg?.apiKey === 'string' && globalCfg.apiKey.trim()) {
    apiKey = globalCfg.apiKey.trim();
    source = globalPath;
  }

  const rawBase =
    (typeof baseUrlFlag === 'string' && baseUrlFlag.trim()) ||
    (typeof env.SPICA_API_URL === 'string' && env.SPICA_API_URL.trim()) ||
    (typeof localCfg?.baseUrl === 'string' && localCfg.baseUrl.trim()) ||
    (typeof globalCfg?.baseUrl === 'string' && globalCfg.baseUrl.trim()) ||
    DEFAULT_BASE_URL;

  return {
    apiKey,
    source,
    baseUrl: validateBaseUrl(rawBase),
    localPath,
    globalPath,
  };
}

function requireKey(cfg) {
  if (!cfg.apiKey) {
    throw new CliError(
      `API key not found.\n` +
        `Run: npx spica-post-cli setup --key sp_live_xxxxx\n` +
        `Get a key at: ${DEVELOPERS_URL}\n` +
        `Or connect via OAuth MCP with no API key: ${MCP_URL}`,
      { exitCode: 2, code: 'missing_api_key' },
    );
  }
  return cfg.apiKey;
}

function splitList(raw) {
  if (!raw || typeof raw !== 'string') return [];
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseJsonFlag(raw, name) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new CliError(`--${name} requires a JSON string.`, { code: 'invalid_argument' });
  }
  try {
    return JSON.parse(raw);
  } catch (err) {
    throw new CliError(`Invalid JSON in --${name}: ${err.message}`, { code: 'invalid_json' });
  }
}

function requireFlag(flags, name, label = `--${name}`) {
  const val = flags[name];
  if (typeof val !== 'string' || !val.trim()) {
    throw new CliError(`Missing required flag ${label}.`, { code: 'missing_flag' });
  }
  return val.trim();
}

function requireIntFlag(flags, name) {
  const raw = requireFlag(flags, name);
  const n = Number(raw);
  if (!Number.isInteger(n) || n <= 0) {
    throw new CliError(`--${name} must be a positive integer.`, { code: 'invalid_argument' });
  }
  return n;
}

function buildQuery(params) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== '') sp.set(k, String(v));
  }
  const qs = sp.toString();
  return qs ? `?${qs}` : '';
}

async function apiRequest(cfg, fetchImpl, method, routePath, { body, headers = {}, rawBody } = {}) {
  const key = requireKey(cfg);
  const normalizedPath = routePath.startsWith('/') ? routePath : `/${routePath}`;
  const url = `${cfg.baseUrl}${normalizedPath}`;
  const reqHeaders = {
    Authorization: `Bearer ${key}`,
    Accept: 'application/json',
    'User-Agent': `spica-post-cli/${VERSION}`,
    ...headers,
  };
  let payload;
  if (rawBody !== undefined) {
    payload = rawBody;
  } else if (body !== undefined) {
    reqHeaders['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetchImpl(url, {
      method,
      headers: reqHeaders,
      ...(payload !== undefined ? { body: payload } : {}),
    });
  } catch (err) {
    throw new CliError(`Network error calling ${method} ${url}: ${err.message}`, { code: 'network_error' });
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const message =
      (data && typeof data.error === 'string' && data.error) ||
      `Request failed with HTTP ${res.status}`;
    throw new CliError(message, {
      status: res.status,
      code: (data && typeof data.code === 'string' && data.code) || `http_${res.status}`,
      details: data,
    });
  }
  return data;
}

function formatHelpText() {
  const lines = [
    `spica-post-cli v${VERSION} — CLI for Spica Post (/v1 REST API)`,
    '',
    'Usage:',
    '  npx spica-post-cli <command> [flags]',
    '  npx spica-post-cli help --json',
    '',
    'Auth priority:',
    '  1. SPICA_API_KEY env var',
    '  2. ./.spica-post/config.json (project-local)',
    '  3. ~/.config/spica-post/config.json (user-global)',
    `  Create a key at ${DEVELOPERS_URL} (or use OAuth MCP at ${MCP_URL}).`,
    '',
    'Commands:',
  ];
  for (const cmd of HELP_SPEC.commands) {
    const sig = [cmd.name, ...cmd.flags].join(' ');
    lines.push(`  ${sig}`);
    lines.push(`    ${cmd.description}`);
  }
  lines.push('', 'Global flags:', '  --compact          Emit single-line JSON', '  --base-url <url>   Override API origin (default https://app.spicapost.com)');
  return lines.join('\n');
}

function isPlatformKeyedMap(obj, accountIds) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
  const keys = Object.keys(obj);
  if (!keys.length) return false;
  const idSet = new Set(accountIds);
  return keys.every(
    (k) =>
      (KNOWN_NETWORKS.has(k) || idSet.has(k)) &&
      obj[k] &&
      typeof obj[k] === 'object' &&
      !Array.isArray(obj[k]),
  );
}

export async function runCli(
  argv,
  {
    cwd = process.cwd(),
    home = os.homedir(),
    env = process.env,
    fetch: fetchImpl = globalThis.fetch,
    stdout = (s) => process.stdout.write(`${s}\n`),
    stderr = (s) => process.stderr.write(`${s}\n`),
  } = {},
) {
  const { positionals, flags } = parseArgs(argv);
  const compact = flags.compact === true;
  const emit = (val) => stdout(typeof val === 'string' ? val : JSON.stringify(val, null, compact ? 0 : 2));

  try {
    if (flags.version) {
      emit({ name: 'spica-post-cli', version: VERSION });
      return 0;
    }

    const command = positionals[0] || 'help';
    if (command === 'help' || flags.help) {
      emit(flags.json === true ? HELP_SPEC : formatHelpText());
      return 0;
    }

    const cfg = resolveConfig({
      cwd,
      home,
      env,
      baseUrlFlag: typeof flags['base-url'] === 'string' ? flags['base-url'] : undefined,
    });

    const req = (method, routePath, opts) => apiRequest(cfg, fetchImpl, method, routePath, opts);

    switch (command) {
      case 'setup': {
        const key = requireFlag(flags, 'key');
        if (!key.startsWith('sp_live_') || key.length < 20) {
          throw new CliError('API key must start with sp_live_ (create one on the Developers page of Spica Post).', {
            code: 'invalid_key_format',
          });
        }
        const targetPath = flags.local === true ? cfg.localPath : cfg.globalPath;
        const nextCfg = { ...cfg, apiKey: key };
        let usage = null;
        if (flags['no-verify'] !== true) {
          usage = await apiRequest(nextCfg, fetchImpl, 'GET', '/v1/usage');
        }
        fs.mkdirSync(path.dirname(targetPath), { recursive: true, mode: 0o700 });
        const record = {
          apiKey: key,
          ...(cfg.baseUrl !== DEFAULT_BASE_URL ? { baseUrl: cfg.baseUrl } : {}),
        };
        fs.writeFileSync(targetPath, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 });
        try {
          fs.chmodSync(targetPath, 0o600);
        } catch {}
        emit({
          ok: true,
          savedTo: targetPath,
          key: maskKey(key),
          baseUrl: cfg.baseUrl,
          verified: flags['no-verify'] !== true,
          ...(usage ? { plan: usage.plan ?? null, timeZone: usage.timeZone ?? null } : {}),
        });
        return 0;
      }

      case 'overview':
        emit(await req('GET', '/v1/overview'));
        return 0;

      case 'usage':
        emit(await req('GET', '/v1/usage'));
        return 0;

      case 'brand':
        emit(await req('GET', '/v1/brand'));
        return 0;

      case 'capabilities':
        emit(await req('GET', '/v1/capabilities'));
        return 0;

      case 'accounts':
        emit(await req('GET', '/v1/accounts'));
        return 0;

      case 'accounts:connect': {
        const qs = buildQuery({ network: typeof flags.network === 'string' ? flags.network : undefined });
        emit(await req('GET', `/v1/accounts/connect-links${qs}`));
        return 0;
      }

      case 'accounts:recent': {
        const accountId = encodeURIComponent(requireFlag(flags, 'account'));
        emit(await req('GET', `/v1/accounts/${accountId}/recent-posts`));
        return 0;
      }

      case 'boards': {
        const accountId = encodeURIComponent(requireFlag(flags, 'account'));
        emit(await req('GET', `/v1/accounts/${accountId}/boards`));
        return 0;
      }

      case 'tiktok': {
        const accountId = encodeURIComponent(requireFlag(flags, 'account'));
        emit(await req('GET', `/v1/accounts/${accountId}/tiktok`));
        return 0;
      }

      case 'upload': {
        const filePath = path.resolve(cwd, requireFlag(flags, 'file'));
        if (!fs.existsSync(filePath)) {
          throw new CliError(`File not found: ${filePath}`, { code: 'file_not_found' });
        }
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.heic' || ext === '.heif') {
          throw new CliError('HEIC/HEIF images are not supported by social networks. Convert to JPEG first.', {
            code: 'unsupported_media_type',
          });
        }
        const mimeType = typeof flags['mime-type'] === 'string' ? flags['mime-type'] : MIME_BY_EXT[ext];
        if (!mimeType) {
          throw new CliError(`Unsupported file extension "${ext}". Supported: .jpg, .jpeg, .png, .webp, .mp4.`, {
            code: 'unsupported_media_type',
          });
        }
        const bytes = fs.readFileSync(filePath);
        if (!bytes.length) throw new CliError('File is empty.', { code: 'empty_file' });
        const name = (typeof flags.name === 'string' && flags.name.trim()) || path.basename(filePath);
        const qs = buildQuery({ name });
        let stored = await req('POST', `/v1/media${qs}`, {
          rawBody: bytes,
          headers: { 'Content-Type': mimeType, 'Content-Length': String(bytes.length) },
        });
        const alt = typeof flags.alt === 'string' && flags.alt.trim() ? flags.alt.trim() : null;
        const storedId = stored?.media?.id ?? stored?.id;
        if (alt && storedId) {
          stored = await req('PATCH', `/v1/media/${encodeURIComponent(storedId)}`, { body: { alt } });
        }
        emit(stored);
        return 0;
      }

      case 'upload:url': {
        const body = { url: requireFlag(flags, 'url') };
        if (typeof flags.name === 'string' && flags.name.trim()) body.name = flags.name.trim();
        if (typeof flags.alt === 'string' && flags.alt.trim()) body.alt = flags.alt.trim();
        emit(await req('POST', '/v1/media/from-url', { body }));
        return 0;
      }

      case 'upload-link': {
        const body = {};
        if (typeof flags.name === 'string' && flags.name.trim()) body.name = flags.name.trim();
        if (typeof flags.alt === 'string' && flags.alt.trim()) body.alt = flags.alt.trim();
        if (flags.multiple === true) body.multiple = true;
        if (flags['max-files'] !== undefined) {
          const n = Number(flags['max-files']);
          if (!Number.isInteger(n) || n < 1 || n > 20) {
            throw new CliError('--max-files must be an integer from 1 to 20.', { code: 'invalid_arguments' });
          }
          body.maxFiles = n;
        }
        emit(await req('POST', '/v1/media/upload-link', { body }));
        return 0;
      }

      case 'media':
        emit(await req('GET', '/v1/media'));
        return 0;

      case 'media:delete': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        emit(await req('DELETE', `/v1/media/${id}`));
        return 0;
      }

      case 'check': {
        const networks = splitList(requireFlag(flags, 'network'));
        const text = typeof flags.text === 'string' ? flags.text : typeof flags.caption === 'string' ? flags.caption : '';
        const body = { text, networks };
        if (flags.images !== undefined) body.images = Number(flags.images);
        if (flags.videos !== undefined) body.videos = Number(flags.videos);
        if (flags.story === true) body.story = true;
        emit(await req('POST', '/v1/check', { body }));
        return 0;
      }

      case 'post': {
        const scheduledAt = typeof flags.schedule === 'string' ? flags.schedule.trim() : undefined;
        const queue = flags.queue === true;
        const draftOnly = flags.draft === true;
        const story = flags.story === true;
        if (scheduledAt && queue) {
          throw new CliError('Pass either --schedule <ISO-UTC> or --queue, not both.', { code: 'invalid_arguments' });
        }
        if (draftOnly && (scheduledAt || queue)) {
          throw new CliError('Cannot combine --draft with --schedule or --queue.', { code: 'invalid_arguments' });
        }
        const idempotencyKey =
          (typeof flags['idempotency-key'] === 'string' && flags['idempotency-key'].trim()) || randomUUID();

        const hasVariants = typeof flags.variants === 'string';
        const hasOptions = typeof flags.options === 'string';

        if (!draftOnly && !hasVariants && !hasOptions && !story) {
          const text =
            typeof flags.text === 'string'
              ? flags.text
              : typeof flags.caption === 'string'
                ? flags.caption
                : null;
          if (text === null) throw new CliError('Missing --text (or --caption).', { code: 'missing_flag' });
          const accountIds = splitList(requireFlag(flags, 'accounts'));
          if (!accountIds.length) throw new CliError('--accounts needs at least one account id.', { code: 'missing_flag' });
          const mediaIds = splitList(typeof flags.media === 'string' ? flags.media : '');
          const body = {
            text,
            accountIds,
            idempotencyKey,
            ...(mediaIds.length ? { mediaIds } : {}),
            ...(typeof flags.title === 'string' && flags.title.trim() ? { title: flags.title.trim() } : {}),
            ...(scheduledAt ? { scheduledAt } : {}),
            ...(queue ? { queue: true } : {}),
          };
          emit(await req('POST', '/v1/posts', { body }));
          return 0;
        }

        let variants;
        if (hasVariants) {
          variants = parseJsonFlag(flags.variants, 'variants');
          if (!Array.isArray(variants) || !variants.length) {
            throw new CliError('--variants must be a non-empty JSON array.', { code: 'invalid_argument' });
          }
        } else {
          const accountIds = splitList(requireFlag(flags, 'accounts'));
          if (!accountIds.length) throw new CliError('--accounts needs at least one account id.', { code: 'missing_flag' });
          const text =
            typeof flags.text === 'string'
              ? flags.text
              : typeof flags.caption === 'string'
                ? flags.caption
                : story
                  ? ''
                  : null;
          if (text === null) throw new CliError('Missing --text (or --caption).', { code: 'missing_flag' });
          const mediaIds = splitList(typeof flags.media === 'string' ? flags.media : '');
          const parsedOptions = hasOptions ? parseJsonFlag(flags.options, 'options') : null;
          let networkByAccount = {};
          if (parsedOptions && isPlatformKeyedMap(parsedOptions, accountIds)) {
            const acctResp = await req('GET', '/v1/accounts');
            const list = Array.isArray(acctResp?.accounts) ? acctResp.accounts : Array.isArray(acctResp) ? acctResp : [];
            networkByAccount = Object.fromEntries(list.map((a) => [a.id, a.network]));
          }
          variants = accountIds.map((accountId) => {
            let opt;
            if (parsedOptions) {
              if (isPlatformKeyedMap(parsedOptions, accountIds)) {
                opt = parsedOptions[accountId] ?? parsedOptions[networkByAccount[accountId]];
              } else {
                opt = parsedOptions;
              }
            }
            const variantText = typeof opt?.text === 'string' ? opt.text : typeof opt?.caption === 'string' ? opt.caption : text;
            const variantMedia = Array.isArray(opt?.mediaIds) ? opt.mediaIds : mediaIds;
            const variantKind = opt?.kind ?? (story ? 'story' : undefined);
            let cleanOpt;
            if (opt && typeof opt === 'object') {
              const { text: _t, caption: _c, mediaIds: _m, kind: _k, ...rest } = opt;
              if (Object.keys(rest).length) cleanOpt = rest;
            }
            return {
              accountId,
              text: variantText,
              mediaIds: variantMedia,
              ...(variantKind ? { kind: variantKind } : {}),
              ...(cleanOpt ? { options: cleanOpt } : {}),
            };
          });
        }

        const firstLine = (variants[0]?.text ?? '').split('\n')[0].trim().slice(0, 80);
        const title = (typeof flags.title === 'string' && flags.title.trim()) || firstLine || 'Untitled post';
        const created = await req('POST', '/v1/drafts', { body: { title, variants } });
        const draft = created?.draft ?? created;
        const validation = await req('POST', `/v1/drafts/${encodeURIComponent(draft.id)}/validate`, {
          body: { version: draft.version },
        });
        if (draftOnly || !validation?.valid) {
          emit({ draft, validation, ...(created?.choose ? { choose: created.choose } : {}), ...(created?.ask ? { ask: created.ask } : {}) });
          return validation?.valid ? 0 : 1;
        }
        const actionPath = scheduledAt
          ? `/v1/drafts/${encodeURIComponent(draft.id)}/schedule`
          : queue
            ? `/v1/drafts/${encodeURIComponent(draft.id)}/queue`
            : `/v1/drafts/${encodeURIComponent(draft.id)}/publish`;
        const actionBody = {
          version: draft.version,
          idempotencyKey,
          ...(scheduledAt ? { scheduledAt } : {}),
        };
        const sent = await req('POST', actionPath, { body: actionBody });
        emit({ draft, ...sent });
        return 0;
      }

      case 'drafts': {
        const hasSearch = flags.search || flags.network || flags.account || flags.limit;
        if (hasSearch) {
          const qs = buildQuery({
            query: typeof flags.search === 'string' ? flags.search : undefined,
            network: typeof flags.network === 'string' ? flags.network : undefined,
            accountId: typeof flags.account === 'string' ? flags.account : undefined,
            limit: typeof flags.limit === 'string' ? flags.limit : undefined,
          });
          emit(await req('GET', `/v1/drafts/search${qs}`));
        } else {
          emit(await req('GET', '/v1/drafts'));
        }
        return 0;
      }

      case 'drafts:get': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        emit(await req('GET', `/v1/drafts/${id}`));
        return 0;
      }

      case 'drafts:validate': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const version = requireIntFlag(flags, 'version');
        emit(await req('POST', `/v1/drafts/${id}/validate`, { body: { version } }));
        return 0;
      }

      case 'drafts:publish': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const version = requireIntFlag(flags, 'version');
        const idempotencyKey =
          (typeof flags['idempotency-key'] === 'string' && flags['idempotency-key'].trim()) || randomUUID();
        emit(await req('POST', `/v1/drafts/${id}/publish`, { body: { version, idempotencyKey } }));
        return 0;
      }

      case 'drafts:schedule': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const version = requireIntFlag(flags, 'version');
        const scheduledAt = requireFlag(flags, 'at');
        const idempotencyKey =
          (typeof flags['idempotency-key'] === 'string' && flags['idempotency-key'].trim()) || randomUUID();
        emit(await req('POST', `/v1/drafts/${id}/schedule`, { body: { version, scheduledAt, idempotencyKey } }));
        return 0;
      }

      case 'drafts:queue': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const version = requireIntFlag(flags, 'version');
        const idempotencyKey =
          (typeof flags['idempotency-key'] === 'string' && flags['idempotency-key'].trim()) || randomUUID();
        emit(await req('POST', `/v1/drafts/${id}/queue`, { body: { version, idempotencyKey } }));
        return 0;
      }

      case 'drafts:delete': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        emit(await req('DELETE', `/v1/drafts/${id}`));
        return 0;
      }

      case 'queue':
        emit(await req('GET', '/v1/queue'));
        return 0;

      case 'jobs': {
        const hasFilter = flags.state || flags.network || flags.account || flags.draft || flags.limit;
        if (hasFilter) {
          const qs = buildQuery({
            state: typeof flags.state === 'string' ? flags.state : undefined,
            network: typeof flags.network === 'string' ? flags.network : undefined,
            accountId: typeof flags.account === 'string' ? flags.account : undefined,
            draftId: typeof flags.draft === 'string' ? flags.draft : undefined,
            limit: typeof flags.limit === 'string' ? flags.limit : undefined,
          });
          emit(await req('GET', `/v1/jobs/query${qs}`));
        } else {
          emit(await req('GET', '/v1/jobs'));
        }
        return 0;
      }

      case 'jobs:get': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        emit(await req('GET', `/v1/jobs/${id}`));
        return 0;
      }

      case 'jobs:reschedule': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const scheduledAt = requireFlag(flags, 'at');
        emit(await req('POST', `/v1/jobs/${id}/reschedule`, { body: { scheduledAt } }));
        return 0;
      }

      case 'jobs:cancel': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        emit(await req('POST', `/v1/jobs/${id}/cancel`, { body: {} }));
        return 0;
      }

      case 'jobs:retry': {
        const id = encodeURIComponent(requireFlag(flags, 'id'));
        const idempotencyKey =
          (typeof flags['idempotency-key'] === 'string' && flags['idempotency-key'].trim()) || randomUUID();
        const body = {
          idempotencyKey,
          ...(typeof flags.at === 'string' && flags.at.trim() ? { scheduledAt: flags.at.trim() } : {}),
        };
        emit(await req('POST', `/v1/jobs/${id}/retry`, { body }));
        return 0;
      }

      case 'calendar': {
        const qs = buildQuery({
          days: typeof flags.days === 'string' ? flags.days : undefined,
          from: typeof flags.from === 'string' ? flags.from : undefined,
        });
        emit(await req('GET', `/v1/calendar${qs}`));
        return 0;
      }

      case 'results': {
        const qs = buildQuery({
          days: typeof flags.days === 'string' ? flags.days : undefined,
          source: typeof flags.source === 'string' ? flags.source : undefined,
        });
        emit(await req('GET', `/v1/results${qs}`));
        return 0;
      }

      case 'results:sync': {
        const body = typeof flags.account === 'string' && flags.account.trim() ? { accountId: flags.account.trim() } : {};
        emit(await req('POST', '/v1/results/sync', { body }));
        return 0;
      }

      case 'short-links':
        emit(await req('GET', '/v1/short-links'));
        return 0;

      case 'short-links:create': {
        const body = { url: requireFlag(flags, 'url') };
        if (typeof flags.label === 'string' && flags.label.trim()) body.label = flags.label.trim();
        if (typeof flags.draft === 'string' && flags.draft.trim()) body.draftId = flags.draft.trim();
        emit(await req('POST', '/v1/short-links', { body }));
        return 0;
      }

      case 'links':
        emit(await req('GET', '/v1/links'));
        return 0;

      case 'webhooks':
        emit(await req('GET', '/v1/webhooks'));
        return 0;

      case 'api': {
        const method = String(positionals[1] ?? '').toUpperCase();
        const routePath = String(positionals[2] ?? '');
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          throw new CliError('Usage: spica-post-cli api <GET|POST|PUT|PATCH|DELETE> </v1/...> [--body \'{...}\']', {
            code: 'invalid_argument',
          });
        }
        if (!routePath.startsWith('/v1/')) {
          throw new CliError('Path must start with /v1/.', { code: 'invalid_argument' });
        }
        const body = typeof flags.body === 'string' ? parseJsonFlag(flags.body, 'body') : undefined;
        emit(await req(method, routePath, body !== undefined ? { body } : {}));
        return 0;
      }

      default:
        throw new CliError(`Unknown command "${command}". Run "npx spica-post-cli help" to see available commands.`, {
          code: 'unknown_command',
        });
    }
  } catch (err) {
    if (err instanceof CliError) {
      stderr(
        JSON.stringify(
          {
            error: err.message,
            code: err.code,
            ...(err.status ? { status: err.status } : {}),
            ...(err.details && err.details.error !== err.message ? { details: err.details } : {}),
          },
          null,
          compact ? 0 : 2,
        ),
      );
      return err.exitCode;
    }
    stderr(JSON.stringify({ error: err?.message ?? String(err), code: 'unexpected_error' }));
    return 1;
  }
}

const isEntrypoint =
  process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href;

if (isEntrypoint) {
  runCli(process.argv.slice(2)).then((code) => {
    process.exitCode = code;
  });
}

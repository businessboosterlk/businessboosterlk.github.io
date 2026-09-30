# Business Booster homepage

The root GitHub Pages site at https://businessboosterlk.github.io/. This file is the
handoff for Claude Code or any other coding agent.

## Mission and positioning (do not drift)

- Real work over invented results. Proof is live sites, never invented numbers.
- The only quotable client count is "20+" (from ~/bb-consultancy/BB-METRICS.md).
- No prices anywhere until Thulaib settles the web-build price conflict.
- WhatsApp (+94 76 741 2531) is the primary conversion channel. Gmail and phone secondary.
- Plain, confident, human language. British English. No em dashes. No serial comma.
- No fake testimonials, stats, awards, scarcity, countdowns or visitor counters, ever.

## Architecture

- One file: `index.html` (markup, CSS and JS inline). `assets/` holds the logo,
  og.jpg and portfolio screenshots. No build step, no dependencies, no CDN, no fonts
  loaded over the network (system font stack). Works with the network dead after
  first paint and with JavaScript disabled (core content ships visible; JS enhances).
- Deploy = push `main` over SSH to businessboosterlk/businessboosterlk.github.io.
  gh CLI is not installed. A commit is not a deploy: poll the live URL until it serves.

## Design system

- Editorial black and white foundation with a visitor theme switch:
  `html[data-theme=light|dark]`, tokens in `:root` and `[data-theme=dark]`,
  boot script sets the theme before CSS paints, choice persisted as `bb-theme`.
- ONE accent: signal orange `--accent` (interactive emphasis, selected chips,
  progress, scores, the italic serif words). Acid green `--acid` has exactly one
  job: the recommended-service chip in the audit. Do not spread either colour.
- The white wordmark PNG needs `filter:var(--logo-filter)` (invert in light theme).
- Motion: direct scroll handler (never gate on requestAnimationFrame, it wedges),
  gated reveals via `[data-rv]`, travelling nav underline, reading-progress line,
  services marquee, magnetic primary buttons on fine pointers. All of it dies under
  `prefers-reduced-motion` and the page must read complete without any of it.
- Capture mode for screenshots: append `#capture` (plus `-theme-dark` or
  `-theme-light`) to the URL. CSS under `html.cap` forces every end state and caps
  the hero so tall headless captures show the whole page.

## Smart features (Phase 1, live)

- Industry mode: `.ichip` band under the ribbon. `IND` map drives the hero support
  line and badges matching proof cards. Persisted as `bb-industry`, reset in view.
- Sixty second audit: `AQ` questions, deterministic scoring into marketing (max 9),
  website (max 3), operations (max 9), overall out of 21 scaled to 100. Three worst
  answers map to `ARECS` recommendations; lowest pillar maps to `ASVC`. Always
  labelled indicative, never a guarantee.
- WhatsApp brief builder: optional business name and website inputs, sanitised
  (no newlines or angle brackets, length capped) and URL validated before the brief
  is built. The wa.me href is composed only when the visitor clicks the final CTA.
- Analytics: `bbTrack(ev, data)` pushes to `window.bbEvents` and a localStorage ring
  buffer (`bb_events`, last 100). Nothing is transmitted anywhere. A future endpoint
  connects at the marked sendBeacon line. NEVER put an API key in this file.
  Events wired: theme_switched, industry_selected, industry_reset, audit_started,
  audit_completed, audit_restarted, whatsapp_brief_generated, whatsapp_cta_clicked,
  project_viewed.

## Rank Yourself hub (added 2026-08-05)

- One section, id stays `audit`. Five tabs: website scan, SEO scan, social quiz,
  systems quiz, the full sixty second audit. Tabs are `.rtab` chips, panels `.rpanel`.
- The website and SEO lanes call Google PageSpeed Insights KEYLESS from the browser
  (`runPagespeed?url=...&strategy=mobile`). Real Lighthouse scores, source stated in
  the UI, results never invented. KNOWN LIMIT: the keyless quota is a shared public
  pool and returns 429 for much of the day. The failure path is designed as a
  conversion: "send us the address, a human runs the report free" on WhatsApp.
  UPGRADE PATH, needs Thulaib: either a referrer-restricted PSI API key (Google
  designed these for browser use, restrict to businessboosterlk.github.io) or a
  Supabase edge function proxy holding the key server-side. Never a bare key.
- Social and systems lanes are `mountQuiz()` instances (deterministic, self-read,
  the result says so). The social result offers the human ranking: send a handle,
  the team scores it against three nearby competitors within a day.
- Google audit titles are piped through `stripDash()` before rendering so the
  no-dash rule holds even on Google's own strings.
- New events: rank_tab, rank_started, rank_completed, scan_started, scan_completed,
  scan_failed.
- Browser-pane testing trap: file:// loads cache HARD in the preview pane and can
  execute a stale script while serving fresh markup. Bust with a query string or
  verify on the live URL before believing a "broken" result.

## Future phases (agreed, not built)

- Phase 2: ROI and lost-revenue calculator (label everything an estimate), service
  and package builder (no prices), richer case studies (problem, solution, shipped
  work; metrics only when verified).
- Phase 3: website scanner (honest demo mode until PageSpeed or Lighthouse is
  wired server-side; never fake a scan), reporting dashboard demo (stamp DEMO DATA),
  booking (WhatsApp fallback until a real calendar is connected; never fake
  availability), optional AI advisor behind a backend (keys server-side only).

## Gates before any deploy

1. `python3 ~/.claude/skills/bb-rock-solid/guard.py index.html` must PASS.
2. Grep the file for em and en dashes: zero.
3. `node` syntax-check every script block. One h1. JSON-LD parses.
4. Verify at 390px by DOM measurement (scrollWidth), not by screenshot alone.
5. Console clean. Every wa.me link URL-encoded. No invented claims.
6. Copy changes pass the bb-human-voice checker.

## /packages/ (added 30 Sep 2026)
`packages/` is a separate Astro build (`~/bb-websites/bb-packages`) copied in as static files; never hand edit it here. It prints prices by Thulaib's decision of 30 Sep 2026 (the "no prices" rule above covers the homepage, not this page) and carries noindex while it is sent as a sales link.

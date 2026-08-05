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

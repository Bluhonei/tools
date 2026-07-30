# Bluhoneí Tools

Companion interactive tools for Bluhoneí articles/episodes. Static site,
no build step, no dependencies. Deploys to Netlify as-is.

Read `BRAND_VOICE.md` before writing any copy, labels, result text,
button text, or UI strings for any tool in this repo — it covers voice,
tone, banned constructions, and result-summary examples.

## Tools

- **The Real Money Leak Worksheet** (`index.html`) — Ep01 companion. Six
  questions that identify which money pattern is quietly running your
  finances.
- **The Other Kind of Rich Scorecard** (`scorecard.html`) — Ep02
  companion. Six questions scored across six dimensions (cash stability,
  debt clarity, lifestyle resilience, financial protection, future
  building, peace vs. performance), with a dot-indicator breakdown per
  dimension.
- **The Where You Actually Stand Audit** (`audit.html`) — Ep03 companion.
  A private, unscored inventory: 21 items across 7 categories, all
  visible at once, each marked Current / Needs Attention / Avoided. No
  quiz flow — results are a synthesized pattern summary plus one
  prioritized next step.
- **The Summer Spending Worksheet** (`summer.html`) — Ep04 companion. A
  live budget planner, not a quiz or checklist: the user enters real
  numbers (a summer spending ceiling, three spending buckets, an
  "advance no," monthly income/fixed costs) and every calculation
  updates live as she types. Results show whether the plan fits her
  actual discretionary income.
- **The Financial Floor Calculator** (`floor.html`) — Ep05 companion. A
  pure calculator: estimated monthly costs and accessible cash produce
  a live "floor holds for approximately X months" result (color-coded
  plum/amber/red), plus a transition-fund gap against a selectable
  3/4–5/6-month target. The only tool in the suite that outputs a
  specific number rather than a profile, plan, or inventory.
- **The Reliability Policy** (`policy.html`) — Ep06 companion. A
  decision-builder: four decisions (help limit, protected accounts,
  waiting period, default response) drive a live policy preview that
  fills in below as she completes each one. Results are a clean,
  screenshottable card with the finished policy in four first-person
  sentences. The only tool in the suite that produces a written
  personal document rather than a profile, plan, inventory, or number.

Ep01 and Ep02 share the same quiz structure (intro → one question at a
time with a progress bar → results → email capture). Ep03-Ep06 are each
a different interaction pattern (an all-at-once checklist; a live budget
planner; a live pure calculator; a live decision-builder) — all six
reuse the same brand stylesheet, card components, and footer for visual
consistency, but keep separate JS files since their data/logic differ.

## Local preview

Open `index.html`, `scorecard.html`, `audit.html`, `summer.html`,
`floor.html`, or `policy.html` directly in a browser, or serve the
folder locally:

```
npx serve .
```

## Deploying to Netlify

1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In Netlify: **Add new site → Import an existing project → GitHub** and
   select this repository.
3. Build settings are picked up automatically from `netlify.toml`:
   - Build command: *(none)*
   - Publish directory: `.`
4. Deploy. `index.html`, `scorecard.html`, `audit.html`, `summer.html`,
   `floor.html`, and `policy.html` are all served as static pages at
   their respective paths.

## Wiring up email capture

**Real Money Leak Worksheet** (`index.html`) already has a live Flodesk
form embedded, along with the required Flodesk universal loader script
in `<head>`.

**The Other Kind of Rich Scorecard** (`scorecard.html`), **The Where You
Actually Stand Audit** (`audit.html`), **The Summer Spending Worksheet**
(`summer.html`), **The Financial Floor Calculator** (`floor.html`), and
**The Reliability Policy** (`policy.html`) still ship with the
lightweight fallback form (same pattern the Worksheet originally used)
so each flow is demoable end to end. To go live for any of them:

1. In Flodesk, open the form for that tool and copy its embed code.
   (Note: the Audit's form is email-only, no name field, by design.)
2. In the page's HTML, replace the contents of `#flodesk-embed-container`
   with that embed code.
3. Add the Flodesk universal loader script to that page's `<head>` —
   copy the `<script>` block from `index.html`'s `<head>` (it's the same
   snippet for every form on the same Flodesk account).
4. Remove the fallback `<form id="email-form">` markup and its related
   JS (the `emailForm` submit handler), since Flodesk's embed handles
   submission itself.

## Structure

- `index.html` / `script.js` — Ep01 Real Money Leak Worksheet
- `scorecard.html` / `scorecard.js` — Ep02 The Other Kind of Rich Scorecard
- `audit.html` / `audit.js` — Ep03 The Where You Actually Stand Audit
- `summer.html` / `summer.js` — Ep04 The Summer Spending Worksheet
- `floor.html` / `floor.js` — Ep05 The Financial Floor Calculator
- `policy.html` / `policy.js` — Ep06 The Reliability Policy
- `style.css` — shared Bluhoneí brand styling (cream/plum/terra/gold
  palette, card components, dimension-breakdown dots, audit checklist/
  toggle/modal components, step cards/live-calc/result cards shared by
  the Summer Worksheet, Floor Calculator, and Reliability Policy) used
  by all six tools
- `BRAND_VOICE.md` — copy/voice reference; read before writing any UI text
- `netlify.toml` — Netlify deploy configuration

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

Ep01 and Ep02 share the same quiz structure (intro → one question at a
time with a progress bar → results → email capture). Ep03 and Ep04 are
each a different interaction pattern (an all-at-once checklist; a live
numeric calculator) — all four reuse the same brand stylesheet, card
components, and footer for visual consistency, but keep separate JS
files since their data/logic differ.

## Local preview

Open `index.html`, `scorecard.html`, `audit.html`, or `summer.html`
directly in a browser, or serve the folder locally:

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
4. Deploy. `index.html`, `scorecard.html`, `audit.html`, and
   `summer.html` are all served as static pages at their respective
   paths.

## Wiring up email capture

**Real Money Leak Worksheet** (`index.html`) already has a live Flodesk
form embedded, along with the required Flodesk universal loader script
in `<head>`.

**The Other Kind of Rich Scorecard** (`scorecard.html`), **The Where You
Actually Stand Audit** (`audit.html`), and **The Summer Spending
Worksheet** (`summer.html`) still ship with the lightweight fallback
form (same pattern the Worksheet originally used) so each flow is
demoable end to end. To go live for any of them:

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
- `style.css` — shared Bluhoneí brand styling (cream/plum/terra/gold
  palette, card components, dimension-breakdown dots, audit checklist/
  toggle/modal components, summer worksheet step cards/live-calc/result
  cards) used by all four tools
- `BRAND_VOICE.md` — copy/voice reference; read before writing any UI text
- `netlify.toml` — Netlify deploy configuration

# Bluhoneí Tools

Companion interactive tools for Bluhoneí articles/episodes. Static site,
no build step, no dependencies. Deploys to Netlify as-is.

## Tools

- **The Real Money Leak Worksheet** (`index.html`) — Ep01 companion. Six
  questions that identify which money pattern is quietly running your
  finances.
- **The Other Kind of Rich Scorecard** (`scorecard.html`) — Ep02
  companion. Six questions scored across six dimensions (cash stability,
  debt clarity, lifestyle resilience, financial protection, future
  building, peace vs. performance), with a dot-indicator breakdown per
  dimension.

Both tools share the same brand stylesheet (`style.css`) and structural
pattern (intro → one question at a time with a progress bar → results →
email capture), but keep separate JS files since their question data and
scoring logic differ.

## Local preview

Open `index.html` or `scorecard.html` directly in a browser, or serve the
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
4. Deploy. Both `index.html` and `scorecard.html` are served as static
   pages at their respective paths.

## Wiring up email capture

**Real Money Leak Worksheet** (`index.html`) already has a live Flodesk
form embedded, along with the required Flodesk universal loader script
in `<head>`.

**The Other Kind of Rich Scorecard** (`scorecard.html`) still ships with
the lightweight fallback form (same pattern the Worksheet originally
used) so the flow is demoable end to end. To go live:

1. In Flodesk, open the form for this scorecard and copy its embed code.
2. In `scorecard.html`, replace the contents of
   `#flodesk-embed-container` with that embed code.
3. Add the Flodesk universal loader script to `scorecard.html`'s
   `<head>` — copy the `<script>` block from `index.html`'s `<head>` (it's
   the same snippet for every form on the same Flodesk account).
4. Remove the fallback `<form id="email-form">` markup and its related
   JS in `scorecard.js` (the `emailForm` submit handler), since Flodesk's
   embed handles submission itself.

## Structure

- `index.html` / `script.js` — Ep01 Real Money Leak Worksheet
- `scorecard.html` / `scorecard.js` — Ep02 The Other Kind of Rich Scorecard
- `style.css` — shared Bluhoneí brand styling (cream/plum/terra/gold
  palette, card components, dimension-breakdown dots) used by both tools
- `netlify.toml` — Netlify deploy configuration

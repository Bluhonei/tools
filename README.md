# The Real Money Leak Worksheet

A single-page web app for Bluhoneí — a six-question worksheet that helps
women over 40 identify which money pattern is quietly running their
finances, then offers to email them a copy of their results.

Static site, no build step, no dependencies. Deploys to Netlify as-is.

## Local preview

Open `index.html` directly in a browser, or serve the folder locally:

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
4. Deploy.

## Wiring up the real email capture

The results screen currently ships with a lightweight fallback form so the
full flow is demoable end to end. To go live:

1. In Flodesk, open the form for this worksheet and copy its embed code.
2. In `index.html`, replace the contents of
   `#flodesk-embed-container` with that embed code.
3. Remove the fallback `<form id="email-form">` markup and its related
   JS in `script.js` (the `emailForm` submit handler), since Flodesk's
   embed handles submission itself.

## Structure

- `index.html` — markup for the intro, quiz, and results/email-capture screens
- `style.css` — Bluhoneí brand styling (cream/plum/terra/gold palette)
- `script.js` — question data, scoring logic, and screen navigation
- `netlify.toml` — Netlify deploy configuration

# CLAUDE.md — treppmanndesignportfolio

Tobias Treppmann's portfolio. Astro static site, deployed to **treppmann.design**.
GitHub: `oratioandco/treppmanndesignportfolio`.

## Deploy — GitHub Actions (NOT manual rsync)

Pages source is **GitHub Actions** (`.github/workflows/deploy.yml`). To ship:
just **commit and push `main`** — CI builds and publishes automatically.

- Do **NOT** rsync to the `gh-pages` branch. That legacy flow is retired; the
  `gh-pages` branch is now an unused backup. (The old `rsync --delete` deploy is
  what once silently blanked the ChurchDesk images — see below.)
- `npm run build` runs `scripts/check-images.mjs` first, so the deploy **fails
  in CI if a published study or any page references a missing `/images/...`
  file**. Work-in-progress studies (status ≠ `published`) only warn.
- Inline `!` pushes sometimes don't land (HTTPS credential prompt can't complete
  in that context). A `git push` from a normal authenticated shell works.

## Case study covers — programmatic halftone SVGs

Every case study's `hero_image` is a generated abstract **halftone** cover
(teal duotone dots, resolving outward from a per-study focal point, theme-aware
via `prefers-color-scheme`). They're used as both the **card image** and the
**page hero**, and tie visually to the Redaction typeface (itself a halftone face).

- Generator: `scripts/generate-covers.mjs` → `npm run covers`. Outputs
  `public/images/covers/generated/<study-id>.svg` (one per study) + a preview at
  `/dev/covers/`. Deterministic (seeded), so rebuilds are identical.
- Per-study metaphor + tuning (dot size `DOT`, focal points, fields) live in that
  script. To change a cover, edit the metaphor/params and re-run `npm run covers`.
- Review without a browser: `scripts/render-cover-sheet.mjs` (contact sheet) and
  `scripts/render-style-compare.mjs` (fidelity comparison) render PNGs to `/tmp`
  via `sharp`.
- Meaningful images (diagrams, screenshots) live in the case-study **bodies**
  (section `images`), not as heroes.

## Data & components

- Case studies: `src/data/cv-tailor-data/case-studies/*.json`. Filters (which
  studies show per audience): `.../case-studies/filters/*.json`.
- `[study].astro` inlines `.svg` heroes (theme-aware); raster heroes render as `<img>`.
- Bio: `src/components/BioRegenerator.astro` + `src/data/bio-variants.json`. The
  full name **"Tobias Treppmann"** is always bolded (server render + `renderBio` +
  fallbacks). Live bios come from the external bio API (below).

## Bio API — SEPARATE repo, Coolify-deployed

The live bio generator is a **different project**:
`~/Developer/StudioProjects/treppmann-bio-api` (`oratioandco/treppmann-bio-api`),
a Hono service deployed via **Coolify on Hetzner**. The prompt is in
`src/index.ts`.

- It does **not** auto-deploy on git push — changes require a **manual Coolify
  redeploy** (which also clears its 7-day in-memory cache).

## Current open items

- **bio-api redeploy pending**: the "always use full name in every vibe" prompt
  change is pushed (commit `4877735`) but the running service still serves the
  old cached prompt. Needs a Coolify redeploy, then verify `POST /bio` output
  includes "Tobias Treppmann" for the standard/poem vibes.
- WIP studies reference body images that don't exist yet (datameer/draft,
  spreadshirt, app-redesign, agentic, ai-prototyping) — the image guard warns
  (non-blocking). Add the assets or remove the refs when those studies are finished.

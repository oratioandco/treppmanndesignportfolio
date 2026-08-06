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

## Anonymised leadership study — do not reverse

`leading-a-team-is-a-design-problem` (page: `/case-studies/collaboration-redesign`) is
**deliberately anonymised**. It describes a real, still-identifiable former colleague.

- The employer is **not** named in this study — it is "a B2B SaaS platform company". Ninox
  stays in the CV, the bio, and the `ninox-ai-onboarding` product study; only this one is
  anonymised. Do not "restore" the company name here, and do not put it back in the study
  `id`, the page slug, or the cover filename.
- The individual is **"a senior engineer"** and nothing more. No personality description
  ("difficult"), no dates or timeline, no mention of how their employment ended, no
  pronouns beyond they/them.
- **Never** use "neurodivergent", "neurodiverse", "cognitive diversity", "different minds",
  or any diagnostic/psychological label anywhere in the portfolio. The story is framed
  entirely as *when* collaboration failed (group settings, cold questions, time pressure)
  versus when it worked (1:1, in writing, prepared) — conditions, not people.
- `/case-studies/ninox` is a redirect (`astro.config.mjs`) so old indexed links land on the
  anonymised page. Keep it.

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
- **`npm install` needed before any build**: `node_modules/astro/dist/runtime/server/
  render/astro/` is missing, so `astro build` and `astro dev` both fail with
  `Cannot find module … factory.js`. Unrelated to any content change — the install is
  just incomplete. `npm ci` fixes it. Nothing has been built or previewed since.
- **`bibeltv-llm-safe-design-system` is new and at `status: review`** — needs a read
  before it goes to `published`. Authored from the ProtoBible repo (spec 095: CI gates
  for token safety + the MCP/plugin prototyping surface); source of record is that
  repo's `specs/095-llm-safe-token-prototyping/plan.md`.
  - Framing to preserve: the driver is that **Bibel TV has no in-house design team**,
    so Storybook-as-source-of-truth plus a prototyping layer was the pre-existing
    strategy, and CI enforcement is what makes it safe without a design reviewer.
    Polar's Orbit is deliberately kept to a single closing reference — it is
    convergent prior art, **not** the origin of the approach. Don't promote it.
  - Three body screenshots are in `public/images/bibeltv/llm-safe-*.png`, captured
    headlessly from the ProtoBible Storybook (`packages/design-system`, port 6007).
  - Two optional screenshots are noted in the study's `meta.screenshots_pending`;
    neither blocks publishing.
  - Not yet added to any `case-studies/filters/*.json`, so it won't appear for a
    tailored audience until it is.

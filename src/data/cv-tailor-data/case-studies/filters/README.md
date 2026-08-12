# Filters — bio.context is PUBLIC

`BioRegenerator.astro` renders `bio.context` into the page as a `data-context`
attribute. Everything in `company`, `role`, `emphasis` and `avoid` is readable by
any visitor via View Source.

**Write it as a neutral fact and style sheet.** Instructions about the text, never
statements about gaps, and never positioning strategy. Candid assessment belongs
in `my-cv-tailor`, in `fit-assessment.md` and `READY-TO-SHIP.md`, which are private.

Until 2026-08-11 these blocks were written as private notes. Seven filters
published sentences of the form "never claim X, he has never done it", and one
carried a compensation figure. All rewritten that day.

## Do not add `_`-prefixed keys here

`sync-cv-data.mjs` strips them, and the pre-deploy check fails the build if any
survive — that check caught exactly this mistake on 2026-08-11. It only works for
filters that come through the sync.

## Three filters have no upstream source

`hellofresh-director-ux-design.json`, `kleinanzeigen.json` and `lovehoney.json`
predate the engine and have no `outputs/portfolio/{slug}/content.json` in
`my-cv-tailor`. They were edited here directly on 2026-08-11. **Generating an
upstream `content.json` for them later would overwrite these edits** — carry the
rewritten context across if that happens.

---
name: case-study-motif
description: Assign or invent a thematically-grounded generative poster motif for a case study's card (the animated line-art background on /work, /for, and the homepage). Use when a case study is added, or when an existing one's motif is still on the hash fallback and deserves a real one.
---

# Case-study motif assignment

Every case-study card renders a continuously-animating generative motif via
`src/scripts/poster-motifs.js` + `src/components/CaseStudyCard.astro`. Any
case study with no entry in `MOTIF_ASSIGNMENTS` still gets a motif — a
deterministic hash picks one of the existing mechanisms — but that pick is
arbitrary, not meaningful. This skill is the judgment call the hash can't
make: read what the case study is actually about, and give it a shape that
says so, the way an editorial illustrator would pick one image per story.

**The rule that makes this work: shape carries the story, palette never
does.** Every motif uses the same fixed brand colors (`BRAND_COLORS` in
`poster-motifs.js` — sage accent / light sage / cream). Never introduce a
new palette per case study. If you're reaching for a new color to
differentiate two motifs, that's a sign you need a new shape instead.

## Worked examples (the standard to match)

| Case study | What it's actually about | Mechanism | Why |
|---|---|---|---|
| `churchdesk-booking-system` | Reconciling 3 stakeholders' (funeral homes, priests, parish offices) conflicting schedules into one data model | `interlock-rings` | 3 dashed rings, offset centers, overlapping like a Venn diagram — several distinct cycles converging into one |
| `leading-a-team-is-a-design-problem` | "Redesigning how we work together" — one strained working relationship rebuilt into rhythm | `double-helix` | Two strands winding around each other, meeting and diverging |
| `bibeltv-ai-prototyping` | Rapid iteration, generative variation, an accelerated idea→prototype loop | `sunburst` | Jittered spikes radiating outward from one center |

Notice none of these are "the industry the company is in" or "a generic
design icon" — they're the *mechanism of the actual work*, translated into
a *mechanism of drawing*. That's the bar for every assignment this skill
makes.

## Step 1 — read the real theme, not the headline

Open `src/data/cv-tailor-data/case-studies/<id>.json`. Fields worth reading,
in order of how much signal they carry:

- `sections[].type === 'hero'` → `headline`, `subtext` (the framing, but
  often still marketing copy — a starting point, not the answer)
- `sections[].type === 'narrative'` and `'process'` → the actual mechanism
  of the work: what was reconciled, rebuilt, compressed, split, unified,
  discovered
- `subtitle`, `type`, `tags` → supporting signal

Some `/case-studies/*.astro` pages (e.g. `shipping-ai`) are hand-authored
rollups that don't map to a single data file's `id` — for those, add the
route slug itself as a `MOTIF_ASSIGNMENTS` key (see `"shipping-ai"` in the
file for the pattern) and reason from the page's own content instead.

Boil the theme down to one phrase before touching any code — the same way
the worked-examples table does. If you can't state it in one clause, you
don't understand the case study well enough yet to pick a shape for it;
re-read the narrative/process sections.

## Step 2 — pick or invent a mechanism

**Check the existing catalog first** (`MECHANISMS` in `poster-motifs.js`):

- `sunburst` — one center, many radiating elements, jittered length. Fits:
  acceleration, generative variation, one idea branching outward, an
  explosion of options, one source feeding many derived outputs.
- `double-helix` — two strands winding around a shared path. Fits: two
  parties/systems finding rhythm, a relationship or integration between
  exactly two things, back-and-forth negotiation, AI-drafts/human-decides
  pairings.
- `interlock-rings` — N overlapping ring-ribbons at offset centers. Fits:
  reconciling multiple (3+) independent things into one system, a Venn
  diagram of competing constraints, convergence.

If the theme genuinely doesn't fit any of these, invent a new mechanism
rather than force one. A mechanism is defined by **one shape function +
one arrangement principle** — keep both separate:

- *Arrangement principles already proven in this file:* rotation around a
  fixed center (`makeSunburst`/`makeInterlockRings`'s per-ring loop),
  translation + wobble along a path (`makeWeaveBand`), or invent a third
  (e.g. a grid, a converging funnel, a scatter that resolves into order).
- *Shape:* an SVG path string authored **centered on its own local
  origin** (so `origin: [0,0]` works without `transform-box:fill-box` —
  see the perf note below) unless the arrangement needs the shape's own
  pivot elsewhere (`makeSunburst`'s spikes pivot at `[100,100]`, matching
  their rotation center).
- Every node your generator returns needs: `d`, `transform` (or `angle` +
  it'll assume rotation about `100,100`), `lightAngle` (for the
  light/shadow shading), `origin: [x,y]`, and `t` (0..1, drives palette
  position unless you set an explicit `color`).
- Register it in `MECHANISMS` with `generate`, `colors: BRAND_COLORS`,
  `opacity: [max, min]`, and `rotateWhole` (`true` for a shape that reads
  fine spinning as a rigid disc; `false` — and add a `no-whole-spin` sway
  instead, see the CSS — for a directional shape like the diagonal weave
  band where a full rotation would look wrong).

## Step 3 — performance guardrails (measured, not theoretical)

This was profiled directly in the browser during development — see the
header comment in `poster-motifs.js` for the numbers. Two things matter:

1. **Element count is what costs frame time**, not filters or fancy CSS.
   Animating every element of a 648-node mechanism measured **13fps on
   hover**; animating a 1-in-8 stride (81 live elements, the rest static
   for density) measured **46fps** with no visible loss of texture. If
   your new mechanism produces more than ~150 nodes, set `tumbleStride`
   (see `interlock-rings`) rather than animating all of them.
2. **Never add `filter:` (brightness, drop-shadow) to anything that
   animates.** Both force a full repaint/re-rasterize per frame. Depth
   comes from the static, non-animating `.cs-card-art::before` shadow
   blob already in `CaseStudyCard.astro` — leave it as is.

## Step 4 — write the assignment

Add one line to `MOTIF_ASSIGNMENTS` in `poster-motifs.js`, grouped under
the mechanism it uses:

```js
const MOTIF_ASSIGNMENTS = {
  "churchdesk-booking-system": "interlock-rings", // 3 stakeholders' schedules reconciled into one model
  // ...
  "<new-study-id>": "<mechanism-key>", // one clause: what this shape says about the work
};
```

Always add the one-clause comment — it's the record of the judgment call
for whoever (human or Claude) reads this next.

## Step 5 — verify

1. `npm run dev`, open a page that lists the study (`/`, `/work/<a filter
   that includes it>`, or `/for/<...>`).
2. Confirm the motif renders and looks distinct from its neighbors on the
   same page.
3. Hover it — should smoothly animate, no stutter. If it's janky, that's
   the element-count guardrail above; add/lower `tumbleStride`.
4. Un-hover, wait, re-hover — should resume, not reset or jump. (This is
   automatic from `animation-play-state: paused/running` — don't touch
   that mechanism when adding a new one.)
5. `npm run build` — confirms nothing else broke.

## A note on removed case studies

`ninox-org-building` was removed from the data entirely (privacy: an
un-anonymized real person) and its content lives on now as
`leading-a-team-is-a-design-problem`. If a case study is ever pulled for a
similar reason, remove its `MOTIF_ASSIGNMENTS` entry along with it —
don't leave a mapping pointing at content that no longer exists.

## Status

Check `src/data/cv-tailor-data/case-studies/` for the current authoritative
list of studies. Any `.json` there without a matching `MOTIF_ASSIGNMENTS`
entry in `poster-motifs.js` is running on the hash fallback and is a
candidate for this process.

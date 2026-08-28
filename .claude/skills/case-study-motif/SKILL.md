---
name: case-study-motif
description: Assign or invent a thematically-grounded generative flow-field motif for a case study's card (the animated particle background on /work, /for, and the homepage). Use when a case study is added, or when an existing one's motif is still on the hash fallback and deserves a real one.
---

# Case-study motif assignment

Every case-study card renders a continuously-animating flow field via
`src/scripts/flow-field-motifs.js` + `src/components/CaseStudyCard.astro`.
Particles roam a noise-driven field across the whole card; the case study's
**shape** acts as an obstacle they channel along or bounce off of. Any case
study with no entry in `SHAPE_ASSIGNMENTS` still gets a motif — a
deterministic hash picks one of the existing shapes — but that pick is
arbitrary, not meaningful. This skill is the judgment call the hash can't
make: read what the case study is actually about, and give it a shape whose
**structure** says so — not just a distinct silhouette, the actual mechanism
of the work.

(This supersedes the earlier SVG-based system in `poster-motifs.js`, kept in
the repo unused as a one-line-revert. The judgment process below is the same;
only the shape vocabulary changed, from SVG paths to obstacle fields.)

**The rule that makes this work: shape carries the story, palette never
does.** Every motif uses the same fixed brand colors (`BRAND` in
`flow-field-motifs.js` — sage accent / light sage / cream). Never introduce a
new palette per case study. If you're reaching for a new color to
differentiate two motifs, that's a sign you need a new shape instead.

## Worked examples (the standard to match)

| Case study | What it's actually about | Shape | Why |
|---|---|---|---|
| `churchdesk-booking-system` | Reconciling 3 stakeholders' (funeral homes, priests, parish offices) conflicting schedules into one data model | `interlock-rings` | 3 circle obstacles, offset centers, overlapping like a Venn diagram — several distinct cycles converging into one |
| `leading-a-team-is-a-design-problem` | The team as people in relationship, rebuilt into a working rhythm | `network` | Several gravity-point obstacles (the people), connected by segment "streams" (communication) that particles visibly travel along |
| `bibeltv-ai-prototyping` | Rapid iteration, generative variation, an accelerated idea→prototype loop | `sunburst` | Spikes radiating outward from one center |
| `bibeltv-agentic-engineering` | Collapsing the design-to-ship pipeline into one accelerated loop | `spiral` | An inward-tightening spiral — cycles visibly accelerate as the radius shrinks |
| `bibeltv-metadata-extraction` | One system that handles most fields and deliberately, knowingly leaves one out | `sunburst` + `{ skipOne: true }` | Same radiating shape, minus one spike — the gap in the structure is the point, not an accident |
| `bibeltv-app-redesign` | Old direction and new direction, resolving into one by the end — not two things staying separate | `double-helix` + `{ converge: true }` | Two strands that start out of phase and taper into the same phase, instead of staying parallel forever |

Notice none of these are "the industry the company is in" or "a generic
design icon," and notice the last three aren't even a *different* shape from
their siblings — they're the same shape family with a **structural variant**
that makes the geometry itself say something the plain version wouldn't. A
shape reused with only a new seed is still an accurate motif; a shape reused
with a genuine structural twist is a *better* one when the story calls for it.
That's the bar for every assignment this skill makes.

## Step 1 — read the real theme, not the headline

Open `src/data/cv-tailor-data/case-studies/<id>.json`. Fields worth reading,
in order of how much signal they carry:

- `sections[].type === 'hero'` → `headline`, `subtext` (the framing, but
  often still marketing copy — a starting point, not the answer)
- `sections[].type === 'narrative'` and `'process'` → the actual mechanism
  of the work: what was reconciled, rebuilt, compressed, split, unified,
  discovered
- `subtitle`, `type`, `tags` → supporting signal

Boil the theme down to one phrase before touching any code — the same way
the worked-examples table does. If you can't state it in one clause, you
don't understand the case study well enough yet to pick a shape for it;
re-read the narrative/process sections.

## Step 2 — pick or invent a shape

**Check the existing catalog first** (`SHAPES` in `flow-field-motifs.js`):

- `sunburst` — one center, many things radiating out. Fits: acceleration,
  generative variation, one idea branching outward, one source feeding many
  derived outputs. Variant `{ skipOne: true }`: a deliberate gap among the
  spikes, for a system whose *incompleteness* is itself part of the story.
- `double-helix` — two strands. Plain: parallel forever, never touching —
  for a pairing that stays a pairing (AI drafts, a human decides; never
  merges). Variant `{ converge: true }`: the strands start out of phase and
  taper to the same phase by the end — for a pairing that *resolves* into
  one direction rather than staying two permanently distinct things.
- `interlock-rings` — N circle obstacles at offset centers. Fits:
  reconciling multiple (3+) independent things into one system, a Venn
  diagram of competing constraints, convergence. `variant.count` if the
  number of things being reconciled is a real, specific number worth
  matching (default 3).
- `network` — several gravity-point obstacles (nodes) connected by segment
  "streams," each node linked to its nearest neighbor plus one further one
  (a loose working group, not a full mesh or a rigid ring). Fits: a team, a
  group of stakeholders in ongoing relationship rather than one-time
  reconciliation, anything where the *connections* between several things
  matter as much as the things themselves. `variant.count` sets how many
  nodes (default 4).
- `spiral` — one inward-tightening spiral, cycles visibly accelerating as
  the radius shrinks (the sample points bunch up near the center). Fits: a
  process collapsing into a tighter loop, compounding iteration, something
  that speeds up as it converges.

If the theme genuinely doesn't fit any of these, invent a new shape rather
than force one. A shape is a function `(seed, variant) => field`, where
`field` is an array of **obstacles** — each obstacle is `(x, y) => { dist,
tangent }`. The primitives already in the file:

- `circleObstacle(cx, cy, r)` — a gravity point / ring.
- `segmentObstacle(x1, y1, x2, y2)` — a straight channel.
- `pathObstacles(fn, samples, closed)` — samples a parametric `t → {x, y}`
  function into a chain of segment obstacles; this is how a curve (helix,
  spiral, any custom path) becomes something the closest-wins obstacle
  system can use, without a dedicated curve case.

Particles are influenced by whichever obstacle in the field is nearest each
frame — that's what lets one shape mix several *differently*-shaped
obstacles (not N copies of one shape) when a theme calls for it, the way
`network` mixes circles (people) and segments (channels) in the same field.

## Every shape MUST use its seed to vary real structure, not just position

`resolveShape` always passes a per-slug seed into the shape function. It is
not optional to use it. Two studies sharing a shape must render **visibly
different works**, not the same geometry in the same colors — if you can't
tell them apart at a glance, that's a bug, not an acceptable side-effect of
sharing a shape.

This was caught for real, twice, in two different systems: the earlier SVG
version's `double-helix` and `interlock-rings` originally ignored `seed`
entirely, so every study on each mechanism rendered pixel-identical — fixed
by threading `mulberry32(seed)` into each shape's own structural parameters
(ring spacing/radius, helix angle/amplitude/cycles, sunburst spike
count/length/center). The flow-field version was built with this already
applied from the start — every `SHAPES` entry calls `mulberry32(seed)` and
uses it to vary real geometry (ring count/spread, strand amplitude/cycles,
spike count/length, node positions, spiral turns/radius), not just per-node
jitter within a fixed structure.

When adding a shape, ask: *if I render this with 5 different seeds, do I get
5 different-looking studies, or 5 copies with different sizes?* If the
latter, vary something structural, not just decoration.

## Step 3 — performance guardrails (measured, not theoretical)

Profiled directly in the browser during development (see the header comment
in `flow-field-motifs.js`): a single active canvas (hover-gated — only one
card animates at a time in real use) holds 59fps at 3800 particles. The
production `COUNT` is 700, well inside that headroom.

- **The rAF loop only runs while a card is hovered/focused.** No frame is
  drawn, let alone a full particle pass computed, while idle — stricter than
  a CSS animation-pause, which still requires the browser to track a paused
  animation. Don't add a mechanism that runs on page load or scroll-into-view
  instead of hover/focus.
- **Obstacle field size is cheap; particle count is what costs frame time.**
  `nearestObstacle` runs once per particle per frame and is a simple linear
  scan — a shape with 40 segment obstacles (e.g. a dense `pathObstacles`
  sample) costs far less than doubling `COUNT`. If a new shape needs more
  obstacles for fidelity, that's fine; don't raise `COUNT` without
  re-profiling.

## Step 4 — write the assignment

Add one line to `SHAPE_ASSIGNMENTS` in `flow-field-motifs.js`:

```js
const SHAPE_ASSIGNMENTS = {
  "churchdesk-booking-system": ["interlock-rings"], // one clause: what this shape says about the work
  "bibeltv-app-redesign": ["double-helix", { converge: true }], // shape + variant, when the plain version isn't specific enough
  // ...
};
```

Always add the one-clause comment — it's the record of the judgment call
for whoever (human or Claude) reads this next. Only add a variant object
when the plain shape genuinely isn't specific enough to the story; most
assignments don't need one.

## Step 5 — verify

1. `npm run dev`, open a page that lists the study (`/`, `/work/<a filter
   that includes it>`, or `/for/<...>`).
2. Confirm the shape renders and looks distinct from its neighbors on the
   same page — both different shapes, and same-shape siblings via seed.
3. Hover it — particles should channel along the shape and read as legible
   within a second or two of trail buildup, no stutter.
4. Un-hover, wait, re-hover — the last frame should freeze in place while
   unhovered (not clear to blank, not keep animating), and resume from that
   same state on re-hover, not reset or jump.
5. Move the pointer across the card while hovered — particles near the
   cursor should visibly repel/swirl (the pointer-displacement force). Touch
   works the same way on mobile.
6. `npm run build` — confirms nothing else broke.

## A note on removed case studies

`ninox-org-building` was removed from the data entirely (privacy: an
un-anonymized real person) and its content lives on now as
`leading-a-team-is-a-design-problem`. If a case study is ever pulled for a
similar reason, remove its `SHAPE_ASSIGNMENTS` entry along with it — don't
leave a mapping pointing at content that no longer exists.

## Status

Check `src/data/cv-tailor-data/case-studies/` for the current authoritative
list of studies. Any `.json` there without a matching `SHAPE_ASSIGNMENTS`
entry in `flow-field-motifs.js` is running on the hash fallback and is a
candidate for this process.

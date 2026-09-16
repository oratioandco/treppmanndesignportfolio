# Portfolio case-study videos — visual identity

Derived from treppmann.design (`src/styles/global.css`, `scripts/generate-covers.mjs`).
Every case-study clip traces its look back to this file.

## Style Prompt
Warm paper canvas, ink typography, one teal accent. The whole motion language is a single idea taken
from the site's halftone covers and the Redaction typeface: **low fidelity resolving into clarity**.
Dots resolve into images, coarse type grades resolve into the crisp grade, scattered UI layers
assemble into a working screen. Editorial pacing, no neon, no gradients, no stock motion-graphics
energy. Feels like the site moving, not like a promo template.

## Colors
| Role | Light |
|---|---|
| paper (bg) | `#f8f3ee` |
| ink (text) | `#1a1a1a` |
| muted text | `#666666` |
| rule / hairline | `#c9c0b6` |
| accent teal | `#457468` |
| accent light (highlight fill) | `#e8f0ed` |
| halftone ramp | `#d6ddd6` `#a4bbb2` `#779e93` `#5e8c7d` `#457468` |

Dark variant (only if a study is dark-canvas): bg `#1a2520`, text `#e8e0d2`, accent `#a4c6b9`.

## Typography
- **Display**: Redaction. Grades 70 → 50 → 35 (italic cuts) → 20 Regular. Headlines can step through
  the grades as they land ("grade morph"). Tracking -0.02em.
- **Body / captions**: Switzer variable, weights 300 and 500.
- **Data / kickers**: Departure Mono, uppercase, letter-spacing 0.12em, teal.

## Motion rules
- Entrances resolve: dots grow then shrink to reveal, blur to sharp, scatter to assembled.
- Ease vocabulary: `expo.out` for confident arrivals, `power3.out` for text, `back.out(1.4)` for dots
  seating, `sine.inOut` for ambient float. Exits use `.in` eases.
- One ambient motion per scene (device float, stage drift, dot drift). Never more.
- Transitions: blur crossfade (continuation), zoom-through (going into the product), dot takeover
  (open and close).
- Marker emphasis (hand-drawn circle, highlight sweep) at most once per scene, teal ink.

## What NOT to do
- No gradient text, no neon glow, no cyan-on-dark.
- No pure `#000` or `#fff` surfaces.
- No slideshow cuts: every screenshot arrives through a resolve, a device move or an assembly.
- No numbers that are not in the case-study JSON.
- No Inter / Roboto / system sans.

## Sound
One house sound across studies, varied by mood per study: warm sustained bed with slow movement,
soft electronic pulse instead of drums, subtle chiptune / digital accents low in the mix; narration
in "we"/"you", sidechain-ducked bed. Mood lines per study and the brief template:
`my-cv-tailor/.claude/skills/generate-case-study-video/references/music-direction.md`.

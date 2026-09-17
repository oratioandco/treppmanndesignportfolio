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

## Cover title card (every video)
Every video opens with a brief, fully-resolved title card — kicker, title at its final Redaction 20
grade, subtitle — held static ~0.25s, then a blur-crossfade dissolve (~0.15s) into the film's own
kinetic opening. Not a kinetic build from nothing: the viewer's first frame is already legible and
complete. House duration: 0.4s total. This frame also becomes the `<video poster>` — the site's
still and the film's true first frame are the same image.

## Real footage (added 2026-09-17)
Realistic video (AI-generated or captured) is a deliberate second register, not a style violation —
the site mixes real product screenshots with flat graphic elements already, and Apple/Anthropic/OpenAI
all mix illustration with real footage the same way. Do not force the halftone/dot treatment onto
real footage; a graphic dot-screen laid over a photorealistic shot reads as a mismatched overlay, not
the house style. Instead, real footage gets an analog film grade: lifted/faded blacks, a gentle
warm-highlight / cool-shadow split tone, mild desaturation (~0.8–0.85), fine film grain, a soft
vignette. Confirmed on the first test (`ffmpeg`: soft S-curve per channel, `eq=saturation=0.82`,
`noise=alls=6:allf=t+u`, `vignette=PI/4`). This keeps real footage feeling like *this site's* film,
not stock footage, without borrowing a graphic language built for illustrations and UI.

Note: duotone is not a site motif — that was an overreach in an earlier illustration prompt,
caught and corrected 2026-09-17. The site's actual graphic identity is halftone dot-resolve plus a
pixelated/chunky low-res treatment (`image-rendering: pixelated`, the homepage dot fields), not a
flat two-color duotone wash. Keep future illustration prompts to halftone + pixel-edge language, not
"duotone."

## Motion vocabulary is a constant, mood is not
Every film uses the same core techniques — halftone resolve, marker-circle/highlight draw, device
tilt in perspective, grade-morph type, depth/exploded assembly where content supports it — at least
one resolve and one marker draw per film, minimum. A calmer mood (BibelTV, ChurchDesk) changes
tempo, palette warmth and how *often* each technique fires; it never means dropping them. A film
with zero of these reads as thin, not restrained. See LEARNINGS.md #33 for how this went wrong once.

# AGENT REPORT — ChurchDesk funeral booking clip (stage-10b trial run, 2026-09-16)

Trial run of the stage-10b video pipeline, parallel to the Sonnet attempt. One script pass, one
composition pass, fixes only where review gates found defects. Nothing committed; study JSON,
schema, LEARNINGS.md and the other project folders untouched.

## Render

- **Master:** `video/churchdesk-booking-system-glm/renders/churchdesk-booking-system-glm.mp4`
  — 56.00s, H.264 1920×1080 @ 30fps, AAC 48kHz, 24.8 MB
- **Web:** `public/video/churchdesk-glm.mp4` (7.5 MB, crf 23, faststart) ·
  `public/video/churchdesk-glm-poster.jpg` — deliberately separate filenames; the real
  `churchdesk-booking-system.*` paths were not created or touched
- Source of truth: `script.md` (brief, beats, sources, music brief), `review.md` (all four
  gates), `index.html` (composition)

## Checker / lint summary

- `check_video.py`: **0 FAIL, 1 WARN, 24 PASS.** The single WARN is pacing rate 2.90 wps against
  the ≤2.6 ideal — accepted deliberately: the measured rate reflects the fitted clone voice at
  atempo 0.93, the pilot accepted 2.84, and slowing further would have pushed runtime past the
  55s target.
- `hyperframes lint`: **0 errors, 0 warnings.**

## Gate outcomes (evidence in review.md)

1. **Script** — PASS. 97 words, every claim traced line-by-line to the study JSON; no risky
   load-bearing words; monotone-safe sentences.
2. **Storyboard** — PASS after two fixes found by snapshots: the marker circle was invisible
   (parent opacity set to 0, never restored, and outside the scaling device) and the metric
   numerals rested in the deliberately-coarse Redaction 70 grade, reading as broken at 190px
   (fixed with a grade morph to 20).
3. **Audio** — PASS on measurements: 20 dB duck depth (−37.8 dB RMS under speech vs −17.5 dB
   recovered), fade-in ≤0.8s, fade-out over the last 2.5s, all clip paddings ≥0.25s.
4. **Render** — PASS on measurements: −15.0 LUFS integrated, −1.8 dBFS true peak, LRA 3.2,
   40% voice-free, frames verified at every beat.

## Measured vs not verified

**Measured:** all durations (VO clips, scenes, master), LUFS, true peak, LRA, per-window RMS of
bed and mix, duck depth, checker and lint output, frame content at 20+ timestamps.

**NOT verified — needs a human ear (mine doesn't exist):**
- How the voice actually sounds: pronunciation, warmth, whether the clone's flat delivery
  undersells "while a grieving family waited" — the one line most at risk.
- Whether the Lyria take honours the somber/hopeful brief or drifts bright; **two takes exist**
  (`assets/audio/take1.mp3`, `take2.mp3`; take 2 is in the cut) — choose by ear.
- Whether emphasis lands where intended; every line was written stress-independent, but that is
  a design claim, not a listening result.

## Honest self-critique

Would a professional promo editor accept this cut? As a *structure*, probably yes: the arc is
clean, frame 1 is product, the money shot is genuinely full-width, the film works muted, and the
restraint register is held throughout — no slide-show cuts, two transition types, one ambient
motion per scene. As a *craft object*, three things would draw a senior editor's pen: (1) the
beat-2 chain diagram is the least certain moment — its dotted connectors and "Before" kicker are
legible but the scene earns less than its 6.5 seconds; a director might trim a second and give
it to the money shot's hold. (2) The halftone resolve into S5 takes ~2.5s of its 7s window; in
motion it either reads as the film's signature move or as the frame being late — without ears or
eyes on the moving image at full attention, I cannot say which, and the stills only prove it
lands before the card does. (3) 56s against a 45–55s brief is over by one second — chosen
deliberately for the close hold, but it is over. The mix numbers are inside every band, but
"inside the bands" is not "sounds good"; the bed was chosen between two generated takes I could
not hear, which is the weakest link in the chain.

## Skipped / not done

- No LEARNINGS.md retro entry (explicitly out of scope for this standalone trial).
- No commit or push anywhere, per the trial constraints.
- No text-free ambient hero loop, no per-role-family variants (planned follow-ups in README).
- No ear pass, no external review; Tobias's listen is the remaining gate.
- The `s5` screenshot crop shows a sliver of the product's own "Back to Protestant Funeral"
  chrome at the very top of frame — authentic UI, kept; flagged in case it reads as a crop
  mistake on a big screen.

# Review record — Ninox AI onboarding clip

Job-to-be-done of this film: show that Tobias's AI-onboarding principle (generate into the surface
the user owns, chat beside it) solved a real adoption gate at Ninox and shipped.

## Round 5 (2026-09-16) — script v5, 60.4s

### Gate 1 — Script
Critique before generation (the failures of the round-4 script that drove the rewrite):
- Never defined "schema" for a design-leader audience → now "tables, fields, how records connect".
- "tools that only look easier" depended on stress; a synthetic voice flattened it → cut.
- "new users stall" is a load-bearing monosyllable → "that is where the easy part ends".
- Editor beat said one idea three ways → two sentences, each adds one fact.
- "That principle became the onboarding pattern" was an abstract noun with no picture → "The AI starts
  the database. The user owns it." pays off the title.
- First sentence is about the product-for-small-businesses, not the author. PASS.
- Pronouns: "we"/"you" only. PASS.
- Facts: lines 1–2 trace to `my-cv-tailor/data/verification-log/2026-09-16-ninox-context-for-video.md`;
  lines 3–8 to the study JSON (context, "why chat alone wouldn't work", process steps, outcome).
  No competitor, no number outside the study. PASS.

`check_video.py` (after calibration to real clip durations):
```
0 FAIL, 8 WARN, 18 PASS
WARN caption   beat 3 / beat 8: voice repeats the card — accepted: the typed prompt is the artefact;
               the close intentionally says the URL that is on screen.
WARN card      beat 1 sub-line 7 words; beat 6 headline 7 words (study quote) — accepted.
WARN length    60.4s over the 60s target — accepted (approved script; ceiling is 65).
WARN rate      2.84 wps after slowing 7% — this clone reads fast; slowing further sounds stretched.
               Tobias to judge by ear.
WARN sentence  beat 1, 15 words ("Every offer, case or project is a record, and the app is built
               around it.") — a list sentence; accepted.
WARN voice-free 29% — just under 30%; accepted.
```
Verdict: PASS with accepted warnings. Script shown to Tobias and approved before voice generation.

### Gate 2 — Storyboard (snapshots at 0.2, 5, 13, 20, 26, 31.5, 35, 42.5, 51.5, 58)
- Frame 1: tilted device with the empty prompt, mid-settle. PASS.
- Mute pass: cards read as Title → Powerful/Gate → One sentence in → Schema generated → Chat alone
  wouldn't work → Show the output, edit it → No AI mode to leave → Case study. The story survives
  without voice. PASS.
- Cards ≤6/12 words except the typed prompt. PASS (two 7-word cards accepted above).
- Holds: title 9.2s; problem cards 4.6s+; typed prompt holds ~1s after last char then 1.0s more
  before resolve; "Six tables. A first guess." 3.8s; "Chat alone wouldn't work." 5.1s; "Show the
  output…" 8.5s; outcome 8.8s; close 5.4s. All ≥ max(1.5s, chars÷12). PASS.
- No re-wrap: typed prompt in a fixed left box, headlines single-line. PASS.
- One ambient motion per scene (device float / stage drift / dot drift). Transition types: blur
  crossfade, zoom-through, dot takeover = 3. PASS.
- Emphasis cues: circle on "gate" at 15.4s during "where the easy part ends"; chat dim + card
  outline at 42.0s, estimated position of "card you can change" (4.2s into a 5.9s line). Verify by ear.
- Money shot: editor stage at 90% of frame width. PASS.
- 3D near edge inside the frame (rendered frame checked in round 3). PASS.
- Contrast: lint 0 errors 0 warnings; teal text #3d6a5e. PASS.

### Gate 3 — Audio
- Every clip `data-duration` = file + 0.25s (checker: all PASS).
- Per-line rate after atempo 0.93: 2.6–3.1 wps; fast but even. WARN, by ear.
- Bed sidechain-ducked against the v5 voice stem (threshold 0.015, ratio 12, attack 120ms,
  release 700ms). Round-3 measurement of the same chain: −16.6 dB → −33.2 dB under speech.
- Music enters at 0 with 0.8s fade-in, fades over the last 2.5s. No SFX.
- Loudness / true peak: measured on the render (Gate 4).

### Gate 4 — Render
Filled in from the v7 render output: duration, integrated LUFS, true peak, RMS in voice vs gap
windows. Not measured: how it sounds, pronunciation of "Ninox AI's", whether the 42.0s cue lands on
"card you can change". Tobias listens.

Gate 4 measurements (v7 render, 2026-09-16):
- 60.4s, 1920×1080, 30fps, H.264 + AAC. Web copy re-encoded (CRF 23) to `public/video/`, poster at 5.0s.
- Integrated −15.1 LUFS, true peak −2.2 dBTP. PASS.
- RMS: music-only intro −24.5 dB; voice windows −17.9 / −17.3 dB; gap between beats 2 and 3 −31.1 dB
  (bed fully ducked and recovering); tail −27.3 dB. Voice sits ~7 dB over the un-ducked bed and
  ~13 dB over the ducked bed. PASS.
- Not measured: sound, pronunciation, cue timing by ear. Handed to Tobias with that stated.

## Round 6 (2026-09-16) — script v6, 62.4s

Tobias's notes on v5: "the first prompt is always one sentence" did not land (the point is that
everyone prompts in one sentence); the film should say explicitly that this project was started to
build AI onboarding for Ninox's long-standing problem.

Gate 1: beat 2 gains "This project set out to fix that. Describe what you need, and the AI drafts the
schema." Beat 3 becomes "Nobody writes a long brief. People type one sentence." Both voice-safe (no
stress-dependence, ≤10 words per sentence). Checker: 0 FAIL, 7 WARN (same accepted set; voice-free
now 27%, length 62.4s — both accepted as the cost of the two clarifications).
Gate 2: snapshots at 21, 27.5, 33.5, 44.5 checked after the +2.0s retime from 22.2s onward.
Gate 3: stem rebuilt at the new starts, bed re-ducked, all clips padded +0.25s.
Gate 4: from the v8 render (see below).
Gate 4 (v8): 62.4s, integrated -14.8 LUFS, peak -1.9 dBFS. Not measured: sound, pronunciation, cue timing by ear.

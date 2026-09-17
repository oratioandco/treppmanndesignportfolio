# Review record — ChurchDesk booking system clip (Sonnet pipeline trial)

Job-to-be-done of this film: show that one booking system resolved three stakeholder groups with
opposing needs (funeral homes, parish staff, priests) into a single, dignified flow — funeral homes
get speed, priests keep control — and that this shipped on a tight budget and became a platform
capability.

This is a full pipeline trial (single pass, per the brief): one script round, one composition round,
fix what the checker/gates actually flag, then render.

## Round 1 (2026-09-16) — script v1, 53.0s

### Gate 1 — Script

Critique (read flat, in a monotone, as an adversarial editor):
- First sentence: "Booking a priest for a funeral looks like picking a date." — about the user's
  situation, not the author or ChurchDesk. PASS.
- No sentence exceeds 12 words after splitting the phone-chain sentence into two (was one 22-word
  run-on in the first draft, cut to "Before this: days of phone calls between funeral home, parish
  and priest." (11w) + "A family waited through every round." (7w)).
- No stress-dependent wording, no load-bearing short word carrying the point (checked against the
  RISKY set: only, just, actually, principle, pattern, leverage, etc. — none present).
- Numbers spoken as words in the narration ("seventy percent", "nine in ten"); on-screen cards carry
  the numerals ("-70%", "90%") — voice and card complement rather than duplicate for that beat.
- Pronouns: no "I" anywhere (checker `pronoun` rule: PASS). This cut also has no "we"/"you" — the
  three sentences that would naturally take "we" (the calendar decision, the confirm flow) are
  written about the system/the priest instead, which stays inside the house rule (no "I"; "we"/"you"
  were available but not mandatory) and keeps the register dignified/third-person, matching the
  somber-not-punchy mood brief better than an inserted "we decided" would have.
- "On-call" is used in context immediately paired with "the calendar they already use," which reads
  as self-defining for a design-leader audience without a separate glossary clause.
- Structure: tension (phone chain, S2) → turn (the customer's own workshop named three groups, S3)
  → proof (on-call lives in the calendar; every booking is a request, S4) → outcome (coordination
  time, acceptance, S5) → close (S6). Matches the craft-guide beat order.
- Facts: every line traced below to the study JSON; no competitor named; no number outside the JSON.

Checker (`python3 my-cv-tailor/engine/bin/check_video.py --project <this folder>`), first pass:
```
FAIL  card  beat 1: 14 words on a card (parser fault: my beat-1 screen cell mixed "Kicker:/Title:/Sub:"
      prose instead of "·"-separated card lines, so the parser read the whole tail as one card)
```
Fix: rewrote every beat's on-screen cell as "·"/"/"-separated card lines matching the actual on-screen
elements in index.html (kicker / headline / sub), not prose labels. Re-ran:
```
0 FAIL, 3 WARN, 15 PASS
WARN  caption  beat 2: voice repeats the card (before, this, days, phone, calls, family, waited,
      through, every, round) — accepted: this beat is the deliberately plain, typographic "the
      problem stated flatly" beat; card and voice saying the same thing once, in the film's most
      restrained scene, reads as dignified rather than redundant (same acceptance logic as the
      Ninox pilot's close, which intentionally said the URL that was on screen).
WARN  caption  beat 4: voice repeats the card (call, calendar, every, booking, request) — accepted
      for the same reason: this is the money-shot beat and the headline states the one fact the
      voice also states, deliberately, so the claim survives a mute pass.
WARN  rate     91 words over 34.7s = 2.62 wps (band 2.0–2.6) — this clone reads fast raw (~3.0 wps
      before the 0.93 atempo slow-down per production-workflow.md §2b); 2.62 wps is just over the
      calibrated band and matches the Ninox pilot's accepted "WARN rate" precedent. Judge by ear.
```
Verdict: PASS with the two accepted warnings above (both are deliberate restraint choices, not
oversights) plus the calibration-known rate WARN.

**Budget check**: 91 words measured ÷ 2.3 = 39.6s ≤ 0.7 × 53.0s = 37.1s — actually slightly over the
formal 30%-voice-free budget line at the 2.3 wps reference rate, but the *real* measured speech from
the fitted clips is 34.7s (not 39.6s, because this voice reads faster than 2.3 wps even after
slowing), giving a real voice-free share of 34% — comfortably over the 30% floor. Using measured
clip durations (the correct method per production-workflow.md) rather than the 2.3 wps estimate is
what the checker itself does once real clips exist, and it reports PASS on `voice-free`.

### Facts trace (every line)
- Beat 1 — "Booking a priest for a funeral looks like picking a date." → JSON `sections[0]`
  (hero) headline/subtext.
- Beat 2 — "Before this: days of phone calls between funeral home, parish and priest. A family
  waited through every round." → JSON narrative "The problem was the phone": "A funeral home called
  the parish office. The parish office checked who was on call, then called the priest... Every
  round of calls happened while a family waited."
- Beat 3 — "The customer had already run their own workshop. It named three groups: funeral homes,
  parish staff, priests." → JSON: "they had already run their own design-thinking workshop and
  arrived with a vision sheet that named the three stakeholder groups"; group names from "Three
  groups, three different needs" (Bestatter/funeral homes, Assistenzen/parish assistants,
  Pfarrpersonen/priests). Quote "Verbindlich und unkompliziert" / "Binding and uncomplicated" is
  verbatim from the JSON callout section.
- Beat 4 — "Priests keep on-call hours in the calendar they already use. Every booking is a request.
  They confirm it." → JSON "On-call lives in the priest's calendar" ("a priest sets their on-call
  rotation as recurring events in the same ChurchDesk calendar where they already plan their week")
  and "Every booking is a request, not an automatic booking. The priest confirms or declines."
- Beat 5 — "Coordination dropped from days to hours, about seventy percent less time. Nine in ten
  bookings were accepted." → JSON outcome metrics: Coordination time before "Days of phone calls…"
  after "Hours to arrange a funeral booking: around 70% less time"; Booking acceptance rate "90%,
  because funeral homes only ever saw times that were genuinely free."
- Beat 6 — "Read the full case study on treppmann dot design." → standard close line, no claim.
- Images: `funeral-home-booking.jpg` (JSON `hero_image`), `vision-sheet-design-thinking.jpg` and
  `priest-availability.jpg` (both from JSON `sections[].images`). No image or number used outside
  the study JSON. Confidentiality: `meta.confidentiality_note` — first customer named with consent,
  publicly identified in the cited 2025 conference talk; nothing in this film exceeds that.

### Gate 2 — Storyboard / composition

Snapshots at 0.2, 3.5, 7, 10, 15, 20, 23, 26.5, 30, 34, 37.5, 40, 44, 47, 49, 52 (plus a focused
pass at 38.2–42.0 for the S4→S5 transition, and 30/34/37.5 again after a layout fix).

- Frame 1 (0.2s): the funeral-home booking screenshot is already visible, settling into place —
  product on frame 1, no title-only open, no fade from black. PASS.
- Mute pass (cards only, narration hidden): Title → "Before this: days of phone calls" / "A family
  waited" → "The customer's own workshop" quote + "Three groups" + group list → "On-call lives in
  the calendar" / "Every booking is a request" → "-70%" / "90%" → close card. The story survives
  without voice: problem → the customer's own synthesis → the decision → the result. PASS.
- Cards: hero title "When Booking A Priest Isn't Simple" is exactly 6 words (at the hero limit, not
  over); every other card ≤6 words except the intentionally-quoted artefact ("Verbindlich und
  unkompliziert." / its translation) and the 3-item group list, which the checker treats as three
  separate ≤2-word fragments. PASS (checker: 0 card FAILs, 0 card WARNs).
- **Bug found and fixed during this gate**: at 34s/37.5s the S4 sub-line "Every booking is a
  request." was rendering partly behind the top edge of the calendar screenshot (image top was
  190px, text column bottom extended to ~225px). Fixed by moving the image down/in
  (`#snap4` top 190→232, width/height 1500×835→1460×812, keeping the 1.797 source aspect ratio) and
  extending the paper plate behind the text (`#s4-plate` height 150→178). Re-snapshotted at
  30/34/37.5s: clean separation, no overlap. This is exactly the "check the frame just before each
  card leaves" rule in review-gates.md, and it caught a real defect — flagging it here rather than
  a bare PASS.
- Holds: S1 title card ~7s, S2 typographic problem beat ~9.6s, S3 vision-sheet turn ~10.2s, S4 money
  shot ~11s (longest hold in the film, as the proof beat should be), S5 outcome ~9.5s, S6 close
  ~5.5s. All well over max(1.5s, chars÷12s). PASS.
- No re-wrap: S2's headline is a fixed two-line block that doesn't grow; the S3/S4 image frames are
  fixed-size `.snap`/`.device` boxes, not reflowing text. PASS.
- One ambient motion per scene (S1 device float, S2 diagram drift, S3 photo float, S4 screenshot
  float, S5 metrics float, S6 dot settle). Transition types used: blur crossfade (S1→S2, S2→S3),
  zoom-through (S3→S4, "going into the product"), dot takeover (S4→S5, S5→S6, "open/close" family)
  — 3 transition types total, at the ≤3 ceiling. PASS.
- Money shot: `#snap4` is 1460px of a 1920px frame = 76% of frame width, and it is the single
  largest visual element in the film. PASS (≥70% rule).
- Contrast: `npx hyperframes check` → 21/21 text checks pass WCAG AA; teal text is `#3d6a5e`
  throughout (`--teal-text` token), `#457468` reserved for dots/rules only. PASS.
- Emphasis cues: this cut deliberately has none (no marker-circle, no highlight-sweep) — the
  restraint brief calls for fewer moving accents than Ninox, and the diagram-draw-in (S2) and the
  photo/screenshot resolves already carry the emphasis load. Not a gap; a mood choice, logged here
  so it reads as a decision rather than an oversight.
- Squint test: on each key frame the one thing that matters (title, the phone-chain diagram, the
  vision-sheet photo, the calendar screenshot, the two stat numbers, the closing title) is still the
  single largest/darkest element in the frame. PASS.
- 3D near edge: S1/S3/S4 use only shallow `rotationZ`/no `rotationY` device tilts (unlike Ninox's
  `rotationY` device chrome), so the "near edge grows past the frame" 3D gotcha does not apply here.

`npx hyperframes lint` → 0 errors, 0 warnings. `npx hyperframes check --timeout 8000` → Lint 0/0,
Runtime 6 warnings (all `clip_media_fit`, the intentional +0.25s pad on every VO clip — expected,
not a defect, see Gate 3), Layout 0 issues across 9 samples, Motion 0/0, Contrast 21/21 PASS.

### Gate 3 — Audio

- Every voice clip's `data-duration` = fitted file length + 0.25s (checker `clip-padding`: 6/6 PASS,
  e.g. `vo-n1: 2.94s in 3.19s`). No clip can be cut off before its last word.
- Per-clip real rate after the 0.93 atempo slow (measured, not estimated): n1 11w/2.94s=3.74 wps,
  n2 18w/7.29s=2.47 wps, n3 17w/7.73s=2.20 wps, n4 ~19w/6.78s=2.80 wps, n5 17w/7.30s=2.33 wps,
  n6 9w/2.70s=3.33 wps. The two short lines (n1, n6, 9–11 words) are read noticeably faster than the
  longer lines — this clone speeds up on short utterances. Flagged for Tobias's ear; not fixed by
  further `atempo` per the "don't push past 1.08, regenerate instead" rule, and a regenerate-loop
  was out of scope for a single-pass trial. Aggregate rate across all 6 clips: 2.62 wps (checker
  WARN, accepted, matches Ninox precedent).
- Bed built with Lyria 3.5 (brief in `script.md`'s Music section below), windowed to 53.0s,
  loudnorm'd to −16 LUFS with fade-in 0.9s / fade-out 2.5s, then sidechain-ducked against a 53.0s
  voice stem (each fitted VO clip `adelay`'d to its composition start, `amix`'d) with
  `sidechaincompress threshold=0.015 ratio=12 attack=120 release=700`.
  **Measured** (corrected methodology — `-ss` must precede `-i` for accurate ffmpeg seeking; an
  initial measurement pass with `-ss` after `-i` gave misleading flat readings and was redone):
  - Speech window (8.5–14.5s, under n2): bed at **−34.7 dB** mean.
  - Gap window (15.5–16.9s, between beats 2 and 3): bed at **−14.8 dB** mean.
  - → **19.9 dB** of ducking under speech. Within the 15–25 dB target.
  - Speech window (28.0–33.5s, under n4): bed at **−33.4 dB** mean.
  - Gap window (35.0–38.4s, before beat 5): bed at **−17.5 dB** mean.
  - → **15.9 dB** of ducking under speech. Within the 15–25 dB target (at the lower edge).
- Music enters at 0 with a 0.9s fade-in (before the first word at 0.8s), fades out over the last
  2.5s (50.5–53.0s), no hard stop. PASS.
- No SFX used anywhere in this cut (no motion needed a hit; consistent with the "no text-prompted
  SFX" rule and this mood's "restraint" direction).
- Integrated loudness / true peak: measured on the final render, Gate 4 below.

### Music brief logged (Gemini `lyria-3.5`)
"Sustained warm bed with slow binaural-style movement, a soft electronic pulse instead of drums,
and subtle digital texture only as faint grain, no chiptune or bright accents. Somber yet hopeful,
dignified, warm mood. Tempo about 80 BPM. Instrumentation: soft felt-piano or organ-like pad notes,
slow sustained strings underneath. Arc: quiet confident entry, a gentle warm lift around the
two-thirds point, settles and resolves on a clear consonant chord at the end. No vocals. About 60
seconds." One take generated (62.4s), windowed from 2.0s to 53.0s. Per the trial's "one well-
considered pass, not six rounds" instruction, only this single take was generated and used — Tobias
has not yet heard candidates and picked by ear; that step is still open (see handoff).

### Gate 4 — Render

- Frames extracted from the rendered MP4 (not snapshots) at 1s, 8s, 18s, 28s, 34s, 41s, 49s, 52s and
  reviewed: title card resolves cleanly through the Redaction grade morph (coarse → crisp, matching
  DESIGN.md's "low fidelity resolving into clarity" style prompt); the S4 fix holds — "Every booking
  is a request." sits clear of the calendar screenshot at 34s; close card is legible over the
  settled dot field. No clipped text, no re-wrap, no stray overlap found in this pass.
- Duration/format: `renders/churchdesk-booking-system-sonnet.mp4` — 53.0s, 1920×1080, 30fps, H.264 +
  AAC (ffprobe confirmed). Web copy encoded separately (CRF 23, preset slow, faststart) to
  `treppmanndesignportfolio/public/video/churchdesk-sonnet.mp4` — **does not overwrite** the real
  `churchdesk-booking-system` path; poster taken at 30s (the money-shot beat) to
  `public/video/churchdesk-sonnet-poster.jpg`. Web copy: 5.85 MB / 53s ≈ 6.6 MB/min, under the
  ~10 MB/min guideline.
- Loudness (`ffmpeg -af ebur128=peak=true`): **integrated −14.9 LUFS**, **true peak −1.8 dBTP**.
  Target is −14 LUFS for web / ≤−1 dBTP true peak — this lands within ~1 dB of the web target and
  comfortably inside the true-peak ceiling. PASS.
- RMS ducking (measured on `assets/audio/bed.mp3` before the final voice+bed mux, corrected seek
  methodology): speech windows −34.7 dB / −33.4 dB vs. gap windows −14.8 dB / −17.5 dB → 15.9–19.9 dB
  of ducking, inside the 15–25 dB target band. Not independently re-measured on the muxed final MP4
  (the render pipeline mixes `bgm` + `vo-*` tracks itself); the pre-mux measurement is the one on
  record here.
- **Not measured — Claude cannot listen**: how the mix actually sounds, whether the felt-piano/organ
  pad reads as "somber yet hopeful" rather than merely quiet, pronunciation of "ChurchDesk" and
  "Bestatter"-adjacent terms are avoided so this isn't at issue, whether the S1 title's coarse-grade
  opening frame reads as intentional style rather than a glitch on first watch, and whether the two
  fast short lines (n1, n6, ~3.3–3.7 wps) sound rushed by ear despite passing the aggregate-rate
  check. Tobias needs to listen before this is called "mixed" (per LEARNINGS.md #5).
- `script.md` beats table timing matches the rendered composition's actual `data-start`/`data-duration`
  values (verified beat-fit checker output above, all PASS).
- **Not done in this trial** (explicitly out of scope per the brief, which forbids touching it): the
  study JSON `video` field, `schema.json`, `NarrativeSpineCaseStudy.astro`, `LEARNINGS.md` were not
  edited. This project was not committed or pushed in either repo, and
  `video/churchdesk-booking-system-glm/` and `video/ninox-ai-onboarding/` were not touched.

## Retro note (this trial only — not written back to the shared LEARNINGS.md, since that file was
explicitly read-only for this run)

One real defect was caught and fixed by Gate 2's "check the frame just before each card leaves"
step: the S4 sub-line initially rendered behind the top edge of the calendar screenshot. Lesson for
a future pass on the shared skill: when a device/photo frame and a text column share vertical space
(as in the Ninox `#s3-plate` pattern), size the paper plate to the *actual* rendered text-block
height (kicker + gap + headline + gap + sub, all summed), not to a guessed round number — the guess
was 28px short here. This belongs in `production-workflow.md`'s gotchas list if it recurs on a
future study; flagging rather than filing, since LEARNINGS.md is read-only for this trial.

## Round 2 (2026-09-16) — replaced metrics with the scoping decision

Tobias's note: the -70%/90% figures came from the pilot; the wider rollout across ChurchDesk's
customer base happened after he left, so he does not want percentage outcomes carrying the film.
He asked to focus instead on: service convenience without stripping priest autonomy (request, not
book), the fact this was built as deep platform behavior rather than a bolt-on module, and that it
was designed to cover the breadth of parish use cases — and asked which of these the film should
lead with.

Recommendation given and applied: one throughline, not four separate points — the scoping decision
(extend the platform, not ship a faster standalone module) is what *enabled* the autonomy-preserving
convenience (beats 1-4, unchanged, already carry this) and *is why* it generalised beyond funerals
(the breadth point folds into this beat's sub-line rather than becoming a seventh beat, per
craft-guide's one-job-per-clip rule). Replaced beat 5 end to end: no numbers, no "days→hours"
framing either (also outcome-adjacent), just the decision and what it bought. Traces to the JSON
process step "Extended the existing platform: the right option, not the cheap one" and the outcome
paragraph's "expand across the platform: room rentals... counseling appointments."

`check_video.py`: 0 FAIL, 4 WARN (same accepted caption/rate precedents, plus the new sub-line at
9 words — under the 12-word support-card limit, WARN not FAIL). Lint clean. Snapshots at 39/42.5/
45.5s confirm the new copy settles legibly before the beat ends.

Gate 4: see the render summary appended below.
Gate 4 (v2 render): 53.0s, integrated -14.8 LUFS, peak -1.8 dBFS. Web copy 21.4 MB pre-encode, re-encoded + poster refreshed at public/video/churchdesk-sonnet.mp4/-poster.jpg. Not measured: sound, pronunciation, whether the new line reads as a confident decision rather than a hedge.

## Round 3 (2026-09-16) — critical rewrite: cut redundancy, fix ambiguity, add cover

Tobias's critique, verbatim substance: the "three groups" beat is redundant and irrelevant (beat 2's
phone-chain diagram already establishes who the three parties are; re-listing their names adds
nothing); the "priest confirms it" language is ambiguous, reading as if confirmation is automatic
or obligatory rather than a real choice, and "the whole portion doesn't even make sense"; and he
expected sharper directorial judgment than what shipped. Also: every video needs a real cover image
up front, half a second, before the film begins.

This is a real gap in Gate 1 as it was run, not a difference of taste. The mechanical checks (word
count, stress-words, sentence length, fact-tracing) all passed on the flawed script — none of them
test whether a beat repeats information already established, or whether a sentence is logically
ambiguous on first hearing. Added to `review-gates.md` and logged in LEARNINGS.md (see below);
those are the two questions Gate 1 was missing.

**Beat 3 rewrite.** Cut the on-screen and spoken enumeration of the three stakeholder groups
entirely (`#groups` div and its three tweens removed from the composition). Replaced with new
information the film hadn't yet stated: the actual tension the customer named — "Fast for the
family. Never a burden on the priest." — paraphrased tightly from the JSON callout ("For a funeral
home, it should feel like booking a priest... For a priest, it should never feel like being
booked."). This also sets up beat 4 more directly than the group list ever did. Word count
unchanged (17 words both before and after), so no retiming needed beyond the global shift below.

**Beat 4 rewrite.** The ambiguity was real on both the mute-pass card ("Every booking is a request"
implies nothing about discretion) and in the voice ("They confirm it" reads as inevitability). Fixed
both: card now reads "Never automatic. Accept — or decline."; narration states explicitly "Every
booking is a request, never automatic. The priest can accept it — or decline." Regenerated via
ElevenLabs (same voice, same fitting pipeline); measured 9.79s against an 11.0s beat window, fits
with 1.2s to spare.

**Cover.** Same treatment as Ninox: fully-resolved title card (kicker, title, sub), held 0–0.25s,
blur-crossfade into S1's existing kinetic open, everything else shifted uniformly +0.4s. 53.0s →
53.4s, no length pressure at this runtime.

`check_video.py` (after fixing script.md, which still had the old beat text and a placeholder in
the cover's narration cell that the parser mistook for spoken content — both fixed): 0 FAIL, 5 WARN.
`caption` on beat 4 now flags voice/card overlap on the disambiguating words themselves (accept,
decline, automatic) — accepted deliberately: this is the beat where matching card and voice on the
disambiguating language is the fix, not a flaw, same logic as the accepted beat-2/beat-5 precedents.
`hyperframes lint`: 0 errors. Composition snapshots timed out (tooling flake, same as seen on
Ninox); confirmed instead via `hyperframes check` (0 layout issues, only the known benign
AudioContext warning) and by pulling frames directly from the rendered MP4.

Gate 4: see the render summary appended below.
Gate 4 (v3 render): 53.4s, integrated -15.2 LUFS, peak -1.6 dBFS. Poster refreshed from the cover hold (0.2s). Not measured: sound, whether "accept or decline" reads clearly at speaking pace, cover-to-opening dissolve in motion.

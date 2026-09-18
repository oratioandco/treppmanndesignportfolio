# Review record — ChurchDesk funeral booking clip (GLM trial run)

Job-to-be-done of this film: show that Tobias resolved three stakeholder groups with opposing
constraints into one integrated booking flow — the surface stayed simple, the outcome measured.

This is a standalone trial run of the stage-10b pipeline (parallel to the Sonnet attempt in
`churchdesk-booking-system-sonnet/`). Nothing here is wired into the study JSON or committed.

## Round 1 (2026-09-16) — script v1

### Gate 1 — Script

Adversarial critique, written before the checker ran (stance: assume the script is mediocre until
it proves otherwise; read every line in a flat synthetic voice):

- **What would make a director wince.** The phone-chain diagram (beat 2) risks being the most
  diagrammatic moment without being the most important one; if its connectors snap in fast it
  reads as corporate-explainer. Mitigation: stroke-draw connectors slowly, no easing snap, one
  node at a time. If it still reads busy, the film leans on beats 4–6 and this becomes a countdown.
- **"Underneath sit on-call shifts and cemetery opening hours."** — inversion ("sit") is
  literary but monotone-safe; it does not depend on stress. PASS, but flagged for the ear check.
- **"No more phoning around."** — a quote, stated plainly, no irony. Safe in monotone. The German
  original is on the card, the English is spoken; neither repeats the other.
- **Terms an audience may not know:** "on-call shifts" (named plainly; beat 6's picture of the
  Verfügbarkeit modal shows it); "Verfügbarkeit" appears only as image content, never spoken, and
  the card does not rely on it. "Rota" avoided entirely in speech.
- **Load-bearing short words:** checked for only/just/stall/gate — none in the narration. The
  card "Green means bookable." carries the filtering claim without a spoken "only".
- **Structure:** first sentence is about the user's problem, not the author. Tension (2) →
  three groups (3) → turn (4, the customer's own words) → proof (5–6) → outcome (7) → close (8).
  Title promise ("isn't simple") paid off in beat 7 in words: "days … now takes hours". PASS.
- **Pronouns:** "we"/"you" only — in fact this draft uses neither; all lines are third-person
  about the groups, which is warmer for a somber subject. No "I". PASS.
- **Sentences:** all ≤11 words, one verb each, concrete (shows, confirms, took, accepted).
- **Facts:** traced line-by-line in script.md §Sources, all to the study JSON. The 70% and 90%
  figures are the study's outcome metrics. The customer is not named (consent exists, but the
  film does not need it). No competitor. PASS.
- **Budget:** 96 narration words ≈ 37s speech at the fitted rate → ~33% voice-free in ~55s.
  Cut list from earlier drafts: dropped "the customer's own workshop had already named the goal in
  their own workshop" (redundant double "own"), dropped a "baptisms, weddings, room rentals"
  line (platform-generalisation is a second argument; one job per film), dropped "parish
  assistants wanted oversight" from VO (the card carries the label; the voice carries only the
  opposition). "So the calendar shows the times that are genuinely free" was shortened to "what
  is genuinely free" — same claim, two fewer words.

Automated check: run after voice fitting and composition (the checker reads both files); output
pasted below when run.

### Gate 2 — Storyboard
Snapshot pass over 15 beats/transitions (`snapshot --at 4.5,12.2,19.4,26.8,33.7,40.2,47,53.5` plus
transition frames). Node 22, `--no-browser-gpu`. Findings and dispositions:

- **Frame 1 is product** (4.5s): the funeral home's week view is already in its device at open;
  the title grades down beside it. PASS.
- **Mute pass**: every beat carries its claim on screen (chain + card, three columns, quote strip,
  "What the funeral home sees.", request-not-assignment pair, 70/90 metrics, close card). The film
  works silent. PASS.
- **Card holds**: shortest card hold is the beat-2 pair (~1.5s at 6 words each) — readable at a
  glance; all other cards hold 2.5s+. No re-wrap observed at any snapshot. PASS.
- **Transitions**: two types total — blur crossfade (S1→S2…S5→S6→S7) and dot/halftone takeovers at
  open and close. ≤3. PASS.
- **Money shot** (33.7s): device spans ~78% of frame width (1500/1920); card plate sits clear of
  it. PASS. **Bug found and fixed**: the marker circle was invisible — the timeline set the parent
  SVG's opacity to 0 at 31.6s and never restored it, and the marker sat outside the scaling device
  so it would not track the punch-in. Fix: moved `#marker5` inside `#dev5` (device coords
  600/382 → Mon 10:00 slot), restored opacity at 32.0s. Re-snapshot at 33.7s confirms the circle
  draws on the free slot and scales with the device.
- **Metric numerals** (47s): "70%" rendered in the deliberately-coarse Redaction 70 grade at rest —
  reads as broken pixel-art at 190px. Fixed: grade-morph on both numerals (70→50→35→20 as each
  metric lands, same device as the title). Snapshots at 47.9/49.4s confirm the morph steps and that
  the numbers rest crisp (grade 20 retains the family's mild pixel construction, matching the S8
  title — intentional).
- **Contrast/squint**: teal kickers on paper pass at snapshot scale; ink numerals dominate S7 as
  intended; nothing competes with the money-shot screen. PASS.

Verdict: PASS after the two fixes above.

### Gate 3 — Audio
All measurements via `ffmpeg astats` on the actual files (I cannot listen; "how it sounds" is
explicitly **not** verified anywhere in this record).

**Voice.** 13 clips, ElevenLabs `eleven_v3`, voice `FLj50PrMa40MhGHappOt`. Each raw clip:
leading-silence trim → `atempo=0.93` → reverse-trim 0.25s tail → `loudnorm=I=-16:TP=-1.5:LRA=7`.
Measured fitted durations sum to 33.41s; every clip is placed with ≥0.25s headroom in its scene
(`data-duration` = fit + 0.25s). Whether the clone's German-free delivery, emphasis and pacing
actually sound right is **not verified** — flagged for Tobias's listen.

**Bed.** Lyria 3.5, two takes generated (117–121s); take 2 fitted from 18s, loudnorm, 0.8s
fade-in, 2.5s fade-out ending at 56.0s → `bed1.mp3`; sidechain-ducked against the voice stem
(threshold 0.015, ratio 12, attack 120ms, release 700ms) → `bed.mp3`, which is what the
composition plays at volume 0.8. Take 1 (`bed1.mp3` pre-fit source `take1.mp3`) is kept as an
alternate for Tobias to choose by ear.

**Duck depth, measured** (RMS of the ducked bed):
| Window | RMS | Reading |
|---|---|---|
| 31.0–33.5s (VO n9 speaking) | −37.8 dB | ducked bed ≈ 24 dB under the −16 LUFS voice |
| 3.75–4.45s (release in progress) | −30.4 dB | recovery under way between sentences |
| 46.75–47.25s (gap, bed recovered) | −17.5 dB | unducked bed level; ≈ 20 dB delta vs speech window |
| 54.6–55.6s (tail) | −30.2 dB | fade-out under way |

20 dB duck delta sits inside the craft guide's 18–25 dB band. In the 40% voice-free stretches the
bed carries the film at ≈ −19.5 dB RMS after the 0.8 track volume — present but quiet, which is
the intended register for this mood, judged from the numbers, not the ear.

**Music direction fit.** Prompt followed the ChurchDesk mood line (somber yet hopeful, ~76–84
BPM, felt-piano/organ pad, no brightness). Whether the generated take actually honours it is
**not verified** — needs Tobias's listen; the alternate take exists for that comparison. No SFX
anywhere in the composition (digital texture is carried by the bed prompt, per the mood line).

Verdict: PASS on every measured property; unverified-by-ear items listed above for Gate-4 handoff.

### Gate 4 — Render
Final render: `renders/churchdesk-booking-system-glm.mp4` (Node 22, hardware GPU, "looks" quality),
plus a draft pass first to catch issues cheaply. All numbers measured with `ffprobe` /
`ffmpeg ebur128=peak=true` / `astats` on the rendered file.

| Property | Measured | Gate |
|---|---|---|
| Duration | 56.00s | ≤65 ceiling, near 55 target. PASS |
| Video | H.264 1920×1080 @ 30fps, 1680 frames | PASS |
| Audio | AAC 48kHz stereo | PASS |
| Integrated loudness | −15.0 LUFS | inside −14/−16 band. PASS |
| True peak | −1.8 dBFS | ≤ −1.0. PASS |
| Loudness range | 3.2 LU | gentle bed + even VO, as intended |
| Mix RMS, VO window 31.0–33.5s | −16.5 dB | voice dominant |
| Mix RMS, VO window 5.0–6.0s | −15.5 dB | (an earlier note mislabelled this a gap; n2 speaks 4.5–8.1s) |
| Mix RMS, bed-only gap 46.75–47.25s | −19.3 dB | bed ≈ 3 dB under speech-bearing mix in gaps — quiet-carrier register |

Frame checks on the encode (33.7s, 47.0s): marker circle crisp on the Mon 10:00 slot inside the
punch-in device; metric numerals resting in grade 20. Draft frames at 0.2/12.4/32.4/51.5/55.5s
confirmed: product on frame 1, chain mid-draw with "Before" kicker (paid off by S5's "What
changed" plate), halftone resolve landing as the money-shot VO line ends, dot takeover into the
close card.

Web outputs (separate filenames, real study path untouched):
`public/video/churchdesk-glm.mp4` (7.5 MB, faststart) · `public/video/churchdesk-glm-poster.jpg`
(still at 4.5s). Nothing committed; study JSON not wired.

Verdict: PASS on all measured properties.

## Round 2 (2026-09-16) — applied Tobias's three fixes + cover

Same three fixes applied here as to the Sonnet cut, since GLM's original script (written with no
visibility into Tobias's feedback) independently made two of the same misjudgments and additionally
kept the -70%/90% metrics he asked removed from the whole project:
1. Beat 3's group-by-group naming ("Funeral homes · Speed / Parish assistants · Oversight /
   Priests · Control of their own time") cut and replaced with the same tension line used in the
   Sonnet cut ("Fast for the family. Never a burden on the priest.") — new information, not a
   repeat of beat 2's phone-chain diagram.
2. Beat 6's "the priest confirms" narration and its "A request, not an assignment." card both made
   explicit: card gains "Never automatic. Accept — or decline."; narration states the choice
   directly.
3. Beat 7's 70%/90% metric plate replaced with the same approved "harder path" scoping-decision
   content as the Sonnet cut (extending the platform vs. a faster standalone module).
4. Cover title card added, same house treatment as both other films.

Mechanical note for next time: regenerating a longer voice line mid-timeline without checking the
FOLLOWING clip's start time causes a silent overlap (two narration clips playing simultaneously) —
hit this on n10/n11 here (n10 grew to 6.27s real, overran into n11's original 44.20 start by
~0.3s). Fixed by pushing n11 and everything downstream (S7 entrances, T7 crossfade, all of S8,
n13) later by a uniform +0.6s, extending root duration 56.4s → 57.0s. `check_video.py`'s
`beat-fit` rule catches this against the script.md table, but only once the table itself is kept
in sync — it does not catch clip-to-clip overlap directly. Logged as a LEARNINGS.md item.

`check_video.py`: 0 FAIL, 4 WARN (same accepted-precedent set as the Sonnet cut, adjusted per
beat numbering). `hyperframes lint`: 0 errors.

Gate 4: see the render summary appended below.
Gate 4 (v2 render): 57.0s, integrated -15.7 LUFS, peak -1.5 dBFS. Web copy + poster refreshed at public/video/churchdesk-glm.mp4/-poster.jpg (poster now from the cover hold). Not measured: sound, whether "accept or decline" reads clearly at pace.

## Round 3 (2026-09-16) — graphics polish; this is now the cut Tobias is shipping

Tobias's verdict on the two fixed ChurchDesk cuts: "I actually think churchdesk-glm-v2.mp4 is the
better video. now some of the graphics could be nicer, but the storytelling is actually better."
This reverses my earlier recommendation to ship the Sonnet cut — GLM's structure and prose win on
their own merits, independent of which model produced them.

Three concrete graphics fixes, from my own critical frame-by-frame read (not a vague pass):
1. The phone-chain diagram (beat 2) read thin — floating text with a faint dashed hairline. Added
   a teal marker dot per node and a hairline label under each; thickened and tealized the connector
   lines (3px pale rule → 5px teal at 55% opacity).
2. The priest's-calendar device (beat 6) was visibly smaller than the week-view money shot a few
   beats earlier, undercutting its own proof moment. Enlarged from 1040×579 to 1150×730, pulled
   back from an initial 1230px width once checked against the text column at x:1330 (only 10px
   clearance — tightened to 90px).
3. The vision-sheet photo strip (beat 4) enlarged 1150px → 1380px for more presence against the
   paper background.

`check_video.py`: 0 FAIL, 4 WARN (unchanged, same accepted set). `hyperframes lint`: 0 errors.

Gate 4: see the render summary appended below. This is the version wired into the real study.
Gate 4 (v3 render): 57.0s, integrated -15.7 LUFS, peak -1.5 dBFS.

## Round 4 (2026-09-16) — deepened the story; this is the shipping cut

Tobias watched v3 (the graphics-polished cut) and confirmed it's the one, with four substantive
notes rather than a green light:
1. The hook ("Booking a priest for a funeral looks like picking a date") undercut its own pain
   point by sounding like an admission that it IS easy. Replaced with the literal chain: "A funeral
   home calls the parish. The parish calls the priest on call. The priest checks the cemetery, then
   calls back." — stated directly, no subverted-expectation setup that wasn't landing.
2. Beat 2 now states "back and forth" explicitly, in voice and on the card ("Back and forth. One
   waiting family."), instead of relying on the diagram alone to imply repetition.
3. The platform-vs-module decision (beat 7) previously stated the choice with no concrete reason.
   Now: "One on-call shift can cover several cemeteries at once. Entering that by hand was the
   wrong fight. So we extended the calendar they already used." — traces to the study's own "one
   event covers several cemeteries... setting each one separately would be six entries a week of
   friction" text, per Tobias's direct instruction that this causal link should be the actual
   justification, not left implicit.
4. The priest-control beat (beat 6) gained the real interaction mechanism: "The priest is notified
   — in the app, and by email. One button: accept, or say no." The email channel is not in the
   written case study; it is Tobias's own recollection of the shipped design, logged to
   `data/verification-log/2026-09-16-ninox-context-for-video.md` before use, per gate 1's fact rule.
5. New house pattern, decided this round: the close now reuses the case study's own closing-hook
   paragraph, trimmed, as the CTA tease — "Curious how a two-month tool ended up running weddings
   and rentals for ChurchDesk's whole customer base?" — instead of a generic "read the full case
   study" line. Codified in SKILL.md as the standing pattern for every future video's close.

Mechanical: root grew 57.0s → 65.0s (right at the hard ceiling) to hold the added substance without
rushing it. This pushed voice-free down to 19% (FAIL); recovered to 25% by trimming two lines
further (one qualifier clause in beat 1, the CTA sentence in beat 8) rather than padding silence —
the freed seconds became the breathing room. `check_video.py`: 0 FAIL, 8 WARN (all matching
established accepted precedents). `hyperframes lint`: caught one real overlapping-tween bug (the
opening device's entrance and its ambient float competed on the same property for 0.2s); fixed by
pushing the float's start past the entrance's end.

Bed: re-windowed and re-ducked for the new length and the new voice stem; the musical passage used
shifted (windowed from the start of the take rather than the same mid-track offset as v2/v3), so
the character may read slightly different even though it's the same take and mood brief — worth a
fresh listen, not just a duration check.

Gate 4: see the render summary appended below.
Gate 4 (v4 render): 65.0s, integrated -15.0 LUFS, peak -1.6 dBFS. Not measured: sound, whether the new hook/decision/notification lines land at pace, whether the re-windowed bed still reads as the same character.

## Assets needed (flagged 2026-09-17, per Tobias's process request)

- **Video beat 1/2** (the phone-chain problem): no real footage of a phone call exists (this is a
  2024-25 internal workflow, nothing to screenshot). Currently a typographic node diagram only —
  works, but doesn't dramatize the human moment. Candidate for generated illustration (see
  production-workflow.md's new section): a phone-call scene, tested and approved-looking 2026-09-17.
- **Video beat 6** (priest notified, accepts or declines): the email-notification channel is real
  (Tobias's own recollection, logged to the verification log) but has no screenshot anywhere — not
  in the case study, not capturable now. Candidate for generated illustration: a hand holding a
  phone with a notification + accept button, tested and approved-looking 2026-09-17.
- **Case study text**: same two gaps apply at the case-study level — the phone-chain problem and the
  notification mechanism are both described in prose only, no image, in the written study too.
- Not blocking either beat (both read fine as typography/product-only), but both would gain real
  presence from either a Tobias-supplied screenshot (unlikely to exist for the phone-chain moment)
  or a generated illustration, pending his decision on using generated imagery in the shipping cut.

**Resolved 2026-09-17**: Tobias approved both generated illustrations. Integrated: beat 2 now
resolves the phone-call illustration in via a halftone screen (the same buildScreen technique as
the money-shot beat) beside the phone-chain diagram; beat 6 gets the notification illustration as a
small card that pops in near the calendar screenshot, timed to the word "notified." Both images:
`assets/ui/illus-phone-call.png`, `assets/ui/illus-notification.png` — gemini-3-pro-image,
prompts logged in `script.md`'s sources section.
Gate 4 (v5 render, with illustrations): 65.0s, integrated -15.0 LUFS, peak -1.6 dBFS. This is the current shipping cut in public/video/churchdesk-booking-system.mp4.

## Round 6 (2026-09-17) — static illustrations replaced with real generated footage

Tobias, after seeing the two static illustrations render cleanly: wanted actual video scenes
instead — realistic footage of the back-and-forth phone calls, and a priest getting notified and
accepting. Also corrected the illustration prompt's "duotone" language (not actually the site's
identity — pixel/halftone is) and flagged that a first test batch read too American; regenerated
with explicit Central European/German architectural cues and confirmed on inspection.

Real footage (Veo 3.1 via the Gemini API) gets an analog film grade, not the halftone treatment —
see DESIGN.md's new "Real footage" section. `#illus2` and `#illus6` were resized from square
illustration cards to 16:9 video cards and their `<img>` swapped for `<video>` clips with their own
`data-start`/`data-duration`/`data-media-start`/`data-track-index` (per the audio-clip pattern —
these are proper framework clips now, not passive divs). `ht2`'s `buildScreen` dims updated to
match (480×270). Full sourcing and the prompt used: `script.md`, "Superseded by real generated
footage."

`check_video.py`: unchanged, 0 FAIL / 8 WARN, all matching the v5 precedent (no narration timing
touched). `hyperframes lint`: 2 errors on first pass (video needs its own `id`, `crossorigin` breaks
Studio preview) — fixed, 0 errors / 0 warnings after. Snapshots at 13s/15.5s/35.5s/36.8s confirm
both video cards render, the halftone-resolve on `#illus2` still fires correctly at the new
dimensions, and neither card collides with the diagram, headline, or calendar screenshot.

**Not measured — cannot listen or watch full playback:** whether the film-grade treatment reads
as intentional rather than just "lower quality" once in motion at full speed, whether the two video
inserts feel tonally consistent with each other and with the product-screenshot beats around them
across a full watch-through, not just still frames.

Gate 4 (v6 render, with real generated footage): 65.0s (65.1s encoded), integrated -15.1 LUFS, true
peak -1.6 dBTP. This is the current shipping cut in public/video/churchdesk-booking-system.mp4,
poster regenerated from the cover hold.

## Round 7 (2026-09-17) — small inset cards → full-screen cutaways

Tobias, after watching v6: the video segments should be full screen, not small floating cards —
and flagged this would change the pacing. Agreed it does, and pushed back on a naive resize:
recommended treating each as a real cutaway (establish shot first, hard cut to full-bleed footage,
not a bigger version of the same insert), since going full-screen removes the diagram/screenshot
from view for that stretch rather than sharing the frame with it. Tobias agreed to build it that
way.

Rebuilt both beats within their EXISTING beat windows (no duration change, no global time shift):
beat 2 establishes the phone-chain diagram in full (all four nodes/links), then a full-screen dot
takeover (the same halftone technique as the S5 money-shot, now scaled to the full 1920×1080 stage)
swaps the diagram for the phone-chain video, with the headline re-cast as a caption over a paper
scrim at the bottom of frame. Beat 6 does the same: calendar establishes with its kicker+headline,
then a dot takeover swaps to the full-screen notification video, with a new caption
("Never automatic" / "Accept — or decline.") replacing the old body-copy line that used to sit
beside the calendar screenshot.

**Bug caught before render**: the first pass reused ht5's per-dot stagger constants (30px spacing,
0.0012s each) at full-screen scale (~2300 dots). The effective spread from GSAP's per-item stagger
offset is `(count-1) × each`, which at that dot count is nearly 3 seconds — far longer than the
nominal `duration` argument suggests. Snapshot at 15.5s caught it directly: a ring of undissolved
teal dots still sitting over the video and headline, well past when the shrink was supposed to
finish. Root cause is the same class of bug as LEARNINGS.md's crop-verification lesson — a number
that looks fine in the code reads wrong once you actually look at the rendered frame. Fixed by
widening dot spacing to 60px (~860 dots) and cutting `each` to 0.0005, keeping the effective
takeover under ~0.75s; re-snapshotted and confirmed clean, including one transition frame (38.35s)
where the video shows through the shrinking dot field, a genuinely strong shot in its own right.

`check_video.py`: unchanged, 0 FAIL / 8 WARN (duration held flat at 65.0s — the redesign fits inside
the original beat windows, not an extension). `hyperframes lint`: 0 errors / 0 warnings. New video
`data-start`/`data-media-start` windows: beat 2's clip now runs 13.90–17.9 (cut visible ~15.8–17.3),
beat 6's runs 37.40–41.4 (cut visible ~39.0–41.0).

Gate 4 (v7 render, full-screen cutaways): 65.0s (65.1s encoded), integrated -15.1 LUFS, true peak
-1.6 dBTP — unchanged from v6, confirming the restructure didn't touch the audio mix. This is the
current shipping cut in public/video/churchdesk-booking-system.mp4, poster regenerated from the
cover hold. Not yet watched at full speed with sound by either of us.

**Real bug found and fixed (2026-09-17, same day)**: Tobias reported the player getting stuck on the
calendar frame with audio and video out of sync. Investigated by frame-accurately checking the
shipped file against the intended schedule at several timestamps (t=32 correctly showed the S5
money shot, t=45 correctly showed S7's headline) — the actual frame content was NOT scrambled, ruling
out a render/timeline bug. `ffprobe` on the shipped file's audio stream showed `sample_rate=96000`,
non-standard for web/MP4 playback and a known trigger for exactly this failure mode (video appears
stuck while audio continues) in browsers and some native players. Checked all prior encodes
(v3–v6 raw renders, and the v7 raw render itself): every one is 48000 Hz — the 96kHz only appeared
in the final `ffmpeg` loudnorm/encode step that produces the shipped file, with no `-ar` explicitly
set. Root mechanism in the AAC encoder path not fully diagnosed, but the fix is unambiguous: pin
`-ar 48000` explicitly on every future encode rather than relying on inheriting the input's rate.
Re-encoded with `-af "loudnorm=...,aresample=48000" -ar 48000`, verified 48000 Hz on the output,
duration and loudness unchanged. Shipped. **Lesson for the skill**: always assert the shipped file's
audio sample rate in Gate 4, not just loudness — a rate the render pipeline never produced can still
appear after the final encode step.

## Round 8 (2026-09-17) — narration/visual mismatch, root-caused with real evidence

Tobias watched with sound this time (the sample-rate fix resolved playback) and said narration and
visuals didn't line up and didn't make sense — then, pointedly, that we'd regressed from something
that worked well (Ninox). Fair. Investigated properly instead of guessing: transcribed n3/n4/n10
word-by-word with `hyperframes transcribe` (whisper), and pulled contact sheets of both reel clips
at 1fps to map exactly what each source clip shows second by second.

Found two real, specific bugs, both caused by trusting arithmetic over evidence:

1. **Beat 2**: "A grieving family waits through every round" lands at 14.45–16.88s absolute. The cut
   revealed the video at 15.05s, but `reel-phone-chain.mp4` (Tobias's supplied clip) had been set to
   start playing from its own t=0 at `data-start=13.90`, hidden behind the diagram. By the 15.05s
   reveal, the clip was already 1.15s into itself — past the family shot (0–1s) and onto a stranger
   in an office. The word "family" played over the wrong person entirely.
2. **Beat 6**: the reveal at 38.25s used `data-media-start=1.8`, landing on the priest mid-stride
   with no phone in hand — the actual phone-in-hand, engaged moment doesn't start until ~3.2s into
   that clip (confirmed via a full 1fps contact sheet of `reel-notification-accept.mp4`). The caption
   "Accept — or decline." was appearing over a man still walking, not accepting anything.

Fixed by recomputing `data-start`/`data-media-start` from the actual transcript timestamps and the
actual per-second content map, not assumed pacing: beat 2's video now starts fresh at the reveal
(`data-start=15.00`, `data-media-start=0`) so the family is the first frame shown, exactly on the
word "family." Beat 6's `data-media-start` moved to 3.2s so the reveal lands on the phone-in-hand,
engaged moment, landing "Accept" on an actual tap gesture. Re-snapshotted at the exact transcript
timestamps (15.1s, 15.3s "family", 16.2s "every round", 38.3s, 38.6s, 39.3s "accept") and confirmed
each one now shows content that matches what's being said.

**Process failure, named plainly**: rounds 6 and 7 both computed video offsets from arithmetic
(elapsed = composition-time − data-start) instead of directly sampling the source clips and
cross-referencing against actual narration timing. The math wasn't wrong; the *inputs* to it were
assumptions (guessed frame rate, guessed pacing) never checked against the real files. This is the
same root pattern as LEARNINGS.md #34 (crop math from a guess) and #35 (stagger math from a guess) —
now a third instance, promoted to a general rule rather than a one-off fix.

Gate 4 (v8 render): 65.0s (65.1s encoded), integrated -15.1 LUFS, true peak -1.5 dBTP, audio
48000 Hz (verified directly on the shipped file, not assumed). Re-checked the two fixed moments on
the actual shipped binary, not just the pre-render snapshot: t=15.3s shows the family exactly as
"family" plays, t=39.3s shows the priest mid-tap exactly as "Accept" plays. This is the current
shipping cut in public/video/churchdesk-booking-system.mp4.

## Round 9 (2026-09-17) — process reset: treatment written, structure rebuilt against it

Tobias asked for a real process, not another patch: treatment, storyboard, asset identification,
verification, assembly. Updated the skill first (`generate-case-study-video/SKILL.md`,
`references/treatment.md`, `references/review-gates.md`) to make Treatment a mandatory step before
any script prose, and asset-verification (contact sheet + transcript cross-check) a mandatory Gate
2 item — both permanent additions, not just this project. Then wrote ChurchDesk's own treatment
(`script.md` §Treatment) and rebuilt the composition against it:

- **S1 is now a cold open** on the phone-chain problem (diagram assembles in sync with the literal
  chain description, n1/n2; a dot takeover cuts to real footage for the emotional close, n3/n4).
  No product screenshot until it's earned.
- **S2 is a new silent "turn" beat** (17.3–19.8s): the product reveal, moved here from the old
  opening. No narration — the shot speaks for itself, per the skill's own `[silence]` rule.
- **S7 gets the diagram it was missing**: "one on-call shift" branching to three named cemeteries,
  reusing the node/connector language freed up by S1's restructure (not a repeat — different
  subject, same visual grammar, exactly the "motif not redundancy" check the treatment calls for).
- All downstream beats (S3–S8) shifted by a uniform +2.5s to make room for the turn beat; S8's
  closing tweens were pinned to their original absolute times rather than shifted, which
  automatically shortened the dead-air tail at the end instead of pushing total duration over
  budget. Root duration held at exactly 65.0s. No VO was regenerated — every beat's existing
  narration was reusable once paired with the right visual, confirming the original problem really
  was structural, not textual.

`check_video.py`: two new WARNs appeared from explanatory parentheticals I'd left in the "On
screen" column of the beats table (not real on-screen text) — fixed by moving the explanation out
of that column; back to 0 FAIL / 8 WARN, unchanged from prior precedent. `hyperframes lint`: one
real overlapping-tween warning (`#dev0` scale animated by two tweens at once in the new turn beat) —
fixed by starting the ambient float after the entrance tween's own end instead of overlapping it;
0 errors / 0 warnings after. Snapshots confirm: the diagram nodes now land in sync with the literal
chain description, the turn beat reads as a clean earned product reveal, the S7 diagram is legible,
and the previously-fixed "family"/"accept" narration-to-visual alignment survived the retime intact.

Gate 4 (v9 render): 65.0s (65.1s encoded), integrated -15.0 LUFS, true peak -1.5 dBTP, audio
48000 Hz. This is the current shipping cut in public/video/churchdesk-booking-system.mp4. First
version built through the full treatment → script → asset-verification → storyboard → audio →
render process rather than patched incrementally.

## Round 10 (2026-09-17) — three real defects, corrected with verified fixes

Tobias, after watching v9: three specific problems, not vague "off."

1. **Wrong chain, wrong node.** The actual chain is family → funeral home → parish office →
   priest; cemetery opening hours are a constraint the priest checks, not a fourth party being
   called. The diagram wrongly showed "Cemetery" as a 4th node in the call sequence. Fixed: dropped
   the Cemetery node entirely (it was never narrated as a caller either — narration only ever named
   funeral home, parish, priest), recentered the remaining 3 nodes. Logged the corrected chain and a
   refined justification for the multi-cemetery argument to the verification log.
2. **Product shown before the customer's goal was established.** Round 9 inserted a silent "turn"
   beat (product reveal) immediately after the cold open, before the tension beat (S2) and the
   customer's own stated goal (S3) had run. That's backwards — the design's reasoning has to be
   established before the solution is shown, or the reveal reads as arbitrary. Fixed: removed the
   standalone turn beat outright. The film now goes straight from the cold open into the tension and
   customer's-own-words beats; the product's first appearance is the S4 money shot, which is where
   it always belonged. This also returned total runtime to its original, non-extended shape — no
   duration bookkeeping needed, the extra 2.5s from round 9 simply came back out.
3. **Priest-accept footage cut off almost immediately after revealing.** Real bug, not a judgment
   call: round 9 shifted the S6 dot-takeover reveal by +2.5s (to make room for the now-deleted turn
   beat) but never shifted the `<video>` element's own `data-start`/`data-duration` to match — so
   the clip's valid window ended almost right after it became visible. Reverting the whole S3–S8
   shift (per fix #2) fixed this as a side effect, since it restored the original alignment between
   the reveal tween and the video's own timing window. Verified directly: the footage is still fully
   visible at 40.9s, one-tenth of a second before the scene itself ends at 41.0s.

`check_video.py`: 0 FAIL / 8 WARN, matching the long-standing precedent (beat numbers shifted down
by one since the turn beat's removal, warnings unchanged in substance). `hyperframes lint`: 0
errors / 0 warnings. Snapshots at 4.5s (diagram, 3 nodes, correct), 20.0s (confirms no product
appears before S2/S3), and 40.9s (confirms the S6 footage fix) all verified directly against the
fixes claimed above, not assumed.

Gate 4 (v10 render): pending.
Gate 4 (v10 render): 65.0s (65.1s encoded), integrated -15.1 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean (0 errors). This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

## Round 11 (2026-09-17) — restored the Family node

Tobias corrected round 10's diagram: it should be four parties (Family, Funeral home, Parish
office, Priest), not three. Round 10 had over-corrected — dropping "Cemetery" (right, it was never
a party in the call chain) also mistakenly dropped "Family" (wrong, Family is the originating
party and belongs in the chain). Restored the original 4-node layout and positions (200/610/1090/1520,
tuned for 4-node balance), relabeled node 1 "Family". Logged to the verification log.

`check_video.py`: 0 FAIL / 8 WARN, unchanged. `hyperframes lint`: 0 errors / 0 warnings. Snapshot
at 6.0s confirms all four nodes present, correctly ordered, evenly spaced.

Gate 4 (v11 render): 65.0s (65.1s encoded), integrated -15.1 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean. This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

## Round 12 (2026-09-17) — a direction change, not another patch

Tobias, correctly: retiming the diagram+footage hybrid one more time "does not feel like a
ground-up updated approach, this still feels like finetuning something we agreed is not up to our
standard." Right. Stopped mid-edit and reconsidered the beat itself rather than its timing.

Presented three real options: (A) footage-only for the whole beat with lower-thirds naming each
party; (B) diagram-only, with the human moment as its own dedicated beat; (C) rebuild the same
hybrid, planned properly. Tobias chose B.

Rebuilt: S1 is now purely graphic — 4-node diagram, connectors pulse through "back and forth" (a
new touch, not present before), card lands for the close. No footage, no scrim, no dot-takeover in
this beat. A new silent beat (S1b, 17.3–19.8s) follows: one shot of the family alone, slowed 2x for
weight (extracted and retimed from the source clip via ffmpeg, since the source's own internal
cuts move too fast to give the moment room otherwise), full screen, nothing else on screen. This
also directly answers the still-earlier "shouldn't the footage be visible through the whole
narration segment" question — it doesn't need to be, because the diagram now owns that segment on
its own terms, and the human moment gets a segment it can actually fill.

Downstream (S2–S8) shifted by a uniform +2.5s to make room, same bookkeeping as round 9: S8's
closing tweens pinned to their original absolute times rather than shifted, which shortens the
tail-hold silence instead of pushing total runtime over budget. Root duration held at exactly
65.0s.

`check_video.py`: 0 FAIL / 8 WARN, unchanged. `hyperframes lint`: 0 errors / 0 warnings. Snapshots
at 12.0s (diagram holds, pulsing) and 18.0s (family shot, alone, full screen) confirm the new
structure directly.

Gate 4 (v12 render): pending.
Gate 4 (v12 render): 65.0s (65.1s encoded), integrated -15.0 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean. This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

## Round 13 (2026-09-17) — the grid, and a real content bug caught before render

Tobias, after watching round 12: the human-moment beat "barely shows up and then is gone already"
(a real bug: fades baked in twice — once in the ffmpeg extraction, once in the composition's own
scene crossfade, stacked on a 2.2s clip). Then proposed the actual fix, not just a timing patch: a
2×2 grid of all four parties as real video, no text labels, with the scene playing across the four
during the narration, "one calling the next... back and forth."

Per the new rule (this is round 3 of feedback on the same beat — reopen the treatment, don't patch)
this was treated as a real redesign. Checked the four candidate clips side by side *before* building
anything, per the plan stated when agreeing to try it — good thing: the four clips didn't read as
one consistent scene. The funeral-home and parish clips (generated earlier, previously rejected)
had a much heavier grade than the family clip; the priest shot was bright outdoor daylight against
three dim interiors; two had visible generator watermarks. Fixed: re-graded all four from their raw
sources with one identical film-grade filter, cropped both watermarks, darkened the priest's
exterior shot to match the interiors.

**Second bug, caught the same way**: the first priest extraction (source 1.9–3.1s) was wrong — a
fine-grained 19-frame scan of the source clip showed that window is mostly the parish assistant,
with the priest appearing only in a single stray frame. The actual priest segment is 8.3–9.5s.
Re-extracted, re-graded, re-verified before wiring in. This is exactly why checking assets before
building was worth doing twice in one round.

Rebuilt S1 (0.4–19.8s, same total span as round 12's S1+S1b combined, so nothing downstream needed
retiming): a 2×2 grid, family/funeral-home top row, parish/priest bottom row, no text labels except
a small "Before" kicker. A spotlight (scale + opacity) moves cell to cell as the narration names
each party, oscillates between the three institutional parties for "back and forth, call after
call", then settles on family for "a grieving family waits." Two looped clips (family, priest —
both short source segments extended to 18s via `ffmpeg -stream_loop`) plus two natural-length clips
(funeral home, parish — already ~8s from their original generation).

`check_video.py`: 0 FAIL, 7 WARN (one fewer than before — the redundant on-screen card is gone, so
its own caption-repeats-narration warning is gone with it). `hyperframes lint`: 0 errors, 0
warnings. Snapshots at 6.0s and 15.5s confirm all four cells show the correct person with consistent
grading, and the priest fix specifically verified against the corrected clip.

Gate 4 (v13 render): pending.
Gate 4 (v13 render): 65.0s (65.1s encoded), integrated -15.0 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean. This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

## Round 14 (2026-09-17) — spotlight sync and a semantic bug

Tobias: "clip highlighting is not in sync with the narration, and the priest does not call the
cemetery." Two real issues, both from the same root cause as before — the original spotlight timing
in round 13 was paced by assumption (guessed proportional offsets like 1.30/3.30/5.60), never
checked against the actual transcript. Fixed properly this time:

1. Transcribed n1–n4 word-by-word with `hyperframes transcribe` and rebuilt every `spot()` call
   from the measured word timestamps, not guesses.
2. Found the actual bug behind "the priest does not call the cemetery": the narration says the
   priest *checks* the cemetery (an internal action) then *calls back* — the old timing had the
   spotlight moving off the priest right around the word "cemetery," which visually implied a call
   to a party that was never on screen. Fixed: the priest now stays highlighted through "checks the
   cemetery" with no cell change, and the spotlight only moves on the actual word "calls" (back to
   the parish — the real direction of the callback, not the funeral home, which the previous
   round-robin cycling implied incorrectly).

`check_video.py`: 0 FAIL / 7 WARN, unchanged. `hyperframes lint`: 0 errors / 0 warnings. Snapshots
at the measured word timestamps (1.8s during "calls the parish", 3.7s during "calls the priest")
confirm the correct cell is brightening at the correct moment.

Gate 4 (v14 render): pending.
Gate 4 (v14 render): 65.0s (65.1s encoded), integrated -15.0 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean. This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

## Round 15 (2026-09-17) — regenerated family and priest as real 8s clips

Tobias: right that the clips weren't built for this format — family and priest were 1.1–1.2s
snippets extracted from Tobias's supplied montage and stretched to 18s by looping, visibly
repeating every ~1.1s. Funeral-home and parish were already genuine 8s Veo generations, so those
stayed as-is.

Generated two new Veo 3.1 clips: family (mother and son on a sofa, phone appearing partway through
so the "checking the phone" beat lands in the back half, matching where the grid's own family
spotlight fires late in the beat) and priest (Romanesque church facade, phone held throughout — a
static pose that holds up at any point since his spotlight moments are scattered, not one
continuous window). Priest's first generation attempt hit the same transient "audio safety" false
positive seen earlier in the project; succeeded on retry with slightly reworded phrasing.

Cropped a visible watermark from the family clip (bottom-right), applied the same unified film-grade
filter used for all four cells, and darkened/desaturated the priest's bright exterior shot to match
the three dim interiors — same treatment as the round-13 fix. Verified all four side by side before
wiring in (again): now read as one consistent set.

Both new clips are natural 8-second files, not pre-looped — matching how funeral-home and parish
were already declared at the full 19.4s beat duration without issue, so no extra `ffmpeg`
stream-loop step needed this time.

`check_video.py`: 0 FAIL / 7 WARN, unchanged. `hyperframes lint`: 0 errors / 0 warnings.

Gate 4 (v15 render): pending.
Gate 4 (v15 render): 65.0s (65.1s encoded), integrated -15.0 LUFS, true peak -1.5 dBTP, audio
48000 Hz, full decode clean. This is the current shipping cut in
public/video/churchdesk-booking-system.mp4.

Status correction (2026-09-17, from Tobias): v15 is deployed live but **not approved**. It is a
working cut published for review; the film still needs work and v15 will be overwritten by the
next round. Do not treat deployment as approval, and do not treat this cut as final anywhere.

## Round 16 (2026-09-17) — v16, the four v15 review fixes

Tobias, on v15: the 4-clip grid is odd; the clips stop playing and become 4 static cards; the
priest accepting on their phone is cut off after less than a second when it should be visible
throughout that moment; and he had asked for 5 cemeteries with different funeral hours (the
diagram showed 3, with no hours). v16 addresses all four. Deployment of v16 is again a working
cut for review, not approval.

- **Grid freeze**: cell assets were 8.0s in a 19.4s beat. All four rebuilt as 22s ping-pong xfade
  loops (forward → 1s dissolve → reversed → 1s dissolve → forward; crf 16, 24fps). Wiring
  unchanged. Full detail in `script.md` Round 16.
- **"Grid is odd"**: freeze fixed first; spotlight design kept (lesson 37 — second-round signal on
  the same beat re-opens the structural decision, but the freeze plausibly *was* the oddness, and
  restructuring while a known defect was also live would confound the read). Structural options
  logged in `script.md` for round 17 if the grid still reads odd.
- **Priest accept**: rewired `#reel6` from `start 37.40 / duration 4.0 / media-start 3.2` (played
  hidden under `#dev6`; only 0.65s visible after the reveal) to `start 40.75 / duration 2.75 /
  media-start 4.5`. In-point from a 0.6s-step frame scan: read → tap (~5.6 in source) → nod, under
  the "accept, or say no" narration line.
- **Five cemeteries with hours**: S7 diagram rebuilt, 5 named nodes with hour sub-labels, links
  restaggered 45.10–47.50 inside n11 (43.9–53.59).

**Illustrative-content disclosure (the diagram's hours).** The study verifies only the *range*:
"cemetery opening hours ranged from Thursdays at 9am only to every day 10am–4pm, and everything
between." It does not name which cemetery had which hours, nor any of the cemeteries' names beyond
Hauptfriedhof and Waldfriedhof appearing in the availability screenshot's selection. On the
diagram: `Bestattungswald — Thu 9:00 only` and `Hauptfriedhof — Daily 10:00–16:00` are the two
verified *endpoints* attached to named cemeteries as illustrative instances; `Waldfriedhof —
Mon–Sat 9:00–12:00`, `Stadtfriedhof — Wed & Fri 14:00–16:00`, `Lindenfriedhof — Tue 10:00–12:00`
are invented names with invented intermediate hours inside the verified range. Every hour label on
this diagram is therefore illustrative of the verified range, none is asserted as a fact about a
real cemetery, and the diagram sits under narration ("can cover several cemeteries at once") that
is itself study-sourced. The names Stadtfriedhof and Lindenfriedhof are new this round;
Bestattungswald was already in the v15 diagram.

Round 16 verification: snapshots at 9.0/17.5 (grid holds, spotlight intact), 41.3/41.9/42.6/43.2
(the tap on accept is visible across the full-bleed window under the caption), 46.0/47.9/50.0 (five
cemetery nodes with hour sub-labels, readable at full size). `check_video.py --strict`: 0 FAIL /
7 WARN (same known warns as v15: rate, one long sentence in beat 7, voice-free share). `hyperframes
render`: 65.0s. Gate 4 (v16): integrated -15.0 LUFS, true peak -1.54 dBTP, audio 48000 Hz pinned on
the ship encode, 1920x1080, 65.0s, full decode clean. Shipped as
public/video/churchdesk-booking-system.mp4 + regenerated poster (money-shot frame, 33.5s).
**v16 is deployed live as a working cut for review — not approved.**

## Round 17 (2026-09-17) — v17, spoken narrative pivot after the grid

Tobias, on v16: after the 2×2 grid montage, should there be a "but" — his draft: "the diocese
wanted to serve the grieving families better and make this process much more service oriented" —
so viewers understand the pivot in the narrative. Agreed: the film jumped from "a grieving family
waits through every round" straight into "Fast for the family" with no hinge.

- **Line**: "But the church wanted this to feel different." (n4b, ElevenLabs same voice, fitted at
  the house 0.93 atempo → 2.22s), placed 17.35–19.6 over the family settle at the end of beat 1,
  in the 2.7s of silence between n4 and n5 — no downstream re-timing. The specifics still land in
  beat 2's own lines ("The customer had already named the goal. Fast for the family…").
- **"Church", not "diocese"**: the pilot customer is the Evangelische Kirche von Kurhessen-Waldeck,
  Protestant — "diocese" is a Catholic term and would mis-code the story.
- **Compression, disclosed**: Tobias's fuller wording (~17 words ≈ 7s) does not fit the gap; it
  would force a re-timing of the whole film. The implemented line carries the pivot as aspiration
  ("wanted this to feel different") rather than as a process claim — the study never uses
  "service-oriented" framing, so the stronger claim is also the less defensible one. If Tobias
  wants the fuller sentence, that is a timing-table round, not a patch.
- Bed re-ducked: vo-stem rebuilt with n4b at 17350ms, sidechain re-run against bed-fit-65.
- **n5 removed ("The customer had already named the goal.")**: adding the pivot line pushed the
  voice-free share to 21.7% (FAIL floor is 22%) — the checker has been saying since v15 that the
  film is narrated to its ceiling. The pivot line makes n5 redundant three ways (pivot → beat 2
  card → beat 3's own "The customer's own workshop had named the goal"), so n5 came out rather
  than jiggling silence padding to squeak under a threshold. Voice-free back to 25% — the same
  WARN profile v15/v16 shipped with. **Tobias: if you want n5 back, it re-breaks the gate — the
  next narration addition must be paired with another cut.**
- Gate after changes: 0 FAIL / 7 WARN (the known v15/v16 warns), rate 2.96 wps, voice-free 25%,
  beat-fit all PASS. n4b data-duration 2.40 to clear the +0.15s padding floor.
Round 17 Gate 4 (v17 render): 65.0s, integrated -15.2 LUFS (target -15.0, within 0.2 LU; left
un-normalized because a +0.2 dB makeup gain would push true peak to -1.31 dBTP, further off the
-1.5 spec than the loudness is), true peak -1.51 dBTP, audio 48000 Hz pinned on the ship encode.
Shipped to public/video/churchdesk-booking-system.mp4. **v17 is a working cut for review — not
approved, and not pushed/deployed until Tobias has watched it.**

## Round 18 — voice swap to Tobias's own clone (2026-09-18)

Tobias chose his ElevenLabs clone `kMS8f1BmXMghbv2jguJo` as the narrator (his words: "yes go
with my voice and re-render the existing videos with it"), which makes the first-person pivot
line in beat 6 literally his perspective. All 11 narration lines re-generated and fitted
(n5/n12 placeholders unreferenced). Raw pace ~2.8–2.9 wps; every take fit its existing window
at natural pace — **no atempo anywhere**, one 0.3s start shift (n8 29.40 → 29.70 after n7's new
tail at 29.54 overlapped). Fitted: n1 4.16 / n2 2.96 / n3 3.68 / n4 2.72 / n4b 2.08 / n6 3.52 /
n7 3.04 / n8 1.20 / n9 2.72 / n10 6.40 / n11 9.60 / n13 8.00 — 50.08s speech, voice-free 23.0%
(WARN, same band as shipped v17), rate 2.82 wps (WARN, under the 3.0 ceiling).

Word timings re-measured via `hyperframes transcribe` on the new takes (round-14 discipline);
absolute times = clip data-start + word offset. Spotlight cues re-anchored: gc-parish 1.60 /
gc-priest 3.46 / gc-parish 7.09, oscillation 10.56–13.00, gc-family 14.43. Beat-table beat 1
corrected to the actually-spoken text ("then calls back" once — the second occurrence was never
in the audio). vo-stem + bed rebuilt (12 inputs, sidechain unchanged). Gate: **0 FAIL, 7 WARN,
21 PASS** (first pronoun PASS now active under the author-voice rule).

Gate 4 (v18 render): 65.0s, integrated −16.5 LUFS, true peak −1.46 dBTP. Ship-encoded
(-c:v copy, aac 192k @48k) to `public/video/churchdesk-booking-system.mp4`, poster at −ss 32.2.
**v18 is a working cut for review — not approved, and not pushed/deployed until Tobias has
watched it.**

## Round 19 — four A/V sync + layout defects (2026-09-18, Tobias on v18)

Tobias, verbatim: "the audio and the visual timing are off. voice says calendar and only a
second later it shows up. while the voice says the church wanted it different the 3x3 grid
still is sitting there. also the grid has a weird before label, maybe we can position that
differently or make the grid smaller so it can sit above? Fast for the family is visible for
over a second before the voice says it"

Classified: all four are **timing/visual** (none script/facts). Root causes found:

1. **"calendar" lag** — a real drift bug, not a judgement call: S5's internal cues (halftone
   resolve 32.30, device zoom 32.20) assumed the scene was visible from ~32.0, but the T4
   crossfade sat at 34.30/34.40 — so the resolve played behind a still-invisible scene and the
   calendar arrived ~1.9s after "calendar" was spoken (measured: word at 32.55–33.12 abs,
   `transcript-n9.json`). Fixed: T4 moved to the beat-3/4 boundary the beat table already
   declared (31.90/32.00) — the resolve now lands on the word. The beat table had been right;
   the composition had drifted from it.
2. **Grid still up through the pivot** — n4b (17.35–19.43) now dims the whole grid to 0.32
   opacity with a 5px stage blur while it plays; the old way visibly recedes before the
   crossfade takes it out at 19.8.
3. **"Before" label** — the grid had spanned y=20..1060 (nearly full frame) with the kicker
   overlaid on the footage. Grid shrunk (cells 455px tall, rows at y=110/585) so the kicker
   sits in clear paper above it.
4. **"Fast for the family" leading the voice** — s3-l1 appeared at 20.40 vs voice onset 22.79
   (measured, `transcript-n6.json`: "Fast" 22.79, "never" 24.52, "burden" 24.94). Lines now
   arrive at 22.70 / 24.45, teal sweep at 24.90 — with the words, not ahead of them. S3 holds
   an empty paper breath through the pivot's tail.

`check_video.py`: 0 FAIL, 7 WARN, 21 PASS (unchanged — script untouched this round). Lint
clean. Snapshots at 10/17.9/21.5/23.3/25.3/32.7/35.2 confirm each fix. Gate 4 pending on the
v19 render. **Working cut for review — not approved, not pushed until Tobias has watched it.**

## Round 20 — "never a burden on the priest" + the priest/pastor question (2026-09-18, decision pending)

Tobias, verbatim: "doesn't 'never a burden on the priest' sound bad? it was about transparency
and quick responses for the funeral home and with that fast for the family. so maybe fast for
the family, transparency and ease of use for the funeral home and yet not a burden on the
priest (still sounds not amazing about the priest…) … this is not because priests think
they're too good for this but because they reject the idea of being booked or somebody else
controlling their time not because they're vain but because they're engaged in kind of whole
life ministry and that includes … it's really important to be able to manage their own time
well. Now … it was a Protestant diocese so I don't know if they're called different and so
that's not a priest it would be a pastor actually. Maybe that's something we need to change."

Classified: **script** (beat-2 line) + **facts** (priest → pastor terminology). Root cause the
checker could never catch: the line compressed the stakeholder triad into a negative framing
("burden") that implies the pastor is the problem, when the study's own callout frames it as
consent ("never feel like being booked … stay in control of their own time"). And the film's
English gloss "priest" contradicts the customer's actual identity — the study names
Evangelische Kirche von Kurhessen-Waldeck (Protestant), and the S5 screenshot literally reads
"Back to Protestant Funeral" on screen while the voice says "priest". Decision pending with
Tobias: proposed replacement line + terminology sweep scope.

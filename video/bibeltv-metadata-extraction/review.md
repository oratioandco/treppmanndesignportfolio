# Review — bibeltv-metadata-extraction film

## Round 1 — 2026-10-11 — Gate 1 (script), before any voice

**Job to be done:** show that a timestamp is a product interface, and that the pipeline was built
by someone who did the logging by hand first, so each sermon passage becomes a clip that describes
itself.

### check_video.py --strict
```
PASS  first-sentence   "—"   (beat 0 is the silent cover; first spoken line is beat 1, about the user)
PASS  length           root duration 59.4s
PASS  pronoun          beat 3: first person — narrator is Tobias's own clone
PASS  pronoun          beat 4: first person — narrator is Tobias's own clone
PASS  voice-free(est)  92 words ≈ 40s speech → 33% voice-free at 2.3 wps
0 FAIL, 0 WARN, 5 PASS
```
First pass was 1 FAIL (26% voice-free, 103 words) + 7 WARN (voice repeating cards in beats 4–6,
two long sentences, a 7-word hero card). Rewritten from each beat's job, not patched.

### Treatment check
- PASS Opening move: cold open on the problem; first line is about a wrong-looking result, frame 1
  shows that mismatch (typographic), not the app. Product earned by beat 4 (~22s, first 37%).
- PASS Every beat has a visual mode (typographic / diagram / typographic / screenshot+diagram /
  footage / typographic / typographic).
- PASS Reuse: beat 3's halftone frame is from beat 5's recording — intentional callback.

### Adversarial read (what a director would wince at)
1. **Hook**: v0 ended "Its title is about something else" — a shrug, not a problem. Now "Its title
   makes it look wrong": the consequence is stated. PASS.
2. **"First I did it by hand"**: "it" undefined on first hearing. Now "the logging myself, for a
   week, on real videos". PASS.
3. **Beats 4–6 restated their cards.** Voice now carries what the card can't: what the pipeline
   reads (what was said, not the title), the trust line (the clip's words come from the sermon,
   never from the model), and why the clips exist (evidence the chat can retrieve). PASS.
4. **The turn is thinner than the study.** The study's real boundary insight — the goal was not a
   model watching so nobody has to, it was removing repeat capture work — was cut for budget. The
   sequence (by hand → pipeline) implies it; it isn't said. **Open question for Tobias** (~10 words).
5. **Hook example vs proof footage.** Hook: Genesis 1 / "Who is Jesus?". Proof: John 3 /
   Nicodemus. Not a contradiction — the proof shows the fix (the clip titled for its own passage) —
   but a Genesis 1 recording would make it a callback. Try to record Genesis 1 at picture stage; if
   it has no clips, keep John 3.
6. **"Title" on the beat-4 card next to "never from the model"** could read as "titles aren't
   model-written". Voice says *words*; the source says clip *text*. **Open question**: are clip
   titles model-generated? If yes, the card stays (it's true and the voice is precise); if a
   stranger might conflate, drop "Title." from the card.
7. **No adoption claim anywhere**; beat 6 card states "In development, not yet published".
   805/299 is a corpus snapshot Tobias checked himself (attribution rule). PASS.

### Facts — per line, see script.md "Sources". Every line traces to the study JSON or a dated log.

### Assets needed
- B1 typographic, B2 timeline diagram: built in house kit — not blocking.
- B3 halftone frame: from the beat 5 recording — have it.
- B4 n8n overview (sanitized, already public) — have it.
- B5 recording — have it (`assets/capture/verse-to-clip-flow.mp4`); optional Genesis 1 re-take.

**Gate 1: passed, pending Tobias's go on the script and the two open questions.**

## Round 1b — 2026-10-11, open question 6 answered from the code

**Are clip titles model-generated? Yes.** Workflow 03's extraction prompt asks the model for
`title`, `description`, the passage and the time range; only `clip_text` is sliced from the
transcript segments by code. Evidence: my-cv-tailor
`data/verification-log/2026-10-11-who-writes-each-clip-field.md`.

So v1's beat-4 line ("the clip's words come from the sermon, never from the model") beside a
"Title" card overclaimed: a listener hears "words" and sees "Title". **Rewritten (v2):**
"I built a pipeline that reads the sermon, not its title. The model marks each passage and names
it. The quote is cut from the sermon." Card: "Source video. Start. End. Title. Quote." The five
labels split visually: four from the model's pass, the quote tied back to the transcript.

Adversarial re-read: the line now credits the model with exactly what it does, and the trust
claim is narrower and true. "Names it" also sets up the study's own close (why a clip title
matters to retrieval). Risk: beat 4 now carries 25 words in 11.5s (≈10.9s at 2.3 wps), so it is
tight; if the clone runs slow, cut "from the sermon" from the last sentence, or extend beat 4 by
1s from beat 5's silent lead-in.

`check_video.py --strict`: 0 FAIL, 0 WARN, 5 PASS (95 words, ~30% voice-free est.).
**Gate 1 holds.** Still waiting on Tobias: go on the script, the beat-3 boundary line, budget cap.

### Genesis 1 alternate for beat 5 (2026-10-11, 09:35)
Genesis 1 does have clips (1. Mose 1,1: five, e.g. "Der Schöpfungsbericht als göttliche
Offenbarung"; the count grew from 4 to 5 while capturing, so the corpus is live). None of them is
the "Who is Jesus?" sermon from the hook, so the film can echo the passage but not the example.
Two screenrecord takes ended at the moment the player launched (12.9s / 14.6s, sheet only), so
there is no usable Genesis take yet. **John 3 stays the keeper.** At picture stage, retry with
screenrecord started after the sheet opens, or record the player as a separate take.

## Approval — 2026-10-11
Tobias: "go for both" — in reply to: go on the script, and the proposed $5 cap. Script approved as
written; budget.approved_max = 5 USD.

## Round 2 — 2026-10-11, voice + picture (Gate 3 voice part, Gate 2)

### Voice
7 clone lines (`kMS8f1BmXMghbv2jguJo`, eleven_v3), $0.28. Fit chain PASS. Every clip transcribed
(`assets/vo/b*-r1-r1.mp3.words.json`) and matches the script word for word. check_video --strict:
0 FAIL, 1 WARN — rate 2.95 wps (band 2.0–2.6). Same as the clone's pace on earlier films; kept.
If it sounds rushed, re-fit all seven with `atempo 0.93` (fits every window; cues re-anchor).
Voice-free 46%.

### Picture — built, snapshotted, fixed
- Cover held 0–0.4s per DESIGN.md (the ai-prototyping film holds 2.5s with no recorded reason; the
  written rule wins).
- **Beat 5 timing changed from the script table.** The raw recording spends ~3s on loading
  placeholders, so it was cut into three real segments (reader 0–3.8s, clip list 6.4–8.6s, tap →
  player 10.6–12.5s, last frame held): `assets/capture/verse-to-clip-cut.mp4`, 30fps CFR (the
  source is VFR from screenrecord). The player opens at 40.1s, so b5 moved to 40.2s ("clip
  starts" lands as it opens) — the silence before it grew from 3s to ~6.7s. Jump cuts are real
  footage, no reordering.
- Portfolio-proof size: the recording is portrait, so the ≥70%-width rule can't apply; the device
  is 1002px tall (93% of frame height), the largest element in the film.
- Beat 3 frame cropped to the preacher only (`assets/ui/sermon-frame.png`): the first crop showed
  identifiable audience members.
- Fixes after the first snapshot pass: close card unreadable (title over the densest dots) → the
  dots now sweep in and clear before the title; marker circle clipped the result card's kicker →
  refit around the title only; beat-5 caption wrapped mid-phrase → shortened.
- Motion vocabulary: halftone resolves (beat 3 sermon, beat 4 workflow, beat 5 device), marker
  circle (beat 1) + underline (beat 3), device tilt (beats 4, 5), grade morph (beats 3, 6),
  dot-takeover close. Cues cite word timestamps in `index.html` comments.
- Mute pass: problem (search → wrong-looking title) → timestamp diagram → 3–5 min by hand →
  pipeline → the record's fields (model vs transcript) → the app → 805 / 299, in development. Holds.

**Gate 2: passed on snapshots.** Gate 3 (bed, duck, levels) next.

## Round 3 — 2026-10-12, Tobias's feedback (verbatim)
> "there is an odd part that's not in my voice and the numbers are wrong, we have thousands of clips now and thousands of transcribed videos and have live automation now to process new videos as well as they become available. we also have articles from the gott-erklaert.de website as well as additional videos that do not have bible verse tagging (bible verse tagging is also something we do in the pipeline. also I did not manually tag for a week (well sort of) but the next scene fails to mention the goal and vision of automating this and that the current setup only offered the starting point not the end point. so theer is still a lot we could improve for this clip"

Classified: **facts** (805/299 stale; live automation, articles, untagged videos missing; "a week"
wording in question), **script** (the turn lacks the goal and the start-point/end-point insight),
**audio** (one line not in his voice — measured: b2 spectral centroid ~1,010 Hz vs 740–850 Hz for
the other six at the same pitch; regenerate b2).
Facts logged: my-cv-tailor `data/verification-log/2026-10-12-sermon-pipeline-scale-and-the-start-point.md`
(11,405 clips / 3,504 videos, 3,574 transcripts, 91 articles, nightly + 15-min automation, as of 2026-10-09).
Gate gap: Gate 1 traced 805/299 to the study and stopped; for a live, growing system the number
must also be checked against the current ops record. To add to LEARNINGS + review-gates.
Next: script v3 (beats 3, 4, 6 rewritten), regenerate b2, re-cut. Open: what the onboarding "week" was.

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

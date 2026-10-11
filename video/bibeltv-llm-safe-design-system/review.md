# bibeltv-llm-safe-design-system — review log

Job-to-be-done: in one minute, show that in a company with no staff designers, a design decision
only holds if the build refuses the alternatives — and that Tobias built the rails that do it.

## Round 1 — 2026-10-11, Gate 1 (script)

Started on Tobias's request ("please start the llm-safe film"). Read first: LEARNINGS.md,
treatment.md, review-gates.md, craft-guide.md, music-direction.md, project-state.md, the study
JSON and its verification logs.

### Treatment check
- Opening move: cold open on the problem, justified by the first line (an assistant may type the
  number, not the token). Frame 1 = the defect beside an identical-looking chip. PASS.
- Every beat has a visual mode. PASS.
- Reuse flagged: Storybook halftone (2) → resolved (3) is one intentional reveal; the chip (1)
  and the `SuggestionChip.tsx` path in the refusal output (4) are a deliberate callback. PASS.

### Concreteness pass
- **B1 had no stake (v0).** It said what goes wrong but not why it matters. The study's mechanism:
  an off-system change "looks fine in a screenshot and fails six months later when the palette
  moves". Fixed without words: a wordless diagram at the end of B1, token 16 → 24, only the bound
  chip follows. FIXED.
- **B5 ran on a label (v0: "Matching numbers are not a matching decision").** Replaced with the
  concrete story from the study's own section: his check once matched a twelve-pixel font to an
  unrelated token. FIXED.
- **Hook as a skeptical viewer.** "It may type the number, not the token" could read as trivial.
  The card ("Same pixels. Wrong code.") plus the 16 → 24 divergence carries the stakes. PASS, but
  watch it in the storyboard: if the divergence is not legible in ~2s, the hook is thin.
- **Close** from the study's own hook (the independent reviewer question), not the twelve-pixel
  question, because the film already tells that story. PASS.

### Structure / sentences / voice-safe
- First spoken sentence is about the user (the person asking). PASS.
- Terms: "token" is not defined in words. The B1 visual defines it (a named variable replacing a
  number). Design leaders know it; a recruiter gets it from the picture. Accepted, noted.
- No beat restates another: B4 shows suggestions working, B5 tells why they are constrained and
  why silence is allowed. PASS.
- Certainty check: "It may type" (possibility, not claim); "Claude gets a closed list" (true: the
  vocabulary tool exists and is what the assistant reads). PASS.
- Voice-safe: no stress-dependent lines; "not the token" is a plain contrast. PASS.
- Correction during drafting: v0's hook said an invented token "renders the same". False: a
  missing var() voids the declaration. Only the hardcoded 16 is pixel-identical (16px token in all
  eight blocks, logged). The invented token moved to the proof beat.

### Facts
Per line in script.md "Sources". Everything traces to the study JSON or the 2026-10-11 capture
log and its addendum. Not claimed: the prototype-to-PR path (designed, not live), any count.
The staged change is labeled as staged on screen.

### check_video.py --strict
0 FAIL, 0 WARN, 4 PASS — 95 words, ~30% voice-free (at the floor; first line to cut if the clone
runs slow: B3's "Storybook became the reference." The card already says it).

### Adversarial read — what would make a director wince
1. **30% voice-free is the floor.** The B4 2s silence and the wordless B1 diagram are the only real
   air. If the voice lands at 2.5 wps it's fine; slower and B3 loses its first sentence.
2. **B5 is the densest line** (concept + story in 9s). Needs the diagram to do half the work.
3. **B6 then B7 are both short lines on typographic frames.** Risk of the end feeling like two
   closing cards. Mitigation in picture: B6 holds on the refusal terminal fading to the line, so
   it lands on evidence, not a blank.
4. **No human in the film.** Deliberate: the study is about a system replacing a missing person.
   Recorded as a choice, not a gap.

### Assets needed
- B1 chip render — have (`assets/capture/suggestion-chip-{light,dark}.png`); staged diff — have.
- B3 Storybook — have; token names — have (`token-vocabulary.txt`, real tool output).
- B4 refusal outputs — have, verbatim (`check-*-output.txt`).
- B5 diagram — built in kit; no asset needed.
- Nothing blocking.

**Gate 1: passed. Waiting on Tobias: go on the script, and a budget cap (proposing $5: voice
≈$0.40 + bed, same as the other films).**

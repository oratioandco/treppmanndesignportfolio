# bibeltv-ai-prototyping — review

## Gate 1 — script (2026-10-05)

### Checker

```
python3 engine/bin/check_video.py --project <portfolio>/video/bibeltv-ai-prototyping --strict

WARN  length           root duration 64.0s over the 60s target
PASS  first-sentence   ""
PASS  pronoun          beats 3/4 — narrator is Tobias's own clone
PASS  voice-free(est)  101 words ≈ 44s speech → 31% voice-free at 2.3 wps

0 FAIL, 1 WARN, 5 PASS
```

The one WARN is accepted and deliberate: at the checker's conservative 2.3 wps estimate, 101
narration words need ≥ 63.4s of runtime to keep voice-free ≥ 30%. The proof beat's two numbers
alone are 12 words; cutting to a 60s film would mean dropping a claim. At the clone's real pace
(~2.9 wps, ninox r18 calibration) this script is ~35s of speech → ~45% voice-free, so the film
will breathe more than the estimate suggests. **Re-check with real clip durations at Gate 3** —
the est path disappears once clips exist.

### Adversarial read (mine, not delegated — LEARNINGS #26)

**Claims against the study JSON, line by line:**

- *"A spec can say a gradient should feel premium"* — the study's own example ("a spec can say a
  gradient should feel premium, but it cannot show…"). Verbatim framing, safe.
- *"banding on older Android"* — study: "older Android screens, which is where most of our users
  actually are, tend to band on that kind of gradient". "Older" kept — it is the qualifier; a
  bare "on Android" would overclaim the platform. The "most of our users" part is dropped, not
  contradicted — fine for a 60s film, and it is on the study page for the curious.
- *"an API I built myself"* — singular, matching "I stood up a custom API myself". My first draft
  said "APIs" (plural), lifted from the study's headline phrase "real and self-built APIs" while
  the narrative describes one custom API. **Composite-claims discipline caught it before the
  checker could** — plural would have implied a body of APIs that the narrative doesn't
  corroborate.
- *"91.8 percent of the design tokens. 94 percent of the data model."* — study: "91.8% of the
  design-token fields and 94% of the core Kotlin data model, verified field by field". The
  narration compresses "design-token fields" → "design tokens"; the card keeps the full "91.8%
  design-token fields". The "verified field by field" qualifier travels on the card, under the
  numbers, never dropped.
- *"Their estimate: a lot, if not the majority, ships."* — attributed to engineering, exactly as
  Jannis framed it ("his own estimate, not something I've measured myself"). The hedge travels
  with the fact: it lives on a quote card labeled `quote:` with "appbase engineering" beneath,
  and the narrator's verb is "Their estimate" — attribution, not assertion. Narrator never says
  it as measured. ✓
- *"The web build fought the phone"* — compression of the study's "the mobile browser's own
  chrome was reason enough to rebuild natively". The close hook of the study itself uses this
  framing, so the film is quoting the source's own rhetoric. Safe.
- Company naming: Bibel TV never named; appbase only on the quote card as attribution. ✓

**Beats repeating known information / structure:**

- Beat 1 (what a spec *can* do) → beat 2 (what it can't) is a progression, not a repeat. Cards
  differ in kind: beat 1 abstract ("What specs can't tell you"), beat 2 concrete ("Android
  bands. Chrome eats.").
- Beat 3's card is "Handoff: a running prototype" while the voice says "something that already
  runs" — complement, not caption (checker agrees: no caption WARN).
- Cover states the thesis ("Specs are lossy" — the study's own reflection). I considered whether
  this spends the ending: it doesn't, because the film is *evidence for* the thesis, not a
  mystery about it, and the close teases different material (why the rebuild, how much ships).

**Sentences implying certainty where the fact is a choice:**

- "The prototype went native Kotlin" — the move to native was a decision, and "went" states it
  as an event. The study supports the framing (real problems → continued natively), and beat 5's
  card "Same prototype, different body" carries the decision aspect. Accepted.
- "The shipped app proves it" — backed by a field-by-field teardown, the strongest evidence
  class in the study. Not an overclaim.

**Risky-word scan:** no RISKY-list words in any line. First-person "I" appears only with the
clone declaration in the Brief. First narration sentence opens on the spec, not the author. ✓

**Open craft risks (for Gate 2, not script fixes):**

1. Beat 2 is a drawn diagram of browser chrome — it must not read as a faked screenshot. Draw it
   obviously schematic (stroke-drawn frame, labeled bar).
2. Beat 6's count-up must land both numbers before 46.0s with reading hold to spare; if the
   count-up animation eats the hold, hold the final cards longer and start the count at 34.5.
3. The cover title "Specs are lossy" does double duty as the poster frame — confirm at Gate 4
   that the poster frame is the settled title state, not mid-crossfade.

### Assets needed

| Beat | What's missing | Fix | Ship without? |
|---|---|---|---|
| 1 | — | Gradient banding gag composed typographically (CSS gradient → banding steps). No asset. | ✓ ships |
| 2 | No real capture of the browser-chrome problem exists (nobody screenshotted the failure) | Drawn schematic diagram in the composition — honest, treatment forbids faking a screenshot | ✓ ships |
| 3 | Real web-prototype device footage | Candidates: `product-ads/bibeltv-redesign/captures/proto-phone/`, `proto-tablet/` (real captures of this same prototype, from the ad project). **Blocked on Tobias's cross-project reuse confirmation** (state.json open question) | ✗ blocked — beat 3 is the turn; without footage it degrades to typographic and the film loses its best moment |
| 4 | — | Stroke-drawn three-node diagram. No asset. | ✓ ships |
| 5 | Native Kotlin build footage — **may not exist at all.** The product-ads captures are of the *web* prototype; whether any screen recording of the native build exists is unknown | Ask Tobias: does a native-build capture exist (device or emulator)? If not: capture one, or beat 5 falls back to the same footage as beat 3 with a "native" visual treatment — weaker, flag it | ⚠ ships degraded |
| 6–8 | — | Typographic. No asset. | ✓ ships |

For the case-study text itself: no missing-evidence gap found — the study's numbers (91.8 / 94)
carry their verification method inline.

### Verdict

Script passes Gate 1. Waiting on Tobias: (1) go on this script, (2) budget cap for voice + bed
(state.json `approved_max` is 0 and every paid call hard-fails), (3) product-ads capture reuse,
(4) whether any native-Kotlin capture exists for beat 5.

## Tobias's decisions (2026-10-06, in words — logged same session)

1. **Script: YES.** Gate 1 passed; the script is the film's script. Any wording change from
   here on is a dated entry in this file.
2. **Budget cap: not sure — still unset.** `approved_max` stays 0 and voice/bed remain
   hard-blocked. Proposed to Tobias same day: **cap $5** (the film needs ~10 clone TTS
   clips ≈ 102 words — well under $1 even with redos — plus one or two Lyria bed takes at
   cents per request; $5 is generous headroom). Waits on a number in words from him.
3. **product-ads capture reuse: OK.** Beat 3 may use
   `product-ads/bibeltv-redesign/captures/proto-phone/` (+ `proto-tablet/`).
4. **Native Kotlin: exists — but no recording of it yet.** Per Tobias, the native build is
   ONLY the new-design prototype, and it lives in the ProtoBible repo
   (`~/Developer/StudioProjects/ProtoBible`, `packages/android`, installable APKs in
   `exports/`). Repo inspected 2026-10-06: **no mp4/mov anywhere** — beat 5 needs a capture
   run (emulator or device) before its footage exists. Recorded with the scope qualifier in
   `my-cv-tailor/data/verification-log/2026-10-06-bibeltv-native-build-and-strategy-deck.md`.

**Context, not claims:** Tobias also pointed at `~/Downloads/Online Design Strategy.pdf`
(his Bibel APP strategy deck, 30.10.2025) as background on the new design's vision. Client
confidential — read for context only; nothing from it enters the film or any public output.
The study JSON stays the only claim source.

### What unblocks next

- **Now (no money):** Gate 2 — build scenes into index.html against the beat table; beat 3
  wired from the product-ads captures; beat 5 built but pending its capture.
- **Blocked on the cap:** voice (Gate 2's timing table wants measured clip durations first —
  the 2.3-wps estimate retires once real clips exist), then bed.
- **Blocked on a capture run:** beat 5 footage (ask: emulator OK, or does he record a device?).

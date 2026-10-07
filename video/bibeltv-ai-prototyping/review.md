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

## Budget cap set (2026-10-06, second answer in words)

Tobias: *"let's do $5 cap"*. **`budget.approved_max` = 5 USD**, logged same session. Covers the
voice (~102 clone words ≈ pennies even with redos) and the Lyria bed. Any spend above $5
hard-fails again until a new number is agreed in words.

Same message: *"you do the emulator, but also there is a pixel phone connected you can use"* —
beat-5 capture is mine to make, real Pixel device preferred over the emulator (sharper render).
APK of record: `ProtoBible/exports/ProtoBible-Neues-Design-Home-Screen v4.3.apk` (home-screen
build, matching the beat's card).

## Beat-5 capture (2026-10-06, done)

Recorded on Tobias's Pixel 8 Pro via adb (`39201FDJG000F8`, streamed install of the v4.3 APK,
versionName 0.012). Two files in `assets/native/`:

- `protobible-home-pixel8pro.mp4` — 22s static hold on the home screen (take 1).
- `protobible-tabs-take3-pixel8pro.mp4` — 22s interaction: Home → Mediathek → Live TV (live
  player + channel chips) → Programm (schedule, date chips). **Beat-5 primary.**

Both carry the system status bar and bottom nav — the composition crops them (same treatment
the product-ads clean-clip pipeline applied to beat 3's footage).

**One question for Tobias, open at Gate 2:** the capture shows the app with live real content —
including the "God Friendled Me" series promo card and (on Live TV/Programm) broadcast imagery.
The film's company rule says Bibel TV is never *named*; showing the app's own UI with its real
content is inherent to showing the prototype, but third-party series artwork and broadcast
frames in a public portfolio film is his call, not mine. If he wants it clean, the fix is
dismissing the promo card (the ✕ is at uiautomator (960,359) device px) and re-recording —
cheap. **Answered 2026-10-07 in words: ship as-is — "no also commit the videos so they are
live in the case study."** The mp4s are committed; content question closed.

## Gate 2 — composition (2026-10-07)

`index.html` built to the approved beat table: 8 scenes + cover + close, 64.0s root, house
conventions from ninox (GSAP timeline on `window.__timelines["main"]`, mulberry32 seed, dot
field + halftone screens, film-grain overlay, Redaction grade-morph sets).

### Evidence

30 snapshots (beats + transition midpoints) → `snapshots/contact-sheet-{1..4}.jpg`, reviewed
frame by frame against the script. Checker:

```
python3 engine/bin/check_video.py --project video/bibeltv-ai-prototyping --strict
0 FAIL, 1 WARN, 5 PASS   (WARN = 64s length, same accepted WARN as Gate 1)
```

**Bug found and fixed during verification:** first snapshot pass showed only the static cover on
all 30 frames. Console probe via hyperframes' bundled puppeteer-core showed
`TypeError: p.getTotalLength is not a function` — the stroke-draw prep targeted a `<g>` wrapper,
which has no `getTotalLength`. Fixed by putting `#ph-frame` on the `<rect>` itself. Second
probe error (`Cannot set properties of undefined`) is a bare-Chrome artifact — `window.__timelines`
only exists under the hyperframes runtime.

### Frame-by-frame findings

| Beat | Frames | Verdict |
|---|---|---|
| Cover | 1.8 | settled title; doubles as poster state |
| 1 problem | 2.75, 5.5, 6.8, 8.45 | card + gradient draw; smooth at 6.8 is correct (bands step 6.85/7.15); banded + "what ships" by 8.45 |
| 2 breaks | 10.5–14.9 | schematic reads as drawn (stroke frame, "DRAWN · NOT A SCREENSHOT" caption, labeled bars); circle draw completes 14.9 — **Gate-1 risk #1 closed** |
| 3 handoff | 15.8, 18, 20.5 | halftone resolves; footage plays chips → typed query → answer card; status bar cropped |
| 4 build | 23, 25.5, 26.6, 27.4 | nodes → connectors → API pulse → loop + "one working loop" |
| 5 rebuild | 29, 31 | native footage tilted (rotationY 26→−10 entrance + drift), halftone, status bar + bottom nav cropped |
| 6 proof | 35, 37.5, 40, 45.9 | count-ups mid-flight (46.6%, 87%); both landed + "verified field by field", holding to 45.9 — **Gate-1 risk #2 closed** |
| 7 quote | 48, 52, 54.4 | quote + attribution on card |
| 8 close | 56, 60, 63.8 | dot takeover, title, url, clean fade |

**Accepted, recorded:** at 21.4s and 33.4s the device screens read dark — the video element at/
past its media end inside the zoom-through-out, under 0.3s mid-transition. Not re-timed.

### Mute pass (reasoned, per checklist)

Cards alone tell the story: cover thesis → spec card with banded gradient → drawn phone with
banding + chrome bar → running prototype on device → prototype→API→content loop → native
Kotlin on device → 91.8% / 94% verified field by field → engineering quote → title. Every beat
carries its claim visually; narration adds argument, not information the eye lacks.

### Card + hold audit

Hero headlines ≤6 words (5/4/4/4/4/3), support text ≤12 per card; every headline holds ≥ its
scene minus entrances (min ≈2.5s at beat 6's landed numbers — over the 1.5s floor); grade morph
on the metric numbers completes 38.9, before the hold ends. One ambient motion per scene (device
float in 3/5, nothing looping elsewhere); 3 transition types total (blur crossfade, zoom-through,
dot takeover). Squint test: each beat has one dominant readable element.

### Verdict

Gate 2 **passed** (0 FAIL; the 64s WARN carries from Gate 1 and retires at Gate 3 when measured
clip durations replace the 2.3-wps estimate). Next: voice — one clone clip per beat, measure all,
build the timing table, re-anchor cues via transcribe, then bed.

## Voice round + cue re-anchor (2026-10-07)

### Voice clips

8 clone clips (voice kMS8f1BmXMghbv2jguJo — Tobias's clone, per LEARNINGS), texts verbatim from
the approved script's narration lines. Total spend **$0.34** (8 × ElevenLabs entries in
`state.json` budget). Measured durations:

| Clip | dur | data-start | key word anchors (from b{n}-r1.mp3.words.json, whisper small.en) |
|---|---|---|---|
| b1-r1 | 2.56 | 2.50 | "premium" ends 5.00 |
| b2-r1 | 5.12 | 8.50 | "banding" 9.51–10.16, "browser" 12.56, "eats" ends 13.47 |
| b3-r1 | 4.56 | 15.00 | "I handed" 17.48, "runs" ends 19.26 |
| b4-r1 | 4.80 | 21.50 | "API" 24.75–25.14, "myself" ends 25.96 |
| b5-r1 | 3.85 | 27.50 | "native" 30.46, "Kotlin" ends 31.30 |
| b6-r1 | 6.80 | 33.50 | "91.8%" 35.45–36.98, "94%" 38.70–39.42, "data model" ends 40.22 |
| b7-r1 | 6.10 | 46.00 | "a lot" 49.21, "majority" ends 51.15, "ships" ends 51.92 |
| b8-r1 | 4.48 | 54.50 | "get in touch" 57.59–58.84 |

`fit` chain measured + asserted (atempo ceiling 1.08 respected — no clip needed speeding).
`check-audio`: **PASS 8 clips, root 64.0s, 0 warn** (after bumping three data-durations to give
the ≥0.15s hard / ≥0.2s comfort pads).

### Cue re-anchoring

The Gate 2 composition ran on the 2.3-wps *estimate*. All speech-synced cues re-anchored to the
whisper word timestamps above (each edit carries an inline comment citing its words.json anchor —
never arithmetic, per the LEARNINGS rule that cost ninox round 5 a second of drift). Largest moves:
beat-3 halftone dissolve 16.35→**18.50** (reveal lands on "already runs"); beat-5 dissolve
28.85→**30.30**; count-up cards 34.60→**35.45** / 36.50→**38.70** (each lands just after its
number is spoken); quote 46.80→**48.90**, attribution 48.20→**51.95**, url 56.00→**57.55**.
The beat-3/5 halftone *swells* did not move — treatment rule holds: dots cover the product until
the line that earns it.

### Re-anchor verification

16 snapshots at the new cue times (4.5→58.0), reviewed frame by frame: all correct — circle
mid-draw at 14.2, dots covering both devices with footage hidden until their reveal lines,
footage revealed at 19.2/31.0, API pulse on "API", count-ups mid-flight *while spoken* and landed
with the qualifier by 42.0, quote + attribution + url all landing on their words. Zero defects.

Voice-free reality: 38.2s measured speech / 64.0s ≈ **40% voice-free** — the Gate-1 estimate WARN
(2.3 wps → 31%) retires here.

### Audio wired

`<audio>` block (track 20) in index.html: vo-b1..vo-b8 at the data-starts above, data-duration =
file + ≥0.15s pad, data-volume 1. Ducking/bed next (Gate 3 continues).

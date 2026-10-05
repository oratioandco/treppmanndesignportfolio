# bibeltv-ai-prototyping — film script

## Brief

- **Study:** `data/case-studies/bibeltv-ai-prototyping.json` — the ONLY claim source. Confidential: false.
- **Audience / role family:** master cut (AI-first product design + design-engineering roles).
- **Narrator:** Tobias's own ElevenLabs clone, voice ID `kMS8f1BmXMghbv2jguJo` (house narrator
  since 2026-09-18). This declaration is what makes first-person "I" legitimate — the film is his
  own practice, in his own voice.
- **Company naming:** Bibel TV is never named in the film. appbase may be attributed as the
  engineering agency on the quote card (external verification carries the beat).
- **Target length:** 64s (hard ceiling 65s; WARN >60s accepted — see review.md). ~102 narration
  words. Gate 1 has no clips yet, so `check_video.py` estimates speech at a conservative 2.3 wps:
  102 words ≈ 44.4s → 30.7% voice-free ≥ the 30% floor. At the clone's real ~2.9 wps this is
  ~35s speech → ~45% voice-free, so the estimate failing short would mean real trouble, not
  pedantry.
- **Music mood** (`music-direction.md`, Bibel TV design-system row): bright, precise,
  playful-technical, ~108–112 BPM, crisper blips; LLM-safe/methodical phrasing allowed for the
  spec opening.
- **Claims used:** spec lossiness (incl. gradient-banding and browser-chrome examples — the
  study's own two), Claude Code prototype on real data, custom API where production API lacked,
  native Kotlin/Jetpack Compose continuation, teardown 91.8% token fields / 94% core data model
  verified field by field, Jannis at appbase "a lot, if not the majority" (his estimate, hedged —
  stays on a quote card, never asserted by the narrator as measured), engineering decides
  keep/change/rebuild.

## Treatment

**The one claim the film argues:** a prototype that already runs is a better handoff than a spec,
and the shipped app proves it — the tokens and data model Tobias wrote are the ones in production.

**Opening move: cold open on the problem.** The opening narration line is about what a spec cannot
do — so the first visual is the spec's failure, not the product. A gradient "premium" line bands
and breaks on screen; the browser-chrome bar eats a phone frame. The product is earned at beat 3
of 8, inside the first third: the device resolves with the prototype already running. Opening
product-first would repeat the ChurchDesk round-1 failure in mirror image (solution-picture under
problem-voice) — here the mirror is problem-picture under solution-voice, and the opening line is
not about the product.

**Arc** (problem → tension → turn → method → complication → proof → endorsement → close):

1. **Hook (problem, typographic).** A spec card on paper; its "premium gradient" line renders,
   then visibly bands into stripes — the study's own example, shown not told.
2. **Tension (typographic/diagram).** The second lossiness the study names: a phone frame where
   the browser's own chrome eats the viewport before the layout starts. Two failures, both from
   the study's own narrative; no product yet.
3. **Turn (footage).** "…handed them something that already runs." The real prototype resolves
   onto the device — halftone resolve into live capture. This is the beat the film exists for;
   nothing before it has shown the product, nothing after it argues without it.
4. **Method (diagram).** Stroke-drawn: prototype ↔ custom API ↔ real content. The custom-API
   claim has no screenshot and is a mechanism — diagram, not footage (treatment.md rule:
   mechanism = diagram).
5. **Complication → answer (footage).** Web build fighting the phone → the same prototype
   continues as a native Kotlin app. Device tilt on the native build. The close hook's first half
   set up here, paid off at the close.
6. **Proof (typographic).** The money beat. Two metric cards, one line each: 91.8% /
   94%, with "verified field by field" as the qualifier line — the qualifier travels with the
   number (composite-claims discipline).
7. **Endorsement (quote card).** "a lot, if not the majority" — appbase engineering. The hedge
   stays visible on the card; the narrator attributes, never asserts it as measured.
8. **Close (quiet title).** The study's own closing hook, trimmed, in the voice; card is plain
   title + URL (standing policy: the tease lives in the voice).

**Visual mode per beat:** 1 typographic · 2 diagram · 3 footage · 4 diagram · 5 footage ·
6 typographic · 7 typographic (quote) · 8 typographic.

**Asset reuse:** beats 3 and 5 both want device footage of the same prototype — intentional
(callback: web problem → native answer), different captures (proto-phone web vs. native build),
not the same clip twice. Pending Tobias's confirmation that product-ads captures may be reused
in the portfolio film.

**Beats to hold on text** (reading hold ≥ 1s + 0.35s/word): the two metric cards and the quote
card carry the longest holds; the beat t-spans already reserve that silence (beat 6 is 12.5s for
18 spoken words, beat 7 is 8.5s for 14), so no `[silence]` markers are needed in the table — the
checker would otherwise count them as words.

## Beats

| # | t | On screen | Narration | Visual |
|---|---|-----------|-----------|--------|
| 0 | 0.0–2.5 | kicker: AI-native prototyping · title: Specs are lossy · sub: treppmann.design |  | Cover card, static hold, blur-crossfade out (doubles as poster) |
| 1 | 2.5–8.5 | card: What specs can't tell you | A spec can say a gradient should feel premium. | Typographic — spec card; its gradient line renders, then bands into stripes |
| 2 | 8.5–15.0 | card: Android bands. Chrome eats. | It can't show banding on older Android. Or the screen a browser eats. | Diagram — phone frame; browser-chrome bar slides over the viewport; banding stripes on the edge |
| 3 | 15.0–21.5 | card: Handoff: a running prototype | I stopped handing engineering a spec. I handed them something that already runs. | Footage — real prototype capture resolves onto the device (halftone resolve) |
| 4 | 21.5–27.5 | card: From brief to build | Prototyped in Claude Code, real content — an API I built myself. | Diagram — prototype ↔ custom API ↔ content, stroke-drawn |
| 5 | 27.5–33.5 | card: Same prototype, different body | The web build fought the phone. The prototype went native Kotlin. | Footage — device tilt into the native Jetpack Compose build |
| 6 | 33.5–46.0 | 91.8% design-token fields · 94% core data model · verified field by field | The shipped app proves it: 91.8 percent of the design tokens. 94 percent of the data model. | Typographic — two metric cards, count-up, qualifier line beneath |
| 7 | 46.0–54.5 | quote: "a lot, if not the majority" · appbase engineering | Engineering decides what to keep. Their estimate: a lot, if not the majority, ships. | Typographic — quote card with attribution; metric-style reveal |
| 8 | 54.5–64.0 | title: Specs are lossy · sub: treppmann.design | Why a browser forced a rebuild? How much ships? Get in touch. | Quiet title card, URL only |

## Sources

- Study JSON: `data/case-studies/bibeltv-ai-prototyping.json` (all claims; close hook trimmed
  from `key-takeaway`).
- Footage candidates (pending Tobias's confirmation): `product-ads/bibeltv-redesign/captures/`
  (proto-phone, proto-tablet) and `product-ads/bibeltv-redesign/assets/ui/*.mp4` — real captures
  of the same prototype, from the ad project, not the portfolio.
- Diagram source for beat 4: `data/projects/bibelv-design-token-sync.md` architecture sketch as
  reference only; the film draws a simpler three-node version (prototype / custom API / content).
- No generated illustration planned. The browser-chrome beat (2) is drawn as a diagram in the
  composition (a device frame with a chrome bar), not a generated image — nothing is faked as a
  screenshot.

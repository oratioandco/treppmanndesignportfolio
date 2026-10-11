# An LLM-safe design system — clip script (v1, target ~60s)

## Treatment

- **Audience**: master cut (design-systems leads, design leaders, AI-first product roles).
- **The one claim**: in a company with no staff designers, a design decision only holds if the
  build refuses the alternatives. Tobias moved the rules out of documents and review and into
  Storybook, a closed token vocabulary and checks that fail the build.
- **Opening move: cold open on the problem.** The first line is about the pain: an assistant
  asked for rounder cards may type the number instead of the token, and nothing on screen changes.
  Frame 1 shows that defect (the code line beside an identical-looking chip), not the system that
  catches it. The system is earned at beat 3 (turn) and shown working at beat 4, inside the first
  two thirds.
- **Arc**: problem (wrong code, right pixels) → tension (no designers, so nobody notices in
  review) → turn (Storybook as the reference, a closed vocabulary for Claude) → proof (the checks
  refuse both off-system lines, by name and with real tokens) → insight (a matching number is not
  a matching decision; silence beats a wrong hint) → outcome (design authority lives in what the
  build refuses) → close (study's own hook).
- **The turn** is beat 3: the rules move from paper into the system.
- **Visual mode per beat**
  1. `diagram` + `screenshot` — typed code line in a fixed left box: `borderRadius: 16` replacing
     `var(--btv-component-suggestion-chip-corner-radius)` (`assets/capture/staged-diff.txt`), beside
     the real SuggestionChip render (`suggestion-chip-light.png`). Marker circle draws on `16`.
     Card: "Same pixels. Wrong code." Then, wordless (`diagram`): two chips, one bound to the token,
     one hardcoded; the token value ticks 16 → 24 and only the bound chip follows. This is the
     stake the voice does not spend words on: the off-system card falls behind when the system moves.
  2. `typographic` — "Product managers shape the features." over a **halftone** of the Storybook screenshot that
     will resolve in beat 3 (intentional: the dots become the answer).
  3. `screenshot` — halftone resolves into `llm-safe-storybook.png` in a **tilted device**; then a
     column of real token names scrolls from `token-vocabulary.txt` (the closed list). Card:
     "Storybook, not Figma." / "A closed list of names".
  4. `screenshot` (money shot, **≥70% frame width**) — terminal frame, the two real FAIL outputs
     (`check-vars-output.txt`, `check-literals-output.txt`) typed in line by line; marker on the
     invented token name, then on the three suggested tokens. Small label: "Staged change · real
     checks". Card: "Six checks · locally and in CI".
  5. `diagram` — `font-size: 12` → a 12px token from another family drawn, struck through; the
     suggestion slot left empty. Card: "12 px ≠ 12 px".
  6. `typographic` — "Everything else is advice."
  7. `typographic` — dot takeover close, title + treppmann.design.
- **Reuse**: the Storybook screenshot appears as halftone (2) and resolved (3): intentional, one
  continuous reveal. The SuggestionChip appears only in 1; beat 4's output names the same file
  (`SuggestionChip.tsx`), a deliberate callback the viewer can see.
- **Length**: ~59s + 0.4s cover. Mood: calm, methodical, quietly clever (music-direction row
  "LLM-safe design system"), ~96 BPM, ticks and clicks as the pulse.

## Brief
- Voice: Tobias Treppmann's own ElevenLabs clone `kMS8f1BmXMghbv2jguJo` (eleven_v3). First person
  is his own work.
- Music: house family, LLM-safe mood line per `music-direction.md`; lift at beat 3, settle at 6.

## Beats

| # | t (s) | On screen | Narration | Visual |
|---|---|---|---|---|
| 0 | 0.0–0.4 | Cover: Bibel TV · Design system · 2026 / An LLM-safe design system / A company with no staff designers. | — | Settled title card, held, dissolves into S1. |
| 1 | 0.4–8.0 | borderRadius: 16 / Same pixels. Wrong code. | Ask an assistant for rounder cards. It may type the number, not the token. | Code line typed beside the real chip; marker circle on 16. Then two chips side by side, bound and hardcoded: the token ticks 16 → 24, the bound chip rounds further, the hardcoded one stays. |
| 2 | 8.0–14.5 | Product managers shape the features. | Bibel TV has no staff designers. Rules on paper need someone to notice. | Halftone of the Storybook screen behind the card. |
| 3 | 14.5–23.0 | Storybook, not Figma. / A closed list of names | Storybook became the reference. Claude gets a closed list of tokens. | Halftone resolves into Storybook in a tilted device; real token names scroll. |
| 4 | 23.0–36.5 | Six checks · locally and in CI / Staged change · real checks | [silence 2s] An invented token is refused by name. A hardcoded sixteen gets real tokens back. | Money shot: terminal, the two real FAIL outputs typed in, markers on the names, ≥70% width. |
| 5 | 36.5–45.5 | 12 px ≠ 12 px | My check once matched a twelve-pixel font to an unrelated token. Now, if nothing fits, it stays silent. | Diagram: same-value token from another family struck through; empty suggestion slot. |
| 6 | 45.5–51.5 | Everything else is advice. | Design authority lives in whatever the build refuses. | Typographic, one line. |
| 7 | 51.5–59.4 | Case study · An LLM-safe design system · treppmann.design | Why did I ask a reviewer to disprove every audit finding? Get in touch. | Dot takeover, title, fade. |

Words: 95. Estimated speech at 2.3 wps ≈ 41s of 59.4s (~30% voice-free, at the floor); the clone measured ~2.5 wps on prior films.

## Sources (every claim traced)
- B1 diagram (16 → 24, only the bound chip follows) — §"What it enables": *"a silent off-system
  change that looks fine in a screenshot and fails six months later when the palette moves"*. A
  demonstration of the mechanism, built in the kit, not a recorded event.
- B1 "rounder cards" — study §"What it enables": *"describe what they want, make the cards
  rounder"*. "It may type the number, not the token" — study §"The system could not depend on
  Figma expertise": *"a plausible Claude result could invent a token or hardcode a value and still
  compile and render."* Card "Same pixels" — the staged `borderRadius: 16` equals the bound token
  (16px in all eight theme/device blocks): `data/verification-log/2026-10-11-llm-safe-check-refusal-capture.md`
  (addendum). The pictured change is staged; beat 4's label says so.
- B2 "no staff designers" — study: *"Bibel TV has no on-staff designers"*; card "Product managers shape the features" — *"product managers and product owners shape new features and interface changes"*. "Rules on paper need
  someone to notice" — outcome metric "Enforcement", before: *"A written convention, dependent on
  someone noticing in review"*.
- B3 "Storybook the reference" — study: *"Storybook had to become the inspectable source of
  truth"*; card "Storybook, not Figma" — closing hook *"Why did Storybook, not Figma, have to
  become the source of truth?"*. "a closed list of tokens" — *"Claude had to work inside a closed
  vocabulary"*; process: *"Claude works from the valid token vocabulary instead of recalling
  names."* Scrolling names: real output of `list_token_vocabulary` (same log, addendum); the count
  is not shown as a number.
- B4 "refused by name" / "gets real tokens back" — the two real FAIL outputs, 2026-10-11 capture
  log; study outcome: *"The invented token is refused by name. The hardcoded 16 is refused with three
  real tokens to use instead"*. Card "Six checks · locally and in CI" — *"Six checks run locally and
  in CI"*.
- B5 "My check once matched a twelve-pixel font to an unrelated token" — §"Twelve
  pixels is not twelve pixels": *"It was looking at a font size of 12px. It found a primitive or
  semantic token holding exactly 12px and offered it as the alias"*, *"coupling the typography to
  an unrelated design decision"*, *"I'd written that suggestion engine an hour earlier"*. "if
  nothing fits, it stays silent" — *"Where nothing qualifies, the check says nothing at all."*
- B6 — §"Where design authority lives": *"It lives in whatever the build refuses. Everything else
  is advice."*
- B7 — study close, trimmed: *"Why did I ask an independent reviewer to try to disprove every audit
  finding?"* … *"Get in touch."*

## Claim limits honoured
- The path from prototype to pull request is designed, not live (study: "is designed to"; Tobias,
  2026-09-01). The film claims only what is live: Storybook, the closed vocabulary, the six checks.
- The pictured change is staged for the film and labeled so; no claim that a PM made it.
- No component count, no token count, no adoption metric in voice or cards.

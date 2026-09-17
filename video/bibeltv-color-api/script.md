# BibelTV color API — clip script (v1, target ~55s)

## Brief
- Audience: master cut (design leaders / recruiters).
- Claim: color extraction looks like an engineering utility, but the choices inside it are brand
  decisions — so design kept ownership, and that discipline is what lets a two-person team theme
  ten thousand videos without ever hand-picking a color.
- Proof image: `color-lab-applied.png` — the same artwork, dark mode and light mode side by side,
  both reading warm and on-brand. The single shot that proves the claim without a word of text.
- Arc: scale problem (no one to hand-pick 10,000+ themes) → the obvious tool wasn't enough (the
  study's own quote) → the decision (design keeps the dials, not engineering) → proof (both modes
  land) → outcome (ships live, clears contrast automatically) → the restraint close (built
  multi-tone, shipped one color on phones, on purpose).
- Length target: 50–55s + 0.4s cover. Mood: bright, precise, quietly confident — a craft story
  about taste with math underneath, not a spectacle piece.
- Voice: ElevenLabs eleven_v3, voice `FLj50PrMa40MhGHappOt`, fitted at atempo 0.93.
- Music: Lyria 3.5, house family, BibelTV mood line per music-direction.md: bright, precise,
  playful-technical, ~108–112 BPM, crisper digital blips a little more present than the Ninox bed.

## Beats

| # | t (s) | On screen | Narration | Visual |
|---|---|---|---|---|
| 0 | 0.0–0.4 | Cover: kicker / A color engine that automates what bigger streamers do by hand / Ten thousand videos. One color engine. | — | Settled title card, held, dissolves into S1. |
| 1 | 0.4–9.3 | Kicker: Bibel TV · Color API · 2025 / title / Ten thousand videos. One color engine. | Bibel TV publishes ten thousand videos. Each one needs its own color theme. There's no one to pick them by hand. | Product on frame 1: `color-lab.png` (the dials panel) in a tilted device beside the title. |
| 2 | 9.3–19.7 | The obvious answer / "Some cards demanded the page. Others almost disappeared. The artwork didn't decide which — the RGB math did." | The obvious tool already existed. It extracted palettes automatically. But automated wasn't the same as right. | Device holds, dimmed; the study's own callout quote resolves in as a card — the quoted artefact, exempt from the card-length rule per gate 2. |
| 3 | 19.7–27.1 | The decision / Design kept the thresholds. / Brand calls, not code commits. | So design kept the thresholds — hue ranges, vibrance filters. Brand calls, not code commits. | Zoom into `color-lab.png`'s dial panel (visible sliders) — the claim made concrete. |
| 4 | 27.1–33.5 | Both modes, one artwork. | Every theme is checked against the artwork, then validated for contrast. | Money shot: `color-lab-applied.png`, dark and light mode side by side, full width, held longest. |
| 5 | 33.5–42.5 | The outcome / Live, on every video. / Every theme clears contrast — nobody checks by hand. | It ships live, on every video in the library. Every theme clears contrast. Nobody checks by hand. | Device: the applied comparison holds, one line of outcome text. |
| 6 | 42.5–50.9 | On phones, it goes quiet. / One color, not two. | On phones, the engine goes quiet — one color, not two. Sometimes the decision is not to use what you built. | Typographic beat, no screenshot — the reflection line stands alone, the film's real closing thought. |
| 7 | 50.9–58.5 | Case study · A color engine that automates what bigger streamers do by hand · treppmann.design | Read the full case study on treppmann dot design. | Dot takeover, title, fade. |

Speech (real, measured): n1 7.67s + n2 7.22s + n3 6.95s + n4 4.37s + n5 7.39s + n6 7.73s + n7 2.83s
= 44.16s of 58.5s (24.5% voice-free — WARN band, same accepted precedent as all three other films).

## Voice-safe checks (Gate 1)
- No sentence depends on stress/irony/one short load-bearing word; every line reads flat and lands.
- "OKLCH", "K-means" are not used in narration (jargon with no plain-language payoff in a 50s film);
  the film states what the system does (checks against the artwork, validates contrast), not how.
- First spoken sentence is about the scale problem (ten thousand videos), not the author or company
  achievement.
- Pronouns: no "I"; "design" stands in for the team's decision in beats 3/5 rather than "we", since
  the JSON's own framing is "design owned the infrastructure" as a role, not a first-person claim —
  matches house rule (no "I" is mandatory; "we"/"you" optional, third person permitted).
- No competitor named. No number used anywhere (deliberately — see below).

## Metric decision (per the new attribution rule)
The JSON has a real, usable metric: a concept survey (n=264, 51% light preference) that justified
the light-mode-first decision, and "Contrast compliance: AA/AAA, no manual checking." Both are
things Tobias's own team measured/built, not post-departure adoption numbers — they would clear the
attribution check. Deliberately not used anyway: the reflection line ("sometimes the decision is
not to use what you built") is a stronger, more senior-signal close than a survey percentage, and
one film that trusts a decision over a number is a better answer to "which of these should the film
lead with" than reaching for a number because one exists. "No manual checking" appears as a system
property in beat 5, not as a headline metric.

## Sources (every claim traced)
- "Ten thousand videos... no one to pick them by hand" — subtitle: "too small to hand-pick a theme
  color for 10,000+ videos."
- "The obvious tool already existed... extracts palettes automatically" — narrative: "Bibel TV
  already runs its images through imgix, and imgix ships with a palette-extraction feature."
- Quote: callout, verbatim — "Some cards demanded the page; others almost disappeared. The artwork
  didn't decide which, the RGB math did."
- "Design kept the thresholds... brand calls, not code commits" — narrative "Design owned the
  infrastructure": "Color extraction usually lives with platform engineering. I owned it, because
  the choices inside it — hue thresholds, vibrance filters... — are design decisions"; "Tunable by
  design, not by code": "K-means thresholds, hue-exclusion ranges... all of it lives behind dials in
  the config UI, not behind code commits."
- "Checked against the artwork itself, then validated for contrast" — process steps "Filter for
  character" + "Validate contrast."
- "Ships live, on every video in the library" — outcome metric "Delivery": "Live in production...
  written onto every image in the content library."
- "Clears the accessibility bar, nobody checks by hand" — outcome metric "Contrast compliance:
  Every extracted theme validated at AA or AAA, no manual checking."
- "On phones, the engine goes quiet — one color, not two. Sometimes the decision is not to use what
  you built." — reflection: "The engine can produce complex multi-tone looks. On a phone, the
  simpler output was the better one. Sometimes the decision is to not use what you built."
- Images: `color-lab.png`, `color-lab-applied.png` — both from the study JSON's `outcome.images`
  and `public/images/bibeltv/`.

## Gate exceptions logged
- Beat 2's on-screen quote (17 words) exceeds the 12-word support-card limit, but it is the
  quoted artefact itself — the study's verbatim callout — explicitly exempted by gate 2's own
  wording ("except a quoted artefact"). Same treatment as Ninox's typed prompt and ChurchDesk's
  German quote.
- Beats 0/7's title card (11 words) is the study's own canonical title, used verbatim, not
  authored card copy — not shortened, matching how every other film uses its real title.
- Rate and a few sentence-length WARNs: same accepted-precedent band as prior films.

# Bibel TV metadata extraction — clip script (v1, target ~60s)

## Treatment

- **Audience**: master cut (design leaders, AI-product and design-engineering roles).
- **The one claim**: a timestamp is a product interface. Tobias did the capture work by hand
  first, then built the pipeline that turns a sermon into passage clips that describe themselves.
- **Opening move: cold open on the problem.** The first line is about the pain (a right result
  with a wrong-looking title), so frame 1 shows that mismatch, not the app that fixes it. The
  product is earned at beat 4 (pipeline) and shown at beat 5, inside the first two thirds.
- **Arc**: problem (right sermon, wrong title) → tension (the passage is somewhere inside; a
  timestamp is where playback starts) → turn (he did it by hand first; that set the boundary) →
  mechanism (pipeline reads the transcript; each passage becomes a clip with start, end, title) →
  proof (real recording: tap a verse, the clip plays) → outcome (805 clips / 299 videos, in
  development) → close (study's own hook).
- **The turn** is beat 3: the hand work is what earns the automation.
- **Visual mode per beat**
  1. `typographic` — "Genesis 1" typed, a result card resolves titled "Who is Jesus?", marker
     circle on the title. Built in house type, not a fake app screen.
  2. `diagram` — a sermon as a horizontal timeline; a passage segment draws in with start/end
     ticks; a play-head jumps to the start tick.
  3. `typographic` — the number card over a halftone of a real frame from the sermon footage.
  4. `screenshot` + `diagram` — sanitized n8n workflow (`n8n-sermon-insights-workflow.png`, already
     public) resolves in a tilted device, then explodes into five labels: source video · start · end · title · quote. The quote label draws a line back to the transcript (code cuts it); the other four come from the model's pass.
  5. `footage` — **money shot, ≥70% frame width**: the real screen recording
     (`assets/capture/verse-to-clip-flow.mp4`, 2026-10-11): reader John 3 → verse sheet → clip list
     → player. Device with depth.
  6. `typographic` — two metric lines + "in development" qualifier.
  7. `typographic` — dot takeover close, title + treppmann.design.
- **Reuse**: the sermon footage frame in beat 3's halftone is from the beat 5 recording —
  intentional callback (the same sermon you then see as a clip). No other asset repeats.
- **Length**: 60s incl. 0.4s cover (v3: beat 6 carries more, close tighter). Mood: patient, archival, precise — quieter than the color-api
  film; the bed leaves air for the timeline beat.

## Brief
- Voice: Tobias Treppmann's own ElevenLabs clone `kMS8f1BmXMghbv2jguJo` (eleven_v3). First person
  is his own work.
- Music: house family, Bibel TV mood line per `music-direction.md`, slower than color-api.

## Beats

v3, 2026-10-12 — rewritten from Tobias's round-3 feedback (review.md): the turn is now the
start-point/end-point insight plus the goal of automating it; the outcome uses the 2026-10-09
counts and the live automation; "for a week" is gone.

| # | t (s) | On screen | Narration | Visual |
|---|---|---|---|---|
| 0 | 0.0–0.4 | Cover: Bibel TV · Sermon pipeline · 2026 / The Metadata Nobody Sees / A timestamp is an interface. | — | Settled title card, held, dissolves into S1. |
| 1 | 0.4–8.0 | Genesis 1 / result: "Who is Jesus?" | You're reading the creation story. Search finds the right sermon. Its title makes it look wrong. | Typographic: query typed, result card resolves, marker circle on the title. |
| 2 | 8.0–14.0 | A timestamp is an interface. | Where the passage starts is where playback should start. | Diagram: sermon timeline, segment draws in, play-head jumps to its start. |
| 3 | 14.0–22.0 | A start point. No end point. / 3–5 minutes each, by hand | The old logs marked where a verse came up. Never where its passage ended. | The log format as a diagram: verse · start · end, the end slot empty; sermon frame resolves beside it. |
| 4 | 22.0–33.5 | The goal: automate it / Transcript → passage → clip / Source video. Start. End. Title. Quote. | The goal: automate it, start to end. The model marks each passage and names it. The quote is cut from the sermon. | n8n workflow resolves in a tilted device; the five fields come out, End lands with "start to end". |
| 5 | 33.5–45.0 | Tap a verse. | [silence] The clip starts where the passage starts. | Money shot: real recording, reader → clip list → player. |
| 6 | 45.0–54.0 | 11,405 clips · 3,504 videos / + 91 gott-erklärt articles / New videos processed nightly · in development | Thousands of clips now. New videos are processed every night. Videos without a verse get timed passages too. | Count-ups, then the two support lines. |
| 7 | 54.0–60.0 | Case study · The Metadata Nobody Sees · treppmann.design | Curious why a clip title matters to retrieval? Get in touch. | Dot takeover, title, fade. |

Words: 97. Estimated speech at 2.3 wps ≈ 42s of 60.0s (~30% voice-free); the clone ran 2.95 wps on r1 (~34s).

## Sources (every claim traced)
- B1 — study §"A correct search result could still look wrong" ("Who is Jesus?" / creation account).
- B2 — study: a timestamp is "the point where playback would begin".
- B3 "The old logs marked where a verse came up. Never where its passage ended." —
  `data/verification-log/2026-08-25-the-verse-extraction-and-video-analysis-pipeline.md`, "Virtual
  clips": *"The state he found: only a start time is recorded per verse reference."*; Tobias
  2026-10-12: *"the current setup only offered the starting point not the end point"*
  (`2026-10-12-sermon-pipeline-scale-and-the-start-point.md`). Card "3–5 min per video" — his own
  count (study; 2026-08-25 log). No duration of hand logging is claimed (the "week" is withdrawn:
  "I did not manually tag for a week (well sort of)").
- B4 "The goal: automate it, start to end." — Tobias 2026-10-12: *"the goal and vision of automating
  this"*; start/end per the virtual-clip entry. "The model marks each passage and names it. The quote
  is cut from the sermon." — `2026-10-11-who-writes-each-clip-field.md`.
- B5 — `2026-10-11-bibel-erklaert-flow-recording.md`.
- B6 "Thousands of clips" / card "11,405 clips · 3,504 videos", "+ 91 gott-erklärt articles" —
  `CORPUS_OPERATIONS.md` counts checked live 2026-10-09, logged in the 2026-10-12 entry. "New videos
  are processed every night" — nightly-sync 03:00 UTC + workflow 03 every 15 min (same). "Videos
  without a verse get timed passages too" — 80,132 transcript passages from every transcript (same;
  built, not claimed as live in the chat). "In development" — app unpublished.
- B7 — study close, trimmed.

## Claim limits honoured
- App unpublished: no adoption, usage or discovery-improvement claim (2026-08-25 log: discovery
  benefit is designed intent, not measured). Beat 6 card says "in development, not yet published".
- No colleague names, URLs, credentials or execution payloads (confidentiality note). The n8n image
  is the already-published sanitized overview.
- Broadcaster names visible in the recording (Arche TV) are public programme credits inside the
  product, not colleagues.

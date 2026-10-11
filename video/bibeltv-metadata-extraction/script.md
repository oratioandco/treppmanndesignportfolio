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
- **Length**: ~60s + 0.4s cover. Mood: patient, archival, precise — quieter than the color-api
  film; the bed leaves air for the timeline beat.

## Brief
- Voice: Tobias Treppmann's own ElevenLabs clone `kMS8f1BmXMghbv2jguJo` (eleven_v3). First person
  is his own work.
- Music: house family, Bibel TV mood line per `music-direction.md`, slower than color-api.

## Beats

| # | t (s) | On screen | Narration | Visual |
|---|---|---|---|---|
| 0 | 0.0–0.4 | Cover: Bibel TV · Sermon pipeline · 2026 / The Metadata Nobody Sees / A timestamp is an interface. | — | Settled title card, held, dissolves into S1. |
| 1 | 0.4–8.0 | Genesis 1 / result: "Who is Jesus?" | You're reading the creation story. Search finds the right sermon. Its title makes it look wrong. | Typographic: query typed, result card resolves, marker circle on the title. |
| 2 | 8.0–14.0 | A timestamp is an interface. | Where the passage starts is where playback should start. | Diagram: sermon timeline, segment draws in, play-head jumps to its start. |
| 3 | 14.0–22.0 | 3–5 min per video / Scripture alone, by hand | First I did the logging myself, for a week, on real videos. | Halftone of a sermon frame behind the number card. |
| 4 | 22.0–33.5 | Transcript → passage → clip / Source video. Start. End. Title. Quote. | I built a pipeline that reads the sermon, not its title. The model marks each passage and names it. The quote is cut from the sermon. | n8n workflow resolves in a tilted device; explodes into five labels, the quote label last and tied back to the transcript. |
| 5 | 33.5–45.0 | Tap a verse. | [silence 3s] The clip starts where the passage starts. | Money shot: real recording, reader → verse sheet → clip list → player, ≥70% width. |
| 6 | 45.0–52.5 | 805 clips · 299 videos / In development, not yet published | Each one is evidence the app's chat can retrieve for an answer. | Typographic, one line each. |
| 7 | 52.5–59.4 | Case study · The Metadata Nobody Sees · treppmann.design | Curious why a clip title matters to retrieval? Get in touch. | Dot takeover, title, fade. |

Words: 95. Estimated speech at 2.3 wps ≈ 41s of 59.4s (~30% voice-free); the clone measured ~2.5 wps on prior films.

## Sources (every claim traced)
- B4 "the model marks each passage and names it. The quote is cut from the sermon" — process step "Derive clips":
  *"Clip text is derived deterministically from source segments rather than invented by the model."*
  Field-by-field split (title, range and passage from the model; `clip_text` sliced by code):
  `data/verification-log/2026-10-11-who-writes-each-clip-field.md`. Replaces v1's "the clip's words come
  from the sermon, never from the model", which sat beside a "Title" card and overclaimed.
- B6 "retrieved as evidence for an answer in the app's chat" — process step "Make each segment
  retrievable": *"The app can retrieve the segment as evidence for a Bible-study answer"* + outcome
  *"wired into the app's running chat system during development"*.
- B1 "creation story … right sermon … title about something else" — study §"A correct search
  result could still look wrong": *"A sermon titled 'Who is Jesus?' also discussed the creation
  account … technically relevant result whose inherited video title made it look irrelevant."*
  Same example in `data/verification-log/2026-08-25-the-verse-extraction-and-video-analysis-pipeline.md`.
- B2 "where playback should start" / card "A timestamp is an interface" — study: *"A timestamp was
  not merely metadata. It was a product interface: … the point where playback would begin."*
- B3 voice "logging myself, for a week, on real videos" / card "3–5 min per video, Scripture alone, by hand" — study:
  *"I spent a week with the logging team and did the capture work on real videos. Scripture
  extraction alone took three to five minutes per video by my own count, sometimes more."* (The
  hedge "sometimes more" runs upward; the spoken range does not overclaim.)
- B4 "reads the transcript" — process step "Create one consistent transcript" / study: "transcript-
  driven extraction". "Each passage becomes a clip with its own start, end and title" — process
  step "Derive clips" + "connect each virtual clip back to its source video and time range"; the
  per-clip title is the virtual-clip concept (2026-08-25 log: *"virtual clip metadata … instead of
  the sermon title"*), visible on every clip card in the dev build (2026-10-10 and 2026-10-11
  capture logs). Card "Source video. Start. End." — same process step.
- B5 "the clip starts where the passage starts" + footage — `data/verification-log/2026-10-11-bibel-erklaert-flow-recording.md` (this round).
- B6 card "805 clips · 299 videos" — outcome metrics:
  *"805 sermon clips from 299 transcribed videos, checked live on 16 September 2026"*; *"wired into
  the app's running chat system during development"*. Tobias ran that check himself (study meta
  source: direct confirmation 2026-10-07) — attribution rule satisfied.
- B7 — study's closing hook, trimmed: *"… or why a clip title matters to retrieval quality? Get in
  touch."*

## Claim limits honoured
- App unpublished: no adoption, usage or discovery-improvement claim (2026-08-25 log: discovery
  benefit is designed intent, not measured). Beat 6 card says "in development, not yet published".
- No colleague names, URLs, credentials or execution payloads (confidentiality note). The n8n image
  is the already-published sanitized overview.
- Broadcaster names visible in the recording (Arche TV) are public programme credits inside the
  product, not colleagues.

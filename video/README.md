# Case-study videos

Short promo clips for the portfolio case studies, built with HyperFrames (HTML + GSAP → MP4).
Visual identity for every clip: `DESIGN.md` in this folder. One project per study.

| Study | Project | Status |
|---|---|---|
| ninox-ai-onboarding | `ninox-ai-onboarding/` | v8: 62s narration-led master (script v6, voice FLj50…, Lyria 3.5 bed ducked); awaiting Tobias's listen; beat-alignment pass open; uncommitted |

## Requirements
- Node 22 (`source ~/.nvm/nvm.sh && nvm use 22`). The renderer refuses Node 20.
- FFmpeg on PATH.

## Workflow
```bash
cd video/<study>
npx hyperframes lint                 # fast checks while editing
npx hyperframes check --timeout 8000 # lint + runtime + layout + contrast gate
npx hyperframes snapshot --at 2,8,14 --no-end --describe false --no-browser-gpu   # stills for review
npx hyperframes render --quality draft --output renders/draft.mp4                  # quick encode
npx hyperframes render --output renders/<study>.mp4                                # final ("looks" quality)
```
`renders/`, `snapshots/` and `.hyperframes/` are gitignored. Commit `index.html`, `assets/` and this folder's docs.

## Gotchas learned on the pilot
- Do not write `Georgia` as a CSS fallback. The compiler maps it to a Google Fonts fetch and the
  headless page then hangs at navigation. Use plain `serif`.
- `check` reports one `AudioContext` console error on this machine even for silent compositions.
  It comes from the headless browser's audio device, not the composition.
- If `snapshot` times out on the hardware GPU path, pass `--no-browser-gpu`.
- Layers for the exploded-UI shot are cut from the study screenshots with `sips -c H W --cropOffset Y X`.
  Coordinates in the Ninox project are in `index.html` comments and `assets/layers/`.

## Motion kit (reuse across studies)
All implemented inline in `ninox-ai-onboarding/index.html`, copy the functions and CSS:
- `buildField()` — cover-style halftone field, dots largest at a focal point, staggered "resolve" entrance.
- `buildScreen()` — uniform halftone screen inside a device for image A → image B resolves.
- Grade morph — `tl.set(fontFamily)` stepping Redaction 70 → 50 → 35 → 20.
- Device — `.device` chrome with `perspective` on the scene, `rotationY` tilt, sine float.
- Exploded UI — golden-angle 3D scatter → assemble (`frags` block), chat dim + card outline emphasis.
- Marker circle — inline SVG path on `.em`, `strokeDashoffset` draw.
- Typewriter — `tl.set(textContent)` per character, finite cursor blink.

## Music (Lyria 3 via the Gemini API)
A dedicated ElevenLabs key lives in `video/.env` (gitignored) with TTS, music (`POST /v1/music`) and
sound-effects (`POST /v1/sound-generation`) permissions; it lacks the read scopes, so `/v1/voices` and
`/v1/user` return 401, which is fine. Music also works via Gemini: the Gemini key
(`$GEMINI_API_KEY`) has `lyria-3-clip-preview` (≈30s clips), `lyria-3-pro-preview` and `lyria-3.5`
(longer). Plain `generateContent` with `responseModalities: ["AUDIO"]` returns base64 MP3:

```bash
curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/lyria-3-clip-preview:generateContent?key=$GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"<mood, instrumentation, BPM, arc, no vocals, ~32 seconds>"}]}],"generationConfig":{"responseModalities":["AUDIO"]}}'
# decode candidates[0].content.parts[*].inlineData.data → mp3
```
Fit to the cut with ffmpeg (`atempo` for a few percent, `loudnorm=I=-16:TP=-1.5`, `afade` out), save
as `assets/audio/bed.mp3`, referenced by `<audio id="bgm">` in the composition. Takes v1..v3 and the
muxed previews for the Ninox pilot are in `ninox-ai-onboarding/assets/audio` and `renders/`.

## Voiceover and sound design
- VO: ElevenLabs `eleven_v3`, Aperto voice `K7vKTyZUra3BubHkQtSC`, one clip per beat in `assets/vo/`.
  v3 timing is variable, so each line is silence-trimmed, time-fitted (`atempo` ≤ 1.18) and
  normalised to -18 LUFS (`l*-fit.mp3`). If a line overruns its scene window, split it into two
  lines rather than pushing tempo further.
- SFX: `POST /v1/sound-generation` clips in `assets/sfx/` (typing, whoosh, click, shimmer, chord),
  placed as timed `<audio>` clips on their own tracks. Music bed at `data-volume="0.42"` under voice.
- Web copy: `ffmpeg -crf 23 -preset slow -movflags +faststart` → `public/video/<study>.mp4`, poster
  from a still at ~4s → `public/video/<study>-poster.jpg`. The study JSON `video` field points at both.

## Page integration
`CaseStudy.video?: { src, poster, caption?, duration_s? }` (type, schema, JSON). `NarrativeSpineCaseStudy`
renders it as a click-to-play figure directly under the hero. Not autoplayed: the clip carries its own
text. A future text-free ambient loop for the hero and per-role-family variants (`video_variant` in
the filter JSON, batch-rendered via HyperFrames variables) are the planned follow-ups.

## Process owner
The reusable process (brief → script → voice → timing → picture → music → review → wire) and the
sourced craft guide live in `my-cv-tailor/.claude/skills/generate-case-study-video/`. This folder
holds the projects and the visual identity; that skill holds the method.

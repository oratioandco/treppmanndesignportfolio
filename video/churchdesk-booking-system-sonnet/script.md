# ChurchDesk booking system — clip script (Sonnet trial, round 1)

## Brief
- Audience: master cut (design leaders / recruiters), full pipeline trial.
- Claim: one booking system resolved three stakeholder groups with opposite needs into a single,
  dignified flow — funeral homes get speed, priests keep control.
- Proof image: `priest-availability.jpg` — on-call set as a recurring event in the priest's own
  calendar, several cemeteries at once. This is the decision that distinguishes the system.
- Arc: tension (the phone chain) → turn (the customer's own workshop named three groups) →
  proof (on-call lives in the calendar; every booking is a request) → outcome (coordination time,
  acceptance rate) → close.
- Length target: 48–52s. Mood: somber yet hopeful, dignified, warm, restrained — no exploded-UI
  spectacle; lean on the diagram/typographic register and the vision-sheet artefact.
- Voice: ElevenLabs eleven_v3, voice `FLj50PrMa40MhGHappOt` (established narrator).
- Music: Lyria 3.5, ~76–84 BPM, soft felt-piano/organ pad, faint digital grain only, no chiptune.

## Beats

| # | t (s) | On screen | Narration | Visual |
|---|---|---|---|---|
| 0 | 0.0–0.4 | Cover: kicker / When Booking A Priest Isn't Simple / Three groups. One booking flow. | — | A settled, fully-resolved title card, held, then dissolves into S1. |
| 1 | 0.4–7.6 | ChurchDesk · Funeral Booking · 2025 / When Booking A Priest Isn't Simple / Three groups. One booking flow. | Booking a priest for a funeral looks like picking a date. | Product on frame 1: `funeral-home-booking.jpg` in a settled device frame beside the title. |
| 2 | 7.6–17.2 | The problem / Before this: days of phone calls. / A family waited through every round. | Before this: days of phone calls between funeral home, parish and priest. A family waited through every round. | Device fades; a plain three-node line diagram (funeral home → parish → priest) draws in, typographic, no UI chrome. |
| 3 | 17.2–27.4 | The customer's own workshop / "Verbindlich und unkompliziert." / Binding and uncomplicated. / Fast for the family. Never a burden on the priest. | The customer had already named the goal. Fast for the family. Never a burden on the priest. | Blur crossfade into `vision-sheet-design-thinking.jpg`; the tension (not a redundant stakeholder list) resolves in below the quote. |
| 4 | 27.4–38.4 | The decision / On-call lives in their calendar. / Never automatic. Accept — or decline. | On-call lives in the calendar priests already use. Every booking is a request, never automatic. The priest can accept it — or decline. | Zoom-through into `priest-availability.jpg`, largest element in the film (≥70% width), held longest. |
| 5 | 38.4–47.9 | The harder path / Not a module. Platform behavior. / Every future booking type — rooms, baptisms, counseling — reuses it. | A standalone module would have shipped faster. We extended the platform instead, the right call, not the easy one. | Kicker, headline, sub resolve in sequence — same register as S4, no metric cards. |
| 6 | 47.9–53.4 | Case study · When Booking A Priest Isn't Simple · treppmann.design | Read the full case study on treppmann dot design. | Dot takeover, title card, quiet fade; music resolves. |

Word count: 11 + 18 + 17 + 18 + 17 + 9 = 90 words narration (regex count in checker may read ~91–92
counting "on-call" and "seventy" tokens slightly differently).
Real measured speech across all six fitted clips: 34.74s of 53.0s total = 34.5% voice-free.

## Voice-safe checks (Gate 1)
- No sentence depends on stress/irony/one short load-bearing word; every line reads flat in a
  monotone and still lands.
- Defined term: "on-call" is shown in context (calendar screenshot, "Priests keep on-call hours in
  the calendar they already use") rather than as jargon needing a gloss — audience is design
  leaders, the concept (a duty rota) is familiar from the sentence itself.
- First spoken sentence is about the user/problem ("Booking a priest for a funeral looks like
  picking a date"), not the author or company.
- Pronouns: no "I" anywhere; "we" not used either in this cut (no team-action sentence needed it) —
  narration stays in third person about the customer/system, "you"/"we" not required by these
  beats. Re-checked: no first-person singular anywhere. PASS.
- Numbers spoken as words: "seventy percent", "nine in ten" (not "70%" spoken as a percent sign
  read literally — script text says it in words; on-screen card shows the numeral).
- No competitor named, no number outside the study JSON.

## Sources (every claim traced)
- "Booking a priest for a funeral looks like picking a date" — JSON `sections[0].headline`/`subtext` (hero).
- "days of phone calls between funeral home, parish and priest... family waited" — JSON narrative
  "The problem was the phone": "A funeral home called the parish office. The parish office checked
  who was on call, then called the priest... while a family waited."
- "The customer had already run their own workshop. It named three groups: funeral homes, parish
  staff, priests." — JSON: "they had already run their own design-thinking workshop and arrived
  with a vision sheet that named the three stakeholder groups"; groups list from section
  "Three groups, three different needs" (Bestatter/funeral homes, Assistenzen/parish assistants,
  Pfarrpersonen/priests).
- "Verbindlich und unkompliziert" / "Binding and uncomplicated" — JSON callout quote + context, verbatim.
- "Priests keep on-call hours in the calendar they already use" — JSON "On-call lives in the
  priest's calendar": "a priest sets their on-call rotation as recurring events in the same
  ChurchDesk calendar where they already plan their week."
- "Every booking is a request. They confirm it." — JSON: "Every booking is a request, not an
  automatic booking. The priest confirms or declines."
- "A standalone module would have shipped faster. We extended the platform instead, the right call,
  not the easy one." — JSON process step "Extended the existing platform: the right option, not
  the cheap one": "Extending both was harder than building a standalone booking module would have
  been... the right option, not the cheap one." The sub line ("rooms, baptisms, counseling") traces
  to JSON outcome: "a booking capability that could carry funeral booking as its launch use case and
  then expand across the platform: room rentals, equipment reservations, counseling appointments."
- Images: `public/images/churchdesk/funeral-home-booking.jpg` (hero_image), `vision-sheet-design-
  thinking.jpg`, `priest-availability.jpg` — all from the study JSON's `sections[].images`.
- Company/product name "ChurchDesk" and dates from JSON `company`, `duration`.

## Layer / device notes
No exploded-UI beat in this cut (restraint per the mood brief). Three device/image moments only:
S1 `funeral-home-booking.jpg`, S3 `vision-sheet-design-thinking.jpg`, S4 `priest-availability.jpg`
(the money shot, ≥70% frame width). S2 is a plain typographic + line-diagram scene, no screenshot.

## Timing (filled in after measured voice clips — see §Voice clips below)

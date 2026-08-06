# Portfolio Review — Case Studies

**Date:** 2026-07-29
**Scope:** All 11 case studies in `src/data/cv-tailor-data/case-studies/`, plus how they render
**Target:** Head of Design / VP Design / CDO — *and* Staff/Principal IC
**Method:** Read all 11 JSON sources, the render template, the filter configs; built the site and
inspected the actual rendered pages and images at real display size (1440px viewport).

This supersedes `AUDIT.md` (2025-04-25), which reviewed the three legacy `.astro` pages. The JSON
studies have improved enormously since then. Some of that audit's top findings are still open.

---

## 0. The short version

**The writing is top-decile. The evidence layer is missing. That is the whole problem.**

You do not need to rewrite the content. You need to change two things: **the reading model** (a
skim-reader currently cannot extract anything without reading 2,000 words) and **the visual layer**
(the images that exist are illegible at render size, and the images that would prove your claims
don't exist yet).

Five findings, in order of cost:

1. **The default entry point shows the old, weak pages.** The per-application curated views
   (`/for/{company}`) are a good idea, correctly built, and rightly not linked from the homepage.
   But `index.astro` hardcodes links to `/case-studies/churchdesk`, `/ninox`, `/modern-practice` —
   the 2025 legacy pages the previous audit rated 🟡 / 🟡 / 🔴, illustrated with German-language
   ChurchDesk conference slides. Anyone arriving without a curated link sees only that. Give the
   homepage a default curated view. Highest ROI fix in the repo, and it's routing, not content.
   (Related: `/for/` and `/work/` are byte-identical duplicate route trees — 94 of 101 built pages.
   Collapse them before doing any template work, or you'll do all of it twice.)
2. **Card covers carry no information.** Three abstract halftone dot fields. A design hiring
   manager's first instinct is "show me the work"; the shop window currently answers with a
   decorative pattern.
3. **Every product screenshot is illegible.** Ninox exports are 3798px wide and render at 648px — a
   5.9× downscale. I looked at the rendered figure: UI text is 3–4px tall. The images are present
   and functionally doing nothing.
4. **No scope bar, and the outcome is buried.** ChurchDesk's page is 14,507px tall and the metrics
   appear at **81% scroll depth**. Team size, budget, and "what I personally did" exist only inside
   prose. `AUDIT.md` flagged this in 2025 as gap #1; the data has `role`/`team`/`duration` fields
   and the template still never shows them together.
5. **Leadership evidence is thin for Head-of-Design-and-above.** One leadership study, one anecdote,
   zero images. Nothing on hiring bar, ladders, budget, headcount cases, operating model, or
   org maturity before/after.

**Verdict on "do I need to fundamentally change the approach?"** No fundamental content rewrite.
Yes, a fundamental change to how the content is packaged and proven. The prose quality is currently
*substituting* for evidence instead of supporting it.

---

## 1. What best practice actually looks like at this level

Grounding first, because "best practice" for a Head of Design portfolio is genuinely different from
the case-study advice that circulates for mid-level product designers.

**How the artefact is actually used.** For Head of Design and above, the portfolio rarely wins the
job. Its three jobs are: (a) survive a 60–90 second skim by someone looking at 40 candidates,
(b) arm the hiring manager with something to advocate with internally, (c) seed the questions you
want asked in the interview. For Staff/Principal IC, it does more direct work — craft evidence is
assessed straight off the page.

The patterns that separate senior portfolios from good mid-level ones:

| # | Pattern | Why it matters at this level |
|---|---|---|
| 1 | **Altitude legible in the first screen** — scope bar: role, team, budget, span of control, *your* contribution vs the team's | A senior reader's first question is "what were you actually responsible for?" Never make them infer it |
| 2 | **Outcome first, story second** | The skim reader never reaches the bottom. Inverting the student structure (problem→process→solution→outcome) is the single biggest structural difference |
| 3 | **Decisions, not process** — options considered, choice made, cost accepted, road not taken | The clearest seniority signal that exists. Process narration reads junior no matter how well written |
| 4 | **Leverage, not output** — the artefact is often an org, a system, a practice, a standard | But it still needs *artefacts*: org charts, ladders, rituals, roadmaps, maturity before/after |
| 5 | **Business language** — revenue, retention, cost, risk, time-to-market, win rate | Directional numbers beat no numbers. Phrase impact the way the CFO would |
| 6 | **Craft proof, at leadership altitude** — a few beautifully presented, *legible* artefacts | Even a VP is assessed on taste. Not full walkthroughs; 3–4 pieces of undeniable craft |
| 7 | **A stated thesis, 3–5 studies** | The portfolio should argue one claim about you. More studies at uneven quality dilutes it |
| 8 | **Third-party validation** — quotes from CEOs, PMs, engineers, reports; talks; publications | Cheapest credibility lift available, and almost nobody does it |
| 9 | **Dual-track readability** — a 60-second executive read nested inside a 6-minute deep read | This is exactly what lets one asset serve both Head-of-Design and IC applications |
| 10 | **Confidentiality handled as recreation, not absence** | Redacted/rebuilt visuals with synthetic data beat "no screenshots available" |

Scored against that list, this portfolio is **strong on 3, 6 (in the writing), and 9 (in the data
model)**, and **weak or absent on 1, 2, 4, 5, 7, 8, and 6-as-rendered**.

---

## 2. What is genuinely good — keep all of this

Being specific, because these are real assets and some of them are rare.

**The writing is the best thing here, by a distance.** Sentence-level craft that most design leaders
cannot produce:

- *"The problem was the phone."* — a section head that does the work of three paragraphs.
- *"For a funeral home, it should feel like booking a priest: fast and reliable. For a priest, it
  should never feel like being booked."* — this is a hiring-worthy sentence. It compresses an entire
  multi-stakeholder design brief into a line and demonstrates the judgment behind it.
- *"A design system in Figma is a promise. A design system as an API is a guarantee."*
- *"Some cards demanded the page; others almost disappeared. The artwork didn't decide which — the
  RGB math did."* — a technical failure diagnosed in a sentence a non-technical exec can feel.

**Decision-centric narration is already present in the best studies.** This is the hardest thing to
retrofit and you already have it:

- ChurchDesk's double fork — build-vs-buy dismissed quickly (custom-form requirement rules out
  vendors), then the *real* fork: standalone module vs integrated platform capability, with the
  faster rejected path explicitly named and the cost of the harder choice owned. Textbook senior.
- Color API's **"Restraint on the phone"** — the engine can produce two text colours, testing said
  one, shipped one, kept the capability for other surfaces. *"The mobile call wasn't 'drop the
  feature', it was 'don't use it here'."* That is a craft-judgment beat very few portfolios contain.
- Ninox AI's **"Why chat alone wouldn't work"** — two concrete, non-theoretical constraints
  (schemas too large for chat transcripts; trial users won't write a 400-word spec) that force the
  split-screen model. Reasoning from constraints to interaction model, shown not asserted.

**The honesty calibration is unusual and it is an asset.** *"The customer had already done the
synthesis; my job was translation and validation, not the discovery."* / *"They wrote the code, not
me."* / *"This is a Copilot skill, not a custom-built agent."* Most portfolios inflate. Yours
deflates. Net effect on a skeptical reader: high trust. (It is over-corrected in two places — see
§4.7.)

**The technical depth is your strongest 2026 market differentiator.** OKLCH perceptual clamping,
k-means with vibrance filtering, programmatic WCAG validation in the pipeline, Style Dictionary
token API with DTCG format, agentic prototyping against real APIs. Very few design leaders can write
these credibly, and you write them without bluffing.

**The infrastructure you've built around the content is smart and underused.** The `variants` system
(executive / in-depth / blog with per-format section subsets) and the per-audience `filters/*.json`
with `_context.selection_rationale` already anticipate best practice #9 and #7. The architecture is
right; it just isn't switched on in the render.

**The editorial design system is distinctive and good.** The `§ NN` section markers, `Fig. NN` rail
captions, the Redaction halftone-face tie-in, the drop caps. It reads as a considered publication,
not a Framer template. And the captions do real narrative work — *"The decision that distinguishes
the system from Calendly, captured in one screen"* is exactly how a caption earns its place.

---

## 3. Study-by-study assessment

Ratings: 🟢 ready · 🟡 close · 🟠 needs real work · 🔴 rebuild or cut

| Study | Words | Figs | Status | HoD signal | IC signal | Verdict |
|---|---|---|---|---|---|---|
| `churchdesk-booking-system` | 2,095 | 4 | draft | 🟢 | 🟡 | **Your best.** Ship first |
| `bibeltv-color-api` | 1,333 | 1 | draft | 🟡 | 🟢 | Strongest craft story, starved of images |
| `ninox-ai-onboarding` | 1,522 | 5 | draft | 🟡 | 🟢 | Strong; images illegible |
| `bibeltv-design-system-api` | 834 | 2 | **published** | 🟡 | 🟢 | Good bones, too thin |
| `ninox-org-building` | 785 | **0** | draft | 🟡 | ⚪ | Great anecdote, no org evidence |
| `bibeltv-app-redesign` | 586 | **0** | draft | 🟠 | 🟠 | The redesign itself is invisible |
| `datameer-data-dense-analytics` | 756 | 1 | draft | 🟠 | 🟠 | **Biggest wasted asset in the portfolio** |
| `spreadshirt-user-research-strategy` | 753 | 1 | draft | 🟡 | 🟠 | Good story, ageing (2014–16) |
| `bibeltv-agentic-engineering` | 964 | 1 | review | 🟡 | 🟡 | Merge with the one below |
| `bibeltv-ai-prototyping` | 935 | 3 (all missing) | in-progress | 🟠 | 🟠 | **Duplicate. Merge or delete** |
| `bibeltv-support-agent` | 542 | 0 | in-progress | 🟠 | 🟠 | Honest but too small to carry weight |

### 3.1 ChurchDesk — *When booking a priest isn't simple* 🟢

The reference standard for the rest. Real constraints (€20k, two months), a named launch customer
with consent, the strongest metrics in the portfolio (70% / 90% / 20+ cemeteries), the double
build-vs-buy fork, a dual product+design role that is *justified* rather than just claimed, and a
reflection that lands on leverage rather than craft.

Gaps: the metrics render as small grey text (§4.4); "around 70%" and "90%" need a source line
(measured how? over what period? n=?); Fig. 01 has video-player chrome baked into it (§4.3); and the
public conference talk where the customer presented this system is buried in `meta.source` where no
reader will ever see it — that's an external party publicly validating your work, sitting unused.

### 3.2 Bibel TV Color API — *A color engine built for the brand* 🟡 (best craft story)

The most differentiated piece of work in the portfolio and the one most damaged by the missing
visual layer. A study whose entire subject is **colour**, with **one image**. The claims are all
visual claims — "colours collapsed to beige in dark mode and rose in light", "some cards demanded
the eye, others disappeared", "the grid reads as a coherent collection" — and the reader is asked to
take every one on trust. This is the study where images convert skepticism most directly, and it has
the fewest.

Also: it inherits the same n=40 / 87% light-mode figure as the app-redesign study. Fine, but state
the method once so it doesn't look like one soft number reused to imply two results.

### 3.3 Ninox AI onboarding — *Who Controls the AI?* 🟡

Best-argued AI study and the most transferable thesis ("the seam between AI generation and user
ownership"). Five figures — good instinct — but all five are 3798px full-window captures rendered at
648px, so none of them are readable (§4.2). The dual-path point *is* the story and the image that
proves it is unreadable at exactly the moment the reader needs it.

The outcome section is honest but soft: "adopted as the primary onboarding pattern," "handed off to
the product team." If the public beta shipped in 2026 with your interaction model, that's a citable
external outcome — link it.

### 3.4 Design System API 🟡 · only `published` study

Right thesis ("a service, not a Figma file"), good architecture diagram, correct alternatives-
rejected paragraph. But 834 words is too thin for the one study a visitor is most likely to reach,
and the outcome is honest to the point of weakness: Android live, Figma synced, iOS and web
"defined and ready." The reader is told one of four platforms consumes the system. Either quantify
what shipped (tokens count, PR cadence, drift incidents before/after, time to ship a colour change)
or reframe explicitly as "phase one of four, here's the rollout plan" — which is itself a leadership
artefact.

### 3.5 Ninox org building 🟡 — the only leadership study, and it has no images

Genuinely well-written, and the reframe ("what's wrong with our system?" not "what's wrong with that
person?") is the most senior *thinking* in the portfolio. The business case — that the process was
filtering out good ideas before they were heard — is strong.

But it is one anecdote about one engineer, carrying the entire weight of your leadership claim, as
an unbroken text wall. The role paragraph gestures at the rest — team of five, a design lead, a
planning process, shared design-system governance, hiring, and *"when someone was not the right fit,
I made that call too"* — and then explicitly walks away from all of it: *"The part that taught me the
most was not on that list."* That's a good literary move and a bad hiring move. Everything you
skipped is what a VP-hiring panel needs.

~~Also flag consent handling: the original text described a real, identifiable person to anyone who
worked there.~~ **Resolved 2026-08-06.** The study was fully anonymised: employer removed from this
story, individual reduced to "a senior engineer", all personality description and any speculation
about how they think removed, and the story reframed around *when* collaboration failed versus when
it worked. The study id and both page URLs were renamed so the employer is not in the path either.
Do not reintroduce any of it.

### 3.6 Bibel TV app redesign 🟠 — the redesign is invisible

586 words and **zero images** for a study whose entire claim is *"we made a light interface feel
premium."* Premium-ness is not arguable in prose; it is either visible or it isn't. Right now the
reader is told that a competitive bet against Pray.com was won on visual quality, and shown nothing.
This is the single largest gap between claim and evidence in the portfolio.

The "prototype on the target platform" lesson is good and is told twice more elsewhere (§4.6).

### 3.7 Datameer 🟠 — the biggest wasted asset

**Director of Design. Five years. Three designers across Berlin and NYC. Top US/CA/UK banks and
insurers. Design system 0→1. Exec-sponsored research access into institutions that treat any
external access as a compliance risk.** That is the most senior-scoped story you have, and it is 756
words with four metrics that are not metrics ("Built from scratch (0 → 1)", "Direct access to
regulated enterprise environments", "Designed honest feedback that maintained user trust").

It carries the `org-building` tag without any org-building content: no hiring, no team structure
across two time zones, no ladder, no maturity before/after beyond one line, no stakeholder story
about how you actually won the research access. And it's `hidden` in the Jupus filter.

If you want VP/CDO roles, **this is where that story is hiding.** Rebuild it as your second
leadership study. The confidentiality constraint is real but solvable by recreation (§5, roadmap).

### 3.8 Spreadshirt 🟡

Genuinely good structure: assumption → research → the one quote that turned it → prototype as
persuasion device → strategy changed → project that failed twice succeeds. "Make the data
undeniable" is a senior lesson.

The problem is the date. 2014–2016, Axure, a t-shirt designer. Keep it as a short "notes" piece
demonstrating research-led strategy change; don't feature it. It also has the same key-takeaway
sales-pitch tail as the other older studies (§4.8).

### 3.9 + 3.10 The two agentic-prototyping studies 🟠 — merge them

`bibeltv-agentic-engineering` and `bibeltv-ai-prototyping` make the **same argument** with the
**same Android gradient anecdote** and **numbers that disagree**:

- agentic-engineering: iteration "Days → hours"
- ai-prototyping: "3-5 days → **1 day**"; plus "~70% of AI-generated code ships directly",
  "Claude generates a **95%-complete** prototype", "first version ships in **2 weeks**"

Two studies arguing one thesis with inconsistent numbers is worse than one study. Worse, several of
those numbers won't survive an interview as written: "95%-complete", "~70% ships directly", and
"Engineering Team Satisfaction: High" (not a metric). And "first version ships in 2 weeks" directly
contradicts `bibeltv-app-redesign`, which says the redesign is still *"moving into development."* A
sharp interviewer will find that in under a minute.

Also: `ai-prototyping` is the only study with **missing image files** — all three refs
(`agentic-design-hero.png`, `prototype-to-code.png`, `agentic-design-workflow.png`) don't exist.

**Action:** merge into one study, keep `agentic-engineering`'s framing and the handoff-collapse
diagram, delete `ai-prototyping`, and re-source every number as either measured, attributed
("engineering's estimate"), or scoped ("on the Mediathek screens"). One honest number beats four
impressive ones.

### 3.11 Support agent 🟠

Admirably honest — *"This is a Copilot skill, not a custom-built agent"* — and the escalation-as-
first-class-output decision is genuinely good AI-UX thinking. But 542 words and no images can't
carry a portfolio slot. Either grow it (the escalation taxonomy and the "what is a good draft"
rubric are both showable artefacts) or fold the human-in-the-loop principle into the Ninox AI study
as a second example.

---

## 4. Cross-cutting problems

### 4.1 The generic public entry point shows the weakest version of the work

**First, credit where it's due:** the per-application curated collections are a genuinely good idea
and correctly built. `filters/*.json` drives seven tailored views (`kleinanzeigen`, `gitlab`, `n8n`,
`jupus`, `deliveryhero`, `liveeo`, `mobile-de`), each with its own study selection, ordering,
`visibility` tiers, per-view bio, CV link, and a `_context.selection_rationale` documenting why each
study was chosen. Sending a hiring manager a URL curated for them is better practice than sending
everyone the same portfolio. It is also correct that the homepage doesn't link to these — they're
meant to be handed out, not browsed.

Verified: `_context.selection_rationale` does **not** leak into the built HTML, and no `/for/` or
`/work/` page names another target company. Good.

**The problem is the default path.** `src/pages/index.astro` links to `/case-studies/churchdesk`,
`/case-studies/ninox`, `/case-studies/modern-practice` — three hand-built legacy `.astro` pages
(179 / 109 / 120 lines) that the 2025 audit rated 🟡 / 🟡 / 🔴. So anyone who arrives *without* a
curated link — an inbound recruiter, someone who Googles you, a hiring manager forwarded the bare
domain — gets the 2025 version and never sees any of the work reviewed here.

Confirmed against the build, not just the source: `public/CNAME` is `treppmann.design`, and
`dist/index.html` contains exactly three case-study links — `/case-studies/churchdesk`,
`/case-studies/modern-practice`, `/case-studies/ninox`. Zero links to any `/work/` path, even though
`dist/work/` contains all seven audience views.

It is worse than "the older text," because of how the legacy ChurchDesk page is illustrated. Its nine
figures are `churchdesk/page-01.png` … `page-09.png` — **slides exported from the ChurchDesk
conference deck of 2025-02-26.** They are 4000×2250 presentation slides in **German**, in
**ChurchDesk's brand** (their teal header bar, their logo top-right, their type), and mostly bullet
lists: *"Einfach — Für Pfarrpersonen"* over six bullets; *"Der gesamte Prozess automatisiert und an
einem Ort."* So the ChurchDesk case study a recruiter actually reaches is illustrated with a client's
German-language sales deck rather than with your own portfolio visuals.

Fix: give the homepage a **default curated view** (a generic `filters/default.json` rendered at `/`,
or a canonical `/work/` index) and retire the three legacy pages. The curated-link mechanism stays
exactly as it is; it just stops being the *only* way to reach the good work.
**Do this first — it costs an afternoon.**

#### 4.1a `/for/` and `/work/` are two byte-identical copies of the entire collection system

`src/pages/for/[slug].astro` and `src/pages/work/[slug].astro` differ in **three lines**; the two
`[study].astro` files differ in **one** (`backUrl`). The only difference is the link prefix. The
build produces **47 HTML pages under `/for/` and 47 under `/work/`** — 94 of the site's 101 pages are
the same content twice.

Two consequences:

- **Every template fix in this review has to be made twice**, or the two copies drift. The scope bar,
  the metric typography, the figure sizing — all of it. This is the one finding that will actively
  cost you time on everything else.
- Duplicate content on an indexable domain, with no `rel=canonical` and no `noindex` on either set.

Pick one prefix (`/for/` reads better for a tailored link — *"treppmann.design/for/kleinanzeigen"* is
a nice thing to put in a cover letter), make the other a redirect, and delete the duplicate templates.

Minor, related: `public/robots.txt` advertises `https://treppmann.design/sitemap-index.xml`, but no
sitemap is generated — there's no sitemap integration in `astro.config.mjs`. Either add
`@astrojs/sitemap` or drop the line. If you add one, exclude the tailored `/for/*` views so a
curated application page isn't served up to a different employer via search.

Related: 9 of 11 studies are `draft` / `in-progress` / `review`; exactly one is `published`. Since
`scripts/check-images.mjs` only *blocks* on published studies, drafts can ship with broken images.

### 4.2 Every product screenshot is illegible at render size

Measured on the built site: body figures render at **648px wide**, full-bleed at ~945px.

| Source | Native width | Rendered | Downscale |
|---|---|---|---|
| `ninox/*.png` (all 5) | 3798px | 648px | **5.9×** |
| `bibeltv/color-lab.png` | 3788px | 648px | **5.8×** |
| `churchdesk/priest-availability.jpg` | 1710px | 648px | 2.6× |
| `churchdesk/booking-form.jpg` | 1440px | 648px | 2.2× |

I viewed the rendered Ninox figure: the UI type is 3–4px tall and completely unreadable. The
caption says "note the 'Create field' affordance on every card" and the reader cannot see a card,
let alone an affordance.

**Root cause: you are shipping full-window captures where you need detail crops.** No amount of
resolution fixes a whole-application screenshot rendered into a 648px column. The fix is editorial,
not technical: crop to the decision, then annotate.

### 4.3 Zero annotation, and one figure has video chrome baked in

No figure in the portfolio has a callout number, a highlight box, a zoom detail, or a leader line.
Every caption asks the reader to hunt for the thing being described.

And `churchdesk/vision-sheet-design-thinking.jpg` — Fig. 01 of your strongest study, the reader's
first visual impression — is a frame grab from the conference-talk recording with a **video
play/pause scrubber overlaid across the middle of the flipchart** and black letterbox bars top and
bottom. On a design portfolio that reads as carelessness in precisely the place craft is being
judged. Re-source it (§5.1).

### 4.4 The metric typography is inverted

In the render template, `value` metrics get large display italic; `before → after` metrics get small
muted body text. The consequence, on your best study:

- **"around 70% less time"** — the single strongest number in the portfolio — renders as small grey prose.
- **"90%, because funeral homes only ever saw times that were genuinely free"** — a whole sentence —
  gets the large display treatment.

There is no big-numeral treatment anywhere in the system. **70%** and **90%** should be the largest
type on that page after the title. Standard treatment: big figure, small label beneath, one-line
explanation under that.

### 4.5 No scope bar, and the payoff is at 81% depth

Measured: ChurchDesk renders **14,507px tall**; `.cs-metrics` sits at **11,737px = 81% scroll
depth**. Four figures across 14,500px is roughly one visual anchor every 3,600px, against a norm of
one every 600–1,000px.

And the masthead shows only `CASE STUDY · CHURCHDESK GMBH · 2024 – 2025` plus role as a tagline.
`team` ("1 designer + engineering team, Berlin"), `duration`, budget, and your personal contribution
are all in the JSON or the prose but never presented as scannable metadata. The 2025 audit's #1
recommendation, still open.

### 4.6 Two anecdotes are told three times each

The Android gradient lesson appears in `app-redesign`, `agentic-engineering`, and (as the platform-
rebuild point) `ai-prototyping`. The "Figma is a promise / repo is the source" flip appears in
`design-system-api` and again in `color-api`. Reading two or three Bibel TV studies in one sitting —
which is what your `related` links invite — makes the body of work look smaller than it is. Assign
each anecdote one owner and cross-reference from the others.

### 4.7 Two places where the honesty over-corrects

The honesty is an asset, but twice it argues against you:

- **ChurchDesk:** *"The harder synthesis work belonged to the customer; my work was translation and
  refinement."* You then describe owning product and design, running competitive analysis, making the
  build-vs-buy call, making the standalone-vs-integrated call, designing the availability model, and
  shipping in two months on €20k. "Translation and refinement" is not an accurate summary of that.
  Credit the customer's workshop precisely — and separately state what you owned.
- **Ninox org-building:** listing the real leadership work (team of five, planning process, design-
  system governance, hiring, exiting someone) and then saying *"The part that taught me the most was
  not on that list"* discards your entire management evidence base in one sentence.

### 4.8 The `key-takeaway` sections read as sales copy

*"Why this matters for your team… I can lead that conversation…"* / *"I'm proving it works at Bibel
TV with real products, real deadlines…"* — present in Datameer, Spreadshirt, agentic-engineering,
ai-prototyping. It breaks the editorial register the rest of the writing establishes, and at Head-of-
Design level it reads as pitching rather than reporting. The stronger studies (ChurchDesk, Color API,
Ninox AI) don't have it and don't miss it. Cut them; let the reflections carry the transfer argument.

### 4.9 No third-party validation anywhere

Zero quotes from a CEO, a project lead, an engineer, a PM, or a direct report. Zero links to talks,
articles, or the shipped products. This is the cheapest credibility lift available and you have
unusually good access to it:

- The **ChurchDesk conference talk (2025-02-26)** where the launch customer publicly presented this
  system — currently only in `meta.source`.
- The **Ninox CEO and technical co-founder** you worked with directly.
- The **Ninox AI public beta (2026)** built on your interaction model.
- The **Bibel TV app** in the App Store / Play Store, if the redesign has shipped.
- The **engineer** from the org-building story, and your former **design lead**.

Three short quotes would do more for a skeptical reader than another 500 words of prose.

### 4.10 Schema drift

Not a hiring issue, but it will bite the tooling. Most `type` values in the data
(`process-innovation`, `ai-product`, `streaming-media`, `design-system`, `business-process`) are not
in the `schema.json` enum; `status: "in-progress"` isn't either; a majority of `tags` are off-enum
(`design-systems`, `token-architecture`, `oklch`, `k-means`, `platform-thinking`…); and
`outcome.narrative` is used in nearly every study but isn't a declared section property. It all
renders, but the schema is now fiction — which matters because the image guard and any future
validation lean on it. Either regenerate the enums from actual usage or drop them to free strings.

### 4.11 The career arc isn't framed anywhere

Director of Design (Datameer, 2016–21) → Head of Product Design (Ninox, 2023–24) → Head of Platform
and Design (ChurchDesk, 2024–25) → Head of Product Design (Bibel TV, 2025–). A skeptical reader sees
a title plateau and three companies in three years. That reading is available and nothing on the site
contests it. One deliberate framing sentence — why you've chosen founder-adjacent roles where design
owns infrastructure, and what you're now looking to do at larger scope — costs nothing and closes the
gap. Not a case-study fix, but it's the frame they sit in.

---

## 5. Positioning: Head of Design vs IC

You asked whether this can serve both. It can, and mostly with the same fixes — but they need
different top layers.

**For Head of Design / VP / CDO, what's missing is org evidence, not craft evidence.** You currently
have one leadership study built on one anecdote. A panel hiring a Head of Design wants: the hiring
bar and how you set it; a career ladder or competency framework; how you run design review, critique,
and planning; how design plugs into product and engineering; a headcount or budget case you argued
and won; design-org maturity before/after; and one story where you set a direction that *other people
executed*. Almost none of that is present, and some of it exists in your history (Datameer: three
designers over two time zones; Ninox: team of five, hiring, an exit; ChurchDesk: "Head of Platform
and Design" — a scope worth explaining, since platform ownership is unusual for a design lead).

**Recommendation: add an operating-model page — "How I lead."** Not a case study. A page with your
hiring bar, your rituals, your ladder, how you run reviews, how you scope design's remit. Standard at
Head+ level, completely absent here, and quick to write because you already do these things.

**For Staff / Principal IC, you are closer than you think — and blocked by the same visual gap.** The
IC reader wants pixels, states, edge cases, systems, and the reasoning underneath. Your raw material
is unusually good (colour engine, token architecture, code prototypes, the schema-editing seam).
What they get today is prose *about* pixels. Fix the visual layer and the IC case largely makes
itself.

**Recommended portfolio shape — 4 deep + 3 notes, not 11 at uneven quality:**

| Tier | Study | Proves |
|---|---|---|
| Deep | ChurchDesk | Complex multi-stakeholder systems, product+design ownership, delivery under constraint |
| Deep | Bibel TV Color API | Technical craft depth, design owning infrastructure, judgment/restraint |
| Deep | Ninox AI onboarding | AI-native product design, transferable interaction thesis |
| Deep | **Datameer, rebuilt** | Org building and design-org maturity at Director scope, regulated enterprise |
| Notes | Design System API | Platform thinking (fold into or pair with Color API) |
| Notes | Ninox org building | Leadership philosophy (link from the "How I lead" page) |
| Notes | Agentic prototyping (merged) | Modern practice |
| Cut/park | app-redesign (fold into Color API), support-agent (fold into Ninox AI), ai-prototyping (delete), Spreadshirt (archive) | |

---

## 6. Image roadmap

You were right that pictures are missing — but the more urgent problem is that the pictures you
*have* aren't working. Below: a presentation standard first, then a per-study shot list.

Only three files are actually missing on disk (all in `ai-prototyping`, which I recommend deleting).
Everything else in this section is new sourcing — **with one useful exception.**

**You already own more raw material than the JSON studies use.** `churchdesk/page-01.png` …
`page-09.png` are the nine slides from the 2025-02-26 conference deck. They are not portfolio-grade
as-is — 4000×2250 slides in German, in ChurchDesk's brand, mostly bullet lists — so don't drop them
into a case study (that's what the legacy page does, §4.1). But they are good *source* for two P0
items below:

- **`page-03.png` already contains the three-stakeholder content** — Bestatter / Assistenzen /
  Pfarrpersonen with the needs per group. Redraw it in the portfolio's visual language, in English.
- **`page-09.png` contains a booking-request card mock** (*Neue Buchungsanfage · Status: Angefragt ·
  Angefragte Ressourcen · confirm/decline*) — the request-not-assignment decision, already visualised.

One caution: the vision-sheet photo inside `page-03.png` carries the **same video-player scrubber
overlay** as the current Fig. 01, which means the overlay came from the deck. Re-source Fig. 01 from
the original photograph, not from the deck or its PDF.

### 6.0 Presentation standard — apply to every new image

1. **Export at 2× render width, not 4–6×.** Body figures render at 648px → export **~1300px**.
   Full-bleed renders at ~945px → export **~1900px**. Stop exporting 3800px full-window captures.
2. **Crop to the decision.** Never a whole application window in a 648px column. If the caption
   names one control, the figure shows that control and just enough context to locate it.
3. **Annotate, 1–3 callouts max.** Numbered markers keyed to the caption text. This is the single
   highest-leverage change in the whole roadmap.
4. **Use the rail.** The template already puts captions in a side rail — use it for callout keys and
   marginalia instead of stuffing everything into the caption.
5. **Pair wide + detail.** One wide establishing shot (full-bleed) plus 1–2 tight 100%-scale detail
   crops beats one medium screenshot every time.
6. **Device frames only when the platform is the point** (mobile). Never frame desktop; never show
   browser chrome, OS chrome, tabs, or bookmarks.
7. **No player chrome, no letterboxing, no real user data.** Re-shoot or rebuild rather than ship a
   frame grab.
8. **Light + dark side by side** wherever the study's claim is about colour or theming.
9. **Recreate rather than omit for confidential work.** Rebuild in Figma with synthetic data and
   label it *"Recreated with synthetic data; original under NDA."* A labelled recreation is
   completely standard and beats a text wall.
10. **Every figure earns a caption that makes a claim,** not one that describes what's visible. Your
    existing captions already do this — keep that standard.
11. **Add `width`/`height` to the JSON** (the schema supports it) so the template can reserve space
    and avoid layout shift.

### 6.1 ChurchDesk — 4 existing, ~5 to add/replace · *highest priority*

| Priority | Figure | What it is | Notes |
|---|---|---|---|
| **P0** | **Re-source Fig. 01** | The vision sheet, clean | Reshoot the physical flipchart, or crop the video frame to kill the scrubber + letterbox bars. If neither, redraw it as a clean bilingual translation panel |
| **P0** | **Constraint-resolution diagram** | Priest availability ∩ cemetery hours ∩ standing commitments → what the funeral home sees | The section *"How the system fits together"* describes this in prose and shows nothing. This is the intellectual core of the study. Build it like the existing `/diagrams/*.svg` (theme-aware, embedded font) |
| **P0** | **Three-stakeholder map** | Funeral home / parish assistant / priest — what each needs, sees, controls | Serves the "three groups, three needs" section, which is currently pure text. **Content already exists in `page-03.png`** — redraw in English, in your visual language |
| **P1** | **Annotate `priest-availability.jpg`** | Same screenshot + 2 callouts: ① on-call set as a recurring event *in the existing calendar*, ② one event, multiple cemeteries | The caption already makes exactly these two claims; make them visible |
| **P1** | **Annotate `booking-form.jpg`** | Crop to the custom-field block; callout: "these fields are parish-configured via the existing form builder — Calendly's form is fixed" | Crop tighter; 1440px→648px is losing the field labels |
| **P2** | Mobile priest view | The priest confirming/declining a request on phone | You state web + mobile (React + React Native); currently only web is shown. **`page-09.png` has a request card with confirm/decline** to work from |
| **P2** | Adoption/impact panel | 20+ cemeteries, region map or simple bar; before/after coordination timeline | Turn the metrics into one visual |
| **P2** | Figma process artefact | A frame from the working file — explorations, the rejected standalone-module concept | Cheap seniority signal: shows the road not taken |

### 6.2 Bibel TV Color API — 1 existing, ~7 to add · *highest visual ROI in the portfolio*

A study about colour with one image. Every figure here converts skepticism directly.

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **The failure, side by side** | imgix/RGB extraction vs your OKLCH engine, same 8–12 artworks, same grid. Dark mode showing the beige/brown collapse; light mode showing the pink/rose collapse. **This is the most important missing image in the entire portfolio** — it makes your central claim self-evident in one glance |
| **P0** | **Perceptual-weight strip** | Same cards, RGB vs OKLCH, with a lightness/chroma readout under each. Proves "evenly-weighted theme" — currently pure assertion |
| **P0** | **Pipeline diagram** | artwork → k-means clusters → vibrance filter → role mapping (base/accent/text) → WCAG validation loop → JSON theme. The 6-step `process` section is text-only; this is a diagram begging to be drawn |
| **P1** | **Contrast-validation before/after** | A failing text/base pair, then the same pair after lightness+chroma adjustment, with both ratios labelled. Makes "AA/AAA with no manual checking" concrete |
| **P1** | **Annotated Color Lab crop** | Crop `color-lab.png` to the normalisation curves + hue-exclusion gradients (currently 3788px→648px, unreadable). Callouts: ① curves, ② hue exclusion, ③ live dual-mode preview |
| **P1** | **Light/dark parity pair** | Same content card, both modes, from one extracted palette |
| **P2** | **Restraint evidence** | One text colour vs two on a phone card, side by side — makes the "don't use it here" decision visible |
| **P2** | **Broadcast → app** | An on-air frame beside an app card in the same palette. Supports "the app should feel like the broadcast" |
| **P2** | Figma plugin in use | Designer pulling a theme from the API |

### 6.3 Ninox AI onboarding — 5 existing (all illegible), ~4 to add

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **Re-export all 5 at ~1300px** and crop | 3798px→648px is a 5.9× downscale; nothing is readable |
| **P0** | **Annotate `dual-paths.png`** | Crop to the seam. Callouts: ① chat iteration, ② direct-edit affordance on every card, ③ both converge on one schema. This is the study's thesis and currently the reader can't see it |
| **P1** | **The failure mode you rejected** | A mock of the chat-only alternative: a 12-table schema printed into a transcript, with the edit instruction the user would have to type. Makes "chat alone wouldn't work" a demonstration instead of an argument |
| **P1** | **Before/after gate** | The old manual schema-definition entry point vs the prompt entry point — shows what the gate actually was |
| **P2** | **Recovery sequence** | 3 frames: short prompt → wrong-ish schema → direct edit + suggested-action chip → corrected. Proves "first-schema-is-wrong, handled gracefully" |
| **P2** | Detail crop: table card affordances | 100% scale, the edit/add-field controls |

### 6.4 Bibel TV app redesign — 0 existing, ~7 needed

Zero images for a study claiming a visual-quality win. Non-negotiable.

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **Before / after, same screen** | Old app vs redesign, Mediathek home. The entire study rests on "the app looked a few years behind" and "now it doesn't" |
| **P0** | **Competitive frame** | Pray.com dark vs Bibel TV light, side by side. Makes the strategic bet legible in one image |
| **P0** | **Key screens** | Mediathek, Bible reading, reading plans — the three core areas named in the text and never shown |
| **P1** | **The premium-in-light argument** | An annotated teardown of *how*: elevation, warmth, contrast ratios, type scale, gradient handling. This is the craft claim; show the mechanics |
| **P1** | **Web vs Android gradient** | The rendering problem and the resolution. Told in prose three times, shown zero |
| **P2** | Validation artefact | The survey instrument or a results chart (n=40, 87%, 4.2/5) with method stated |
| **P2** | Broadcast rebrand alignment | On-air identity beside app UI |

### 6.5 Datameer — 1 existing, ~6 needed · all recreations

Confidential + five years old. Recreate with synthetic data and label it; that's standard practice.

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **Sample-uncertainty UI, before/after** | The lying empty preview vs your honest-uncertainty treatment. You have the *concept* diagram already (`datameer-sample-uncertainty.svg`); what's missing is the **designed solution**. The study says you "designed honest feedback" and never shows it |
| **P0** | **Design-org maturity before/after** | Execution-only (specs in, pixels out) → strategic partner with research access. Roles, rituals, where design sits in the decision path. Your most senior claim, currently one sentence |
| **P1** | **Team/org chart** | 3 designers, Berlin + NYC, reporting lines, how you split work across time zones |
| **P1** | **Design system 0→1** | A recreated component/token sheet — even a single page of the first unified visual language |
| **P1** | **Platform redesign, recreated** | The named artefacts: big-data pivot table, aggregated JSON structure view, result cards, filter system. Rebuild 2–3 in Figma with synthetic data |
| **P2** | **Research-access story** | The compliance path you navigated to get design into a bank — as a simple process diagram. This is the anecdote that proves the org claim |

### 6.6 Design System API — 2 existing, ~4 to add

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **The three-tier hierarchy, visualised** | primitives → semantic → component, with one token traced end to end (`--brand-primary`: OKLCH value → Kotlin → Swift → CSS → Figma variable). Makes the architecture graspable in one look |
| **P1** | **A real PR** | Token change → CI run → Style Dictionary output diff across platforms. Proof it's a service, not a diagram |
| **P1** | **Drift, before/after** | The four platforms' colour values diverging, then in step. Visualises the actual problem you solved |
| **P2** | Server-driven UI demo | Token changed server-side → app picks it up next launch (2 frames) |
| **P2** | Crop `design-system-tokens.jpg` | Currently a whole-window Figma capture |

### 6.7 Ninox org building — 0 existing, ~4 needed

The only leadership study is a text wall. These are the images that make leadership work *visible* —
and the same treatment applies to any future org study.

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **Meeting model, before/after** | Loudest-voice-first vs written agenda + prep time + sequential input + documented decisions. Redraw as two simple flow panels |
| **P1** | **An anonymised artefact** | A real agenda template, a decision record, or a critique format you introduced — redacted. Makes the practice tangible |
| **P1** | **Team/org structure** | Team of five + design lead, how design connected to product and engineering |
| **P2** | **Anonymised quote card** | From the engineer or your design lead, with permission. Highest-credibility single addition available to this study |

### 6.8 Agentic prototyping (merged) — 1 existing, ~4 to add

| Priority | Figure | What it is |
|---|---|---|
| **P0** | **The prototype itself** | A screen recording still or GIF of the code prototype running against real APIs. The whole thesis is "the prototype is the artefact" — show the artefact |
| **P1** | **Prototype code → production code** | A side-by-side diff or component-lineage panel showing what engineering actually reused |
| **P1** | **Real vs placeholder data** | The design problem real content surfaced (long German titles, missing artwork, edge-case metadata) |
| **P2** | Timeline comparison | Old cycle vs new, honestly measured on one named feature — with the number sourced |

### 6.9 Card covers and the halftone system

The halftone covers are beautiful and should stay in the system — as a **secondary** motif: section
dividers, OG/social images, the about page, and as a duotone field *behind or around* a real product
crop. They should not be the primary card image.

For the grid, each card needs: **a legible product crop** (or, for leadership studies, a diagram
crop) + **headline** + **role and scope** + **one number**. Today the cards show an abstract pattern
and the entire hero paragraph, with no outcome anywhere. Compare:

> *Today:* halftone dots · "When booking a priest isn't simple" · ChurchDesk · 2024–2025 · 60-word
> paragraph · four lowercase tags
>
> *Target:* the booking screen · "When booking a priest isn't simple" · **Head of Platform & Design ·
> 2 months · €20k** · "Coordination days → hours (**−70%**), 90% booking acceptance, 20+ cemeteries"

### 6.10 Suggested sequence

0. **Collapse `/for/` and `/work/` into one route tree.** *(1 hour.)* Do this before any template
   work or you'll make every subsequent fix twice.
1. **Routing fix** — give the homepage a default curated view, retire the legacy pages. *(1 afternoon,
   biggest single ROI.)*
2. **Scope bar + outcome strip + big-numeral metrics** in the template, fed from existing JSON
   fields. *(1 day, fixes §4.4 and §4.5 across all 11 studies at once.)*
3. **Card redesign** — real product crops, scope line, one number. *(1 day.)*
4. **Re-export and annotate what exists** — Ninox ×5, Color Lab, ChurchDesk ×2, re-source Fig. 01.
   *(2–3 days, no new work required, large perceived-quality jump.)*
5. **The three P0 diagrams** — ChurchDesk constraint resolution, Color API failure comparison, Color
   API pipeline. *(2–3 days; the failure comparison alone is worth the week.)*
6. **App redesign visuals** — before/after, competitive frame, three key screens. *(2 days; converts
   a 🟠 into a 🟡–🟢.)*
7. **Merge the two agentic studies; re-source every number.** *(half a day.)*
8. **Rebuild Datameer as the second leadership study** with recreated visuals. *(1 week, unlocks
   VP/CDO positioning.)*
9. **"How I lead" operating-model page.** *(2 days.)*
10. **Three third-party quotes** and links to shipped products/talks. *(a few emails.)*
11. **Schema reconciliation** and `status: published` on the studies you're standing behind.

---

## 7. Bottom line

The raw material is better than the packaging, and the writing is better than both. You are not
missing insight, seniority of thought, or technical credibility — all three are visibly present and
some of it is rare. What's missing is the **evidence layer**: scannable scope, front-loaded outcomes,
legible annotated visuals, and third-party corroboration.

Don't rewrite. **Re-package, and shoot the pictures.** Then rebuild Datameer, add the operating-model
page, and the Head-of-Design case stops resting on one anecdote.

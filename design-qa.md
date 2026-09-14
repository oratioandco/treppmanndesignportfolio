# Bespoke case-study pilot — design QA

## Status

Visual QA is open. The production build passes, but the revised page has not
yet been captured in a controlled browser viewport. Do not publish or roll this
renderer across the other studies until the comparison pass is complete and
Tobias approves the direction.

## Sources

- Existing portfolio system:
  - `/tmp/brand-audit-home-light.png`
  - `/tmp/portfolio-pilot-final-light-desktop.png` (superseded pilot)
- Layout reference:
  - `/tmp/brand-audit-kyle-reference.png`
- 2026 visual research:
  - Fireart: tactile brutalism, typography as architecture, explicit geometry,
    and semantic machine-readable structure.
  - Behance Design Trends 2026: deliberate imperfection, humanised letterforms,
    neo-minimalism with one strong element, and visible grids.
  - Wix: exaggerated hierarchy, tactile texture, elevated brutalism, and the
    warning that trend use still has to remain brand-specific and usable.
  - Captured Behance examples:
    `/tmp/trend-brutalist-1.png`,
    `/tmp/trend-brutalist-2.png`,
    `/tmp/trend-brutalist-3.png`,
    `/tmp/trend-type-1.png`.

## Direction

Technical print object, not a generic editorial template:

- warm cream and deep green remain the permanent light/dark identity;
- Switzer carries scan-critical hierarchy;
- Redaction 20 interrupts one project-specific phrase and the core principle;
- the actual per-study flow-field motif carries from the portfolio card into
  the page rather than adding a stock hero image or decorative gradient;
- sharp rules and visible evidence replace rounded cards, shadows and bento
  compartments;
- content-driven asymmetry replaces the repeated numbered chapter rail.

## Changes after user review

1. User rejected the coral variant because recolouring retained the appearance
   of a Claude artifact.
2. User clarified that the requirement is bespoke web design, not merely an
   on-brand template.
3. Removed the 01–05 context/problem/solution/evidence/contact spine and the
   “Project argument” label.
4. Rebuilt the hero as a project-specific poster using the existing
   concentric-rings flow field and a single Redaction interruption in
   “LLM-safe.”
5. Rebuilt the narrative as an asymmetric evidence composition: a wide real
   artifact, narrow copy measure, a technical mechanism band, and before/after
   outcome lines rather than metric cards.
6. Kept semantic heading order, direct mail links, visible focus rules and the
   full-size evidence link. Verified case-study copy and claims are unchanged.
7. Static Redaction usage was normalized to Redaction 20 across the pilot and
   existing case-study renderer. Redaction 35/50/70 remain available only as
   transient states inside the site's animated typography.
8. The hero flow field now preserves its square 200×200 coordinate system and
   uses nearest-neighbour scaling. The visible pixels are crisp and deliberate
   instead of bilinear blur caused by stretching the canvas to a rectangle.
9. Large hero titles, section headlines and pull quotes now combine balanced or
   pretty wrapping with render-time non-breaking joins across their final three
   words. This prevents one-word closing lines deterministically across the
   pilot and existing case-study renderer; CSS widows/orphans remain as print
   and fragmented-layout safeguards.
10. User review found the visual direction successful but the default reading
    path too long. The pilot now shows the problem lead and conclusion by
    default, keeps the intermediate verified reasoning in a native disclosure,
    and reduces oversized vertical spacing in the hero, principle, sections and
    contact close. No source material was deleted or rewritten.

## Verification

- `npm run build`: passed.
- 441 pages generated.
- Image check: passed.
- Public-output policy check: passed.
- Known unrelated advisory remains: Telekom tailored CV freshness.
- Scope: the renderer remains limited to the LLM-safe pilot on canonical and
  tailored routes.
- Unrelated working-tree changes remain untouched.

## Required captures

- 1440 × 1100 light viewport and full page
- 1440 × 1100 dark viewport and full page
- 390 × 844 light viewport and full page
- 390 × 844 dark viewport and full page
- one tailored pilot route
- one non-pilot route
- combined source / previous pilot / revised pilot comparison

## Final result

final result: blocked — controlled browser capture is unavailable because the
Chrome extension is not attached to the local QA tab.

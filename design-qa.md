# Narrative Spine design QA

## Comparison target

- Source visual truth: `/Users/ttreppmann/.codex/generated_images/01a05c27-94fc-73a3-bf5c-a5f2f689e870/exec-8a187af5-70cb-408e-b6b9-cb8844bcce66.png`
- Implemented route: `http://127.0.0.1:4321/case-studies/bibeltv-llm-safe-design-system`
- Desktop implementation evidence:
  - light: `/tmp/narrative-spine-light-desktop-v2.png`
  - dark: `/tmp/narrative-spine-dark-desktop-v2.png`
  - full light page: `/tmp/narrative-spine-light-desktop-full-v2.png`
- Responsive implementation evidence:
  - tablet: `/tmp/narrative-spine-light-tablet-v2.png`
  - mobile: `/tmp/narrative-spine-light-mobile-final.png`
  - full mobile page: `/tmp/narrative-spine-light-mobile-full-v2.png`
- Combined source/implementation comparison: `/tmp/narrative-spine-desktop-comparison-v2.png`

## Normalization and state

- Source pixels: 1512 × 1040. It presents the same page geometry in light and dark mode side by side.
- Desktop implementation: 1440 × 1100 CSS pixels and captured pixels, device scale 1. Light and dark were captured at the same viewport and scroll position.
- Tablet implementation: 834 × 1194 CSS pixels and captured pixels, device scale 1.
- Mobile implementation: 390 × 844 CSS pixels and captured pixels, device scale 1.
- The combined comparison keeps the 1512-pixel source width and scales each desktop implementation capture to 756 pixels before stacking the pair beneath the source. This normalizes the paired presentation without stretching either page.
- State: canonical case-study route, page top, no menus or dialogs open. The dark implementation capture used the existing `data-theme="dark"` token state; the temporary markup override used only for capture was removed afterward.

## Full-view comparison evidence

The combined comparison was inspected directly. The implementation preserves the selected direction's defining geometry: quiet three-part top rail, numbered left narrative rail, broad sans-serif title, compact role/context, project argument, editorial callout, problem, solution, evidence and contact sequence. Light and dark use identical geometry and content.

The implementation deliberately carries the full verified MVP copy rather than the abbreviated text visible in the generated mock. After the first correction, the problem begins at 821px and the real artifact begins at 1098px in the 1100px desktop viewport. That keeps the project argument and concrete problem in the first screen while placing evidence directly at the fold without deleting content.

The original product screenshot is rendered literally in both themes. It is not recolored or inverted. On mobile it sits in a horizontally scrollable evidence field and links to the full-size source image.

## Focused comparison evidence

The title/argument/callout region was inspected at the original 1440 × 1100 desktop capture size in both themes. The selected sans-serif hierarchy, compact mono metadata, serif callout and one-pixel rule system remain distinct and readable. The full-page desktop and mobile captures were separately inspected for content order, image treatment, metrics and contact closure; no additional crop was required because those captures keep the relevant regions readable at native size.

## Required fidelity surfaces

- **Fonts and typography:** Switzer carries the title, headings and body; Departure Mono carries structural labels; Gambarino carries the principle. The title holds to two lines at 1440px and four readable lines at 390px. No essential content uses the pixelated Redaction display face.
- **Spacing and layout rhythm:** The desktop grid aligns the numbered rail and main story column. Fine rules separate sections without cards, radii or elevation. The layout stacks at 58rem so the intermediate tablet width does not compress the argument column.
- **Colors and tokens:** The existing warm-light and ink-green theme tokens are preserved. The local coral signal color measures 4.87:1 on the light background and 6.35:1 on the dark background. Primary text measures 15.79:1 in light mode and 12.05:1 in dark mode; muted dark text measures 6.17:1.
- **Image quality and asset fidelity:** The real 1280 × 800 BibelTV token screenshot is used at its native aspect ratio with no recoloring, fake UI or placeholder. The source asset remains sharp at desktop width and is available full-size from the mobile crop.
- **Copy and content:** All case-study claims, metrics, process steps and teaser copy render from the existing published study JSON. No source content was edited and no new impact claim was added.
- **Icons:** The implementation uses no decorative or substitute icons. The mock's compressed solution checks become the study's real numbered process steps; this preserves the selected hierarchy without introducing an icon dependency or reducing verified content.
- **Responsiveness:** Final document widths equal viewport widths at 1440, 834 and 390 pixels. No page-level horizontal overflow remains. Mobile media overflow is contained inside the evidence figure by design.
- **Accessibility and behavior:** Heading order is semantic. Back navigation, both contact controls and the full-size evidence link are keyboard reachable in that order. Focus indicators are explicit. The image has descriptive alt text. Reduced-motion rules remain in place. Browser console: 0 errors. The contact controls were verified enabled; QA did not activate the `mailto:` destination because opening an external composer was unnecessary.

## Comparison history

### Pass 1 — blocked

- **P2 — Opening remained hero-heavy.** The first implementation wrapped the title over three lines and pushed the problem and artifact too far below the selected composition.
- **Fix:** Reduced top-rail and context padding, lowered the desktop title maximum from 6.1rem to 4.75rem, widened its measure, and tightened the principle block without removing copy.
- **Post-fix evidence:** `/tmp/narrative-spine-light-desktop-v2.png` and `/tmp/narrative-spine-dark-desktop-v2.png`. The title now holds to two lines; the problem begins at 821px and the artifact at 1098px.

### Pass 2 — blocked

- **P2 — Tablet overflow.** At 834px the first responsive pass produced a 860px document width and clipped the argument column.
- **Fix:** Moved the stacked narrative breakpoint to 58rem while preserving the narrower 48rem page gutters for phones.
- **Post-fix evidence:** `/tmp/narrative-spine-light-tablet-v2.png`. At an 834px viewport the final document width is 834px with no console errors.

### Pass 3 — passed

- Desktop light/dark, tablet and mobile now have no actionable P0, P1 or P2 mismatch.
- The canonical route, a tailored Doctolib route and an unrelated fundraising study were checked. The selected renderer appears on the LLM-safe study; the unrelated route retains the existing renderer.

## Follow-up polish

- **P3:** The mock places more of the artifact inside the first screen because it uses abbreviated problem copy. The implementation keeps the full verified MVP text and positions the artifact at the fold. Revisit only if Tobias chooses to alter the content model, not as an unreviewed CSS shortcut.

final result: passed

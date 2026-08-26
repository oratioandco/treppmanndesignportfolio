// Generative "poster" motifs for case-study cards, inspired by whorl.app's
// technique: one small stencil shape, echoed many times through a rotation
// or translation sweep, rendered as filled shapes with simulated directional
// light rather than flat strokes. Runs entirely client-side against
// <svg class="echo-svg" data-slug="..."> placeholders — see
// CaseStudyCard.astro for the markup and MOTIF_ASSIGNMENTS below for how a
// case study's slug maps to a mechanism.
//
// To add a new case study's motif or curate one still on the hash fallback,
// see .claude/skills/case-study-motif/SKILL.md — that's the judgment
// process this file's MOTIF_ASSIGNMENTS records the results of.
//
// Performance notes (measured, not guessed — see conversation history):
//   - feDropShadow / filter:drop-shadow on an animating group re-rasterizes
//     the whole alpha silhouette every frame. Removed; depth comes from a
//     static CSS shadow (.cs-card-art::before in CaseStudyCard.astro) instead.
//   - transform-box:fill-box forces a bounding-box recompute per element
//     per frame. Replaced with a fixed numeric transform-origin per node.
//   - filter:brightness() in the tumble keyframe is a repaint; opacity is
//     compositor-only. Switched to opacity.
//   - Element COUNT is what actually drives frame cost, not the above.
//     Animating all 648 elements of the densest ring mechanism measured
//     13fps on hover; animating a 1-in-8 stride (81 elements, rest static
//     for density) measured 46fps with no visible loss of texture.

const NS = "http://www.w3.org/2000/svg";

function toRGB(str) {
  if (str.startsWith("#")) {
    return str.match(/\w\w/g).map((h) => parseInt(h, 16));
  }
  return str.match(/[\d.]+/g).slice(0, 3).map(Number);
}

function lerpColor(a, b, t) {
  const pa = toRGB(a);
  const pb = toRGB(b);
  const rgb = pa.map((c, i) => Math.round(c + (pb[i] - c) * t));
  return `rgb(${rgb.join(",")})`;
}

function shade(hex, amount) {
  return amount >= 0
    ? lerpColor(hex, "#ffffff", Math.min(amount, 1))
    : lerpColor(hex, "#000000", Math.min(-amount, 1));
}

// deterministic pseudo-random so a given slug always renders the same motif
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---------------------------------------------------------------------
// Mechanisms — each returns an array of nodes: { d, transform|angle,
// lightAngle, origin: [x,y], color?, t }. `t` (0..1) drives palette
// position when no explicit `color` is set; `origin` is the node's own
// local pivot for the tumble animation (see buildEchoField).
// ---------------------------------------------------------------------

// Sunburst: jagged needle spikes radiating from center — rapid iteration /
// generative variation radiating out from one idea. Spike length is
// jittered so the outer edge reads as a burst, not a ring.
function makeSunburst(cfg) {
  const rand = mulberry32(cfg.seed);
  // vary copies/radius/center per seed too, not just per-spike jitter —
  // otherwise every sunburst is "the same star" with different noise
  const copies = cfg.copies + Math.floor(rand() * 24) - 12; // ±12
  const lenMin = cfg.lenMin * (0.7 + rand() * 0.5);
  const lenMax = cfg.lenMax * (0.85 + rand() * 0.35);
  const centerOffset = 10; // how far the burst's origin can drift from dead-center
  const cx = 100 + (rand() - 0.5) * 2 * centerOffset;
  const cy = 100 + (rand() - 0.5) * 2 * centerOffset;
  const startAngle = rand() * 360;

  const nodes = [];
  for (let i = 0; i < copies; i++) {
    const angle = startAngle + (360 / copies) * i;
    const rad = (angle * Math.PI) / 180;
    const len = lenMin + rand() * (lenMax - lenMin);
    const width = 1.4 + rand() * 1.8;
    const ux = Math.cos(rad), uy = Math.sin(rad);
    const px = -uy, py = ux; // perpendicular, for the spike's base width
    const tipX = cx + ux * len, tipY = cy + uy * len;
    const d =
      `M${(cx - px * width).toFixed(1)},${(cy - py * width).toFixed(1)} ` +
      `L${tipX.toFixed(1)},${tipY.toFixed(1)} ` +
      `L${(cx + px * width).toFixed(1)},${(cy + py * width).toFixed(1)} Z`;
    nodes.push({
      d,
      // the angle is already baked into the path's absolute coordinates
      // above (unlike the other mechanisms' spikes), so this must NOT also
      // go through buildEchoField's rotate(angle,100,100) fallback —
      // "rotate(0)" (not "", which is falsy and would fall through to it)
      transform: "rotate(0)",
      lightAngle: angle,
      origin: [cx, cy],
      t: i / (copies - 1),
    });
  }
  return nodes;
}

// Woven band: a shape translates + twists along a line, wobbling
// perpendicular to it. `phase` shifts the wobble so two opposite-phase
// calls (see makeDoubleHelix) read as two strands winding around each
// other rather than one ribbon.
function makeWeaveBand(cfg) {
  const nodes = [];
  const [x1, y1] = cfg.from,
    [x2, y2] = cfg.to;
  const dx = x2 - x1,
    dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len,
    uy = dy / len;
  const px = -uy,
    py = ux;
  const baseAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  const phase = cfg.phase || 0;

  for (let i = 0; i < cfg.copies; i++) {
    const t = i / (cfg.copies - 1);
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;
    const wobble = Math.sin(t * Math.PI * cfg.cycles + phase) * cfg.amplitude;
    const ox = cx + px * wobble;
    const oy = cy + py * wobble;
    const twist = baseAngle + Math.sin(t * Math.PI * cfg.cycles + phase) * 35;
    nodes.push({
      d: cfg.shape,
      transform: `translate(${ox.toFixed(2)} ${oy.toFixed(2)}) rotate(${twist.toFixed(1)})`,
      lightAngle: twist,
      origin: [0, 0], // cfg.shape is authored centered on its own local origin
      t,
    });
  }
  return nodes;
}

// Double helix: two parties/systems winding around each other, meeting and
// diverging — a relationship, integration, or negotiation between two.
function makeDoubleHelix(cfg) {
  return makeWeaveBand({ ...cfg, phase: 0 }).concat(
    makeWeaveBand({ ...cfg, phase: Math.PI })
  );
}

// Interlocking rings: several stakeholders' conflicting schedules
// reconciled into one model — a Venn diagram of overlapping ring
// "ribbons". Each ring is built from concentric hatched tracks at fixed
// offsets/colors (a tube cross-section), not a lighting gradient.
function makeInterlockRings(cfg) {
  const nodes = [];
  cfg.centers.forEach(([cx, cy]) => {
    cfg.bands.forEach((band, bandIndex) => {
      const r = cfg.radius + band.offset;
      for (let i = 0; i < cfg.ticksPerRing; i++) {
        const angle = (360 / cfg.ticksPerRing) * i;
        const rad = (angle * Math.PI) / 180;
        const px = cx + Math.cos(rad) * r;
        const py = cy + Math.sin(rad) * r;
        nodes.push({
          d: cfg.tick,
          transform: `translate(${px.toFixed(2)} ${py.toFixed(2)}) rotate(${(angle + 90).toFixed(1)})`,
          color: band.color,
          lightAngle: angle,
          origin: [0, 0], // cfg.tick is authored centered on its own local origin
          t: bandIndex / (cfg.bands.length - 1 || 1),
        });
      }
    });
  });
  return nodes;
}

// ---------------------------------------------------------------------
// Brand palette — fixed across every card. The story lives in the SHAPE,
// not a different hue per case study. Matches the site's real tokens.
// ---------------------------------------------------------------------
const BRAND_COLORS = ["#4f8375", "#a4c6b9", "#f4f1ea"];

const MECHANISMS = {
  sunburst: {
    generate: (seed) =>
      makeSunburst({ copies: 56, lenMin: 30, lenMax: 80, seed }),
    colors: BRAND_COLORS,
    opacity: [0.95, 0.2],
    rotateWhole: true,
  },
  // NOTE: every generate() here takes `seed` and uses it to vary the
  // mechanism's own parameters (not just jitter within a fixed shape) —
  // otherwise every case study sharing a mechanism renders pixel-identical
  // geometry, which is exactly what happened before this comment existed:
  // double-helix and interlock-rings both ignored the seed entirely, so
  // all 5 studies on each mechanism were the same image. Vary enough that
  // two studies on the same mechanism are visibly different works, not
  // just different colors of the same one.
  "double-helix": {
    generate: (seed) => {
      const rand = mulberry32(seed);
      // rotate the diagonal the strands travel around the card's center,
      // and vary amplitude/cycles/kite size — same "two strands" story,
      // a genuinely different weave per study
      const angle = rand() * Math.PI * 2;
      const cx = 100, cy = 100, reach = 80;
      const from = [cx - Math.cos(angle) * reach, cy - Math.sin(angle) * reach];
      const to = [cx + Math.cos(angle) * reach, cy + Math.sin(angle) * reach];
      const amplitude = 15 + rand() * 14; // 15..29
      const cycles = 2 + Math.floor(rand() * 3); // 2..4, integer for a clean loop
      const kiteW = 6 + rand() * 4; // 6..10
      const kiteL = kiteW * (1.3 + rand() * 0.5);
      return makeDoubleHelix({
        copies: 34,
        from,
        to,
        amplitude,
        cycles,
        shape: `M-${kiteW.toFixed(1)},0 L0,-${kiteL.toFixed(1)} L${kiteW.toFixed(1)},0 L0,${kiteL.toFixed(1)} Z`,
      });
    },
    colors: BRAND_COLORS,
    opacity: [0.95, 0.3],
    rotateWhole: false,
  },
  "interlock-rings": {
    tumbleStride: 8,
    generate: (seed) => {
      const rand = mulberry32(seed);
      // rotate where the 3 rings sit around the center, and vary their
      // spacing/radius/density — same "3 overlapping cycles" story, a
      // genuinely different Venn diagram per study
      const rotation = rand() * Math.PI * 2;
      const spacing = 20 + rand() * 10; // 20..30 — how far the 3 centers sit apart
      const radius = 38 + rand() * 14; // 38..52 — how big each ring is
      const centers = [0, 1, 2].map((i) => {
        const a = rotation + (i * Math.PI * 2) / 3;
        return [100 + Math.cos(a) * spacing, 100 + Math.sin(a) * spacing];
      });
      return makeInterlockRings({
        centers,
        radius,
        ticksPerRing: 72,
        tick: "M-1.1,-4.6 C-1.1,-5.5 1.1,-5.5 1.1,-4.6 L1.1,4.6 C1.1,5.5 -1.1,5.5 -1.1,4.6 Z",
        bands: [
          { offset: -9, color: "#4f8375" },
          { offset: 0, color: "#1a2520" },
          { offset: 9, color: "#f4f1ea" },
        ],
      });
    },
    colors: BRAND_COLORS,
    opacity: [0.98, 0.3],
    rotateWhole: true,
  },
};

// Explicit, theme-grounded assignments — curated via
// .claude/skills/case-study-motif. Unknown slugs fall back to a
// deterministic hash across the three mechanisms — always the SAME
// mechanism for a given slug, just not a curated one until someone adds
// it here.
const MOTIF_ASSIGNMENTS = {
  "churchdesk-booking-system": "interlock-rings", // 3 stakeholders' schedules reconciled into one model
  "bibeltv-color-api": "interlock-rings", // brand warmth, WCAG contrast, and light/dark mode reconciled into one engine
  "bibeltv-llm-safe-design-system": "interlock-rings", // three enforcement layers, doing three different jobs, converging into one system
  "datameer-data-dense-analytics": "interlock-rings", // many data dimensions reconciled into one legible view

  "leading-a-team-is-a-design-problem": "double-helix", // one working relationship rebuilt into rhythm (formerly ninox-org-building, anonymized)
  "bibeltv-app-redesign": "double-helix", // the light-mode bet held against the competitor's approach, resolved together
  "bibeltv-support-agent": "double-helix", // AI draft and human decision, paired, never fully merging
  "ninox-ai-onboarding": "double-helix", // AI capability and user control, balanced together
  "bibeltv-ai-fundraising": "double-helix", // AI generation and a human deciding what actually goes out, paired

  "bibeltv-ai-prototyping": "sunburst", // rapid iteration, generative variation
  "bibeltv-agentic-engineering": "sunburst", // collapsing the design-to-ship pipeline into one accelerated loop
  "bibeltv-design-system-api": "sunburst", // one token source radiating out to iOS, Android, web, and Figma
  "spreadshirt-user-research-strategy": "sunburst", // one prototype's insight radiating out to redirect company strategy
  "bibeltv-metadata-extraction": "sunburst", // one system radiating out to handle most fields, deliberately leaving one out

  // route slugs that aren't case-study data ids (hand-authored /case-studies/ pages)
  "shipping-ai": "interlock-rings", // a support copilot, a campaign generator, and a prototyping practice — 3 initiatives converging into one flagship practice (was sunburst, but that duplicated bibeltv-ai-prototyping's shape on the same homepage grid)
};

const MECHANISM_KEYS = Object.keys(MECHANISMS);

function resolveMechanism(slug) {
  if (MOTIF_ASSIGNMENTS[slug]) return MOTIF_ASSIGNMENTS[slug];
  const idx = hashStr(slug || "default") % MECHANISM_KEYS.length;
  return MECHANISM_KEYS[idx];
}

// ---------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------
const LIGHT_SOURCE = -40; // degrees — fixed, so a spinning motif visibly sweeps a highlight across itself

function buildEchoField(svg, mechanismKey) {
  const cfg = MECHANISMS[mechanismKey];
  const seed = hashStr(svg.dataset.slug || mechanismKey);

  const group = document.createElementNS(NS, "g");
  group.setAttribute("class", "echo-group");
  const nodes = cfg.generate(seed);
  const waves = cfg.tumbleWaves ?? 5;
  const tumbleDur = cfg.tumbleDuration ?? 3.6;
  const stride = cfg.tumbleStride ?? 1;

  nodes.forEach((node, i) => {
    const t = node.t;

    let baseColor;
    if (node.color) {
      baseColor = node.color;
    } else {
      const colorT = t < 0.5 ? t * 2 : (1 - t) * 2;
      baseColor =
        t < 0.75
          ? lerpColor(cfg.colors[0], cfg.colors[1], Math.min(colorT, 1))
          : lerpColor(cfg.colors[1], cfg.colors[2], (t - 0.75) * 4);
    }

    const centerDist = Math.abs(t - 0.5) * 2;
    const opacity =
      cfg.opacity[0] - (cfg.opacity[0] - cfg.opacity[1]) * centerDist;

    const la = node.lightAngle ?? node.angle ?? 0;
    const facing = Math.cos(((la - LIGHT_SOURCE) * Math.PI) / 180);
    const shadeAmount = node.color ? 0.22 : 0.55;
    const lit = shade(baseColor, facing * shadeAmount);
    const edgeShadow = shade(baseColor, -0.4 - (1 - facing) * 0.12);

    const holder = document.createElementNS(NS, "g");
    holder.setAttribute(
      "transform",
      node.transform || `rotate(${node.angle.toFixed(2)} 100 100)`
    );

    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", node.d);
    path.setAttribute("fill", lit);
    path.setAttribute("stroke", edgeShadow);
    path.setAttribute("stroke-width", 0.6);
    const [ox, oy] = node.origin || [0, 0];
    path.style.transformOrigin = `${ox}px ${oy}px`;
    path.style.setProperty("--base-opacity", opacity.toFixed(3));
    path.style.opacity = opacity.toFixed(3);

    if (i % stride === 0) {
      path.classList.add("tumble-el");
      const phase = ((i / nodes.length) * waves) % 1;
      path.style.animationDelay = `${(-phase * tumbleDur).toFixed(3)}s`;
      path.style.animationDuration = `${tumbleDur}s`;
    }

    holder.appendChild(path);
    group.appendChild(holder);
  });

  svg.appendChild(group);
  if (!cfg.rotateWhole) svg.classList.add("no-whole-spin");
}

function init() {
  document.querySelectorAll(".echo-svg:not([data-built])").forEach((svg) => {
    const mechanism = svg.dataset.mechanism || resolveMechanism(svg.dataset.slug);
    buildEchoField(svg, mechanism);
    svg.dataset.built = "true";
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

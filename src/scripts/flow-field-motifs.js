// Case-study card motif engine — flow field + shape-as-obstacle, on canvas.
// Supersedes the SVG "echo" system in poster-motifs.js (kept in the repo,
// unused, as the one-line revert). Prototyped and approved across several
// rounds in-session: on-path -> particle swarm with pseudo-3D depth cueing ->
// flow field with the shape as an obstacle particles channel along / bounce
// off -> pointer/touch displacement -> this file.
//
// Why a flow field instead of on-path: particles roam a noise-driven field
// across the whole card, and the case study's shape acts as an obstacle that
// channels nearby particles along its tangent and repels ones that get too
// close. Far from the shape, motion is chaotic ambient wandering; near it,
// the shape reads clearly. This is what gives the "moving particle image"
// quality instead of a rigid spinning disc.
//
// Zero idle cost, more strictly than the SVG version's CSS animation-pause:
// the rAF loop is only ever scheduled while a card is hovered/focused. No
// canvas draws a single frame while idle.
//
// See .claude/skills/case-study-motif/SKILL.md for how a case study's shape
// is chosen — the same judgment applies here; only the mechanism changed.

const BRAND = ["#4f8375", "#a4c6b9", "#f4f1ea"];

function hashStr(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function toRGB(hex) {
  return hex.match(/\w\w/g).map((h) => parseInt(h, 16));
}

function colorFor(t) {
  const [a, b, mix] = t < 0.5 ? [BRAND[0], BRAND[1], t * 2] : [BRAND[1], BRAND[2], (t - 0.5) * 2];
  const rgbA = toRGB(a), rgbB = toRGB(b);
  return rgbA.map((c, i) => Math.round(c + (rgbB[i] - c) * mix));
}

// Cheap analytic pseudo-noise (sum of sines). `personal` is a per-particle
// phase offset so nearby particles don't sample the same field value and
// collapse onto the same few streamlines — without it the flow reads as a
// handful of coherent lanes instead of broad, organic coverage.
function noiseAngle(x, y, time, personal) {
  return (
    Math.sin(x * 0.045 + time * 0.35 + personal) * 1.4 +
    Math.cos(y * 0.05 - time * 0.28 + personal * 0.7) * 1.4 +
    Math.sin((x + y) * 0.03 + time * 0.15 - personal * 0.5) * 1.0 +
    Math.sin(x * 0.11 - y * 0.09 + time * 0.5 + personal * 1.3) * 0.9
  );
}

// ---------------------------------------------------------------------
// Obstacles: each is a function (x, y) => { dist, tangent }. A "field" is
// an array of these; particles are influenced by whichever is closest each
// frame. This is what lets one case study mix several differently-shaped
// obstacles (not N copies of one shape) in the same field.
// ---------------------------------------------------------------------
function circleObstacle(cx, cy, r) {
  return (x, y) => {
    const dx = x - cx, dy = y - cy;
    const dist = Math.hypot(dx, dy);
    return { dist: Math.abs(dist - r), tangent: Math.atan2(dy, dx) + Math.PI / 2 };
  };
}

function segmentObstacle(x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const len2 = dx * dx + dy * dy || 1;
  const tangent = Math.atan2(dy, dx);
  return (x, y) => {
    let t = ((x - x1) * dx + (y - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + dx * t, py = y1 + dy * t;
    return { dist: Math.hypot(x - px, y - py), tangent };
  };
}

// A closed or open path, sampled into a chain of segment obstacles — this is
// how a curve (helix, spike, spiral) becomes something the closest-wins
// obstacle system can use, without a dedicated curve case.
function pathObstacles(fn, samples = 28, closed = false) {
  const pts = Array.from({ length: samples + (closed ? 0 : 1) }, (_, i) =>
    fn(i / samples)
  );
  const segs = [];
  const count = closed ? pts.length : pts.length - 1;
  for (let i = 0; i < count; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length];
    segs.push(segmentObstacle(a.x, a.y, b.x, b.y));
  }
  return segs;
}

function nearestObstacle(field, x, y) {
  let best = { dist: Infinity, tangent: 0 };
  for (const ob of field) {
    const r = ob(x, y);
    if (r.dist < best.dist) best = r;
  }
  return best;
}

// ---------------------------------------------------------------------
// Shape families — the flow-field equivalent of poster-motifs.js's three
// mechanisms. Each returns an obstacle field, seed-varied structurally
// (not just palette) so every case study sharing a family still reads as
// a distinct shape.
// ---------------------------------------------------------------------
const SHAPES = {
  "interlock-rings": (seed) => {
    const rand = mulberry32(seed);
    const count = 3;
    const baseR = 30 + rand() * 12;
    const centerX = 100 + (rand() - 0.5) * 16;
    const centerY = 100 + (rand() - 0.5) * 16;
    const spread = 18 + rand() * 14;
    const field = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.6;
      const cx = centerX + Math.cos(angle) * spread;
      const cy = centerY + Math.sin(angle) * spread;
      const r = baseR * (0.85 + rand() * 0.3);
      field.push(circleObstacle(cx, cy, r));
    }
    return field;
  },

  "double-helix": (seed) => {
    const rand = mulberry32(seed);
    const amplitude = 34 + rand() * 18;
    const cycles = 1.4 + rand() * 1.1;
    const xStart = 24 + rand() * 10;
    const xEnd = 176 - rand() * 10;
    const phase0 = rand() * Math.PI * 2;
    const strand = (offset) =>
      pathObstacles((t) => ({
        x: xStart + (xEnd - xStart) * t,
        y: 100 + Math.sin(t * Math.PI * 2 * cycles + phase0 + offset) * amplitude,
      }), 26);
    return [...strand(0), ...strand(Math.PI)];
  },

  sunburst: (seed) => {
    const rand = mulberry32(seed);
    const cx = 100 + (rand() - 0.5) * 10;
    const cy = 100 + (rand() - 0.5) * 10;
    const spikes = 7 + Math.floor(rand() * 5);
    const innerR = 14 + rand() * 8;
    const field = [];
    for (let i = 0; i < spikes; i++) {
      const angle = (i / spikes) * Math.PI * 2 + rand() * 0.3;
      const len = 46 + rand() * 30;
      const x1 = cx + Math.cos(angle) * innerR;
      const y1 = cy + Math.sin(angle) * innerR;
      const x2 = cx + Math.cos(angle) * (innerR + len);
      const y2 = cy + Math.sin(angle) * (innerR + len);
      field.push(segmentObstacle(x1, y1, x2, y2));
    }
    return field;
  },
};

const SHAPE_KEYS = Object.keys(SHAPES);

// Same per-slug curation as poster-motifs.js's MOTIF_ASSIGNMENTS — kept in
// sync deliberately; see that file's table for the one-clause reasoning
// behind each assignment. A slug not listed here falls back to a
// deterministic hash pick, same as before.
const SHAPE_ASSIGNMENTS = {
  "churchdesk-booking-system": "interlock-rings",
  "bibeltv-color-api": "interlock-rings",
  "bibeltv-llm-safe-design-system": "interlock-rings",
  "datameer-data-dense-analytics": "interlock-rings",

  "leading-a-team-is-a-design-problem": "double-helix",
  "bibeltv-app-redesign": "double-helix",
  "bibeltv-support-agent": "double-helix",
  "ninox-ai-onboarding": "double-helix",
  "bibeltv-ai-fundraising": "double-helix",

  "bibeltv-ai-prototyping": "sunburst",
  "bibeltv-agentic-engineering": "sunburst",
  "bibeltv-design-system-api": "sunburst",
  "spreadshirt-user-research-strategy": "sunburst",
  "bibeltv-metadata-extraction": "sunburst",
};

function resolveShape(slug) {
  const key = SHAPE_ASSIGNMENTS[slug] || SHAPE_KEYS[hashStr(slug || "default") % SHAPE_KEYS.length];
  const seed = hashStr(slug || key);
  return { field: SHAPES[key](seed), seed };
}

// ---------------------------------------------------------------------
// Per-canvas runtime
// ---------------------------------------------------------------------
const CHANNEL_RADIUS = 14;
const POINTER_RADIUS = 30;
const SIZE = 200;

function initCanvas(canvas) {
  const slug = canvas.dataset.slug || "default";
  const ctx = canvas.getContext("2d");
  const { field, seed } = resolveShape(slug);

  const particleSeedRand = mulberry32(seed * 104729 + 1);
  const COUNT = 700; // single active canvas at a time (hover-gated) — profiled headroom well above this
  const particles = Array.from({ length: COUNT }, () => ({
    x: particleSeedRand() * SIZE,
    y: particleSeedRand() * SIZE,
    angle: particleSeedRand() * Math.PI * 2,
    speed: 0.4 + particleSeedRand() * 0.5,
    colorT: particleSeedRand(),
    len: 0.4 + particleSeedRand() * 0.7,
    personal: particleSeedRand() * Math.PI * 2,
  }));

  const pointer = { x: -1000, y: -1000, target: 0, strength: 0 };
  let time = 0;
  let rafId = null;
  let active = false;

  function setPointerFromClient(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    pointer.x = ((clientX - rect.left) / rect.width) * SIZE;
    pointer.y = ((clientY - rect.top) / rect.height) * SIZE;
    pointer.target = 1;
  }

  function frame() {
    time += 0.016;
    ctx.fillStyle = "rgba(26,37,32,0.05)";
    ctx.fillRect(0, 0, SIZE, SIZE);
    pointer.strength += (pointer.target - pointer.strength) * 0.12;

    for (const p of particles) {
      const free = noiseAngle(p.x, p.y, time, p.personal);
      const { dist, tangent } = nearestObstacle(field, p.x, p.y);
      const channelWeight = Math.max(0, 1 - dist / CHANNEL_RADIUS);

      let vx = Math.cos(free), vy = Math.sin(free);
      if (channelWeight > 0) {
        vx += Math.cos(tangent) * channelWeight * 2.2;
        vy += Math.sin(tangent) * channelWeight * 2.2;
      }

      let pointerT = 0;
      if (pointer.strength > 0.01) {
        const pdx = p.x - pointer.x, pdy = p.y - pointer.y;
        const pdist = Math.hypot(pdx, pdy);
        if (pdist < POINTER_RADIUS) {
          pointerT = (1 - pdist / POINTER_RADIUS) * pointer.strength;
          const repelAngle = Math.atan2(pdy, pdx);
          const swirlAngle = repelAngle + Math.PI / 2;
          vx += (Math.cos(repelAngle) * 0.8 + Math.cos(swirlAngle) * 0.6) * pointerT * 3.2;
          vy += (Math.sin(repelAngle) * 0.8 + Math.sin(swirlAngle) * 0.6) * pointerT * 3.2;
        }
      }

      const targetAngle = Math.atan2(vy, vx);
      const da = Math.atan2(Math.sin(targetAngle - p.angle), Math.cos(targetAngle - p.angle));
      p.angle += da * (0.15 + pointerT * 0.35);

      const speedBoost = 1 + pointerT * 1.8;
      p.x += Math.cos(p.angle) * p.speed * speedBoost;
      p.y += Math.sin(p.angle) * p.speed * speedBoost;
      if (p.x < 0) p.x += SIZE; if (p.x > SIZE) p.x -= SIZE;
      if (p.y < 0) p.y += SIZE; if (p.y > SIZE) p.y -= SIZE;

      const nearT = Math.max(1 - Math.min(1, dist / (CHANNEL_RADIUS * 1.5)), pointerT * 0.8);
      const [r, g, b] = colorFor(p.colorT);
      const alpha = 0.15 + nearT * 0.65;
      const len = p.len * (0.6 + nearT * 0.8);
      const hx = Math.cos(p.angle) * len, hy = Math.sin(p.angle) * len;
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
      ctx.lineWidth = 0.2 + nearT * 0.3;
      ctx.moveTo(p.x - hx, p.y - hy);
      ctx.lineTo(p.x + hx, p.y + hy);
      ctx.stroke();
    }

    if (active) rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (active) return;
    active = true;
    rafId = requestAnimationFrame(frame);
  }
  function stop() {
    active = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    // deliberately NOT cleared — the last frame stays on screen, frozen.
    // Re-hovering calls start() again, which resumes the same particle
    // state (positions/angles aren't reset), so motion picks back up
    // exactly where it paused rather than jumping or restarting.
  }

  canvas.addEventListener("mousemove", (e) => setPointerFromClient(e.clientX, e.clientY));
  canvas.addEventListener("mouseleave", () => { pointer.target = 0; });
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) setPointerFromClient(e.touches[0].clientX, e.touches[0].clientY);
    },
    { passive: true }
  );
  canvas.addEventListener("touchend", () => { pointer.target = 0; });

  const card = canvas.closest(".cs-card");
  if (card) {
    card.addEventListener("mouseenter", start);
    card.addEventListener("mouseleave", stop);
    card.addEventListener("focus", start, true);
    card.addEventListener("blur", stop, true);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // draw exactly one static frame so the card isn't blank, then never again
    active = true;
    frame();
    active = false;
  }
}

document.querySelectorAll("canvas.flow-canvas[data-slug]").forEach(initCanvas);

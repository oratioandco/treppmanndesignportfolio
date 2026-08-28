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
// Shape families — the flow-field equivalent of poster-motifs.js's
// mechanisms. Each returns an obstacle field, seed-varied structurally
// (not just palette) so every case study sharing a family still reads as
// a distinct shape. Several accept a `variant` for a study whose story
// needs a real structural difference from its siblings, not just a
// different seed — see .claude/skills/case-study-motif/SKILL.md for the
// judgment behind each one; this is that judgment applied to obstacle
// fields instead of SVG paths.
// ---------------------------------------------------------------------
const SHAPES = {
  // Several distinct, named things reconciled into one system. Each ring
  // is one of the things being reconciled — the point is convergence, not
  // decoration, so ring count should generally match what's actually being
  // reconciled where that's known (see per-study comments below).
  "interlock-rings": (seed, variant) => {
    const rand = mulberry32(seed);
    const count = variant?.count ?? 3;
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

  // Two strands. Plain: parallel forever, never touching — for a pairing
  // that stays a pairing (AI drafts, a human decides; never merges).
  // `variant.converge: true`: the two strands start out of phase and taper
  // toward the same phase by the end — for a pairing that RESOLVES into
  // one direction, not two permanently distinct things.
  "double-helix": (seed, variant) => {
    const rand = mulberry32(seed);
    const amplitude = 34 + rand() * 18;
    const cycles = 1.4 + rand() * 1.1;
    const xStart = 24 + rand() * 10;
    const xEnd = 176 - rand() * 10;
    const phase0 = rand() * Math.PI * 2;
    const converge = !!variant?.converge;
    const strand = (offset) =>
      pathObstacles((t) => {
        const offsetT = converge ? offset * (1 - t) : offset; // tapers to 0 by t=1 when converging
        return {
          x: xStart + (xEnd - xStart) * t,
          y: 100 + Math.sin(t * Math.PI * 2 * cycles + phase0 + offsetT) * amplitude,
        };
      }, 26);
    return [...strand(0), ...strand(Math.PI)];
  },

  // One center, many things radiating out. `variant.skipFraction`: leaves
  // a deliberate gap among the spikes — for a story where the shape's
  // completeness is itself part of the point (a system that handles most
  // things and knowingly leaves one out).
  sunburst: (seed, variant) => {
    const rand = mulberry32(seed);
    const cx = 100 + (rand() - 0.5) * 10;
    const cy = 100 + (rand() - 0.5) * 10;
    const spikes = 7 + Math.floor(rand() * 5);
    const skipIndex = variant?.skipOne ? Math.floor(rand() * spikes) : -1;
    const innerR = 14 + rand() * 8;
    const field = [];
    for (let i = 0; i < spikes; i++) {
      if (i === skipIndex) continue;
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

  // Several gravity points (people), connected by streams (communication)
  // rather than sitting in fixed formation. Every node connects to its
  // nearest neighbor plus one further one, so the graph reads as a loose
  // working group, not a rigid ring or a fully-meshed web. For a team
  // rebuilt into rhythm: the nodes are who's in it, the streams are the
  // channel the flow field's particles actually travel along.
  network: (seed, variant) => {
    const rand = mulberry32(seed);
    const count = variant?.count ?? 4;
    const nodeR = 9 + rand() * 5;
    const nodes = Array.from({ length: count }, () => ({
      x: 60 + rand() * 80,
      y: 60 + rand() * 80,
    }));
    const field = nodes.map((n) => circleObstacle(n.x, n.y, nodeR));
    for (let i = 0; i < nodes.length; i++) {
      // distance-sorted neighbors, connect to the nearest one and one
      // further one — a loose working group, not a full mesh or a ring
      const others = nodes
        .map((n, j) => ({ j, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d);
      const links = [others[0], others[Math.min(2, others.length - 1)]];
      for (const { j } of links) {
        field.push(segmentObstacle(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y));
      }
    }
    return field;
  },

  // An inward-tightening spiral — cycles accelerate as the radius shrinks,
  // same way the path samples get closer together near the center. For a
  // pipeline collapsing into one accelerated loop, not a static shape.
  spiral: (seed) => {
    const rand = mulberry32(seed);
    const cx = 100 + (rand() - 0.5) * 8;
    const cy = 100 + (rand() - 0.5) * 8;
    const turns = 2.4 + rand() * 1.2;
    const outerR = 68 + rand() * 14;
    return pathObstacles((t) => {
      const r = outerR * (1 - t) ** 1.3; // faster radius falloff near the center = the "accelerating" read
      const angle = t * Math.PI * 2 * turns;
      return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    }, 46);
  },

  // Nested rings sharing ONE center, not offset ones overlapping like a
  // Venn diagram. Interlock-rings says "several separate things reconciled
  // side by side"; concentric-rings says "several LAYERS, each catching
  // what the one before it missed" — a hierarchy, not a convergence of
  // peers. Ring count generally matches the number of layers.
  "concentric-rings": (seed, variant) => {
    const rand = mulberry32(seed);
    const count = variant?.count ?? 3;
    const cx = 100 + (rand() - 0.5) * 14;
    const cy = 100 + (rand() - 0.5) * 14;
    const innerR = 20 + rand() * 10;
    const step = 16 + rand() * 8;
    const field = [];
    for (let i = 0; i < count; i++) {
      field.push(circleObstacle(cx, cy, innerR + i * step * (0.85 + rand() * 0.3)));
    }
    return field;
  },

  // A scatter of small "sample" points, each pulled toward whichever of a
  // few larger "attractor" centers it's nearest — k-means made visible.
  // For a system that reduces many raw inputs to a small number of stable
  // outputs, where the reduction itself (not a single source, not several
  // named peers) is the story.
  cluster: (seed, variant) => {
    const rand = mulberry32(seed);
    const attractorCount = variant?.attractors ?? 3;
    const sampleCount = variant?.samples ?? 11;
    const attractors = Array.from({ length: attractorCount }, () => ({
      x: 60 + rand() * 80,
      y: 60 + rand() * 80,
      r: 12 + rand() * 6,
    }));
    const field = attractors.map((a) => circleObstacle(a.x, a.y, a.r));
    for (let i = 0; i < sampleCount; i++) {
      const a = attractors[Math.floor(rand() * attractors.length)];
      const angle = rand() * Math.PI * 2;
      const dist = a.r + 10 + rand() * 24;
      field.push(circleObstacle(a.x + Math.cos(angle) * dist, a.y + Math.sin(angle) * dist, 3 + rand() * 2));
    }
    return field;
  },

  // A literal lattice — rows and columns of short segments. For a story
  // whose subject is density and structure itself (a data-dense grid),
  // not a relationship between named things.
  grid: (seed, variant) => {
    const rand = mulberry32(seed);
    const cols = variant?.cols ?? 4;
    const rows = variant?.rows ?? 4;
    const marginX = 34 + rand() * 10;
    const marginY = 34 + rand() * 10;
    const cellW = (200 - marginX * 2) / (cols - 1);
    const cellH = (200 - marginY * 2) / (rows - 1);
    const field = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = marginX + c * cellW + (rand() - 0.5) * 6;
        const y = marginY + r * cellH + (rand() - 0.5) * 6;
        const len = 8 + rand() * 6;
        if (c < cols - 1) field.push(segmentObstacle(x, y, x + cellW - (cellW - len), y));
        if (r < rows - 1) field.push(segmentObstacle(x, y, x, y + cellH - (cellH - len)));
      }
    }
    return field;
  },

  // A beam with a pivot at its center and one larger node at each end — a
  // scale. For two forces held in deliberate balance against each other,
  // not paired-and-parallel (double-helix) or reconciled-into-one
  // (interlock-rings): a balance is two things that stay in tension.
  balance: (seed) => {
    const rand = mulberry32(seed);
    const cx = 100 + (rand() - 0.5) * 10;
    const cy = 100 + (rand() - 0.5) * 6;
    const halfSpan = 46 + rand() * 18;
    const tilt = (rand() - 0.5) * 0.5;
    const leftX = cx - halfSpan, leftY = cy - halfSpan * tilt;
    const rightX = cx + halfSpan, rightY = cy + halfSpan * tilt;
    const endR = 14 + rand() * 6;
    return [
      segmentObstacle(leftX, leftY, rightX, rightY),
      circleObstacle(cx, cy, 6 + rand() * 3),
      circleObstacle(leftX, leftY, endR),
      circleObstacle(rightX, rightY, endR),
    ];
  },

  // Several curved chutes narrowing from a wide rim down to nearly one
  // point — the inverse read of sunburst's straight spikes radiating OUT.
  // Fewer, wider, and curved rather than many thin straight lines, so it
  // doesn't collapse into "sunburst with fewer spikes." For many
  // generated options narrowing to the one that ships.
  // IMPORTANT: every chute curves the SAME direction it started with — never
  // alternate or mirror handedness per chute, and never let 4 evenly-spaced
  // hooked arms share one rotational sense. That combination (N-fold
  // rotational symmetry + same-handed hooked arms) is a swastika, and an
  // earlier version of this shape produced exactly that by accident with the
  // default 4-chute case. Kept deliberately asymmetric instead: an odd
  // default count, uneven angular spacing (no fixed 360/N step), and a mild,
  // inconsistent curve amount per chute — structurally incapable of reading
  // as a rotationally-symmetric pinwheel.
  funnel: (seed, variant) => {
    const rand = mulberry32(seed);
    const cx = 100 + (rand() - 0.5) * 8;
    const cy = 100 + (rand() - 0.5) * 8;
    const chutes = variant?.chutes ?? 5;
    const outerR = 62 + rand() * 16;
    const innerR = 8 + rand() * 6; // chutes end near the center, not AT it — no shared vertex to read as a hub/hook point
    const field = [];
    let angle = rand() * Math.PI * 2;
    for (let i = 0; i < chutes; i++) {
      angle += (Math.PI * 2) / chutes + (rand() - 0.5) * 0.9; // irregular step, not a fixed 360/N — breaks rotational symmetry outright
      const curve = (rand() - 0.5) * 0.5; // signed per-chute, so neighboring chutes routinely bend opposite ways
      const endAngle = angle + (rand() - 0.5) * 0.6; // the end point isn't on the same ray as the start — no straight radial spoke either
      field.push(...pathObstacles((t) => {
        const r = innerR + (outerR - innerR) * (1 - t);
        const a = angle * (1 - t) + endAngle * t + curve * Math.sin(t * Math.PI);
        return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
      }, 14));
    }
    return field;
  },

  // One larger hub node, N smaller satellite nodes, each connected DIRECTLY
  // to the hub only — a star topology, not network's peer-to-peer mesh
  // (no dominant center there) and not sunburst's plain radiating lines
  // (no nodes at all). For one source with a small, specific, NAMED number
  // of consumers — `variant.count` should match that number exactly where
  // it's known.
  hub: (seed, variant) => {
    const rand = mulberry32(seed);
    const count = variant?.count ?? 4;
    const cx = 100 + (rand() - 0.5) * 8;
    const cy = 100 + (rand() - 0.5) * 8;
    const hubR = 14 + rand() * 4;
    const spokeLen = 52 + rand() * 20;
    const field = [circleObstacle(cx, cy, hubR)];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + rand() * 0.3;
      const sx = cx + Math.cos(angle) * spokeLen;
      const sy = cy + Math.sin(angle) * spokeLen;
      field.push(segmentObstacle(cx, cy, sx, sy), circleObstacle(sx, sy, 8 + rand() * 3));
    }
    return field;
  },

  // One path that travels straight, meets a hinge, and bends sharply into
  // a new direction for the rest of its length — a single redirect, not a
  // gradual curve (spiral) or a symmetric shape. For one piece of evidence
  // that changed the direction of something larger.
  pivot: (seed) => {
    const rand = mulberry32(seed);
    const hingeX = 80 + rand() * 40;
    const hingeY = 80 + rand() * 40;
    const inAngle = rand() * Math.PI * 2;
    const turn = (0.6 + rand() * 0.7) * (rand() < 0.5 ? 1 : -1);
    const outAngle = inAngle + Math.PI + turn; // arriving direction, reversed, then bent — reads as a redirect, not a straight pass-through
    const inLen = 50 + rand() * 20;
    const outLen = 60 + rand() * 24;
    const inStart = { x: hingeX - Math.cos(inAngle) * inLen, y: hingeY - Math.sin(inAngle) * inLen };
    const outEnd = { x: hingeX + Math.cos(outAngle) * outLen, y: hingeY + Math.sin(outAngle) * outLen };
    return [
      segmentObstacle(inStart.x, inStart.y, hingeX, hingeY),
      segmentObstacle(hingeX, hingeY, outEnd.x, outEnd.y),
      circleObstacle(hingeX, hingeY, 5 + rand() * 3),
    ];
  },
};

// Per-slug curation — same judgment as poster-motifs.js's old MOTIF_ASSIGNMENTS,
// re-applied to obstacle fields, one clause each: what the shape says about
// the work. Every study gets its OWN family+variant combination — no two
// studies share a rendered geometry, even loosely (see SKILL.md for the
// full worked reasoning). A slug not listed falls back to a deterministic
// hash pick.
const SHAPE_ASSIGNMENTS = {
  "churchdesk-booking-system": ["interlock-rings"], // 3 stakeholders' schedules reconciled side by side into one model
  "bibeltv-llm-safe-design-system": ["concentric-rings"], // three enforcement LAYERS, each catching what the one before it missed — hierarchy, not peers
  "bibeltv-color-api": ["cluster", { attractors: 3 }], // k-means made visible: many sampled pixels pulled into a few stable extracted colors
  "datameer-data-dense-analytics": ["grid"], // the subject is density and structure itself — pivots, filters, a data-dense grid

  "bibeltv-support-agent": ["double-helix"], // AI draft and human decision, paired, never fully merging
  "bibeltv-app-redesign": ["double-helix", { converge: true }], // old direction and new direction, resolving into one by the end
  "ninox-ai-onboarding": ["balance"], // AI capability and user control held in deliberate tension, not merged and not just paired
  "bibeltv-ai-fundraising": ["funnel", { chutes: 4 }], // many AI-generated drafts narrowing to the one a human sends

  "bibeltv-ai-prototyping": ["sunburst"], // rapid iteration, generative variation, one idea branching outward
  "bibeltv-metadata-extraction": ["sunburst", { skipOne: true }], // handles most fields, deliberately leaves one out — the gap is the point
  "bibeltv-design-system-api": ["hub", { count: 4 }], // one token source, exactly 4 named consumers: iOS, Android, web, Figma
  "spreadshirt-user-research-strategy": ["pivot"], // one prototype's insight that bent the company's whole direction

  "leading-a-team-is-a-design-problem": ["network", { count: 4 }], // the team as gravity points in relationship, not two things paired
  "bibeltv-agentic-engineering": ["spiral"], // collapsing the design-to-ship pipeline into one accelerating loop
};

const SHAPE_KEYS = Object.keys(SHAPES);

function resolveShape(slug) {
  const assignment = SHAPE_ASSIGNMENTS[slug];
  const [key, variant] = assignment || [SHAPE_KEYS[hashStr(slug || "default") % SHAPE_KEYS.length]];
  const seed = hashStr(slug || key);
  return { field: SHAPES[key](seed, variant), seed };
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

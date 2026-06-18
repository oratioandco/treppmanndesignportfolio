// Generates abstract "resolution field" cover SVGs for every case study.
//
// One shared system → guaranteed consistency:
//   • a single 6-step teal duotone palette (light + dark)
//   • a cell grid that resolves coarse→fine, left→right (the site's
//     "low-fidelity → clarity" metaphor, same language as the footer +
//     Redaction type)
//   • per-study "structure field" (the metaphor) that emerges out of teal
//     noise on the resolved side
//   • deterministic seed per study, so rebuilds are byte-identical
//   • NO text, ever — it's drawn from code
//
// Output:
//   public/images/covers/generated/<id>.svg   (production, themes via
//                                               prefers-color-scheme)
//   public/dev/covers/index.html              (review page, light + dark)

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = path.resolve(process.cwd());
const CS_DIR = path.join(ROOT, 'src/data/cv-tailor-data/case-studies');
const OUT_DIR = path.join(ROOT, 'public/images/covers/generated');
const PREVIEW_DIR = path.join(ROOT, 'public/dev/covers');

const W = 1200;
const H = 800;

// 6-step duotone ramps (bg → accent). Lifted from the Berlin footer palette
// so covers, footer, and type all share one teal world.
const LIGHT = ['#f8f3ee', '#d6ddd6', '#a4bbb2', '#779e93', '#5e8c7d', '#4f8375'];
const DARK = ['#1a2520', '#2c3e38', '#456057', '#5e8278', '#7aa297', '#a4c6b9'];

// Per-study metaphor. Default 'diffusion'.
const METAPHOR = {
  'bibeltv-design-system-api': 'grid',          // a token grid resolving
  'bibeltv-app-redesign': 'stack',              // frames aligning
  'bibeltv-color-api': 'spectrum',              // a colour field banding
  'bibeltv-agentic-engineering': 'diffusion',   // agents condensing
  'bibeltv-ai-prototyping': 'diffusion',
  'bibeltv-support-agent': 'converge',
  'churchdesk-booking-system': 'booking',        // a calendar of booked slots
  'datameer-data-dense-analytics': 'scatter',   // dense data resolving
  'ninox-org-building': 'constellation',        // dots aligning into structure
  'ninox-ai-onboarding': 'diffusion',
  'spreadshirt-user-research-strategy': 'converge', // research converging
};

// ---- deterministic randomness -------------------------------------------
function hashStr(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Seeded value noise over a GxG lattice, bilinearly interpolated.
function makeNoise(seed) {
  const G = 12;
  const rnd = mulberry32(seed);
  const lat = new Float64Array((G + 1) * (G + 1));
  for (let i = 0; i < lat.length; i++) lat[i] = rnd();
  const at = (ix, iy) => lat[iy * (G + 1) + ix];
  const sm = (t) => t * t * (3 - 2 * t);
  return (nx, ny) => {
    const fx = Math.min(0.999999, Math.max(0, nx)) * G;
    const fy = Math.min(0.999999, Math.max(0, ny)) * G;
    const ix = Math.floor(fx);
    const iy = Math.floor(fy);
    const tx = sm(fx - ix);
    const ty = sm(fy - iy);
    const a = at(ix, iy);
    const b = at(ix + 1, iy);
    const c = at(ix, iy + 1);
    const d = at(ix + 1, iy + 1);
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty;
  };
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0, e1, x) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

// Focal point each cover resolves outward from (detail/structure here,
// dissolving into quiet low-fi texture toward the edges).
function getFocal(kind, seed) {
  const rnd = mulberry32(seed ^ 0x51ed2701);
  switch (kind) {
    case 'converge':
      return [0.8, 0.5];
    case 'spectrum':
      return [0.5, 0.5];
    case 'grid':
    case 'lattice':
      return [0.5, 0.46];
    case 'scatter':
    case 'constellation':
      return [0.44 + rnd() * 0.12, 0.44 + rnd() * 0.12];
    case 'stack':
      return [0.42, 0.4];
    case 'diffusion':
    default:
      return [0.58 + (rnd() - 0.5) * 0.1, 0.44 + (rnd() - 0.5) * 0.14];
  }
}

// ---- structure fields (metaphors), all return [0,1] ----------------------
function structureField(kind, seed, focal) {
  const rnd = mulberry32(seed ^ 0x9e3779b9);
  switch (kind) {
    case 'grid': {
      const gx = 9, gy = 6, r = 0.34;
      return (nx, ny) => {
        const dx = Math.abs(((nx * gx) % 1) - 0.5);
        const dy = Math.abs(((ny * gy) % 1) - 0.5);
        const d = Math.hypot(dx, dy);
        return clamp01(1 - d / r);
      };
    }
    case 'lattice': {
      const g = 7;
      return (nx, ny) => {
        const a = Math.abs(((nx * g) % 1) - 0.5) + Math.abs(((ny * g) % 1) - 0.5);
        const b =
          Math.abs((((nx + 0.5 / g) * g) % 1) - 0.5) +
          Math.abs((((ny + 0.5 / g) * g) % 1) - 0.5);
        return clamp01(1 - Math.min(a, b) / 0.62);
      };
    }
    case 'booking': {
      // a calendar of slots, some "booked" (filled), some open
      const gx = 8, gy = 5;
      return (nx, ny) => {
        const cx = Math.floor(nx * gx);
        const cy = Math.floor(ny * gy);
        const booked = (cx * 7 + cy * 3) % 3 === 0 ? 1 : 0.22;
        const dx = Math.abs(((nx * gx) % 1) - 0.5);
        const dy = Math.abs(((ny * gy) % 1) - 0.5);
        return dx < 0.36 && dy < 0.36 ? booked : 0;
      };
    }
    case 'spectrum': {
      const bands = 6;
      return (_nx, ny) => clamp01((Math.floor(ny * bands) + 0.5) / bands);
    }
    case 'diffusion': {
      const cx = focal[0];
      const cy = focal[1];
      const sig = 0.2;
      return (nx, ny) => {
        const d = Math.hypot(nx - cx, ny - cy);
        return clamp01(Math.exp(-(d * d) / (2 * sig * sig)));
      };
    }
    case 'converge': {
      return (nx, ny) => {
        const halfBand = 0.06 + 0.42 * (1 - nx); // wide left, narrow right
        const d = Math.abs(ny - 0.5) / halfBand;
        return clamp01(Math.exp(-(d * d)));
      };
    }
    case 'scatter':
    case 'constellation': {
      const k = kind === 'constellation' ? 9 : 26;
      const pts = [];
      for (let i = 0; i < k; i++) pts.push([rnd(), rnd()]);
      const r2 = kind === 'constellation' ? 0.010 : 0.006;
      return (nx, ny) => {
        let best = 0;
        for (let i = 0; i < pts.length; i++) {
          const dx = nx - pts[i][0];
          const dy = ny - pts[i][1];
          const v = Math.exp(-(dx * dx + dy * dy) / r2);
          if (v > best) best = v;
        }
        return clamp01(best);
      };
    }
    case 'stack': {
      const frames = 6;
      return (nx, ny) => {
        const diag = clamp01((nx * 0.7 + (1 - ny) * 0.3));
        return clamp01((Math.floor(diag * frames) + 0.5) / frames);
      };
    }
    default:
      return () => 0.5;
  }
}

// ---- build the halftone dot field -----------------------------------------
// Dots on a regular grid, radius ∝ value (classic halftone — same visual
// language as the Redaction typeface). Structure is sharpest near the
// metaphor's focal point and dissolves outward into a quiet, faintly textured
// field. Calm by design: most of the canvas is small/no dots.
function buildDots(metaphor, seed) {
  const noise = makeNoise(seed);
  const focal = getFocal(metaphor, seed);
  const field = structureField(metaphor, seed, focal);
  const DOT = 34; // grid spacing (px) — bolder dots that hold up at card size
  const maxR = DOT * 0.6; // largest dot radius
  const maxRes = 0.85; // resolve falloff radius
  const dots = [];
  for (let y = DOT / 2; y < H; y += DOT) {
    for (let x = DOT / 2; x < W; x += DOT) {
      const nx = x / W;
      const ny = y / H;
      const resolve = 1 - smooth(0, 1, clamp01(Math.hypot(nx - focal[0], ny - focal[1]) / maxRes));
      // structure fades outward to an 18% floor; a faint noise texture fills
      // the periphery so the field never reads as empty.
      const v = clamp01(field(nx, ny) * (0.18 + 0.82 * resolve) + noise(nx, ny) * 0.1 * (1 - resolve));
      const r = v * maxR;
      if (r > 0.7) dots.push({ cx: +x.toFixed(1), cy: +y.toFixed(1), r: +r.toFixed(1) });
    }
  }
  return dots;
}

// ---- SVG emitters --------------------------------------------------------
// Halftone: a single ink dot colour over the background. Theme-aware via an
// internal prefers-color-scheme @media block, so the dots flip with the OS
// theme whether the SVG is inlined or loaded as an <img>.
function svgProduction(dots) {
  const style =
    `svg{--bg:${LIGHT[0]};--dot:${LIGHT[5]}}` +
    `@media (prefers-color-scheme:dark){svg{--bg:${DARK[0]};--dot:${DARK[5]}}}` +
    `.dot{fill:var(--dot)}`;
  const circles = dots
    .map((d) => `<circle class="dot" cx="${d.cx}" cy="${d.cy}" r="${d.r}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract teal halftone field">` +
    `<style>${style}</style>` +
    `<rect x="0" y="0" width="${W}" height="${H}" fill="var(--bg)"/>` +
    circles +
    `</svg>`
  );
}

function svgBaked(dots, palette) {
  const circles = dots
    .map((d) => `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r}" fill="${palette[5]}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<rect fill="${palette[0]}" x="0" y="0" width="${W}" height="${H}"/>` +
    circles +
    `</svg>`
  );
}

// ---- exports + run -------------------------------------------------------
export { LIGHT, DARK, METAPHOR, buildDots, svgBaked, svgProduction };

export function listStudies() {
  return fs
    .readdirSync(CS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try {
        return JSON.parse(fs.readFileSync(path.join(CS_DIR, f), 'utf8')).id;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .sort()
    .map((id) => {
      const metaphor = METAPHOR[id] || 'diffusion';
      const seed = hashStr(id);
      return { id, metaphor, seed, cells: buildDots(metaphor, seed) };
    });
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const studies = listStudies();
  const previewRows = [];
  for (const { id, metaphor, cells } of studies) {
    fs.writeFileSync(path.join(OUT_DIR, `${id}.svg`), svgProduction(cells));
    previewRows.push(
      `<div class="row"><div class="meta"><b>${id}</b><span>${metaphor}</span></div>` +
        `<div class="pair"><div class="cell light">${svgBaked(cells, LIGHT)}</div>` +
        `<div class="cell dark">${svgBaked(cells, DARK)}</div></div></div>`
    );
  }
  const previewHtml = previewTemplate(studies.length, previewRows);
  fs.writeFileSync(path.join(PREVIEW_DIR, 'index.html'), previewHtml);
  console.log(`Generated ${studies.length} covers → ${path.relative(ROOT, OUT_DIR)}`);
  console.log(`Preview → /dev/covers/  (${path.relative(ROOT, PREVIEW_DIR)}/index.html)`);
}

function previewTemplate(count, previewRows) {
  return `<!doctype html><meta charset="utf-8"><title>Cover preview</title>
<style>
  body{margin:0;font:14px/1.4 ui-monospace,Menlo,monospace;background:#222;color:#ddd;padding:24px}
  h1{font-size:16px;font-weight:600}
  .row{margin:0 0 28px}
  .meta{display:flex;gap:12px;align-items:baseline;margin:0 0 8px}
  .meta b{color:#fff}.meta span{color:#9a9;text-transform:uppercase;letter-spacing:.08em;font-size:11px}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .cell{border-radius:10px;overflow:hidden;aspect-ratio:3/2}
  .cell.light{background:#f8f3ee}.cell.dark{background:#1a2520}
  .cell svg{display:block;width:100%;height:100%}
  .hdr{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:0 0 6px;color:#9a9;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
</style>
<h1>Case-study covers — abstract resolution fields (${count})</h1>
<div class="hdr"><div>light</div><div>dark</div></div>
${previewRows.join('\n')}
`;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();

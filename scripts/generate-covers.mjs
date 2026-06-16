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
  'churchdesk-booking-system': 'lattice',       // time-slots locking together
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

// ---- build the cell list -------------------------------------------------
// Resolution radiates outward from the metaphor's focal point: fine + crisp
// structure near the focal, coarsening into quiet low-fi texture toward the
// edges. Calm by design — the background step dominates (drawn once), and
// only non-background cells are emitted, run-length merged per row.
function buildCells(metaphor, seed, steps) {
  const noise = makeNoise(seed);
  const focal = getFocal(metaphor, seed);
  const field = structureField(metaphor, seed, focal);
  const cols = 120;
  const rows = 80;
  const cw = +(W / cols).toFixed(3);
  const ch = +(H / rows).toFixed(3);
  const QMAX = 8; // coarsest quantization (cells) far from focal
  const maxR = 0.85;
  const cells = [];
  for (let row = 0; row < rows; row++) {
    let runIdx = -1;
    let runStart = 0;
    const flush = (endCol) => {
      if (runIdx > 0) {
        cells.push({
          x: +(runStart * cw).toFixed(1),
          y: +(row * ch).toFixed(1),
          w: +((endCol - runStart) * cw).toFixed(1),
          h: ch,
          idx: runIdx,
        });
      }
    };
    for (let col = 0; col < cols; col++) {
      const ncx = (col + 0.5) / cols;
      const ncy = (row + 0.5) / rows;
      const d = Math.hypot(ncx - focal[0], ncy - focal[1]);
      const r = 1 - smooth(0, 1, clamp01(d / maxR)); // 1 at focal → 0 at edge
      const q = Math.max(1, Math.round(QMAX + (1 - QMAX) * r)); // fine near focal
      const snx = clamp01((Math.floor(col / q) * q + q / 2) / cols);
      const sny = clamp01((Math.floor(row / q) * q + q / 2) / rows);
      const quiet = noise(snx, sny) * 0.4; // far side stays in the low steps
      const val = clamp01(quiet * (1 - r) + field(snx, sny) * r);
      const idx = Math.max(0, Math.min(steps - 1, Math.round(val * (steps - 1))));
      if (idx !== runIdx) {
        flush(col);
        runIdx = idx;
        runStart = col;
      }
    }
    flush(cols);
  }
  return cells;
}

// ---- SVG emitters --------------------------------------------------------
const GRAIN = `<filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.5 0"/></filter>`;

function svgProduction(cells, steps) {
  const lightVars = LIGHT.map((c, i) => `--cv${i}:${c}`).join(';');
  const darkVars = DARK.map((c, i) => `--cv${i}:${c}`).join(';');
  const classes = Array.from({ length: steps }, (_, i) => `.c${i}{fill:var(--cv${i})}`).join('');
  const style =
    `svg{${lightVars}}` +
    `@media (prefers-color-scheme:dark){svg{${darkVars}}}` +
    classes;
  const rects = cells
    .map((c) => `<rect class="c${c.idx}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Abstract teal resolution field">` +
    `<style>${style}</style><defs>${GRAIN}</defs>` +
    `<rect class="c0" x="0" y="0" width="${W}" height="${H}"/>` +
    rects +
    `<rect x="0" y="0" width="${W}" height="${H}" filter="url(#g)" opacity="0.04"/>` +
    `</svg>`
  );
}

function svgBaked(cells, palette) {
  const rects = cells
    .map((c) => `<rect fill="${palette[c.idx]}" x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}"/>`)
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs>${GRAIN}</defs>` +
    `<rect fill="${palette[0]}" x="0" y="0" width="${W}" height="${H}"/>` +
    rects +
    `<rect x="0" y="0" width="${W}" height="${H}" filter="url(#g)" opacity="0.04"/>` +
    `</svg>`
  );
}

// ---- exports + run -------------------------------------------------------
const steps = LIGHT.length;

export { LIGHT, DARK, METAPHOR, buildCells, svgBaked, svgProduction, steps };

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
      return { id, metaphor, seed, cells: buildCells(metaphor, seed, steps) };
    });
}

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  const studies = listStudies();
  const previewRows = [];
  for (const { id, metaphor, cells } of studies) {
    fs.writeFileSync(path.join(OUT_DIR, `${id}.svg`), svgProduction(cells, steps));
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

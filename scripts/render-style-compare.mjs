// Throwaway: compares 3 fidelity treatments on 2 clearer metaphors, so we can
// pick a direction before regenerating all covers. Light only, for legibility.
import sharp from 'sharp';

const W = 600, H = 400;
const LIGHT = ['#f8f3ee', '#d6ddd6', '#a4bbb2', '#779e93', '#5e8c7d', '#4f8375'];
const ACCENT = '#4f8375';
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (e0, e1, x) => { const t = clamp01((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

// Clear metaphor fields in [0,1], resolving outward from a focal point.
function value(metaphor, nx, ny, focal) {
  const r = 1 - smooth(0, 1, clamp01(Math.hypot(nx - focal[0], ny - focal[1]) / 0.8));
  let s = 0;
  if (metaphor === 'grid') {
    // regular token grid: bright at nodes
    const gx = 9, gy = 6;
    const dx = Math.abs(((nx * gx) % 1) - 0.5);
    const dy = Math.abs(((ny * gy) % 1) - 0.5);
    s = clamp01(1 - Math.hypot(dx, dy) / 0.32);
  } else {
    // booking lattice: a calendar of slots, alternating "booked" cells
    const cx = Math.floor(nx * 8), cy = Math.floor(ny * 5);
    const booked = (cx * 7 + cy * 3) % 3 === 0 ? 1 : 0.18;
    const gx = 8, gy = 5;
    const dx = Math.abs(((nx * gx) % 1) - 0.5);
    const dy = Math.abs(((ny * gy) % 1) - 0.5);
    const inCell = dx < 0.36 && dy < 0.36 ? 1 : 0;
    s = inCell ? booked : 0;
  }
  return clamp01(s * (0.2 + 0.8 * r));
}

function rampHex(v) { return LIGHT[Math.max(0, Math.min(5, Math.round(v * 5)))]; }

function render(metaphor, style, focal) {
  let body = `<rect width="${W}" height="${H}" fill="${LIGHT[0]}"/>`;
  if (style === 'halftone') {
    const step = 18;
    for (let y = step / 2; y < H; y += step)
      for (let x = step / 2; x < W; x += step) {
        const v = value(metaphor, x / W, y / H, focal);
        const rad = v * (step * 0.62);
        if (rad > 0.5) body += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad.toFixed(1)}" fill="${ACCENT}"/>`;
      }
  } else {
    const step = style === 'bold' ? 30 : 11;
    for (let y = 0; y < H; y += step)
      for (let x = 0; x < W; x += step) {
        const v = value(metaphor, (x + step / 2) / W, (y + step / 2) / H, focal);
        const idx = Math.round(v * 5);
        if (idx > 0) body += `<rect x="${x}" y="${y}" width="${step - 1}" height="${step - 1}" fill="${rampHex(v)}"/>`;
      }
  }
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`);
}

const styles = ['halftone', 'bold', 'fine'];
const metaphors = [['grid', [0.5, 0.46]], ['booking', [0.5, 0.5]]];
const PAD = 18, LH = 26;
const sheetW = PAD * 2 + W * 3 + PAD * 2;
const sheetH = PAD * 2 + LH + (H + LH + PAD) * 2;
const layers = [{
  input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${LH}"><text x="0" y="18" font-family="monospace" font-size="15" fill="#333">HALFTONE  /  BOLD PIXEL  /  FINE PIXEL  — pick a fidelity</text></svg>`),
  left: PAD, top: PAD,
}];

for (let m = 0; m < metaphors.length; m++) {
  const [metaphor, focal] = metaphors[m];
  const rowTop = PAD + LH + m * (H + LH + PAD);
  layers.push({
    input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="${LH}"><text x="0" y="16" font-family="monospace" font-size="13" fill="#888">${metaphor === 'grid' ? 'design-system (token grid)' : 'churchdesk (booking slots)'}</text></svg>`),
    left: PAD, top: rowTop,
  });
  for (let s = 0; s < styles.length; s++) {
    const png = await sharp(render(metaphor, styles[s], focal)).png().toBuffer();
    layers.push({ input: png, left: PAD + s * (W + PAD), top: rowTop + LH });
  }
}

await sharp({ create: { width: sheetW, height: sheetH, channels: 3, background: '#fff' } })
  .composite(layers).png().toFile('/tmp/style-compare.png');
console.log('Wrote /tmp/style-compare.png', `${sheetW}x${sheetH}`);

// Renders a contact sheet of all generated covers (light | dark) to a PNG,
// so they can be reviewed without a browser. Uses the baked SVGs (literal
// hex) since librsvg/sharp won't resolve CSS var() / prefers-color-scheme.
import fs from 'node:fs';
import sharp from 'sharp';
import { listStudies, svgBaked, LIGHT, DARK } from './generate-covers.mjs';

const OUT = '/tmp/cover-sheet.png';
const CW = 480; // thumb width
const CH = 320; // thumb height
const LABEL = 150; // left label column
const GAP = 16;
const PAD = 24;

const studies = listStudies();
const rowH = CH + GAP;
const sheetW = PAD * 2 + LABEL + CW * 2 + GAP;
const sheetH = PAD * 2 + 28 + studies.length * rowH;

async function thumb(svgStr, bg) {
  const png = await sharp(Buffer.from(svgStr))
    .resize(CW, CH, { fit: 'fill' })
    .png()
    .toBuffer();
  return sharp({
    create: { width: CW, height: CH, channels: 3, background: bg },
  })
    .composite([{ input: png }])
    .png()
    .toBuffer();
}

function labelSvg(id, metaphor) {
  const safe = id.replace(/&/g, '&amp;');
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${LABEL}" height="${CH}">` +
      `<rect width="${LABEL}" height="${CH}" fill="#222"/>` +
      `<text x="0" y="24" fill="#fff" font-family="monospace" font-size="14">${safe
        .split('-')
        .join('-​')}</text>` +
      `<text x="0" y="${CH - 10}" fill="#9a9" font-family="monospace" font-size="12">${metaphor}</text>` +
      `</svg>`
  );
}

const layers = [];
// header
layers.push({
  input: Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetW}" height="28"><text x="0" y="20" fill="#9a9" font-family="monospace" font-size="13">LIGHT  /  DARK  —  ${studies.length} covers</text></svg>`
  ),
  left: PAD + LABEL,
  top: PAD,
});

for (let i = 0; i < studies.length; i++) {
  const { id, metaphor, cells } = studies[i];
  const top = PAD + 28 + i * rowH;
  const light = await thumb(svgBaked(cells, LIGHT), '#f8f3ee');
  const dark = await thumb(svgBaked(cells, DARK), '#1a2520');
  layers.push({ input: labelSvg(id, metaphor), left: PAD, top });
  layers.push({ input: light, left: PAD + LABEL, top });
  layers.push({ input: dark, left: PAD + LABEL + CW + GAP, top });
}

await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: '#222' },
})
  .composite(layers)
  .png()
  .toFile(OUT);

console.log('Wrote', OUT, `${sheetW}x${sheetH}`);

// Build-time guard: every /images/... referenced by a case study or a page
// must exist in public/. A missing reference in PUBLISHED content fails the
// build (this is the class of bug that silently blanked the ChurchDesk
// covers). Missing references inside DRAFT studies only warn — those are
// known content gaps, not regressions.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, 'public');
const CS_DIR = path.join(ROOT, 'src/data/cv-tailor-data/case-studies');
const PAGES = path.join(ROOT, 'src/pages');
const IMG_RE = /\/images\/[^"')\s]+\.(?:png|jpe?g|svg|webp|gif|avif)/gi;

const exists = (src) => fs.existsSync(path.join(PUBLIC, src));

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const errors = [];
const warnings = [];

// Case studies. Only PUBLISHED studies block the build; work-in-progress
// (draft / review / in-progress / anything else) only warns, since those are
// known content gaps rather than live regressions.
for (const f of fs.readdirSync(CS_DIR).filter((f) => f.endsWith('.json'))) {
  const raw = fs.readFileSync(path.join(CS_DIR, f), 'utf8');
  let obj;
  try {
    obj = JSON.parse(raw);
  } catch {
    continue;
  }
  if (!obj.id || !Array.isArray(obj.sections)) continue; // skip schema.json etc.
  const status = obj.status || 'published';
  const refs = new Set(raw.match(IMG_RE) || []);
  for (const src of refs) {
    if (exists(src)) continue;
    const msg = `[${status}] ${f} → ${src}`;
    if (status === 'published') errors.push(msg);
    else warnings.push(msg);
  }
}

// Astro pages (always required).
for (const p of walk(PAGES).filter((f) => f.endsWith('.astro'))) {
  const refs = new Set(fs.readFileSync(p, 'utf8').match(IMG_RE) || []);
  for (const src of refs) {
    if (!exists(src)) errors.push(`[page] ${path.relative(ROOT, p)} → ${src}`);
  }
}

if (warnings.length) {
  console.warn(`\n⚠️  ${warnings.length} missing image(s) in DRAFT studies (not blocking):`);
  for (const w of warnings) console.warn('   ' + w);
}
if (errors.length) {
  console.error(`\n❌ ${errors.length} missing image(s) in published content — build blocked:`);
  for (const e of errors) console.error('   ' + e);
  console.error('');
  process.exit(1);
}
console.log(`✓ image check: all referenced images present (${warnings.length} draft warning(s)).`);

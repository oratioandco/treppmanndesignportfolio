// Build-time guard: every published artifact must match its source in
// my-cv-tailor.
//
// WHY THIS EXISTS
// ---------------
// The sync is a manual step (`npm run sync:cv-data <slug> --cv <path>`), so
// every edit made in my-cv-tailor AFTER a sync silently desynchronises the
// site. Nothing failed, nothing looked wrong, and the page kept serving the
// older document.
//
// On 2026-08-13 the Vinted CV was rewritten four times after its last sync.
// treppmann.design/for/vinted served a CV four revisions behind — and its bio
// still opened with a line the CV had dropped several rounds earlier — while
// the CV itself printed that URL. Caught by hand. The same class of failure
// left /for/fonio a 404 the morning an application citing it went out.
//
// check-public-output.mjs validates what the content SAYS. This checks whether
// it is the CURRENT version of what it says.
//
// BEHAVIOUR
// ---------
// Warns rather than fails. A stale CV is a real problem but it is not a reason
// to block a deploy that may be fixing something else, and CV_TAILOR_DIR is not
// guaranteed to be present on every machine or in CI. If the source repo cannot
// be found, it says so once and exits clean.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const FILTERS = path.join(ROOT, 'src/data/cv-tailor-data/case-studies/filters');
const DOCS = path.join(ROOT, 'public/documents');

const CV_TAILOR =
  process.env.CV_TAILOR_DIR ||
  ['../my-cv-tailor', '../../my-cv-tailor', '/home/user/my-cv-tailor'].find((p) =>
    fs.existsSync(path.join(ROOT, p, 'CAREER-TRUTH.md')) || fs.existsSync(path.join(p, 'CAREER-TRUTH.md')),
  );

const resolveTailor = (p) => (path.isAbsolute(p) ? p : path.join(ROOT, p));

if (!CV_TAILOR || !fs.existsSync(path.join(resolveTailor(CV_TAILOR), 'CAREER-TRUTH.md'))) {
  console.log('  freshness check: my-cv-tailor not found, skipping. Set CV_TAILOR_DIR to enable.');
  process.exit(0);
}

const SRC = resolveTailor(CV_TAILOR);
const md5 = (f) => crypto.createHash('md5').update(fs.readFileSync(f)).digest('hex');
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));

// Published slug -> application slug. The published copy has _application
// stripped, so the mapping has to come from the source filters.
const appOf = {};
const srcFilters = path.join(SRC, 'data/case-studies/filters');
if (fs.existsSync(srcFilters)) {
  for (const f of fs.readdirSync(srcFilters)) {
    if (!f.endsWith('.json') || f.includes('.citations.')) continue;
    let d;
    try {
      d = readJson(path.join(srcFilters, f));
    } catch {
      continue;
    }
    const pub = d.slug || f.replace(/\.json$/, '');
    const app = d._application || (d.aliases || [])[0];
    if (app) appOf[pub] = app;
  }
}

const stale = [];
const missing = [];

for (const f of fs.readdirSync(FILTERS)) {
  if (!f.endsWith('.json') || f.includes('.citations.')) continue;
  const pub = f.replace(/\.json$/, '');
  const published = readJson(path.join(FILTERS, f));
  const app = appOf[pub];
  if (!app) continue;

  // 1. The CV PDF the page offers for download.
  const href = published.cv?.href;
  if (href) {
    const local = path.join(DOCS, path.basename(href));
    const cvDir = path.join(SRC, 'outputs/cv', app);
    if (fs.existsSync(cvDir)) {
      const candidates = fs
        .readdirSync(cvDir)
        .filter((n) => n.endsWith('-public.pdf'))
        .sort();
      const source = candidates.length ? path.join(cvDir, candidates[candidates.length - 1]) : null;
      if (!fs.existsSync(local)) {
        missing.push(`${pub}: page offers ${href} and the file is not in public/documents`);
      } else if (source) {
        // PDFs embed a creation timestamp, so byte-comparing them reports STALE on
        // every rebuild even when nothing changed. Verified 2026-08-13: identical
        // HTML, two different PDF hashes. Compare sizes as a coarse signal instead,
        // and let the bio check below carry the real content comparison.
        const a = fs.statSync(local).size;
        const b = fs.statSync(source).size;
        if (Math.abs(a - b) > 512)
          stale.push(`${pub}: published CV size differs materially from ${path.relative(SRC, source)}`);
      }
    }
  }

  // 2. The bio the page renders.
  const srcContent = path.join(SRC, 'outputs/portfolio', app, 'content.json');
  if (fs.existsSync(srcContent)) {
    let sc;
    try {
      sc = readJson(srcContent);
    } catch {
      sc = null;
    }
    if (sc?.bio?.long && published.bio?.long && sc.bio.long !== published.bio.long)
      stale.push(`${pub}: published bio differs from outputs/portfolio/${app}/content.json`);
  }
}

if (!stale.length && !missing.length) {
  console.log('✓ freshness check: every published CV and bio matches my-cv-tailor.');
  process.exit(0);
}

console.log('\n  freshness check — published content is behind its source:\n');
for (const m of missing) console.log(`  MISSING  ${m}`);
for (const s of stale) console.log(`  STALE    ${s}`);
console.log(`\n  Re-sync each one:`);
for (const line of [...stale, ...missing]) {
  const pub = line.split(':')[0];
  const app = appOf[pub];
  console.log(
    `    CV_TAILOR_DIR=${CV_TAILOR} node scripts/sync-cv-data.mjs ${pub} \\\n` +
      `      --cv ${CV_TAILOR}/outputs/cv/${app}/<latest>-public.pdf`,
  );
}
console.log('\n  Warning only — a stale page is not a reason to block a deploy that fixes something else.');

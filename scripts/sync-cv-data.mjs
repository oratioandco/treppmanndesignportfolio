#!/usr/bin/env node
/**
 * sync-cv-data.mjs — carry one application's portfolio view from my-cv-tailor into this repo.
 *
 *   npm run sync:cv-data -- <slug> [--cv <path-to-public-pdf>] [--dry-run]
 *
 * Why this exists
 * ---------------
 * my-cv-tailor is PRIVATE and holds all personal career data. This repo is PUBLIC.
 * The portfolio therefore keeps its own copy of only the slugs that should be
 * reachable, rather than pulling the whole data set in via a submodule.
 *
 * That copy used to be manual, so it silently stopped happening: work landed in
 * my-cv-tailor and never reached the site. This script makes the step explicit and
 * identical for whoever runs it — nora on the MacBook Pro, or Claude on any machine.
 *
 * What it copies, for one slug only:
 *   - data/case-studies/filters/<slug>.json      -> src/data/cv-tailor-data/case-studies/filters/
 *   - every case study that filter references    -> src/data/cv-tailor-data/case-studies/
 *   - the public CV variant, if cv.href is set   -> public/documents/
 *
 * Privacy rules it enforces (this repo is world-readable):
 *   - keys beginning with "_" are stripped — they are private bookkeeping
 *     (e.g. nora's _context: source URL, positioning notes) and must not ship.
 *   - a CV whose filename does not end in -public.pdf is refused outright. The
 *     application variant carries a phone number and street address.
 */

import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORTFOLIO = resolve(HERE, '..');
const SOURCE = resolve(process.env.CV_TAILOR_DIR || join(PORTFOLIO, '..', 'my-cv-tailor'));

const DEST_FILTERS = join(PORTFOLIO, 'src/data/cv-tailor-data/case-studies/filters');
const DEST_CASES = join(PORTFOLIO, 'src/data/cv-tailor-data/case-studies');
const DEST_DOCS = join(PORTFOLIO, 'public/documents');

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const cvFlagIndex = args.indexOf('--cv');
const cvOverride = cvFlagIndex !== -1 ? args[cvFlagIndex + 1] : null;
const slug = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--cv');

const problems = [];
const notes = [];
let copied = 0;

function die(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

function copy(from, to, label) {
  if (dryRun) {
    console.log(`  would copy  ${label}`);
    return;
  }
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log(`  copied      ${label}`);
  copied++;
}

/** Drop private bookkeeping keys (leading underscore) at every level. */
function stripPrivate(value) {
  if (Array.isArray(value)) return value.map(stripPrivate);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k]) => !k.startsWith('_'))
        .map(([k, v]) => [k, stripPrivate(v)]),
    );
  }
  return value;
}

if (!slug) {
  console.error(`
Usage: npm run sync:cv-data -- <slug> [--cv <path-to-public-pdf>] [--dry-run]

Available slugs in ${SOURCE}:`);
  const dir = join(SOURCE, 'data/case-studies/filters');
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
      console.error(`  ${basename(f, '.json')}`);
    }
  } else {
    console.error(`  (none — ${dir} not found)`);
  }
  process.exit(1);
}

if (!existsSync(SOURCE)) {
  die(`my-cv-tailor not found at ${SOURCE}\n  Set CV_TAILOR_DIR to point at it.`);
}

const filterSrc = join(SOURCE, 'data/case-studies/filters', `${slug}.json`);
if (!existsSync(filterSrc)) {
  die(`No filter config for "${slug}" at ${filterSrc}`);
}

console.log(`\nSyncing "${slug}"`);
console.log(`  from  ${SOURCE}`);
console.log(`  into  ${PORTFOLIO}${dryRun ? '   (dry run)' : ''}\n`);

const filter = JSON.parse(readFileSync(filterSrc, 'utf8'));

// --- Step 6b compliance -----------------------------------------------------
if (!filter.cv?.href) {
  problems.push('filter has no cv.href — the view will render without a CV link (prepare-portfolio.mdc Step 6b)');
} else if (!filter.cv.href.includes('-public') && !cvOverride) {
  notes.push(`cv.href is "${filter.cv.href}" — confirm that file is the public variant`);
}
if (!filter.bio?.short || !filter.bio?.long) {
  problems.push('filter has no bio.short/bio.long — BioRegenerator falls back to the generic B2B SaaS bio');
}
if (!filter.bio?.context) {
  problems.push('filter has no bio.context {company, role, emphasis, avoid} — AI regeneration will drift off-message');
}

// --- filter config ----------------------------------------------------------
const cleaned = stripPrivate(filter);
const droppedKeys = Object.keys(filter).filter((k) => k.startsWith('_'));
if (droppedKeys.length) {
  notes.push(`stripped private key(s) from the published copy: ${droppedKeys.join(', ')}`);
}
const filterDest = join(DEST_FILTERS, `${slug}.json`);
if (dryRun) {
  console.log(`  would write filters/${slug}.json`);
} else {
  mkdirSync(DEST_FILTERS, { recursive: true });
  writeFileSync(filterDest, `${JSON.stringify(cleaned, null, 2)}\n`);
  console.log(`  wrote       filters/${slug}.json`);
  copied++;
}

// --- referenced case studies ------------------------------------------------
for (const entry of filter.case_studies ?? []) {
  const id = typeof entry === 'string' ? entry : entry.id;
  if (!id) continue;
  const from = join(SOURCE, 'data/case-studies', `${id}.json`);
  if (!existsSync(from)) {
    problems.push(`case study "${id}" referenced by the filter does not exist in my-cv-tailor`);
    continue;
  }
  copy(from, join(DEST_CASES, `${id}.json`), `case-studies/${id}.json`);
}

// --- public CV --------------------------------------------------------------
if (filter.cv?.href) {
  const targetName = basename(filter.cv.href);
  let cvSrc = cvOverride ? resolve(cvOverride) : null;

  if (!cvSrc) {
    const cvDir = join(SOURCE, 'outputs/cv');
    if (existsSync(cvDir)) {
      const candidates = readdirSync(cvDir)
        .filter((f) => f.endsWith('-public.pdf') && f.toLowerCase().includes(slug.split('-')[0]))
        .sort();
      if (candidates.length) cvSrc = join(cvDir, candidates[candidates.length - 1]);
    }
  }

  if (!cvSrc) {
    problems.push(`cv.href is set but no public CV found — pass --cv <path> (must end in -public.pdf)`);
  } else if (!basename(cvSrc).endsWith('-public.pdf')) {
    die(`refusing to publish "${basename(cvSrc)}" — only the -public.pdf variant may go into a public repo.\n  The application variant carries a phone number and street address.`);
  } else if (!existsSync(cvSrc)) {
    problems.push(`CV not found at ${cvSrc}`);
  } else {
    copy(cvSrc, join(DEST_DOCS, targetName), `public/documents/${targetName}`);
  }
}

// --- report -----------------------------------------------------------------
console.log('');
for (const n of notes) console.log(`  note:    ${n}`);
for (const p of problems) console.log(`  WARNING: ${p}`);

if (!dryRun) {
  console.log(`\n${copied} file(s) synced. Commit and push this repo so the site picks them up.`);
  console.log(`Then check: ${filter.cv?.href ? 'CV link, ' : ''}bio, and every image path (npm run build runs check-images).`);
}
console.log('');
process.exit(problems.length ? 2 : 0);

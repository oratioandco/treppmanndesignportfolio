#!/usr/bin/env node
/**
 * check-public-output.mjs — the pre-deploy gate.
 *
 * Runs against dist/ AFTER the build, over EVERY page including all /for/
 * variants, and exits non-zero on anything that must not reach the public web:
 *
 *   1. private "_"-prefixed keys rendering into public output
 *   2. banned terms, from the canonical list in my-cv-tailor
 *   3. a CV download link pointing at a file that is not there
 *
 * Why it lives in the build
 * -------------------------
 * `npm run build` is what .github/workflows/deploy.yml runs, so a failure here
 * fails the deploy. That is the point: this is not a habit anyone has to
 * remember. Every one of the three classes above has already shipped to
 * production at least once — 19 filter files with private notes, 7 pages with a
 * 404 download button, and a term ban that a manual sweep had to catch.
 *
 * The banned-terms list is generated, never hand-written:
 *   python3 engine/bin/export_policy.py --out src/data/cv-tailor-data/banned-terms.json
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const DIST = join(ROOT, 'dist');
const POLICY = join(ROOT, 'src/data/cv-tailor-data/banned-terms.json');

const problems = [];
let scanned = 0;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

/** Visible text, with script/style removed and tags stripped. */
function textOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ');
}

/** Block-ish chunks, for rules scoped to a paragraph rather than a document. */
function blocksOf(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .split(/<\/(?:p|div|li|h[1-6]|section|article|td)>/i)
    .map((b) => b.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

if (!existsSync(DIST)) {
  console.error('\n✗ dist/ not found — run the build before the check.\n');
  process.exit(1);
}
if (!existsSync(POLICY)) {
  console.error(
    `\n✗ ${relative(ROOT, POLICY)} is missing.\n` +
    `  The banned-terms list is generated from my-cv-tailor:\n` +
    `    python3 engine/bin/export_policy.py --out <this-repo>/src/data/cv-tailor-data/banned-terms.json\n` +
    `  Refusing to deploy without it — an unchecked deploy is the failure this gate exists to prevent.\n`);
  process.exit(1);
}

const policy = JSON.parse(readFileSync(POLICY, 'utf8'));
const employers = policy.employers ?? [];

// ---------------------------------------------------------------- 1 + 2
const PRIVATE_KEY = /"_[a-zA-Z][\w-]*"\s*:|\b_(?:context|why|source|blocker|asset_gap|notes?)\b/;

for (const file of walk(DIST)) {
  const ext = extname(file).toLowerCase();
  if (!['.html', '.htm', '.json', '.txt', '.xml'].includes(ext)) continue;
  const raw = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);
  scanned++;

  const text = ext === '.html' || ext === '.htm' ? textOf(raw) : raw;
  const blocks = ext === '.html' || ext === '.htm' ? blocksOf(raw) : [raw];

  // 1. private keys
  const pk = raw.match(PRIVATE_KEY);
  if (pk) {
    problems.push({
      rule: 'PRIVATE-KEY', file: rel,
      msg: `private "_"-prefixed material rendered into public output: ${pk[0]}`,
      fix: 'Keys beginning with "_" are internal bookkeeping. sync-cv-data.mjs strips them; something bypassed it.',
    });
  }

  // 2. banned terms
  for (const r of policy.rules) {
    const re = new RegExp(r.pattern, 'gi');
    if (r.kind === 'regex') {
      const m = re.exec(text);
      if (m) problems.push({ rule: r.id, file: rel, msg: `${r.message} — "${m[0]}"`, fix: r.fix });
    } else if (r.kind === 'proximity') {
      const near = new RegExp(r.near, 'i');
      const win = r.window ?? 300;
      let m;
      while ((m = re.exec(text))) {
        const a = Math.max(0, m.index - win);
        const b = Math.min(text.length, m.index + m[0].length + win);
        if (near.test(text.slice(a, b))) {
          problems.push({ rule: r.id, file: rel, msg: `${r.message} — "${m[0]}"`, fix: r.fix });
          break;
        }
      }
    } else if (r.kind === 'absent_in_block') {
      const req = new RegExp(r.requires, 'i');
      for (const b of blocks) {
        const m = new RegExp(r.pattern, 'i').exec(b);
        if (m && !req.test(b)) {
          problems.push({ rule: r.id, file: rel, msg: `${r.message} — "${m[0]}"`, fix: r.fix });
          break;
        }
      }
    } else if (r.kind === 'attribution' && employers.length) {
      // Fires only if the nearest employer mention is the one the rule names.
      const marks = [];
      for (const e of employers) {
        const er = new RegExp(e.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        let em;
        while ((em = er.exec(text))) marks.push([em.index, e]);
      }
      if (!marks.length) continue;
      let m;
      while ((m = re.exec(text))) {
        const mid = m.index + m[0].length / 2;
        let best = marks[0];
        for (const k of marks) if (Math.abs(k[0] - mid) < Math.abs(best[0] - mid)) best = k;
        if (best[1].toLowerCase() === String(r.near).toLowerCase()) {
          problems.push({ rule: r.id, file: rel, msg: `${r.message} — "${m[0]}"`, fix: r.fix });
          break;
        }
      }
    }
  }
}

// ---------------------------------------------------------------- 3
// A download button pointing at a file that is not there. This is what put a
// 404 behind "Download CV (PDF)" on 7 of 21 /for/ pages.
for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
  const raw = readFileSync(file, 'utf8');
  const rel = relative(DIST, file);
  for (const m of raw.matchAll(/href="(\/documents\/[^"]+)"/g)) {
    const target = join(DIST, m[1]);
    if (!existsSync(target)) {
      problems.push({
        rule: 'DEAD-DOWNLOAD', file: rel,
        msg: `download link 404s: ${m[1]}`,
        fix: 'Either sync the file (npm run sync:cv-data -- <slug> --cv <path>) or remove cv.href from the filter.',
      });
    }
  }
}

// ---------------------------------------------------------------- report
const byRule = new Map();
for (const p of problems) {
  if (!byRule.has(p.rule)) byRule.set(p.rule, []);
  byRule.get(p.rule).push(p);
}

if (!problems.length) {
  console.log(`✓ pre-deploy check: ${scanned} file(s) scanned, nothing blocked ` +
              `(policy from my-cv-tailor @ ${policy._source_commit}).`);
  process.exit(0);
}

console.error(`\n✗ PRE-DEPLOY CHECK FAILED — ${problems.length} problem(s) across ${byRule.size} rule(s).\n`);
for (const [rule, list] of byRule) {
  console.error(`  ${rule} — ${list[0].msg.replace(/ — ".*/, '')}  (${list.length} page(s))`);
  for (const p of list.slice(0, 6)) console.error(`      ${p.file}: ${p.msg}`);
  if (list.length > 6) console.error(`      … ${list.length - 6} more`);
  if (list[0].fix) console.error(`      fix: ${list[0].fix}`);
  console.error('');
}
console.error('Deploy refused. Fix the content — do not weaken the check.\n');
process.exit(1);

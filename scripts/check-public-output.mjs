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
import { inflateSync } from 'node:zlib';
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

// ---------------------------------------------------------------- 2b
// PDFs. The first version of this gate scanned HTML/JSON/TXT and never opened a
// PDF — so four CVs sat on the public site carrying banned terms in their text
// layer, including a colleague's personal characteristic, while the gate
// reported clean. A binary file is still published content.
function pdfObjects(buf) {
  const out = [];
  const re = /(\d+)\s+0\s+obj\b/g;
  let m;
  while ((m = re.exec(buf.toString('latin1')))) {
    const start = m.index;
    const end = buf.toString('latin1').indexOf('endobj', start);
    if (end > start) out.push(buf.subarray(start, end));
  }
  return out;
}
function inflateStreams(obj) {
  const s = obj.toString('latin1');
  const i = s.search(/stream\r?\n/);
  if (i < 0) return null;
  const from = i + s.slice(i).match(/stream\r?\n/)[0].length;
  const to = s.indexOf('endstream', from);
  if (to < 0) return null;
  const body = obj.subarray(from, to);
  try { return inflateSync(body); } catch { return body; }
}
// PDF CMap destinations are UTF-16BE hex. Node has no 'utf16be', and
// reversing a utf16le decode is not the same thing — it decoded "Tobias" as
// "吀ob椀as". Read code points directly.
function hexToStr(h) {
  let out = '';
  if (h.length % 4) h = h.padEnd(Math.ceil(h.length / 4) * 4, '0');
  for (let i = 0; i < h.length; i += 4) out += String.fromCharCode(parseInt(h.slice(i, i + 4), 16));
  return out;
}
function parseCMap(buf) {
  const s = buf.toString('latin1'), map = new Map();
  for (const blk of s.match(/beginbfchar([\s\S]*?)endbfchar/g) || [])
    for (const mm of blk.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g))
      map.set(parseInt(mm[1], 16), hexToStr(mm[2]));
  for (const blk of s.match(/beginbfrange([\s\S]*?)endbfrange/g) || [])
    for (const mm of blk.matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      const a = parseInt(mm[1], 16), b = parseInt(mm[2], 16), d = parseInt(mm[3], 16);
      for (let i = a; i <= Math.min(b, a + 5000); i++) map.set(i, String.fromCharCode(d + (i - a)));
    }
  return map;
}
function pdfText(file) {
  const buf = readFileSync(file);
  const objs = pdfObjects(buf);
  const cmaps = new Map();     // object index -> map
  const byNum = new Map();
  const whole = buf.toString('latin1');
  for (const mm of whole.matchAll(/(\d+)\s+0\s+obj\b/g)) byNum.set(mm[1], mm.index);
  const fontCmap = new Map();
  objs.forEach((o) => {
    const inf = inflateStreams(o);
    if (inf && (inf.includes('beginbfchar') || inf.includes('beginbfrange'))) {
      const num = (o.toString('latin1').match(/^(\d+)\s+0\s+obj/) || [])[1];
      if (num) cmaps.set(num, parseCMap(inf));
    }
  });
  objs.forEach((o) => {
    const s = o.toString('latin1');
    const num = (s.match(/^(\d+)\s+0\s+obj/) || [])[1];
    const tu = s.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
    if (num && tu && cmaps.has(tu[1])) fontCmap.set(num, cmaps.get(tu[1]));
  });
  const nameToFont = new Map();
  for (const o of objs)
    for (const fm of o.toString('latin1').matchAll(/\/Font\s*<<([\s\S]*?)>>/g))
      for (const nm of fm[1].matchAll(/\/([A-Za-z0-9#+.\-]+)\s+(\d+)\s+0\s+R/g))
        if (!nameToFont.has(nm[1])) nameToFont.set(nm[1], nm[2]);

  let out = '';
  for (const o of objs) {
    const inf = inflateStreams(o);
    if (!inf) continue;
    const d = inf.toString('latin1');
    if (!d.includes('Tj') && !d.includes('TJ')) continue;
    let cm = null, width = 1;
    for (const t of d.matchAll(/\/([A-Za-z0-9#+.\-]+)\s+[\d.]+\s+Tf|<([0-9A-Fa-f\s]*)>|\(((?:\\.|[^\\)])*)\)/g)) {
      if (t[1]) {
        cm = fontCmap.get(nameToFont.get(t[1])) || null;
        width = cm && Math.max(...cm.keys()) > 0xff ? 2 : 1;
      } else if (t[2] !== undefined) {
        let h = t[2].replace(/\s/g, '');
        if (h.length % 2) h += '0';
        const step = width * 2;
        for (let i = 0; i < h.length; i += step)
          out += (cm && cm.get(parseInt(h.slice(i, i + step), 16))) || '';
      } else if (t[3] !== undefined && cm) {
        const lit = t[3];
        for (let i = 0; i < lit.length; i++) {
          let code = lit.charCodeAt(i);
          if (lit[i] === '\\' && /[0-7]/.test(lit[i + 1] || '')) {
            const oc = lit.slice(i + 1).match(/^[0-7]{1,3}/)[0];
            code = parseInt(oc, 8); i += oc.length;
          }
          out += cm.get(code) || '';
        }
      }
    }
    out += ' ';
  }
  return out.replace(/\s+/g, ' ');
}

for (const file of walk(DIST).filter((f) => f.toLowerCase().endsWith('.pdf'))) {
  const rel = relative(DIST, file);
  scanned++;
  let text = '';
  try { text = pdfText(file); } catch { /* unreadable PDF is its own problem below */ }
  if (text.length < 200) {
    problems.push({ rule: 'PDF-UNREADABLE', file: rel,
      msg: `only ${text.length} chars extractable — an ATS would read nothing`,
      fix: 'Regenerate with engine/bin/build_cv.py --pdf, which verifies the text layer.' });
    continue;
  }
  for (const r of policy.rules) {
    if (r.kind !== 'regex' && r.kind !== 'proximity') continue;
    const re = new RegExp(r.pattern, 'i');
    const m = re.exec(text);
    if (!m) continue;
    if (r.kind === 'proximity') {
      const i = text.search(re), win = r.window ?? 300;
      if (!new RegExp(r.near, 'i').test(text.slice(Math.max(0, i - win), i + win))) continue;
    }
    problems.push({ rule: r.id, file: rel, msg: `${r.message} — "${m[0]}" (in the PDF text layer)`, fix: r.fix });
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

// ------------------------------------------------------- prose (advisory)
//
// ADVISORY, NEVER BLOCKING. CAREER-TRUTH is explicit that prose quality is
// Tobias's judgement while truthfulness is not, so this reports and exits 0.
//
// It exists because nothing was checking the public site's writing at all. The
// blocking rules were the only ones exported, and these pages are hand-authored
// in this repo rather than generated by the pipeline, so the PreToolUse hooks
// never saw them either. A 2026-08-13 audit found 29 negation-antithesis
// constructions and 264 em-dashes across 1019 sentences — one every 3.9, where
// edited prose runs about one in twenty. The flagship case study was at one per
// 1.1. None of it was caught by anything.
//
// Scoped to /case-studies/ and the site root. The /for/ pages render the same
// case-study bodies once per filter, so counting them would report the same
// sentence 29 times and drown the signal.
function runProseCheck() {
  const proseRules = policy.prose_rules || [];

  // DEDUPE BY PARAGRAPH, not by page. Every case-study body renders once per
  // filter, so /for/ and /work/ multiply the same sentence ~29 times. Counting
  // pages would report one tic as 29 findings and drown the signal; excluding
  // those routes would miss the case-study prose entirely, which is most of the
  // writing on the site. Collecting unique paragraphs gets both: full coverage,
  // honest counts.
  const paragraphs = new Set();
  for (const file of walk(DIST).filter((f) => f.endsWith('.html'))) {
    const raw = readFileSync(file, 'utf8');
    const body = raw.replace(/<(?:nav|footer|header)[\s\S]*?<\/(?:nav|footer|header)>/gi, ' ');
    for (const m of body.match(/<p[^>]*>[\s\S]*?<\/p>/gi) || []) {
      // Paragraphs only. All visible text would fold in the
      // <li><strong>Label</strong> — description convention, which is
      // legitimate typography rather than a rhetorical tic; counting it moved
      // the reported density from 1-per-13 to 1-per-5 and would have made this
      // warning permanent furniture — the failure that made WQ-004 prose_only.
      const t = textOf(m).trim();
      if (t.length > 60) paragraphs.add(t);
    }
  }

  let sentences = 0, emDashes = 0;
  const findings = new Map();
  for (const t of paragraphs) {
    sentences += (t.match(/[.!?](?:\s|$)/g) || []).length;
    emDashes += (t.match(/—/g) || []).length;
    for (const rule of proseRules) {
      let re;
      try { re = new RegExp(rule.pattern, 'gi'); } catch { continue; }
      const hits = t.match(re);
      if (!hits) continue;
      if (!findings.has(rule.id)) findings.set(rule.id, { rule, hits: new Set() });
      for (const h of hits) findings.get(rule.id).hits.add(h.trim().slice(0, 90));
    }
  }

  const ratio = emDashes ? sentences / emDashes : Infinity;
  const density = emDashes ? `1 per ${ratio.toFixed(1)} sentences` : 'none';

  if (!findings.size && ratio >= 12) {
    console.log(`  prose: ${paragraphs.size} unique paragraph(s), ${sentences} sentences, ` +
                `em-dash density ${density} — clean.`);
    return;
  }

  console.log(`\n  ── prose (advisory — never blocks) ─────────────────────────`);
  console.log(`  ${paragraphs.size} unique paragraph(s), ${sentences} sentences, em-dash density ${density}`);
  if (ratio < 12) {
    console.log(`     ⚠ under 1 per 12 reads as a generator's default rather than a choice.`);
  }
  for (const { rule, hits } of findings.values()) {
    console.log(`     ${rule.id} — ${rule.message}  (${hits.size} distinct)`);
    for (const h of [...hits].slice(0, 3)) console.log(`        "${h}"`);
    if (hits.size > 3) console.log(`        … ${hits.size - 3} more`);
    if (rule.fix) console.log(`        ${rule.fix}`);
  }
  console.log('');
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
  runProseCheck();
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

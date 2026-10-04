#!/usr/bin/env node
/**
 * Block tailored bios that assume access to the job description or expose
 * total career duration as an age proxy.
 *
 * Title, subtitle, bio.short and bio.long are outward identity copy.
 * bio.context is steering for the regenerator and is intentionally excluded.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const FILTERS = path.join(ROOT, 'src/data/cv-tailor-data/case-studies/filters');

const rules = [
  {
    id: 'CR-001',
    re: /\b(?:1[5-9]|[2-9][0-9])\s*\+?\s*(?:years?|yrs?|jahren?)\b|\b(?:fifteen|sixteen|seventeen|eighteen|nineteen|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)(?:[- ](?:one|two|three|four|five|six|seven|eight|nine))?)\s+(?:years?|yrs?|jahren?)\b|\b(?:(?:fünf|fuenf|sech|sieb|acht|neun)zehn|(?:(?:ein|zwei|drei|vier|fünf|fuenf|sechs|sieben|acht|neun)und)?(?:zwanzig|dreißig|dreissig|vierzig|fünfzig|fuenfzig|sechzig|siebzig|achtzig|neunzig))\s+jahren?\b|\b(?:two|three|four|2|3|4)\s+decades?\b/gi,
    fix: 'Remove total-career duration and introduce current identity, scope and proof.',
  },
  {
    id: 'CR-002',
    re: /\bat\s+(?:a\s+)?b2b\s+(?:product\s+)?scope\b|\bcurrent\s+(?:consumer[- ]product\s+|consumer\s+)?motion\s+work\b|\b(?:not\s+yet|still\s+not|currently\s+not)\s+(?:released|published|shipped|launched)\b|\b(?:unpublished|unreleased)\b|\b(?:the|this)\s+(?:posting|job\s+description)\b|\b(?:this|the)\s+requirement\b|\b(?:direct|adjacent)\s+fit\b|\b(?:must[- ]have|nice[- ]to[- ]have)\b/gi,
    fix: 'Rewrite for a reader who has not seen the posting or an internal gap discussion.',
  },
];

function scanText(file, field, text) {
  const findings = [];
  for (const rule of rules) {
    rule.re.lastIndex = 0;
    let match;
    while ((match = rule.re.exec(text))) {
      findings.push({ ...rule, file, field, match: match[0] });
      if (!match[0].length) rule.re.lastIndex++;
    }
  }
  return findings;
}

function selftest() {
  const cases = [
    ['fifteen years in product design', ['CR-001']],
    ['15+ Jahre UX und Produktführung', ['CR-001']],
    ['fünfzehn Jahre UX und Produktführung', ['CR-001']],
    ['motion work at B2B product scope', ['CR-002']],
    ['the prototype is not yet released', ['CR-002']],
    ['this posting asks for motion', ['CR-002']],
    ['Product design leader building conversational AI products', []],
    ['Ten years mentoring designers at CareerFoundry', []],
    ['Conversational AI Bible Study App, in development', []],
  ];
  let failed = 0;
  for (const [text, expected] of cases) {
    const got = [...new Set(scanText('fixture', 'text', text).map((f) => f.id))];
    if (JSON.stringify(got) !== JSON.stringify(expected)) {
      failed++;
      console.error(`FAIL ${JSON.stringify(text)}: expected ${expected}, got ${got}`);
    }
  }
  if (failed) process.exit(1);
  console.log(`✓ cold-reader selftest: ${cases.length} cases passed`);
}

if (process.argv.includes('--selftest')) selftest();
if (!fs.existsSync(FILTERS)) {
  console.error(`✗ cold-reader check: filters directory missing: ${FILTERS}`);
  process.exit(1);
}

const findings = [];
let scanned = 0;
for (const name of fs.readdirSync(FILTERS).filter((n) => n.endsWith('.json')).sort()) {
  const file = path.join(FILTERS, name);
  let data;
  try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch (error) {
    console.error(`✗ cold-reader check: cannot parse ${name}: ${error.message}`);
    process.exit(1);
  }
  scanned++;
  for (const field of ['title', 'subtitle']) {
    const text = data[field];
    if (typeof text === 'string') findings.push(...scanText(name, field, text));
  }
  for (const field of ['short', 'long']) {
    const text = data.bio?.[field];
    if (typeof text === 'string') findings.push(...scanText(name, `bio.${field}`, text));
  }
}

if (!findings.length) {
  console.log(`✓ cold-reader check: ${scanned} tailored bio file(s), clean`);
  process.exit(0);
}

console.error(`\n✗ COLD-READER CHECK FAILED — ${findings.length} finding(s):\n`);
for (const finding of findings) {
  console.error(`  ${finding.id}  ${finding.file}:${finding.field} — ${JSON.stringify(finding.match)}`);
  console.error(`          fix: ${finding.fix}`);
}
console.error('\nDeploy refused. Fix the bio source; do not weaken the check.\n');
process.exit(1);

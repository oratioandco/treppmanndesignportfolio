// One-shot: point every case study's hero_image at its generated cover.
// Cards (study.cover_image || hero_image.src) and the [study] page hero both
// then use the consistent abstract cover. Meaningful images (diagrams,
// screenshots) move into the case-study body separately.
import fs from 'node:fs';
import path from 'node:path';

const dir = 'src/data/cv-tailor-data/case-studies';
for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
  const p = path.join(dir, f);
  const obj = JSON.parse(fs.readFileSync(p, 'utf8'));
  if (!obj.id) continue;
  obj.hero_image = {
    src: `/images/covers/generated/${obj.id}.svg`,
    alt: `${obj.title} — abstract resolution-field cover`,
  };
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n');
  console.log('wired', obj.id);
}

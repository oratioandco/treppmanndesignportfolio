import { readdirSync, readFileSync } from 'node:fs';
// @ts-check
import { defineConfig } from "astro/config";

// The anonymised leadership study was renamed away from its company-named id
// and slug (see CLAUDE.md). Both old URLs are indexed and, more importantly,
// were shared directly with people — so they redirect rather than 404.
//
// GitHub Pages cannot serve a real 301; Astro emits a static stub with a meta
// refresh, a canonical, and `noindex`. That is the behaviour we want here: the
// goal is for the old URL to drop out of the index entirely, not to hand its
// ranking history to the new one. Humans still land on the right page.
const OLD_STUDY_ID = "ninox-org-building";
const NEW_STUDY_ID = "leading-a-team-is-a-design-problem";

// The tailored-audience routes are generated per filter, so the study moving
// broke one URL per filter under /for/.
// Read off disk, not hand-listed. The hand-listed version named seven filters
// and went stale: by 2026-08-18 seventeen filters referenced the old study, so
// twelve of those URLs would have 404'd instead of redirecting — and four pages
// were still publishing the un-anonymised study outright, which is the failure
// this redirect was created to finish cleaning up. A list that has to be
// remembered is a list that drifts, and this one guards a real person's privacy.
//
// Aliases are included because a /for/ URL that has been printed on a CV is
// served under every path it ever had.
const TAILORED_FILTERS = (() => {
  const dir = new URL("./src/data/cv-tailor-data/case-studies/filters/", import.meta.url);
  const paths = new Set();
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".json") || name.endsWith(".citations.json")) continue;
    const filter = JSON.parse(readFileSync(new URL(name, dir), "utf8"));
    paths.add(filter.slug ?? name.replace(/\.json$/, ""));
    for (const alias of filter.aliases ?? []) paths.add(alias);
  }
  return [...paths];
})();

// The portfolio moved under /work on 2026-10-21 so the site root can carry
// the commercial offer: /case-studies/<id> became /work/<id>, and the tailored
// /for/<slug> pages became /work/for/<slug>. Both old shapes are printed on
// CVs and in sent applications, so every one keeps resolving — straight to the
// final URL, never through a second hop.
//
// (The /work/<filter>/ tree retired on 2026-08-26 was a different shape: a
// filter slug one level under /work. Nothing generates that shape now, so
// /work/<filter>/ninox-org-building, where the un-anonymised study was once
// reachable, stays a 404.)
const tailoredStudyRedirects = Object.fromEntries(
  TAILORED_FILTERS.flatMap((filter) => [
    [`/for/${filter}/${OLD_STUDY_ID}`, `/work/for/${filter}/${NEW_STUDY_ID}`],
  ]),
);

// https://astro.build/config
// Site is fully static — deployed via GitHub Pages. The bio API runs
// as a separate Coolify-hosted Hono service (see ../treppmann-bio-api).
// The static site fetches it cross-origin from the BioRegenerator component.
//
// The five hand-authored src/pages/case-studies/*.astro pages (2026-08-14 to
// -20) predated the data-driven /case-studies/[study] route and drifted
// stale — three were 6-12 days behind the real case-study content, and
// "shipping-ai" was never backed by a real case-study record at all. Old
// links (this ran live long enough to plausibly be indexed or shared) still
// resolve, just to the real thing now instead of the fork that drifted.
export default defineConfig({
  output: "static",
  site: "https://treppmann.design",
  base: "/",
  redirects: {
    "/case-studies/ninox": `/work/${NEW_STUDY_ID}`,
    "/case-studies/collaboration-redesign": `/work/${NEW_STUDY_ID}`,
    "/case-studies/churchdesk": "/work/churchdesk-booking-system",
    "/case-studies/llm-safe-design-system": "/work/bibeltv-llm-safe-design-system",
    "/case-studies/modern-practice": "/work/bibeltv-ai-prototyping",
    // No single real case study replaces this hand-typed placeholder — send
    // visitors to the portfolio to pick a real one rather than fake a 1:1 map.
    "/case-studies/shipping-ai": "/work",
    // The two moves themselves. Astro expands a dynamic redirect over the
    // destination route's getStaticPaths, so every study and every filter
    // (aliases included) gets its own stub without a list to keep in step.
    "/case-studies/[study]": "/work/[study]",
    "/for/[slug]": "/work/for/[slug]",
    "/for/[slug]/[study]": "/work/for/[slug]/[study]",
    ...tailoredStudyRedirects,
  },
});

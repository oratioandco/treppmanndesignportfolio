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
// broke one URL per filter under each of /work/ and /for/.
const TAILORED_FILTERS = [
  "deliveryhero",
  "gitlab",
  "jupus",
  "kleinanzeigen",
  "liveeo",
  "mobile-de",
  "n8n",
];

const tailoredStudyRedirects = Object.fromEntries(
  TAILORED_FILTERS.flatMap((filter) =>
    ["work", "for"].map((prefix) => [
      `/${prefix}/${filter}/${OLD_STUDY_ID}`,
      `/${prefix}/${filter}/${NEW_STUDY_ID}`,
    ]),
  ),
);

// https://astro.build/config
// Site is fully static — deployed via GitHub Pages. The bio API runs
// as a separate Coolify-hosted Hono service (see ../treppmann-bio-api).
// The static site fetches it cross-origin from the BioRegenerator component.
export default defineConfig({
  output: "static",
  site: "https://treppmann.design",
  base: "/",
  redirects: {
    "/case-studies/ninox": "/case-studies/collaboration-redesign",
    ...tailoredStudyRedirects,
  },
});

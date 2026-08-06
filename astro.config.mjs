// @ts-check
import { defineConfig } from "astro/config";

// https://astro.build/config
// Site is fully static — deployed via GitHub Pages. The bio API runs
// as a separate Coolify-hosted Hono service (see ../treppmann-bio-api).
// The static site fetches it cross-origin from the BioRegenerator component.
export default defineConfig({
  output: "static",
  site: "https://treppmann.design",
  base: "/",
  redirects: {
    // The leadership case study used to live at a company-named URL. It is now
    // anonymised, so the slug must not name the employer either — but the old
    // URL is already indexed and shared, so it redirects instead of 404ing.
    // Search engines consolidate on the new URL and drop the old one.
    "/case-studies/ninox": "/case-studies/collaboration-redesign",
  },
});

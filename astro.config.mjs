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
});

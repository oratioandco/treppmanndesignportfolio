# Tobias Treppmann Portfolio

A personal portfolio website with AI-powered chat functionality, built with Astro and deployable via Coolify.

## Features

- **Three Case Studies**: ChurchDesk, Ninox, and Modern Technical Practice
- **AI Chat**: Ask questions about experience, projects, and philosophy
- **Server-Side Rendering**: Runs on Node.js for API functionality
- **Privacy-First**: No tracking, analytics, or cookies
- **Dynamic Portfolio Routing**: Custom `/work/[slug]` pages per application

## Dynamic Portfolio Routing (`/work/[slug]`)

Each job application gets a custom portfolio URL (e.g., `treppmann.design/work/liveeo`). The page shows curated case studies pulled directly from **my-cv-tailor**'s data store — no duplication.

### Architecture

The portfolio is the **rendering layer**. Data lives in my-cv-tailor:

```
my-cv-tailor/data/
├── case-studies/
│   ├── schema.json              # Case study validation schema
│   ├── filter-schema.json       # Filter config schema
│   ├── filters/                 # Per-application portfolio configs
│   │   └── liveeo.json           # ← creates /work/liveeo
│   ├── datameer-data-dense-analytics.json
│   └── ...                      # More case study JSONs
├── jobs/                        # Job analysis files
├── experiences/                 # Work history
└── strategic-positioning.md     # Career strategy
```

- `src/data/cv-tailor.ts` — Reads filter configs + case study JSONs from my-cv-tailor at build time
- `src/pages/work/[slug].astro` — Dynamic page that renders based on filter config
- Filter configs reference case studies by ID; studies are loaded from my-cv-tailor's `data/case-studies/`

### How to add a new application

1. In my-cv-tailor, run `@analyze-job-posting.mdc` for the new role
2. Run `@prepare-portfolio.mdc` to create a filter config in `data/case-studies/filters/`
3. Rebuild the portfolio — the new `/work/{slug}` page appears automatically

### Visibility levels

| Level | Behavior |
|-------|----------|
| `featured` | Shown immediately on the page |
| `browseable` | Hidden behind "Show more work" toggle |
| `hidden` | Not rendered (future: available with `?all` param) |

### Existing application pages

| URL | Company | Role |
|-----|---------|------|
| `/work/liveeo` | LiveEO | Head of Product Design |

---

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:4321

## Deployment on Coolify

1. **Create new service** in Coolify
2. **Connect your Git repository**
3. **Set build pack**: Dockerfile
4. **Add environment variable**: `ANTHROPIC_API_KEY`
5. **Set port**: 4321
6. **Deploy**

## Project Structure

```
portfolio/
├── src/
│   ├── data/
│   │   └── cv-tailor.ts              # Reads from ../my-cv-tailor/data/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── work/
│   │   │   └── [slug].astro          # Dynamic per-application pages
│   │   └── case-studies/
│   │       ├── churchdesk.astro
│   │       ├── ninox.astro
│   │       └── modern-practice.astro
│   └── styles/
│       └── global.css
├── public/
│   └── fonts/
├── Dockerfile
└── astro.config.mjs
```

## Tech Stack

- **Framework**: Astro (static output)
- **Styling**: Custom CSS with CSS variables
- **Fonts**: Redaction (display) + Switzer (body)
- **Deployment**: Docker / Coolify

## License

Private - All rights reserved

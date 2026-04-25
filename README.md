# Tobias Treppmann Portfolio

A personal portfolio website with AI-powered chat functionality, built with Astro and deployable via Coolify.

## Features

- **Three Case Studies**: ChurchDesk, Ninox, and Modern Technical Practice
- **AI Chat**: Ask questions about experience, projects, and philosophy
- **Server-Side Rendering**: Runs on Node.js for API functionality
- **Privacy-First**: No tracking, analytics, or cookies
- **Dynamic Portfolio Routing**: Custom `/work/[slug]` pages per application

## Dynamic Portfolio Routing (`/work/[slug]`)

Each job application gets a custom portfolio URL (e.g., `treppmann.design/work/ckm-group`). The page shows a tailored hero, curated content mix (case studies, articles, leadership philosophy), emphasized skills, and role-specific framing — all driven by a JSON config.

### Content Types

The system supports four content types per application:

| Type | Description |
|------|-------------|
| `case-study` | Deep project writeups with images |
| `article` | Thought leadership pieces |
| `leadership` | Leadership philosophy / approach |
| `side-project` | Personal projects showing craft |

Each content item can have custom tags and a relevance note for the specific role.

### How to add a new application

1. Create a JSON file in `src/data/applications/` named after the company slug:

```json
{
  "slug": "company-name",
  "company": "Company Display Name",
  "role": "Job Title",
  "location": "City",
  "hero": {
    "tagline": "Short descriptor",
    "headline": "Main headline for this application",
    "description": "1–2 sentence intro tailored to this company"
  },
  "aboutSnippet": "Why you're a great fit — shown in the 'Why This Fits' section",
  "designChopsHighlight": "Evidence of hands-on design ability",
  "leadershipAngle": "Leadership approach relevant to this role",
  "content": [
    {
      "id": "modern-practice",
      "type": "case-study",
      "relevanceNote": "Why this matters for this role",
      "tagsOverride": ["Custom", "Tags", "For", "This", "Context"]
    },
    {
      "id": "ai-user-agency",
      "type": "article",
      "relevanceNote": "Relevance to this company"
    },
    {
      "id": "leadership-philosophy",
      "type": "leadership",
      "relevanceNote": "Why leadership approach fits"
    }
  ],
  "emphasizedSkills": [
    "Skill 1",
    "Skill 2"
  ]
}
```

2. **Valid content IDs**: See `src/data/applications.ts` → `contentMeta` for all registered content. Currently: `churchdesk`, `ninox`, `modern-practice`, `privacy-first`, `ai-user-agency`, `leadership-philosophy`
3. **Build** — Astro's `getStaticPaths()` auto-discovers all JSON files in `src/data/applications/`, no registration needed
4. The new page appears at `/work/{slug}`

### Architecture

- `src/data/applications.ts` — Content metadata registry + config loader via `import.meta.glob`
- `src/data/applications/*.json` — One config per application
- `src/pages/work/[slug].astro` — Dynamic page with grouped sections (Case Studies, Perspective, Leadership, Side Projects)

### Existing application pages

| URL | Company | Role |
|-----|---------|------|
| `/work/ckm-group` | CKM Group | AI Transformation & AI Enablement |
| `/work/iu` | IU International University | AI in Education / Design Leadership |
| `/work/thermondo` | thermondo | Head of Product / Design Leadership |

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
│   │   ├── applications.ts           # Content registry + config loader
│   │   └── applications/             # One JSON per application
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

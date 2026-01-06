# Tobias Treppmann Portfolio

A personal portfolio website with AI-powered chat functionality, built with Astro and deployable via Coolify.

## Features

- **Three Case Studies**: ChurchDesk, Ninox, and Modern Technical Practice
- **AI Chat**: Ask questions about experience, projects, and philosophy
- **Server-Side Rendering**: Runs on Node.js for API functionality
- **Privacy-First**: No tracking, analytics, or cookies

## Local Development

```bash
# Install dependencies
npm install

# Create .env file with your Anthropic API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start development server
npm run dev
```

Visit http://localhost:4321

## Deployment on Coolify

1. **Create new service** in Coolify
2. **Connect your Git repository**
3. **Set build pack**: Dockerfile
4. **Add environment variable**:
   - `ANTHROPIC_API_KEY`: Your Anthropic API key
5. **Set port**: 4321
6. **Deploy**

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key for chat functionality |

## Project Structure

```
portfolio/
├── src/
│   ├── components/
│   │   └── Chat.astro       # AI chat widget
│   ├── layouts/
│   │   └── Layout.astro     # Base layout
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── about.astro      # About page
│   │   ├── api/
│   │   │   └── chat.ts      # Chat API endpoint
│   │   └── case-studies/
│   │       ├── churchdesk.astro
│   │       ├── ninox.astro
│   │       └── modern-practice.astro
│   └── styles/
│       └── global.css       # Global styles
├── public/
│   └── fonts/               # Gambarino & Switzer fonts
├── Dockerfile               # Production container
└── astro.config.mjs         # Astro configuration
```

## Tech Stack

- **Framework**: Astro with Node.js adapter
- **Styling**: Custom CSS with CSS variables
- **Fonts**: Gambarino (display) + Switzer (body)
- **AI**: Anthropic Claude API
- **Deployment**: Docker / Coolify

## License

Private - All rights reserved

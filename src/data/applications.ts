import type { GetStaticPaths } from 'astro';

// --- Content Types ---

export interface ContentRef {
  id: string;
  type: 'case-study' | 'article' | 'leadership' | 'side-project';
  /** Custom headline override for this context (optional) */
  titleOverride?: string;
  /** Custom description override (optional) */
  descriptionOverride?: string;
  /** Why this is relevant for this specific application */
  relevanceNote?: string;
  /** Tags to show for this specific context */
  tagsOverride?: string[];
}

export interface ApplicationConfig {
  slug: string;
  company: string;
  role: string;
  location: string;
  hero: {
    tagline: string;
    headline: string;
    description: string;
  };
  aboutSnippet: string;
  /** Ordered list of content to show — case studies, articles, leadership philosophy, side projects */
  content: ContentRef[];
  /** Skills/keywords to emphasize for this application */
  emphasizedSkills: string[];
  /** Optional: what to highlight as design chops evidence */
  designChopsHighlight?: string;
  /** Optional: leadership philosophy override */
  leadershipAngle?: string;
}

// --- Case Study Metadata (shared) ---

export interface ContentMeta {
  id: string;
  type: 'case-study' | 'article' | 'leadership' | 'side-project';
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  tags: string[];
}

export const contentMeta: Record<string, ContentMeta> = {
  'churchdesk': {
    id: 'churchdesk',
    type: 'case-study',
    slug: '/case-studies/churchdesk',
    title: "When 'Simple Booking' Isn't Simple",
    subtitle: 'ChurchDesk Booking System',
    description: 'Designing a deceptively simple booking experience that masks extraordinary complexity—multi-stakeholder coordination for sensitive contexts.',
    coverImage: '/images/covers/churchdesk.jpeg',
    tags: ['Complex Systems', 'Multi-stakeholder', 'Platform Design'],
  },
  'ninox': {
    id: 'ninox',
    type: 'case-study',
    slug: '/case-studies/ninox',
    title: 'Redesigning How We Work Together',
    subtitle: 'Leadership & Inclusion',
    description: "When a team labels someone \"difficult,\" the instinct is to manage the person. But what if the problem isn't the person—it's how the team works?",
    coverImage: '/images/covers/leadership.jpeg',
    tags: ['Leadership', 'Team Design', 'Inclusion'],
  },
  'modern-practice': {
    id: 'modern-practice',
    type: 'case-study',
    slug: '/case-studies/modern-practice',
    title: 'Accelerating Design with AI',
    subtitle: 'AI-First Design Process',
    description: "AI compresses the path from idea to testable prototype. Developing an AI-first design process and teaching teams to do the same.",
    coverImage: '/images/covers/ai.jpeg',
    tags: ['Claude Code', 'Zed/VSCode', 'AI Prototyping'],
  },
  // Future content — articles, leadership philosophy, side projects
  'privacy-first': {
    id: 'privacy-first',
    type: 'article',
    slug: '/articles/privacy-first',
    title: "I Don't Need Your Analytics",
    subtitle: 'Privacy-First Validation',
    description: 'How to validate design decisions without tracking users — proven across 4+ companies in GDPR-constrained environments.',
    coverImage: '/images/covers/churchdesk.jpeg',
    tags: ['Privacy', 'GDPR', 'Qualitative Research'],
  },
  'ai-user-agency': {
    id: 'ai-user-agency',
    type: 'article',
    slug: '/articles/ai-user-agency',
    title: "The Design Leader's Guide to AI User Agency",
    subtitle: 'AI Product Design',
    description: 'Designing AI features that respect user agency — transparency, control, and graceful failure.',
    coverImage: '/images/covers/ai.jpeg',
    tags: ['AI Ethics', 'Product Design', 'User Agency'],
  },
  'leadership-philosophy': {
    id: 'leadership-philosophy',
    type: 'leadership',
    slug: '/about',
    title: 'Human-Centered Organizations',
    subtitle: 'Leadership Philosophy',
    description: 'The same empathy we apply to user research must extend to how we build teams. Human-centered organizations create human-centered products.',
    coverImage: '/images/covers/leadership.jpeg',
    tags: ['Leadership', 'Psychological Safety', 'Inclusion'],
  },
};

// --- Auto-discovery ---

const apps = import.meta.glob<{ default: ApplicationConfig }>(
  './applications/*.json',
  { eager: true }
);

export function getAllApplications(): ApplicationConfig[] {
  return Object.values(apps).map((mod) => mod.default);
}

export function getApplication(slug: string): ApplicationConfig | undefined {
  return getAllApplications().find((app) => app.slug === slug);
}

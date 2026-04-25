import type { GetStaticPaths } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

// --- Paths to my-cv-tailor data ---
const CV_TAILOR_ROOT = path.resolve(process.cwd(), '..', 'my-cv-tailor');
const FILTERS_DIR = path.join(CV_TAILOR_ROOT, 'data', 'case-studies', 'filters');
const CASE_STUDIES_DIR = path.join(CV_TAILOR_ROOT, 'data', 'case-studies');
const JOBS_DIR = path.join(CV_TAILOR_ROOT, 'data', 'jobs');
const STRATEGIC_POSITIONING = path.join(CV_TAILOR_ROOT, 'data', 'strategic-positioning.md');

// --- Types (aligned with my-cv-tailor schemas) ---

export interface FilterConfig {
  slug: string;
  title: string;
  subtitle?: string;
  theme?: string;
  show_all_label?: string;
  case_studies: {
    id: string;
    visibility: 'featured' | 'browseable' | 'hidden';
    order?: number;
    format_override?: string;
  }[];
}

export interface CaseStudySection {
  type: string;
  headline?: string;
  content?: string;
  subtext?: string;
  images?: { src: string; alt: string; caption?: string }[];
  quote?: string;
  attribution?: string;
  context?: string;
  steps?: { label: string; description: string; image?: any }[];
  metrics?: { label: string; value?: string; before?: string; after?: string }[];
  items?: any[];
  layout?: string;
}

export interface CaseStudy {
  id: string;
  title: string;
  subtitle?: string;
  type: string;
  tags: string[];
  company: string;
  role: string;
  team?: string;
  duration: string;
  status: string;
  last_updated?: string;
  hero_image?: { src: string; alt: string; caption?: string };
  format_priority?: string[];
  sections: CaseStudySection[];
  variants?: Record<string, {
    summary?: string;
    angle?: string;
    sections?: string[];
    max_read_time?: string;
  }>;
  related?: string[];
  meta?: {
    read_time_minutes?: number;
    confidential?: boolean;
    confidentiality_note?: string;
    source?: string;
  };
}

// --- Filter loading from my-cv-tailor ---

function loadFilters(): FilterConfig[] {
  if (!fs.existsSync(FILTERS_DIR)) return [];
  
  return fs.readdirSync(FILTERS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(FILTERS_DIR, f), 'utf-8');
      return JSON.parse(raw) as FilterConfig;
    });
}

// --- Case study loading from my-cv-tailor ---

function loadCaseStudy(id: string): CaseStudy | null {
  const filePath = path.join(CASE_STUDIES_DIR, `${id}.json`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as CaseStudy;
}

function loadAllCaseStudies(): Map<string, CaseStudy> {
  const studies = new Map<string, CaseStudy>();
  if (!fs.existsSync(CASE_STUDIES_DIR)) return studies;

  fs.readdirSync(CASE_STUDIES_DIR)
    .filter(f => f.endsWith('.json') && f !== 'schema.json' && f !== 'filter-schema.json')
    .forEach(f => {
      const raw = fs.readFileSync(path.join(CASE_STUDIES_DIR, f), 'utf-8');
      const study = JSON.parse(raw) as CaseStudy;
      studies.set(study.id, study);
    });
  
  return studies;
}

// --- Job analysis loading ---

export interface JobAnalysis {
  slug: string;
  company: string;
  role: string;
  location: string;
  hero_tagline: string;
  hero_headline: string;
  hero_description: string;
  about_snippet: string;
  design_chops_highlight?: string;
  leadership_angle?: string;
  emphasized_skills: string[];
}

function findJobAnalysis(slug: string): JobAnalysis | null {
  if (!fs.existsSync(JOBS_DIR)) return null;

  // Look for files matching the slug pattern: {slug}-*.md
  const files = fs.readdirSync(JOBS_DIR)
    .filter(f => f.startsWith(slug) && f.endsWith('-analysis.md'));
  
  if (files.length === 0) return null;
  
  // Parse the analysis file for key fields
  const raw = fs.readFileSync(path.join(JOBS_DIR, files[0]), 'utf-8');
  return parseJobAnalysis(slug, raw);
}

function parseJobAnalysis(slug: string, content: string): JobAnalysis {
  // Extract structured data from the analysis markdown
  const company = extractField(content, 'Company') || slug;
  const role = extractField(content, 'Role') || 'Product Design';
  const location = extractField(content, 'Location') || 'Berlin, Germany';
  
  return {
    slug,
    company,
    role,
    location,
    // These will be populated from the filter config + strategic positioning
    hero_tagline: '',
    hero_headline: '',
    hero_description: '',
    about_snippet: '',
    emphasized_skills: [],
  };
}

function extractField(content: string, field: string): string | null {
  const regex = new RegExp(`\\*\\*${field}\\*\\*:\\s*(.+)`);
  const match = content.match(regex);
  return match ? match[1].trim() : null;
}

// --- Public API ---

export function getAllFilters(): FilterConfig[] {
  return loadFilters();
}

export function getFilter(slug: string): FilterConfig | undefined {
  return loadFilters().find(f => f.slug === slug);
}

export function getCaseStudy(id: string): CaseStudy | null {
  return loadCaseStudy(id);
}

export function getAllCaseStudies(): Map<string, CaseStudy> {
  return loadAllCaseStudies();
}

export function getFilterWithStudies(slug: string): {
  filter: FilterConfig;
  studies: (CaseStudy & { visibility: string; format_override?: string })[];
} | null {
  const filter = getFilter(slug);
  if (!filter) return null;

  const studies = filter.case_studies
    .map(csRef => {
      const study = loadCaseStudy(csRef.id);
      if (!study) return null;
      return { ...study, visibility: csRef.visibility, format_override: csRef.format_override };
    })
    .filter(Boolean) as (CaseStudy & { visibility: string; format_override?: string })[];

  return { filter, studies };
}

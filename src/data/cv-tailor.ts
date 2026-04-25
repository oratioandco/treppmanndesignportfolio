import type { GetStaticPaths } from 'astro';

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

export interface StudyWithVisibility extends CaseStudy {
  visibility: string;
  format_override?: string;
}

// --- Data loading via import.meta.glob ---

// Auto-discover all filter configs
const filterModules = import.meta.glob<{ default: FilterConfig }>(
  './cv-tailor-data/case-studies/filters/*.json',
  { eager: true }
);

// Auto-discover all case studies
const caseStudyModules = import.meta.glob<{ default: CaseStudy }>(
  './cv-tailor-data/case-studies/*.json',
  { eager: true }
);

// --- Public API ---

export function getAllFilters(): FilterConfig[] {
  return Object.values(filterModules).map(mod => mod.default);
}

export function getFilter(slug: string): FilterConfig | undefined {
  return getAllFilters().find(f => f.slug === slug);
}

function getCaseStudy(id: string): CaseStudy | undefined {
  const entry = Object.values(caseStudyModules).find(
    mod => mod.default && (mod.default as CaseStudy).id === id
  );
  return entry ? (entry.default as CaseStudy) : undefined;
}

export function getFilterWithStudies(slug: string): {
  filter: FilterConfig;
  studies: StudyWithVisibility[];
} | null {
  const filter = getFilter(slug);
  if (!filter) return null;

  const studies = filter.case_studies
    .map(csRef => {
      const study = getCaseStudy(csRef.id);
      if (!study) return null;
      return { ...study, visibility: csRef.visibility, format_override: csRef.format_override };
    })
    .filter((s): s is StudyWithVisibility => s !== null);

  return { filter, studies };
}

import type { GetStaticPaths } from 'astro';

// --- Types (aligned with my-cv-tailor schemas) ---

export interface FilterConfig {
  slug: string;
  /** Previously-published paths for this page. Every one of them keeps
   *  resolving, because a /for/ URL is printed on a CV and handed to a
   *  stranger — once it is out, it is out. On 2026-08-11 the fin and lovehoney
   *  slugs were shortened AFTER a CV carrying the long one had already been
   *  submitted. Aliases mean that shortening is free instead of a broken link
   *  in someone's inbox. Never remove an entry from this list. */
  aliases?: string[];
  title: string;
  subtitle?: string;
  theme?: string;
  show_all_label?: string;
  cv?: { href: string; label?: string; note?: string };
  bio?: {
    short?: string;
    long?: string;
    context?: { company?: string; role?: string; emphasis?: string; avoid?: string };
  };
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
  const filters = getAllFilters();
  return filters.find(f => f.slug === slug)
      ?? filters.find(f => (f.aliases ?? []).includes(slug));
}

/** Every path this filter must answer on: the canonical slug first, then any
 *  alias. Route files map over this so an old URL renders the page rather than
 *  404ing. */
export function getFilterPaths(filter: FilterConfig): string[] {
  return [filter.slug, ...(filter.aliases ?? [])];
}

export function getCaseStudy(id: string): CaseStudy | undefined {
  const entry = Object.values(caseStudyModules).find(
    mod => mod.default && (mod.default as CaseStudy).id === id
  );
  return entry ? (entry.default as CaseStudy) : undefined;
}

/** Every real case study eligible for the canonical, untailored public route
 *  (src/pages/case-studies/[study].astro) and the homepage. Filters out the
 *  two schema definition files (schema.json, filter-schema.json — not case
 *  studies, just shapes) and anything explicitly marked confidential. Does
 *  NOT filter by `status` — draft/review/in-progress already render fine on
 *  /for/ pages today, and excluding them here would just create a second,
 *  inconsistent gate. */
export function getAllPublicCaseStudies(): CaseStudy[] {
  return Object.values(caseStudyModules)
    .map(mod => mod?.default as CaseStudy | undefined)
    .filter((cs): cs is CaseStudy => !!cs?.id && Array.isArray(cs.sections))
    .filter(cs => !cs.meta?.confidential);
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

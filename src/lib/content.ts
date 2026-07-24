import {
  articles,
  certifications,
  education,
  experiences,
  personProfile,
  projects,
  siteSettings,
  skills,
} from "@/content/fallback";
import { sanityFetch } from "@/sanity/client";
import {
  articleBySlugQuery,
  articlesQuery,
  certificationsQuery,
  educationQuery,
  experiencesQuery,
  featuredProjectsQuery,
  personProfileQuery,
  projectBySlugQuery,
  projectsQuery,
  siteSettingsQuery,
  skillsQuery,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type {
  Article,
  Certification,
  Education,
  EducationResultEntry,
  EducationResultStats,
  Experience,
  PersonProfile,
  Project,
  SiteSettings,
  Skill,
} from "@/types/content";
import { sortByOrder } from "@/lib/utils";

function valueToText(value: unknown): string | null {
  if (typeof value === "string") {
    const text = value.trim();
    return text.length ? text : null;
  }

  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (typeof record.body === "string") {
    const text = record.body.trim();
    return text.length ? text : null;
  }

  if (typeof record.code === "string") {
    const text = record.code.trim();
    return text.length ? text : null;
  }

  if (typeof record.caption === "string") {
    const text = record.caption.trim();
    return text.length ? text : null;
  }

  if (typeof record.alt === "string") {
    const text = record.alt.trim();
    return text.length ? text : null;
  }

  if (typeof record.text === "string") {
    const text = record.text.trim();
    return text.length ? text : null;
  }

  if (Array.isArray(record.children)) {
    const text = record.children
      .map((child) => {
        if (!child || typeof child !== "object") {
          return "";
        }

        const childRecord = child as Record<string, unknown>;
        return typeof childRecord.text === "string" ? childRecord.text : "";
      })
      .join("")
      .trim();

    return text.length ? text : null;
  }

  return null;
}

function normalizeTextArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    const text = valueToText(value);
    return text ? [text] : [];
  }

  return value.map((item) => valueToText(item)).filter((item): item is string => Boolean(item));
}

function normalizePersonProfile(profile: PersonProfile | null | undefined): PersonProfile {
  const source = profile ?? personProfile;

  return {
    ...source,
    longBio: normalizeTextArray(source.longBio),
  };
}

function normalizeArticle(article: Article | null | undefined): Article | null {
  if (!article) {
    return null;
  }

  return {
    ...article,
    body: normalizeTextArray(article.body),
  };
}

function normalizeProjectImage(image: Project["featuredImage"]): Project["featuredImage"] {
  if (!image) {
    return undefined;
  }

  const url =
    image.url ??
    image.src ??
    (image.image ? urlForImage(image.image)?.width(1400).height(900).fit("crop").url() ?? undefined : undefined);

  return {
    ...image,
    src: image.src ?? url,
    url,
  };
}

function normalizeProject(project: Project | null | undefined): Project | null {
  if (!project) {
    return null;
  }

  return {
    ...project,
    featuredImage: normalizeProjectImage(project.featuredImage),
    gallery: project.gallery?.map((image) => normalizeProjectImage(image)).filter((image): image is NonNullable<typeof image> => Boolean(image)),
  };
}

function formatEducationPercentage(value: number) {
  return Number(value.toFixed(2));
}

function normalizeEducationResultEntries(entries: EducationResultEntry[] | undefined): EducationResultEntry[] {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((entry) => entry.showOnWebsite !== false)
    .map((entry) => ({
      ...entry,
      label: entry.label?.trim() ?? "",
      percentage: Number(entry.percentage),
      note: entry.note?.trim() || undefined,
      showOnWebsite: entry.showOnWebsite ?? true,
    }))
    .filter((entry) => entry.label && Number.isFinite(entry.percentage));
}

function getEducationResultStats(entries: EducationResultEntry[]): EducationResultStats | null {
  if (!entries.length) {
    return null;
  }

  const highest = entries.reduce((best, entry) => (entry.percentage > best.percentage ? entry : best), entries[0]);
  const total = entries.reduce((sum, entry) => sum + entry.percentage, 0);

  return {
    highestLabel: highest.label,
    highestPercentage: formatEducationPercentage(highest.percentage),
    averagePercentage: formatEducationPercentage(total / entries.length),
    visibleResultCount: entries.length,
  };
}

function normalizeEducationItems(items: Education[]): Education[] {
  return items
    .filter((item) => item.showOnWebsite !== false)
    .map((item) => {
      const resultEntries = normalizeEducationResultEntries(item.resultEntries);

      return {
        ...item,
        achievements: normalizeTextArray(item.achievements),
        resultEntries,
        showOnWebsite: item.showOnWebsite ?? true,
        showResultStats: item.showResultStats ?? true,
        showResultEntries: item.showResultEntries ?? true,
        resultStats: getEducationResultStats(resultEntries),
      };
    });
}

export async function getSiteSettings() {
  return sanityFetch<SiteSettings>({
    query: siteSettingsQuery,
    fallback: siteSettings,
  });
}

export async function getPersonProfile() {
  const data = await sanityFetch<PersonProfile>({
    query: personProfileQuery,
    fallback: personProfile,
  });

  return normalizePersonProfile(data);
}

export async function getProjects() {
  const data = await sanityFetch<Project[]>({
    query: projectsQuery,
    fallback: projects,
  });

  return sortByOrder((data.length ? data : projects).map((project) => normalizeProject(project)).filter((project): project is Project => Boolean(project)));
}

export async function getFeaturedProjects() {
  const data = await sanityFetch<Project[]>({
    query: featuredProjectsQuery,
    fallback: projects.filter((project) => project.featured),
  });

  return sortByOrder(
    (data.length ? data : projects)
      .map((project) => normalizeProject(project))
      .filter((project): project is Project => Boolean(project))
      .filter((project) => project.featured),
  );
}

export async function getProjectBySlug(slug: string) {
  const fallback = projects.find((project) => project.slug === slug) ?? null;

  const project = await sanityFetch<Project | null>({
    query: projectBySlugQuery,
    params: { slug },
    fallback,
  });

  return normalizeProject(project);
}

export async function getExperiences() {
  return sanityFetch<Experience[]>({
    query: experiencesQuery,
    fallback: experiences,
  });
}

export async function getEducation() {
  const data = await sanityFetch<Education[]>({
    query: educationQuery,
    fallback: education,
  });

  return normalizeEducationItems(data.length ? data : education);
}

export async function getSkills() {
  return sanityFetch<Skill[]>({
    query: skillsQuery,
    fallback: skills,
  });
}

export async function getCertifications() {
  return sanityFetch<Certification[]>({
    query: certificationsQuery,
    fallback: certifications,
  });
}

export async function getArticles() {
  const data = await sanityFetch<Article[]>({
    query: articlesQuery,
    fallback: articles,
  });

  return data.map((article) => normalizeArticle(article)).filter((article): article is Article => Boolean(article));
}

export async function getArticleBySlug(slug: string) {
  const fallback = articles.find((article) => article.slug === slug) ?? null;
  const article = await sanityFetch<Article | null>({
    query: articleBySlugQuery,
    params: { slug },
    fallback,
  });

  return normalizeArticle(article);
}

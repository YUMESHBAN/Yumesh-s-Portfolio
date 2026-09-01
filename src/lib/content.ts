import {
  articles,
  certifications,
  education,
  experiences,
  personProfile,
  projects,
  siteSettings,
  skillShowcases,
  stackCategories,
  skills,
} from "@/content/fallback";
import { aboutJourney } from "@/content/about-journey";
import { sanityFetch } from "@/sanity/client";
import {
  aboutJourneyQuery,
  articleBySlugQuery,
  articlesQuery,
  certificationsQuery,
  educationQuery,
  experiencesQuery,
  featuredHomepageArticlesQuery,
  featuredHomepageExperiencesQuery,
  featuredProjectsQuery,
  personProfileQuery,
  projectBySlugQuery,
  projectsQuery,
  projectRelatedContentQuery,
  siteSettingsQuery,
  skillShowcasesQuery,
  skillsQuery,
  stackCategoriesQuery,
} from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import type {
  AboutJourney,
  Article,
  ArticleSource,
  Certification,
  Education,
  EducationResultEntry,
  EducationResultStats,
  Experience,
  PersonProfile,
  Project,
  SiteSettings,
  Skill,
  SkillShowcase,
  StackCategory,
  RichContentBlock,
  RichImageBlock,
} from "@/types/content";
import { sortByOrder } from "@/lib/utils";

export type ProjectRelatedContent = {
  proofs: Array<{
    _id: string;
    title: string;
    description: string;
    highlights?: string[];
    skill?: { name?: string; category?: string };
    image?: import("@/types/content").ImageWithMeta;
    demoVideoUrl?: string;
  }>;
  articles: Array<{
    _id: string;
    title: string;
    slug: string;
    category?: string;
    excerpt?: string;
    publishedAt?: string;
    coverImage?: import("@/types/content").ImageWithMeta;
  }>;
};

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
    aboutManifesto: source.aboutManifesto?.length ? source.aboutManifesto : personProfile.aboutManifesto,
  };
}

function legacyTextBlock(text: string, index: number): RichContentBlock {
  return {
    _key: `legacy-${index}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [{ _key: `legacy-span-${index}`, _type: "span", text }],
  };
}

function normalizeRichContent(value: unknown): RichContentBlock[] {
  const items = Array.isArray(value) ? value : [value];

  return items.flatMap((item, index) => {
    if (typeof item === "string") {
      const text = item.trim();
      return text ? [legacyTextBlock(text, index)] : [];
    }

    if (!item || typeof item !== "object") {
      return [];
    }

    const block = item as Record<string, unknown>;

    if (block._type === "imageWithMeta") {
      const image = normalizeProjectImage(block as RichImageBlock);
      return [
        {
          ...block,
          ...image,
          _type: "imageWithMeta",
        } as RichImageBlock,
      ];
    }

    if (
      block._type === "block" ||
      block._type === "calloutBlock" ||
      block._type === "keyTakeawayBlock" ||
      block._type === "codeBlock"
    ) {
      return [block as RichContentBlock];
    }

    const text = valueToText(item);
    return text ? [legacyTextBlock(text, index)] : [];
  });
}

function normalizeArticle(article: ArticleSource | null | undefined): Article | null {
  if (!article) {
    return null;
  }

  return {
    ...article,
    body: normalizeRichContent(article.body),
    coverImage: normalizeProjectImage(article.coverImage),
    relatedProjects: article.relatedProjects?.map((project) => ({
      ...project,
      featuredImage: normalizeProjectImage(project.featuredImage),
    })),
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

export async function getAboutJourney() {
  const data = await sanityFetch<AboutJourney>({
    query: aboutJourneyQuery,
    fallback: aboutJourney,
  });

  return data.chapters?.length ? data : aboutJourney;
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

export async function getProjectRelatedContent(projectId?: string): Promise<ProjectRelatedContent> {
  if (!projectId) return { proofs: [], articles: [] };
  return sanityFetch<ProjectRelatedContent>({
    query: projectRelatedContentQuery,
    params: { projectId },
    fallback: { proofs: [], articles: [] },
  });
}

export async function getExperiences() {
  return sanityFetch<Experience[]>({
    query: experiencesQuery,
    fallback: experiences,
  });
}

export async function getFeaturedHomepageExperiences() {
  const fallback = experiences
    .filter((experience) => experience.featuredOnHomepage)
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));

  return sanityFetch<Experience[]>({
    query: featuredHomepageExperiencesQuery,
    fallback,
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

export async function getStackCategories() {
  const data = await sanityFetch<StackCategory[]>({
    query: stackCategoriesQuery,
    fallback: stackCategories,
  });

  return sortByOrder((data.length ? data : stackCategories).map((category) => ({
    ...category,
    image: normalizeProjectImage(category.image),
  })));
}

export async function getSkillShowcases() {
  const data = await sanityFetch<SkillShowcase[]>({
    query: skillShowcasesQuery,
    fallback: skillShowcases,
  });

  return sortByOrder((data.length ? data : skillShowcases).map((showcase) => ({
    ...showcase,
    image: normalizeProjectImage(showcase.image),
    project: showcase.project
      ? { ...showcase.project, featuredImage: normalizeProjectImage(showcase.project.featuredImage) }
      : undefined,
  })));
}

export async function getCertifications() {
  return sanityFetch<Certification[]>({
    query: certificationsQuery,
    fallback: certifications,
  });
}

export async function getArticles() {
  const data = await sanityFetch<ArticleSource[]>({
    query: articlesQuery,
    fallback: articles,
  });

  return data.map((article) => normalizeArticle(article)).filter((article): article is Article => Boolean(article));
}

export async function getFeaturedHomepageArticles() {
  const fallback = articles
    .filter((article) => article.featuredOnHomepage)
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99))
    .slice(0, 3);
  const data = await sanityFetch<ArticleSource[]>({
    query: featuredHomepageArticlesQuery,
    fallback,
  });

  return data.map((article) => normalizeArticle(article)).filter((article): article is Article => Boolean(article));
}

export async function getArticleBySlug(slug: string) {
  const fallback = articles.find((article) => article.slug === slug) ?? null;
  const article = await sanityFetch<ArticleSource | null>({
    query: articleBySlugQuery,
    params: { slug },
    fallback,
  });

  return normalizeArticle(article);
}

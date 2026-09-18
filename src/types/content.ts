export type SocialLink = {
  label: string;
  href: string;
  type?: string;
};

export type ContentStatus = "draft" | "published" | "hidden";

export type ImageWithMeta = {
  image?: unknown;
  src?: string;
  url?: string;
  alt?: string;
  caption?: string;
  layout?: "inline" | "wide" | "sideLeft" | "sideRight";
};

export type LinkItem = {
  label: string;
  href: string;
  type?: string;
};

export type ProjectDocumentItem = {
  title: string;
  url: string;
};

export type MetricItem = {
  label: string;
  value: string;
  note?: string;
};

export type RichTextSpan = {
  _key?: string;
  _type: "span";
  marks?: string[];
  text: string;
};

export type RichTextBlock = {
  _key?: string;
  _type: "block";
  children?: RichTextSpan[];
  markDefs?: unknown[];
  style?: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
};

export type RichCalloutBlock = {
  _key?: string;
  _type: "calloutBlock";
  title?: string;
  body?: string;
  tone?: "Note" | "Tip" | "Warning" | "Result" | "Finding" | "Conclusion";
};

export type RichKeyTakeawayBlock = {
  _key?: string;
  _type: "keyTakeawayBlock";
  label?: string;
  body?: string;
};

export type RichCodeBlock = {
  _key?: string;
  _type: "codeBlock";
  language?: string;
  code?: string;
};

export type RichImageBlock = {
  _key?: string;
  _type: "imageWithMeta";
  alt?: string;
  caption?: string;
  image?: unknown;
  src?: string;
  layout?: ImageWithMeta["layout"];
};

export type RichContentBlock = RichTextBlock | RichCalloutBlock | RichKeyTakeawayBlock | RichCodeBlock | RichImageBlock;

export type AboutManifestoItem = {
  lineOne: string;
  lineTwoLead: string;
  accent: string;
  lineTwoTail?: string;
  summary: string;
  description: string;
};

export type AboutJourneyChapter = {
  era: string;
  title: string;
  context: string;
  dateRange: string;
  location: string;
  story: string;
  lesson: string;
  outcome: string;
};

export type AboutJourney = {
  eyebrow: string;
  rangeLabel: string;
  title: string;
  introduction: string;
  chapters: AboutJourneyChapter[];
};

export type SkillReference = {
  _id?: string;
  name: string;
  category?: Skill["category"];
  level?: Skill["level"];
};

export type PersonProfile = {
  name: string;
  headline: string;
  heroEyebrow?: string;
  heroTitle?: string;
  availability?: string;
  location: string;
  email: string;
  phone?: string;
  image: string;
  shortBio: string;
  longBio: string[];
  degree: string;
  overallPercentage: string;
  finalSemesterPercentage: string;
  aboutManifesto: AboutManifestoItem[];
  ctaLinks?: LinkItem[];
  socialLinks: SocialLink[];
};

export type SiteSettings = {
  siteUrl: string;
  title: string;
  description: string;
  keywords: string[];
  cvUrl: string;
};

export type Project = {
  _id?: string;
  status?: ContentStatus;
  title: string;
  slug: string;
  type: "Company" | "Freelance" | "Academic" | "Learning";
  association: string;
  dateRange: string;
  projectYear?: string;
  duration?: string;
  teamSize?: string;
  summary: string;
  role: string;
  audience?: string;
  goals?: string[];
  responsibilities?: string[];
  problem?: RichContentBlock[];
  process?: RichContentBlock[];
  solution?: RichContentBlock[];
  results?: RichContentBlock[];
  metrics?: MetricItem[];
  relatedSkills?: SkillReference[];
  techStack: string[];
  features: string[];
  impact: string[];
  repoUrl?: string;
  liveUrl?: string;
  links?: LinkItem[];
  additionalDocuments?: ProjectDocumentItem[];
  demoVideoUrl?: string;
  demoVideoMimeType?: string;
  projectPdfUrl?: string;
  logo?: ImageWithMeta;
  featuredImage?: ImageWithMeta;
  gallery?: ImageWithMeta[];
  screenshots?: string[];
  featured: boolean;
  order: number;
};

export type Experience = {
  status?: ContentStatus;
  featuredOnHomepage?: boolean;
  homepageOrder?: number;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  workMode: string;
  companyUrl?: string;
  dateRange: string;
  current: boolean;
  summary: string;
  responsibilities?: string[];
  achievements: string[];
  relatedSkills?: SkillReference[];
  skills: string[];
};

export type Education = {
  status?: ContentStatus;
  institution: string;
  degree: string;
  level?: "Primary" | "Secondary" | "+2" | "Bachelor" | "Master" | "PhD" | "Diploma" | "Other";
  dateRange: string;
  location: string;
  summary: string;
  gradeSystem?: string;
  courses?: string[];
  honors?: string[];
  achievements: string[];
  resultEntries?: EducationResultEntry[];
  showResultStats?: boolean;
  showResultEntries?: boolean;
  showOnWebsite?: boolean;
  resultStats?: EducationResultStats | null;
};

export type EducationResultEntry = {
  label: string;
  percentage: number;
  note?: string;
  showOnWebsite?: boolean;
};

export type EducationResultStats = {
  highestLabel: string;
  highestPercentage: number;
  averagePercentage: number;
  visibleResultCount: number;
};

export type Skill = {
  _id?: string;
  status?: ContentStatus;
  name: string;
  iconName?: string;
  semanticIconName?: string;
  aliases?: string[];
  category: string;
  level: "Learning" | "Working" | "Strong";
  featured?: boolean;
  order: number;
};

export type StackCategory = {
  _id?: string;
  status?: ContentStatus;
  title: string;
  label?: string;
  description: string;
  image?: ImageWithMeta;
  order: number;
};

export type ShowcaseProject = {
  title: string;
  slug: string;
  summary?: string;
  role?: string;
  type?: Project["type"];
  liveUrl?: string;
  repoUrl?: string;
  techStack?: string[];
  featuredImage?: ImageWithMeta;
};

export type SkillShowcase = {
  _id?: string;
  status?: ContentStatus;
  skill: SkillReference;
  title: string;
  description: string;
  project?: ShowcaseProject;
  showOnRelatedProject?: boolean;
  image?: ImageWithMeta;
  demoVideoUrl?: string;
  demoVideoMimeType?: string;
  highlights?: string[];
  order: number;
};

export type Certification = {
  status?: ContentStatus;
  title: string;
  issuer: string;
  date: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  description: string;
  credentialUrl?: string;
  relatedSkills?: SkillReference[];
  order?: number;
};

export type Article = {
  status?: ContentStatus;
  featuredOnHomepage?: boolean;
  homepageOrder?: number;
  featuredOnArchive?: boolean;
  archiveOrder?: number;
  title: string;
  slug: string;
  category?: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  coverImage?: ImageWithMeta;
  relatedProjects?: ArticleRelatedProject[];
  showOnRelatedProject?: boolean;
  relatedArticles?: ArticleRelatedArticle[];
  body: RichContentBlock[];
};

export type ArticleRelatedProject = Pick<Project, "title" | "slug" | "summary" | "type" | "featuredImage">;

export type ArticleRelatedArticle = {
  title: string;
  slug: string;
  category?: string;
  excerpt: string;
  publishedAt: string;
};

export type LegacyArticle = Omit<Article, "body"> & {
  body: string[];
};

export type ArticleSource = Article | LegacyArticle;

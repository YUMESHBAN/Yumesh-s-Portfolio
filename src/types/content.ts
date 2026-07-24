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
};

export type LinkItem = {
  label: string;
  href: string;
  type?: string;
};

export type MetricItem = {
  label: string;
  value: string;
  note?: string;
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
  metrics?: MetricItem[];
  relatedSkills?: SkillReference[];
  techStack: string[];
  features: string[];
  impact: string[];
  repoUrl?: string;
  liveUrl?: string;
  links?: LinkItem[];
  logo?: ImageWithMeta;
  featuredImage?: ImageWithMeta;
  gallery?: ImageWithMeta[];
  screenshots?: string[];
  featured: boolean;
  order: number;
};

export type Experience = {
  status?: ContentStatus;
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
  description?: string;
  iconName?: string;
  aliases?: string[];
  category: "Frontend" | "Backend" | "Database" | "CMS" | "Tools" | "Soft Skills";
  level: "Learning" | "Working" | "Strong";
  featured?: boolean;
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
  title: string;
  slug: string;
  category?: string;
  excerpt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  body: string[];
};

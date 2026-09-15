export const personProfileQuery = `*[_type == "personProfile"][0]{
  name,
  headline,
  heroEyebrow,
  heroTitle,
  availability,
  location,
  email,
  phone,
  "image": coalesce(profileImage.asset->url, "https://avatars.githubusercontent.com/u/173427000?v=4"),
  shortBio,
  longBio,
  degree,
  overallPercentage,
  finalSemesterPercentage,
  aboutManifesto[]{lineOne, lineTwoLead, accent, lineTwoTail, summary, description},
  ctaLinks[]{label, href, type},
  socialLinks[]{label, href, type}
}`;
export const aboutJourneyQuery = `*[_type == "aboutJourney"][0]{
  eyebrow,
  rangeLabel,
  title,
  introduction,
  chapters[]{era, title, context, dateRange, location, story, lesson, outcome}
}`;
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteUrl,
  title,
  description,
  keywords,
  "cvUrl": coalesce(cvFile.asset->url, "/Yumesh-Ban-CV.pdf")
}`;
const projectFields = `{
  _id,
  status,
  title,
  "slug": slug.current,
  type,
  association,
  dateRange,
  projectYear,
  duration,
  teamSize,
  summary,
  role,
  audience,
  goals,
  responsibilities,
  problem,
  process,
  solution,
  results,
  metrics,
  relatedSkills[]->{_id, name, category, level},
  techStack,
  features,
  impact,
  repoUrl,
  liveUrl,
  links,
  additionalDocuments[]{_key, title, "url": file.asset->url},
  "demoVideoUrl": demoVideo.asset->url,
  "demoVideoMimeType": demoVideo.asset->mimeType,
  "projectPdfUrl": projectPdf.asset->url,
  logo{image, alt, "src": image.asset->url},
  featuredImage{image, alt, caption, "src": image.asset->url},
  gallery[]{image, alt, caption, "src": image.asset->url},
  "screenshots": screenshots[].asset->url,
  featured,
  order
}`;

export const projectsQuery = `*[_type == "project" && (!defined(status) || status == "published")] | order(order asc)${projectFields}`;
export const featuredProjectsQuery = `*[_type == "project" && featured == true && (!defined(status) || status == "published")] | order(order asc)${projectFields}`;
export const projectBySlugQuery = `*[_type == "project" && slug.current == $slug && (!defined(status) || status == "published")][0]{
  _id,
  status,
  title,
  "slug": slug.current,
  type,
  association,
  dateRange,
  projectYear,
  duration,
  teamSize,
  summary,
  role,
  audience,
  goals,
  responsibilities,
  problem,
  process,
  solution,
  results,
  metrics,
  relatedSkills[]->{_id, name, category, level},
  techStack,
  features,
  impact,
  repoUrl,
  liveUrl,
  links,
  additionalDocuments[]{_key, title, "url": file.asset->url},
  "demoVideoUrl": demoVideo.asset->url,
  "demoVideoMimeType": demoVideo.asset->mimeType,
  "projectPdfUrl": projectPdf.asset->url,
  logo{image, alt, "src": image.asset->url},
  featuredImage{image, alt, caption, "src": image.asset->url},
  gallery[]{image, alt, caption, "src": image.asset->url},
  "screenshots": screenshots[].asset->url,
  featured,
  order
}`;
export const experiencesQuery = `*[_type == "experience" && (!defined(status) || status == "published")] | order(current desc, startDate desc){
  status,
  featuredOnHomepage,
  homepageOrder,
  company,
  role,
  employmentType,
  location,
  workMode,
  companyUrl,
  startDate,
  endDate,
  dateRange,
  current,
  summary,
  responsibilities,
  achievements,
  relatedSkills[]->{_id, name, category, level},
  skills
}`;
export const featuredHomepageExperiencesQuery = `*[_type == "experience" && (!defined(status) || status == "published") && featuredOnHomepage == true] | order(homepageOrder asc){
  status,
  featuredOnHomepage,
  homepageOrder,
  company,
  role,
  employmentType,
  location,
  workMode,
  companyUrl,
  startDate,
  endDate,
  dateRange,
  current,
  summary,
  responsibilities,
  achievements,
  relatedSkills[]->{_id, name, category, level},
  skills
}`;
export const educationQuery = `*[_type == "education" && (!defined(status) || status == "published") && showOnWebsite != false] | order(order asc){
  institution,
  degree,
  level,
  dateRange,
  location,
  summary,
  gradeSystem,
  courses,
  honors,
  achievements,
  resultEntries[]{
    label,
    percentage,
    note,
    showOnWebsite
  },
  showResultStats,
  showResultEntries,
  showOnWebsite,
  order
}`;
export const skillsQuery = `*[_type == "skill" && (!defined(status) || status == "published")] | order(order asc){
  _id,
  status,
  name,
  iconName,
  aliases,
  category,
  level,
  featured,
  order
}`;
export const stackCategoriesQuery = `*[_type == "stackCategory" && (!defined(status) || status == "published")] | order(order asc, title asc){
  _id,
  status,
  title,
  label,
  description,
  image{image, alt, caption, "src": image.asset->url},
  order
}`;
export const skillShowcasesQuery = `*[_type == "skillShowcase" && (!defined(status) || status == "published")] | order(order asc, title asc){
  _id,
  status,
  skill->{_id, name, category, level},
  title,
  description,
  project->{
    title,
    "slug": slug.current,
    summary,
    role,
    type,
    liveUrl,
    repoUrl,
    techStack,
    featuredImage{image, alt, caption, "src": image.asset->url}
  },
  image{image, alt, caption, "src": image.asset->url},
  "demoVideoUrl": demoVideo.asset->url,
  "demoVideoMimeType": demoVideo.asset->mimeType,
  highlights,
  showOnRelatedProject,
  order
}`;
export const certificationsQuery = `*[_type == "certification" && (!defined(status) || status == "published")] | order(order asc, date desc){
  status,
  title,
  issuer,
  date,
  issueDate,
  expiryDate,
  credentialId,
  description,
  "credentialUrl": coalesce(credentialUrl, credentialFile.asset->url),
  relatedSkills[]->{_id, name, category, level},
  order
}`;
export const articlesQuery = `*[_type == "article" && (!defined(status) || status == "published")] | order(featuredOnArchive desc, archiveOrder asc, publishedAt desc){
  status,
  featuredOnHomepage,
  homepageOrder,
  featuredOnArchive,
  archiveOrder,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  updatedAt,
  tags,
  body
}`;
export const projectRelatedContentQuery = `{
  "proofs": *[_type == "skillShowcase" && project._ref == $projectId && (!defined(status) || status == "published") && showOnRelatedProject != false] | order(order asc, title asc){
    _id, title, description, highlights, skill->{name, category}, image{image, alt, caption, "src": image.asset->url}, "demoVideoUrl": demoVideo.asset->url
  },
  "articles": *[_type == "article" && references($projectId) && (!defined(status) || status == "published") && showOnRelatedProject != false] | order(publishedAt desc){
    _id, title, "slug": slug.current, category, excerpt, publishedAt, coverImage{image, alt, caption, "src": image.asset->url}
  }
}`;
export const featuredHomepageArticlesQuery = `*[_type == "article" && (!defined(status) || status == "published") && featuredOnHomepage == true] | order(homepageOrder asc)[0...3]{
  status,
  featuredOnHomepage,
  homepageOrder,
  featuredOnArchive,
  archiveOrder,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  updatedAt,
  tags,
  body
}`;
export const articleBySlugQuery = `*[_type == "article" && slug.current == $slug && (!defined(status) || status == "published")][0]{
  status,
  featuredOnHomepage,
  homepageOrder,
  featuredOnArchive,
  archiveOrder,
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  updatedAt,
  tags,
  coverImage{image, alt, caption, "src": image.asset->url},
  body[]{
    ...,
    _type == "imageWithMeta" => {
      ...,
      "src": image.asset->url
    }
  },
  relatedProjects[]->{
    title,
    "slug": slug.current,
    type,
    summary,
    featuredImage{image, alt, caption, "src": image.asset->url}
  },
  relatedArticles[]->{
    title,
    "slug": slug.current,
    category,
    excerpt,
    publishedAt
  }
}`;

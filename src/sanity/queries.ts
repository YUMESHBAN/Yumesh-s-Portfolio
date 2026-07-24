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
  ctaLinks[]{label, href, type},
  socialLinks[]{label, href, type}
}`;
export const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  siteUrl,
  title,
  description,
  keywords,
  "cvUrl": coalesce(cvFile.asset->url, "/Yumesh-Ban-CV.pdf")
}`;
const projectFields = `{
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
  metrics,
  relatedSkills[]->{_id, name, category, level},
  techStack,
  features,
  impact,
  repoUrl,
  liveUrl,
  links,
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
  metrics,
  relatedSkills[]->{_id, name, category, level},
  techStack,
  features,
  impact,
  repoUrl,
  liveUrl,
  links,
  logo{image, alt, "src": image.asset->url},
  featuredImage{image, alt, caption, "src": image.asset->url},
  gallery[]{image, alt, caption, "src": image.asset->url},
  "screenshots": screenshots[].asset->url,
  featured,
  order
}`;
export const experiencesQuery = `*[_type == "experience" && (!defined(status) || status == "published")] | order(current desc, startDate desc){
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
  description,
  iconName,
  aliases,
  category,
  level,
  featured,
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
  credentialUrl,
  relatedSkills[]->{_id, name, category, level},
  order
}`;
export const articlesQuery = `*[_type == "article" && (!defined(status) || status == "published")] | order(publishedAt desc){
  status,
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
  title,
  "slug": slug.current,
  category,
  excerpt,
  publishedAt,
  updatedAt,
  tags,
  body
}`;

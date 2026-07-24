import type { Article, PersonProfile, Project, SiteSettings } from "@/types/content";
import { absoluteUrl } from "@/lib/utils";

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Yumesh Ban",
    alternateName: ["Yumesh Ban Portfolio", "Yumesh Ban Developer", "yumeshban.com"],
    url: settings.siteUrl,
  };
}

export function personJsonLd(profile: PersonProfile, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: settings.siteUrl,
    image: profile.image,
    jobTitle: "Full Stack Developer",
    description: profile.shortBio,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Tribhuvan University",
    },
    sameAs: profile.socialLinks.map((link) => link.href),
    knowsAbout: [
      "Next.js",
      "React",
      "Sanity CMS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Django",
      "Full Stack Development",
    ],
  };
}

export function profilePageJsonLd(profile: PersonProfile, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about", settings.siteUrl),
    dateCreated: "2026-06-15",
    dateModified: "2026-06-15",
    mainEntity: {
      "@type": "Person",
      name: profile.name,
      description: profile.shortBio,
      image: profile.image,
      sameAs: profile.socialLinks.map((link) => link.href),
    },
  };
}

export function articleJsonLd(article: Article, profile: PersonProfile, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Person",
      name: profile.name,
      url: settings.siteUrl,
    },
    mainEntityOfPage: absoluteUrl(`/articles/${article.slug}`, settings.siteUrl),
  };
}

export function projectJsonLd(project: Project, profile: PersonProfile, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url: absoluteUrl(`/projects/${project.slug}`, settings.siteUrl),
    creator: {
      "@type": "Person",
      name: profile.name,
      url: settings.siteUrl,
    },
    keywords: project.techStack.join(", "),
    sameAs: [project.liveUrl, project.repoUrl].filter(Boolean),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href: string }>, settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href, settings.siteUrl),
    })),
  };
}

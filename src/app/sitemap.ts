import type { MetadataRoute } from "next";

import { getArticles, getProjects, getSiteSettings } from "@/lib/content";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, projects, articles] = await Promise.all([getSiteSettings(), getProjects(), getArticles()]);

  const staticRoutes = ["", "/about", "/selected-work", "/projects", "/articles", "/experience", "/contact"];
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`);
  const articleRoutes = articles.map((article) => `/articles/${article.slug}`);

  return [...staticRoutes, ...projectRoutes, ...articleRoutes].map((route) => ({
    url: absoluteUrl(route || "/", settings.siteUrl),
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}

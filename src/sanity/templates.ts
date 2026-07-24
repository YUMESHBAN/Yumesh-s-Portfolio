import type { Template } from "sanity";

export const templates: Template[] = [
  {
    id: "project-from-dashboard",
    title: "Project from dashboard",
    schemaType: "project",
    value: {
      status: "published",
      type: "Company",
      featured: true,
      order: 99,
      techStack: ["Next.js", "Sanity CMS", "TypeScript"],
      features: ["Describe the core user-facing feature here"],
      impact: ["Describe the measurable or portfolio value here"],
    },
  },
  {
    id: "article-from-dashboard",
    title: "Article from dashboard",
    schemaType: "article",
    value: {
      status: "draft",
      publishedAt: new Date().toISOString().slice(0, 10),
      tags: ["Yumesh Ban"],
    },
  },
  {
    id: "experience-from-dashboard",
    title: "Experience from dashboard",
    schemaType: "experience",
    value: {
      status: "published",
      employmentType: "Full-time",
      workMode: "Hybrid",
      current: false,
      achievements: ["Add one concrete result or responsibility"],
      skills: ["Next.js"],
    },
  },
  {
    id: "skill-from-dashboard",
    title: "Skill from dashboard",
    schemaType: "skill",
    value: {
      status: "published",
      category: "Frontend",
      level: "Working",
      order: 99,
    },
  },
  {
    id: "certification-from-dashboard",
    title: "Certification from dashboard",
    schemaType: "certification",
    value: {
      status: "published",
      date: new Date().getFullYear().toString(),
      order: 99,
    },
  },
];

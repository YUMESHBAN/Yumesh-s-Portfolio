"use client";

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import ArticleDashboard from "./src/components/studio/articles/ArticleDashboard";
import CertificationDashboard from "./src/components/studio/certifications/CertificationDashboard";
import DocumentsDashboard from "./src/components/studio/documents/DocumentsDashboard";
import EducationDashboard from "./src/components/studio/education/EducationDashboard";
import ExperienceDashboard from "./src/components/studio/experience/ExperienceDashboard";
import OverviewDashboard from "./src/components/studio/overview/OverviewDashboard";
import ProfileDashboard from "./src/components/studio/profile/ProfileDashboard";
import ProjectDashboard from "./src/components/studio/projects/ProjectDashboard";
import StackShowcaseDashboard from "./src/components/studio/stack/StackShowcaseDashboard";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { templates } from "./src/sanity/templates";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "your-project-id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const singletonTypes = new Set(["personProfile", "siteSettings"]);

export default defineConfig({
  basePath: "/studio",
  name: "yumesh-ban-portfolio",
  title: "Yumesh Ban Portfolio",
  projectId,
  dataset,
  tools: (previousTools) => [
    {
      name: "overview",
      title: "Overview",
      component: OverviewDashboard,
    },
    {
      name: "profile",
      title: "Profile",
      component: ProfileDashboard,
    },
    {
      name: "project",
      title: "Projects",
      component: ProjectDashboard,
    },
    {
      name: "article",
      title: "Articles",
      component: ArticleDashboard,
    },
    {
      name: "experience",
      title: "Experience",
      component: ExperienceDashboard,
    },
    {
      name: "education",
      title: "Education",
      component: EducationDashboard,
    },
    {
      name: "skill",
      title: "Stack Showcase",
      component: StackShowcaseDashboard,
    },
    {
      name: "certification",
      title: "Certifications",
      component: CertificationDashboard,
    },
    {
      name: "documents",
      title: "Documents",
      component: DocumentsDashboard,
    },
    ...previousTools,
  ],
  plugins: [
    structureTool({
      name: "desk",
      title: "Raw Desk",
      structure,
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (previousTemplates) => [...previousTemplates, ...templates],
  },
  document: {
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter((option) => !singletonTypes.has(option.templateId)),
    actions: (previousActions, context) =>
      singletonTypes.has(context.schemaType)
        ? previousActions.filter((action) => !["duplicate", "delete"].includes(action.action ?? ""))
        : previousActions,
  },
  studio: {
    components: {
      navbar: () => null,
    },
  },
});

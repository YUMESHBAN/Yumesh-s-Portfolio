import { createClient } from "@sanity/client";

import { skillShowcases, stackCategories } from "../src/content/fallback";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-03-01", useCdn: false });

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

const [skills, projects] = await Promise.all([
  client.fetch<Array<{ _id: string; name: string; category?: string }>>(`*[_type == "skill"]{_id,name,category}`),
  client.fetch<Array<{ _id: string; slug?: { current?: string } }>>(`*[_type == "project"]{_id,slug}`),
]);

const resolveSkill = (name: string, category: string) =>
  skills.find((skill) => skill.name.trim().toLowerCase() === name.trim().toLowerCase() && skill.category?.trim().toLowerCase() === category.trim().toLowerCase());
const resolveProject = (slug: string) => projects.find((project) => project.slug?.current === slug);

const missingSkills = skillShowcases
  .map((showcase) => showcase.skill)
  .filter((skill) => !resolveSkill(skill.name, skill.category ?? ""));

if (missingSkills.length) {
  throw new Error(`Cannot seed stack proofs because these skills are missing: ${missingSkills.map((skill) => `${skill.category} / ${skill.name}`).join(", ")}.`);
}

const missingProjects = skillShowcases
  .map((showcase) => showcase.project?.slug)
  .filter((slug): slug is string => Boolean(slug))
  .filter((slug) => !resolveProject(slug));

if (missingProjects.length) {
  throw new Error(`Cannot seed stack proofs because these projects are missing: ${missingProjects.join(", ")}.`);
}

const categoryDocs = stackCategories.map((category) => ({
  _id: `stack-category-${slugify(category.title)}`,
  _type: "stackCategory",
  status: category.status ?? "published",
  title: category.title,
  label: category.label,
  description: category.description,
  order: category.order,
}));

const showcaseDocs = skillShowcases.map((showcase) => {
  const skill = resolveSkill(showcase.skill.name, showcase.skill.category ?? "");
  const project = showcase.project ? resolveProject(showcase.project.slug) : undefined;

  return {
    _id: `skill-showcase-${slugify(`${showcase.skill.category}-${showcase.skill.name}`)}`,
    _type: "skillShowcase",
    status: showcase.status ?? "published",
    skill: { _type: "reference", _ref: skill!._id },
    title: showcase.title,
    description: showcase.description,
    ...(project ? { project: { _type: "reference", _ref: project._id } } : {}),
    highlights: showcase.highlights,
    order: showcase.order,
  };
});

const documents: Array<{ _id: string; _type: string; [key: string]: unknown }> = [...categoryDocs, ...showcaseDocs];
const transaction = documents.reduce((trx, document) => trx.createOrReplace(document), client.transaction());
await transaction.commit();

console.log(`Seeded ${categoryDocs.length} stack categories and ${showcaseDocs.length} skill proofs into ${projectId}/${dataset}.`);

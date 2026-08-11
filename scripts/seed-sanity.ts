import { createClient } from "@sanity/client";

import { aboutJourney } from "../src/content/about-journey";
import {
  articles,
  certifications,
  education,
  experiences,
  personProfile,
  projects,
  siteSettings,
  skills,
} from "../src/content/fallback";
import { loadLocalEnv } from "./load-env";

type SeedDocument = {
  _id: string;
  _type: string;
  [key: string]: unknown;
};

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function block(text: string, index: number) {
  return {
    _type: "block",
    _key: `block-${index}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `span-${index}`,
        text,
        marks: [],
      },
    ],
  };
}

function educationResultEntry(
  entry: {
    label: string;
    percentage: number;
    note?: string;
    showOnWebsite?: boolean;
  },
  index: number,
) {
  return {
    _type: "educationResult",
    _key: `education-result-${index}`,
    ...entry,
  };
}

function aboutManifestoItem(entry: (typeof personProfile.aboutManifesto)[number], index: number) {
  return {
    _type: "aboutManifestoItem",
    _key: `about-manifesto-${index}`,
    ...entry,
  };
}

function aboutJourneyChapter(entry: (typeof aboutJourney.chapters)[number], index: number) {
  return {
    _type: "aboutJourneyChapter",
    _key: `about-journey-${index}`,
    ...entry,
  };
}

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN. Add them to your environment before seeding Sanity.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-01",
  useCdn: false,
});

const docs: SeedDocument[] = [
  {
    _id: "personProfile",
    _type: "personProfile",
    ...personProfile,
    profileImage: undefined,
    image: undefined,
    longBio: personProfile.longBio.map(block),
    aboutManifesto: personProfile.aboutManifesto.map(aboutManifestoItem),
  },
  {
    _id: "siteSettings",
    _type: "siteSettings",
    ...siteSettings,
    cvUrl: undefined,
  },
  {
    _id: "aboutJourney",
    _type: "aboutJourney",
    ...aboutJourney,
    chapters: aboutJourney.chapters.map(aboutJourneyChapter),
  },
  ...projects.map((project) => ({
    _id: `project-${project.slug}`,
    _type: "project",
    ...project,
    slug: { _type: "slug", current: project.slug },
  })),
  ...experiences.map((experience) => ({
    _id: `experience-${slugify(`${experience.company}-${experience.role}`)}`,
    _type: "experience",
    ...experience,
  })),
  ...education.map((item, index) => ({
    _id: `education-${slugify(item.institution)}`,
    _type: "education",
    ...item,
    resultEntries: item.resultEntries?.map(educationResultEntry) ?? [],
    order: index + 1,
  })),
  ...skills.map((skill) => ({
    _id: `skill-${slugify(`${skill.category}-${skill.name}`)}`,
    _type: "skill",
    ...skill,
  })),
  ...certifications.map((certification) => ({
    _id: `certification-${slugify(certification.title)}`,
    _type: "certification",
    ...certification,
  })),
  ...articles.map((article) => ({
    _id: `article-${article.slug}`,
    _type: "article",
    ...article,
    slug: { _type: "slug", current: article.slug },
    body: article.body.map(block),
  })),
];

const transaction = docs.reduce((trx, doc) => trx.createOrReplace(doc), client.transaction());

try {
  await transaction.commit();
  console.log(`Seeded ${docs.length} Sanity documents into ${projectId}/${dataset}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Sanity error";

  console.error(`Sanity seed failed: ${message}`);
  console.error("No secrets were printed. Check your network, project ID, dataset, and token permissions.");
  process.exit(1);
}

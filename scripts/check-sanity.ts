import { createClient } from "@sanity/client";

import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local or .env.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-01",
  useCdn: false,
});

try {
  const summary = await client.fetch<{
    profile?: { name?: string; headline?: string } | null;
    projects: number;
    articles: number;
    experiences: number;
  }>(
    `{
      "profile": *[_type == "personProfile"][0]{name, headline},
      "projects": count(*[_type == "project"]),
      "articles": count(*[_type == "article"]),
      "experiences": count(*[_type == "experience"])
    }`,
  );

  console.log(`Sanity connection OK: ${projectId}/${dataset}`);
  console.log(`Profile: ${summary.profile?.name ? summary.profile.name : "missing"}`);
  console.log(`Projects: ${summary.projects}`);
  console.log(`Articles: ${summary.articles}`);
  console.log(`Experience entries: ${summary.experiences}`);

  if (!summary.profile || summary.projects === 0 || summary.articles === 0) {
    console.log("Sanity is connected, but starter content looks incomplete. Run npm.cmd run seed:sanity.");
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Sanity error";

  console.error(`Sanity check failed: ${message}`);
  console.error("No secrets were printed. Check your network, project ID, dataset, and token permissions.");
  process.exit(1);
}

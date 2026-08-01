import { createClient } from "@sanity/client";

import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-03-01", useCdn: false });
const summary = await client.fetch<{ categories: number; proofs: number; unresolvedSkills: number; unresolvedProjects: number }>(`{
  "categories": count(*[_type == "stackCategory"]),
  "proofs": count(*[_type == "skillShowcase"]),
  "unresolvedSkills": count(*[_type == "skillShowcase" && !defined(skill->._id)]),
  "unresolvedProjects": count(*[_type == "skillShowcase" && defined(project) && !defined(project->._id)])
}`);

if (summary.categories < 6 || summary.proofs < 16 || summary.unresolvedSkills || summary.unresolvedProjects) {
  throw new Error(`Stack showcase verification failed: ${JSON.stringify(summary)}.`);
}

console.log(`Stack showcase verified: ${summary.categories} categories, ${summary.proofs} proofs, all references resolved.`);

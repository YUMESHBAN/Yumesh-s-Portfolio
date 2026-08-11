import { createClient } from "@sanity/client";

import { aboutJourney } from "../src/content/about-journey";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN.");
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-01",
  useCdn: false,
});

const payload = {
  ...aboutJourney,
  chapters: aboutJourney.chapters.map((chapter, index) => ({
    _key: `about-journey-${index + 1}`,
    _type: "aboutJourneyChapter",
    ...chapter,
  })),
};

try {
  await client.createIfNotExists({
    _id: "aboutJourney",
    _type: "aboutJourney",
    ...payload,
  });
  await client.patch("aboutJourney").set(payload).commit();

  const saved = await client.fetch<{ chapters?: unknown[] } | null>(
    `*[_id == "aboutJourney"][0]{chapters}`,
  );

  if (saved?.chapters?.length !== aboutJourney.chapters.length) {
    throw new Error("About journey verification failed after saving.");
  }

  console.log(`Updated and verified ${saved.chapters.length} About journey chapters in ${projectId}/${dataset}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Sanity error";
  console.error(`About journey seed failed: ${message}`);
  process.exitCode = 1;
}

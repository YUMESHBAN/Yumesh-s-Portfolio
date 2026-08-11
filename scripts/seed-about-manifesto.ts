import { createClient } from "@sanity/client";

import { personProfile } from "../src/content/fallback";
import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN. Add them to your environment before updating the manifesto.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-03-01",
  useCdn: false,
});

const aboutManifesto = personProfile.aboutManifesto.map((item, index) => ({
  _type: "aboutManifestoItem",
  _key: `about-manifesto-${index}`,
  ...item,
}));

try {
  const updatedProfile = await client.patch("personProfile").set({ aboutManifesto }).commit();

  if (!Array.isArray(updatedProfile.aboutManifesto) || updatedProfile.aboutManifesto.length !== aboutManifesto.length) {
    throw new Error("Sanity returned an unexpected manifesto after the update.");
  }

  console.log(`Updated and verified ${aboutManifesto.length} About manifesto entries in ${projectId}/${dataset}.`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown Sanity error";

  console.error(`About manifesto update failed: ${message}`);
  console.error("No secrets were printed. Check the profile document, network, dataset, and token permissions.");
  process.exit(1);
}

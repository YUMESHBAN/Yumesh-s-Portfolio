import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, hasSanityConfig, projectId } from "@/sanity/env";

let sanityClient: ReturnType<typeof createClient> | null = null;

export function getSanityClient() {
  if (!hasSanityConfig || !projectId) {
    return null;
  }

  if (!sanityClient) {
    sanityClient = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    });
  }

  return sanityClient;
}

export async function sanityFetch<T>({
  query,
  params = {},
  fallback,
}: {
  query: string;
  params?: QueryParams;
  fallback: T;
}): Promise<T> {
  const client = getSanityClient();

  if (!client) {
    return fallback;
  }

  try {
    const data = await client.fetch<T>(query, params);
    return data ?? fallback;
  } catch {
    return fallback;
  }
}

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

import { dataset, hasSanityConfig, projectId } from "@/sanity/env";

const builder =
  hasSanityConfig && projectId
    ? imageUrlBuilder({
        projectId,
        dataset,
      })
    : null;

export function urlForImage(source: SanityImageSource) {
  if (!builder) {
    return null;
  }

  return builder.image(source);
}

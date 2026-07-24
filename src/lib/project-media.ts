import type { ImageWithMeta, Project } from "@/types/content";

export function getProjectImage(project: Project): ImageWithMeta | undefined {
  return project.featuredImage?.url || project.featuredImage?.src
    ? project.featuredImage
    : project.gallery?.find((image) => Boolean(image.url || image.src));
}

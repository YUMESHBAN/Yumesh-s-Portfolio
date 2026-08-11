import { permanentRedirect } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectRedirectPage({ params }: PageProps) {
  const { slug } = await params;
  permanentRedirect(`/works/${slug}`);
}

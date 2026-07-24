import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { getArticleBySlug, getArticles, getPersonProfile, getSiteSettings } from "@/lib/content";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const articles = await getArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url: `/articles/${article.slug}`,
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [article, profile, settings] = await Promise.all([
    getArticleBySlug(slug),
    getPersonProfile(),
    getSiteSettings(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd data={articleJsonLd(article, profile, settings)} />
      <JsonLd
        data={breadcrumbJsonLd(
          [
            { name: "Home", href: "/" },
            { name: "Articles", href: "/articles" },
            { name: article.title, href: `/articles/${article.slug}` },
          ],
          settings,
        )}
      />

      <article className="site-section pt-32">
        <div className="site-container max-w-3xl">
          <Link href="/articles" className="site-link inline-flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft size={17} />
            Back to Writing
          </Link>
          <p className="site-eyebrow mt-10">{article.publishedAt}</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold leading-none text-white sm:text-6xl">{article.title}</h1>
          <p className="site-muted mt-6 text-xl leading-8">{article.excerpt}</p>

          <div className="prose prose-invert prose-lg mt-10 max-w-none border-t border-white/10 pt-10 prose-headings:text-white prose-p:text-white/68 prose-a:text-blue-300">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <span key={tag} className="site-chip">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}

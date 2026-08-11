import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { JsonLd } from "@/components/json-ld";
import { ArticleContent } from "@/components/article-content";
import { getArticleBySlug, getArticles, getPersonProfile, getSiteSettings } from "@/lib/content";
import { urlForImage } from "@/sanity/image";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ slug: string }>;
};

function formatArticleDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

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

  const category = article.category || article.tags[0] || "Writing";
  const publishedDate = formatArticleDate(article.publishedAt);
  const coverImageUrl = article.coverImage?.src ?? article.coverImage?.url ?? (article.coverImage?.image ? urlForImage(article.coverImage.image as Parameters<typeof urlForImage>[0])?.width(1800).height(1200).fit("max").url() : undefined);

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

      <article className="article-reading site-section pt-32">
        <div className="site-container">
          <header className="article-reading-hero mx-auto max-w-4xl border-b border-white/10 pb-10 sm:pb-14">
            <Link
              href="/articles"
              className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
            <ArrowLeft size={17} />
            Back to Writing
          </Link>
            <p className="article-reading-meta site-eyebrow mt-10 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>{category}</span>
              <span aria-hidden="true" className="text-white/30">
                /
              </span>
              <time dateTime={article.publishedAt}>{publishedDate}</time>
            </p>
            <h1 className="mt-5 text-balance text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
              {article.title}
            </h1>
            <p className="site-muted mt-7 max-w-2xl text-lg leading-8 sm:text-xl sm:leading-8">{article.excerpt}</p>

            <div className="article-reading-meta mt-10 flex flex-wrap items-center gap-x-3 gap-y-3 border-t border-white/10 pt-5">
              <span className="site-eyebrow">Filed under</span>
              {article.tags.length ? (
                <ul className="flex flex-wrap gap-2" aria-label="Article tags">
                  {article.tags.map((tag) => (
                    <li key={tag} className="site-chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-sm text-white/55">{category}</span>
              )}
            </div>
          </header>

          {coverImageUrl ? (
            <figure className="article-reading-cover mx-auto mt-10 max-w-5xl overflow-hidden border border-white/10 bg-black/25 sm:mt-14">
              <Image src={coverImageUrl} alt={article.coverImage?.alt || `${article.title} cover image`} width={1800} height={1200} priority sizes="(min-width: 1280px) 1024px, 100vw" className="h-auto w-full" />
              {article.coverImage?.caption ? <figcaption className="border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45 sm:px-6">{article.coverImage.caption}</figcaption> : null}
            </figure>
          ) : null}

          <div className="article-reading-body mx-auto mt-12 max-w-2xl sm:mt-16">
            <ArticleContent blocks={article.body} />
          </div>

          {article.relatedProjects?.length || article.relatedArticles?.length ? (
            <section className="article-reading-related mx-auto mt-16 max-w-4xl border-t border-white/10 pt-8 sm:mt-20 sm:pt-10" aria-labelledby="related-reading-title">
              <p id="related-reading-title" className="site-eyebrow">Related work and reading</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {article.relatedProjects?.map((project) => (
                  <Link key={project.slug} href={`/works/${project.slug}`} className="group border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-blue-300/40 hover:bg-blue-300/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-200/75">Project</p>
                    <h2 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">{project.title}</h2>
                    {project.summary ? <p className="mt-2 text-sm leading-6 text-white/58">{project.summary}</p> : null}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-200">View project <ArrowRight size={15} aria-hidden="true" /></span>
                  </Link>
                ))}
                {article.relatedArticles?.map((relatedArticle) => (
                  <Link key={relatedArticle.slug} href={`/articles/${relatedArticle.slug}`} className="group border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-blue-300/40 hover:bg-blue-300/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70">
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-blue-200/75">Related article</p>
                    <h2 className="mt-3 text-xl font-semibold leading-tight tracking-[-0.03em] text-white">{relatedArticle.title}</h2>
                    {relatedArticle.excerpt ? <p className="mt-2 text-sm leading-6 text-white/58">{relatedArticle.excerpt}</p> : null}
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-200">Read article <ArrowRight size={15} aria-hidden="true" /></span>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          <footer className="article-reading-footer mx-auto mt-16 flex max-w-4xl flex-col gap-4 border-t border-white/10 pt-8 sm:mt-20 sm:flex-row sm:items-center sm:justify-between">
            <p className="site-eyebrow">Continue exploring</p>
            <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="Article navigation">
              <Link
                href="/articles"
                className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                All writing
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/works"
                className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              >
                View works
                <ArrowRight size={16} />
              </Link>
            </nav>
          </footer>
        </div>
      </article>
    </>
  );
}

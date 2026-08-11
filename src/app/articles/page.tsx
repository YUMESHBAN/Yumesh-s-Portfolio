import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getArticles, getSiteSettings } from "@/lib/content";
import type { RichContentBlock } from "@/types/content";

function formatArticleDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsedDate);
}

function getArticleCategory(article: { category?: string; tags: string[] }) {
  return article.category || article.tags[0] || "Writing";
}

function readingTime(body: RichContentBlock[]) {
  const wordCount = body
    .map((block) => {
      if (block._type === "block") return block.children?.map((child) => child.text).join(" ") ?? "";
      if (block._type === "calloutBlock") return `${block.title ?? ""} ${block.body ?? ""}`;
      if (block._type === "keyTakeawayBlock") return `${block.label ?? ""} ${block.body ?? ""}`;
      if (block._type === "codeBlock") return block.code ?? "";
      return "";
    })
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: "Articles by Yumesh Ban",
    description:
      "Read articles by Yumesh Ban about full-stack development, Next.js, Sanity, academic growth, and project-based learning.",
    alternates: { canonical: "/articles" },
    openGraph: {
      title: "Articles by Yumesh Ban",
      description: settings.description,
      url: "/articles",
    },
  };
}

export default async function ArticlesPage() {
  const articles = await getArticles();
  const featuredArticle = articles.find((article) => article.featuredOnArchive) ?? articles[0];
  const remainingArticles = articles.filter((article) => article.slug !== featuredArticle?.slug);

  return (
    <section className="articles-page site-section pt-32">
      <div className="site-container">
        <header className="articles-hero max-w-3xl">
          <p className="site-eyebrow articles-hero-eyebrow">Articles archive</p>
          <h1 className="articles-hero-title mt-5 text-balance text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-6xl">
            Writing from the work.
          </h1>
          <p className="articles-hero-description mt-5 max-w-xl text-base leading-7 text-white/62 sm:text-lg">
            Notes on systems, process, and craft. Ideas that shape how I build, learn, and solve problems.
          </p>
        </header>

        {featuredArticle ? (
          <>
            <article className="articles-feature mt-10 border-t border-white/10 py-8 sm:mt-12 sm:py-9">
              <Link href={`/articles/${featuredArticle.slug}`} className="articles-feature-link block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70">
                <div className="articles-feature-grid grid gap-x-5 gap-y-5 sm:grid-cols-[3.5rem_1.5rem_minmax(0,1fr)_auto_1rem] sm:items-start sm:gap-x-7">
                  <p className="articles-feature-number font-mono text-base tracking-[0.16em] text-blue-300">01</p>
                  <span className="hidden font-mono text-base text-white/55 sm:block" aria-hidden="true">/</span>
                  <div className="articles-feature-content">
                    <div className="articles-feature-meta flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                      <span className="articles-feature-category text-blue-200/80">Latest article</span>
                      <span aria-hidden="true">/</span>
                      <span>{getArticleCategory(featuredArticle)}</span>
                    </div>
                    <h2 className="articles-feature-title mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:text-4xl">
                      {featuredArticle.title}
                    </h2>
                    <p className="articles-feature-excerpt mt-3 max-w-2xl text-sm leading-6 text-white/62 sm:text-base sm:leading-7">{featuredArticle.excerpt}</p>
                  </div>
                  <p className="articles-feature-aside whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 sm:pt-1">
                    <time dateTime={featuredArticle.publishedAt}>{formatArticleDate(featuredArticle.publishedAt)}</time>
                    <span className="mx-2 text-white/35" aria-hidden="true">·</span>
                    {readingTime(featuredArticle.body)} min read
                  </p>
                  <ArrowRight className="articles-feature-cta hidden text-blue-300 sm:col-start-5 sm:row-start-1 sm:ml-auto sm:block" size={18} aria-hidden="true" />
                </div>
              </Link>
            </article>

            {remainingArticles.length ? (
              <section className="articles-index mt-12 sm:mt-16" aria-labelledby="articles-index-title">
                <div className="articles-index-heading flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <h2 id="articles-index-title" className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/55">More writing</h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{remainingArticles.length} {remainingArticles.length === 1 ? "article" : "articles"}</p>
                </div>
                <div className="articles-index-list">
                  {remainingArticles.map((article, index) => (
                    <article key={article.slug} className="articles-row border-b border-white/10">
                      <Link href={`/articles/${article.slug}`} className="articles-row-link grid gap-x-5 gap-y-4 py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 sm:grid-cols-[3.5rem_1.5rem_minmax(0,1fr)_auto_1rem] sm:items-start sm:gap-x-7">
                        <p className="articles-row-number font-mono text-sm tracking-[0.16em] text-blue-300">{String(index + 2).padStart(2, "0")}</p>
                        <span className="hidden font-mono text-sm text-white/55 sm:block" aria-hidden="true">/</span>
                        <div className="articles-row-content">
                          <div className="articles-row-meta flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/55">
                            <span className="articles-row-category text-blue-200/80">{getArticleCategory(article)}</span>
                          </div>
                          <h3 className="articles-row-title mt-3 max-w-2xl text-balance text-xl font-semibold leading-tight tracking-[-0.035em] text-white sm:text-2xl">{article.title}</h3>
                          <p className="articles-row-excerpt mt-2 max-w-2xl text-sm leading-6 text-white/58">{article.excerpt}</p>
                        </div>
                        <p className="articles-row-cta whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-white/55 sm:pt-1">
                          <time dateTime={article.publishedAt}>{formatArticleDate(article.publishedAt)}</time>
                          <span className="mx-2 text-white/35" aria-hidden="true">·</span>
                          {readingTime(article.body)} min read
                        </p>
                        <ArrowRight className="hidden text-blue-300 sm:col-start-5 sm:row-start-1 sm:ml-auto sm:block" size={16} aria-hidden="true" />
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <div className="articles-empty mt-14 border-y border-white/10 py-12 sm:mt-16 sm:py-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/80">No notes published yet</p>
            <h2 className="articles-empty-title mt-4 text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">Writing is on its way.</h2>
            <p className="articles-empty-description mt-4 max-w-xl text-base leading-7 text-white/58">In the meantime, explore the projects behind the work.</p>
          </div>
        )}

        <div className="articles-closing mt-14 border-t border-white/10 pt-6 sm:mt-16 sm:pt-8">
          <Link href="/works" className="articles-closing-link inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70">
            See the work behind the notes
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

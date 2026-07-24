import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SectionHeading } from "@/components/section-heading";
import { getArticles, getSiteSettings } from "@/lib/content";

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

  return (
    <section className="site-section pt-32">
      <div className="site-container">
        <SectionHeading
          eyebrow="Writing"
          title="Writing from projects, coursework, and practice."
          description="A small collection of notes on full-stack development, project decisions, and career growth."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              href={`/articles/${article.slug}`}
              className="site-panel p-6 transition hover:border-white/20 hover:bg-white/[0.085] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            >
              <p className="text-sm font-medium text-blue-400">{article.publishedAt}</p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{article.title}</h2>
              <p className="site-muted mt-4 text-sm leading-6">{article.excerpt}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">
                Read article
                <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

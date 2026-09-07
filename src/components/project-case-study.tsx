"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ChevronUp, Code2, Github, Play, Sparkles } from "lucide-react";
import { useState, type ReactNode } from "react";

import { urlForImage } from "@/sanity/image";
import { ProjectPdfViewer } from "@/components/project-pdf-viewer";
import { ProjectImageGallery } from "@/components/project-image-gallery";
import type { ImageWithMeta, Project, RichContentBlock, RichTextBlock } from "@/types/content";

type CaseStudyProps = {
  project: Project;
  index: number;
  total: number;
  nextProject?: Project;
  relatedContent?: {
    proofs: Array<{ _id: string; title: string; description: string; highlights?: string[]; skill?: { name?: string; category?: string }; image?: ImageWithMeta; demoVideoUrl?: string }>;
    articles: Array<{ _id: string; title: string; slug: string; category?: string; excerpt?: string; publishedAt?: string; coverImage?: ImageWithMeta }>;
  };
};

function projectNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

function projectProof(project: Project) {
  const metric = project.metrics?.find((item) => item.label?.trim() && item.value?.trim());

  if (metric) {
    return { value: metric.value, label: metric.label, note: metric.note };
  }

  const impact = project.impact?.find((item) => item.trim());
  return impact ? { value: "Proof", label: impact } : null;
}

function hasRichContent(blocks?: RichContentBlock[]) {
  return blocks?.some((block) => {
    if (block._type === "block") {
      return block.children?.some((child) => child.text?.trim());
    }

    if (block._type === "calloutBlock") {
      return Boolean(block.title?.trim() || block.body?.trim());
    }

    if (block._type === "keyTakeawayBlock") {
      return Boolean(block.label?.trim() || block.body?.trim());
    }

    if (block._type === "codeBlock") {
      return Boolean(block.code?.trim());
    }

    return Boolean(block.image || block.alt?.trim() || block.caption?.trim());
  });
}

function inlineText(block: RichTextBlock) {
  return block.children?.map((child) => child.text).join("").trim() ?? "";
}

function renderInline(block: RichTextBlock) {
  const markDefs = (block.markDefs ?? []) as Array<{ _key?: string; _type?: string; href?: string }>;

  return block.children?.map((child, index) => {
    let content: ReactNode = child.text;

    child.marks?.forEach((mark) => {
      if (mark === "strong") content = <strong key={`strong-${index}-${mark}`}>{content}</strong>;
      if (mark === "em") content = <em key={`em-${index}-${mark}`}>{content}</em>;
      if (mark === "code") content = <code key={`code-${index}-${mark}`} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em] text-blue-100">{content}</code>;

      const definition = markDefs.find((item) => item._key === mark);
      if (definition?._type === "link" && definition.href) {
        content = <a key={`link-${index}-${mark}`} href={definition.href} target="_blank" rel="noreferrer" className="text-blue-200 underline decoration-blue-300/45 underline-offset-4 hover:text-blue-100">{content}</a>;
      }
    });

    return <span key={child._key ?? index}>{content}</span>;
  });
}

function RichContent({ blocks }: { blocks?: RichContentBlock[] }) {
  if (!hasRichContent(blocks)) {
    return null;
  }

  return (
    <div className="grid gap-5 text-base leading-8 text-white/65">
      {blocks?.map((block, index) => {
        const key = block._key ?? `${block._type}-${index}`;

        if (block._type === "block") {
          const text = inlineText(block);
          if (!text) return null;

          if (block.style === "h2") return <h3 key={key} className="text-2xl font-semibold leading-tight tracking-[-0.035em] text-white">{renderInline(block)}</h3>;
          if (block.style === "h3") return <h4 key={key} className="text-xl font-semibold leading-tight tracking-[-0.025em] text-white">{renderInline(block)}</h4>;
          if (block.style === "blockquote") return <blockquote key={key} className="border-l border-blue-300/50 pl-5 text-lg leading-8 text-white/80">{renderInline(block)}</blockquote>;
          if (block.listItem) {
            const List = block.listItem === "number" ? "ol" : "ul";
            return <List key={key} className={`ml-5 list-${block.listItem === "number" ? "decimal" : "disc"} marker:text-blue-300`}><li>{renderInline(block)}</li></List>;
          }

          return <p key={key}>{renderInline(block)}</p>;
        }

        if (block._type === "calloutBlock") {
          return (
            <aside key={key} className="border-l-2 border-blue-300/60 bg-blue-300/[0.045] px-5 py-5">
              {block.tone ? <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">{block.tone}</p> : null}
              {block.title ? <h3 className="mt-2 text-lg font-semibold text-white">{block.title}</h3> : null}
              {block.body ? <p className="mt-2 text-sm leading-7 text-white/65">{block.body}</p> : null}
            </aside>
          );
        }

        if (block._type === "keyTakeawayBlock") {
          return (
            <aside key={key} className="border border-blue-300/25 bg-blue-300/[0.06] px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">{block.label || "Key takeaway"}</p>
              {block.body ? <p className="mt-2 text-sm leading-7 text-white/75">{block.body}</p> : null}
            </aside>
          );
        }

        if (block._type === "codeBlock") {
          return block.code ? <pre key={key} className="overflow-x-auto border border-white/10 bg-black/25 p-5 text-sm leading-7 text-blue-100/80"><code>{block.code}</code></pre> : null;
        }

        const source = block.image as Parameters<typeof urlForImage>[0];
        const src = source ? urlForImage(source)?.width(1600).height(1000).fit("max").url() : undefined;
        return src ? (
          <figure key={key} className="overflow-hidden border border-white/10 bg-black/20">
            <Image src={src} alt={block.alt || "Project detail"} width={1600} height={1000} className="h-auto w-full" />
            {block.caption ? <figcaption className="border-t border-white/10 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">{block.caption}</figcaption> : null}
          </figure>
        ) : null;
      })}
    </div>
  );
}

function StorySection({ number, eyebrow, title, children }: { number: string; eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="works-section-reveal border-t border-white/10 py-14 sm:py-20 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[8.5rem_minmax(0,1fr)] lg:gap-12">
        <div className="flex items-center gap-4 lg:block">
          <p className="font-mono text-2xl font-semibold tracking-[-0.06em] text-blue-300">{number}</p>
          <span className="h-px flex-1 bg-blue-300/45 lg:mt-5 lg:block lg:w-10" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="site-eyebrow">{eyebrow}</p>
          <h2 className="mt-4 max-w-3xl text-balance text-3xl font-semibold leading-[0.98] tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">{title}</h2>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  );
}

function ListBlock({ label, items, initialLimit = 10 }: { label: string; items?: string[]; initialLimit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items?.length) return null;

  const shouldPaginate = items.length > initialLimit;
  const visibleItems = isExpanded || !shouldPaginate ? items : items.slice(0, initialLimit);
  const remainingCount = items.length - initialLimit;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">{label}</p>
        {shouldPaginate ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
            Showing {visibleItems.length} of {items.length}
          </span>
        ) : null}
      </div>
      <ul className="mt-4 grid gap-3">
        {visibleItems.map((item) => (
          <li key={item} className="border-b border-white/10 pb-3 text-sm leading-6 text-white/62 last:border-b-0">
            {item}
          </li>
        ))}
      </ul>
      {shouldPaginate ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3.5 inline-flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-blue-300 transition hover:text-blue-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp size={14} aria-hidden="true" />
            </>
          ) : (
            <>
              Show {remainingCount} more <ChevronDown size={14} aria-hidden="true" />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

function ExpandableTechStack({ techStack, initialLimit = 10 }: { techStack: string[]; initialLimit?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!techStack.length) return null;

  const shouldPaginate = techStack.length > initialLimit;
  const visibleTech = isExpanded || !shouldPaginate ? techStack : techStack.slice(0, initialLimit);
  const remainingCount = techStack.length - initialLimit;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Technology</p>
        {shouldPaginate ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
            Showing {visibleTech.length} of {techStack.length}
          </span>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {visibleTech.map((tech) => (
          <span key={tech} className="site-chip">{tech}</span>
        ))}
        {shouldPaginate ? (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="site-chip cursor-pointer border-blue-300/40 text-blue-300 transition hover:border-blue-300 hover:bg-blue-300/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-300"
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <span className="inline-flex items-center gap-1">
                Show less <ChevronUp size={13} aria-hidden="true" />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                + {remainingCount} more <ChevronDown size={13} aria-hidden="true" />
              </span>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ExpandableProofsList({
  proofs,
  initialLimit = 5,
}: {
  proofs: NonNullable<CaseStudyProps["relatedContent"]>["proofs"];
  initialLimit?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!proofs.length) return null;

  const shouldPaginate = proofs.length > initialLimit;
  const visibleProofs = isExpanded || !shouldPaginate ? proofs : proofs.slice(0, initialLimit);
  const remainingCount = proofs.length - initialLimit;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Project proof</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
          {shouldPaginate ? `Showing ${visibleProofs.length} of ${proofs.length}` : `${proofs.length} ${proofs.length === 1 ? "proof" : "proofs"}`}
        </span>
      </div>
      <div className="mt-4 grid gap-6">
        {visibleProofs.map((proof) => (
          <article key={proof._id} className="overflow-hidden border border-white/10 bg-white/[0.03]">
            {proof.image?.src || proof.image?.url ? (
              <Image src={proof.image.src ?? proof.image.url ?? ""} alt={proof.image.alt || proof.title} width={1200} height={675} className="aspect-video w-full object-cover" />
            ) : null}
            <div className="p-5 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-200/70">
                {[proof.skill?.category, proof.skill?.name].filter(Boolean).join(" / ") || "Project proof"}
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-white">{proof.title}</h3>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{proof.description}</p>
              {proof.highlights?.length ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {proof.highlights.map((item) => <span key={item} className="site-chip">{item}</span>)}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
      {shouldPaginate ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="site-button-secondary mt-5 w-full justify-center"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Show less proofs <ChevronUp size={16} aria-hidden="true" />
            </>
          ) : (
            <>
              Show {remainingCount} more {remainingCount === 1 ? "proof" : "proofs"} <ChevronDown size={16} aria-hidden="true" />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

function ExpandableArticlesList({
  articles,
  initialLimit = 5,
}: {
  articles: NonNullable<CaseStudyProps["relatedContent"]>["articles"];
  initialLimit?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!articles.length) return null;

  const shouldPaginate = articles.length > initialLimit;
  const visibleArticles = isExpanded || !shouldPaginate ? articles : articles.slice(0, initialLimit);
  const remainingCount = articles.length - initialLimit;

  return (
    <div className="border-t border-white/10 pt-8">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Related writing</p>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
          {shouldPaginate ? `Showing ${visibleArticles.length} of ${articles.length}` : `${articles.length} ${articles.length === 1 ? "article" : "articles"}`}
        </span>
      </div>
      <div className="mt-4 grid gap-4">
        {visibleArticles.map((article) => (
          <Link key={article._id} href={`/articles/${article.slug}`} className="group block border border-white/10 bg-white/[0.03] p-5 transition hover:border-blue-300/45 sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-blue-200/70">{article.category || "Article"}</p>
            <h3 className="mt-2 text-xl font-semibold text-white group-hover:text-blue-200">{article.title}</h3>
            {article.excerpt ? <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{article.excerpt}</p> : null}
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300">Read article <ArrowUpRight size={15} /></span>
          </Link>
        ))}
      </div>
      {shouldPaginate ? (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="site-button-secondary mt-5 w-full justify-center"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              Show less articles <ChevronUp size={16} aria-hidden="true" />
            </>
          ) : (
            <>
              Show {remainingCount} more {remainingCount === 1 ? "article" : "articles"} <ChevronDown size={16} aria-hidden="true" />
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}

export function ProjectCaseStudy({ project, index, total, nextProject, relatedContent }: CaseStudyProps) {
  const number = projectNumber(index);
  const proof = projectProof(project);
  const image = project.featuredImage?.url || project.featuredImage?.src ? project.featuredImage : project.gallery?.find((item) => item.url || item.src);
  const imageUrl = image?.url ?? image?.src;
  const gallery = project.gallery?.filter((item) => (item.url ?? item.src) && (item.url ?? item.src) !== imageUrl) ?? [];
  const hasContext = Boolean(project.audience || project.goals?.length || hasRichContent(project.problem));
  const hasContribution = Boolean(project.responsibilities?.length || project.relatedSkills?.length);
  const hasProcess = hasRichContent(project.process) || hasRichContent(project.solution);
  const hasResults = Boolean(project.metrics?.length || project.impact?.length || hasRichContent(project.results));
  const hasBuildNotes = Boolean(project.techStack.length || project.features.length || project.demoVideoUrl || project.projectPdfUrl || project.links?.length || gallery.length);
  const hasRelatedContent = Boolean(relatedContent?.proofs.length || relatedContent?.articles.length);
  let sectionIndex = 1;
  const contextNumber = hasContext ? String(sectionIndex++).padStart(2, "0") : undefined;
  const contributionNumber = hasContribution ? String(sectionIndex++).padStart(2, "0") : undefined;
  const processNumber = hasProcess ? String(sectionIndex++).padStart(2, "0") : undefined;
  const resultsNumber = hasResults ? String(sectionIndex++).padStart(2, "0") : undefined;
  const buildNotesNumber = hasBuildNotes ? String(sectionIndex++).padStart(2, "0") : undefined;
  const relatedContentNumber = hasRelatedContent ? String(sectionIndex++).padStart(2, "0") : undefined;
  const metadata: Array<[string, string]> = [
    ["Role", project.role],
    ["Association", project.association],
    ["Timeline", project.dateRange],
  ];
  if (project.duration) metadata.push(["Duration", project.duration]);
  if (project.teamSize) metadata.push(["Team", project.teamSize]);

  return (
    <article className="pt-28 sm:pt-32">
      <div className="site-container max-w-6xl">
        <Link href="/works" className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-semibold">
          <ArrowLeft size={17} aria-hidden="true" />
          Back to Works
        </Link>

        <header className="works-section-reveal pt-8 sm:pt-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[10px] uppercase tracking-[0.16em]">
            <span className="text-blue-300">Works / {number}</span>
            <span className="h-px w-10 bg-blue-300/55" aria-hidden="true" />
            <span className="text-white/55">{project.type}</span>
            <span className="text-white/28" aria-hidden="true">/</span>
            <span className="text-white/55">{project.dateRange}</span>
          </div>
          <div className="mt-7 grid gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(14rem,0.3fr)] lg:items-end">
            <div>
              <h1 className="max-w-5xl text-balance text-[clamp(3.2rem,8vw,7.8rem)] font-semibold leading-[0.86] tracking-[-0.075em] text-white">{project.title}</h1>
              <p className="mt-7 max-w-3xl text-lg leading-8 text-white/64 sm:text-xl">{project.summary}</p>
            </div>
            {proof ? <div className="border-l border-blue-300/45 pl-5 lg:mb-1"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">{proof.value}</p><p className="mt-2 text-sm font-medium leading-6 text-white/78">{proof.label}</p>{proof.note ? <p className="mt-1 text-xs leading-5 text-white/45">{proof.note}</p> : null}</div> : null}
          </div>

          {(project.liveUrl || project.repoUrl) ? <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer" className="site-button-primary">Live project <ArrowUpRight size={17} aria-hidden="true" /></a> : null}
            {project.repoUrl ? <a href={project.repoUrl} target="_blank" rel="noreferrer" className="site-button-secondary"><Github size={17} aria-hidden="true" />Repository</a> : null}
          </div> : null}
        </header>

        <section className="works-section-reveal mt-12 border-y border-white/10 py-3 sm:mt-16 sm:py-4">
          <div className="grid divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-5">
            {metadata.map(([label, value]) => <div key={label} className="px-4 py-4 first:pl-0 sm:first:pl-0 lg:px-5"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{label}</p><p className="mt-2 text-sm font-medium leading-6 text-white/78">{value}</p></div>)}
          </div>
        </section>

        <section className="works-section-reveal mt-10 sm:mt-14">
          {imageUrl ? <figure className="works-story-media group overflow-hidden border border-white/10 bg-[#08090d]"><div className="relative aspect-[16/10] overflow-hidden"><Image src={imageUrl} alt={image?.alt || `${project.title} project screenshot`} fill priority sizes="(min-width: 1024px) 1152px, 100vw" className="object-cover transition duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025] motion-reduce:transition-none" /></div><figcaption className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 sm:px-6"><span>{image?.caption || `Project evidence / ${number}`}</span><span className="text-blue-200/70">16:10 view</span></figcaption></figure> : <div className="border border-white/10 bg-[linear-gradient(115deg,rgba(96,165,250,0.08),transparent_45%)] p-6 sm:p-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.38fr)] lg:gap-12 lg:p-12"><div><p className="font-mono text-6xl font-semibold tracking-[-0.08em] text-blue-300/80 sm:text-8xl">{number}</p><p className="mt-6 site-eyebrow">Case file / text-led evidence</p><p className="mt-4 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.035em] text-white sm:text-3xl">{proof?.label || project.summary}</p></div><div className="mt-9 border-t border-white/10 pt-6 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Built by</p><p className="mt-3 text-sm font-medium text-white/78">{project.role}</p><div className="mt-7 flex flex-wrap gap-2">{project.techStack.slice(0, 4).map((tech) => <span key={tech} className="site-chip">{tech}</span>)}</div></div></div>}
        </section>

        <div className="mt-14 sm:mt-20">
          {hasContext && contextNumber ? <StorySection number={contextNumber} eyebrow="The context" title="The problem, people, and outcome in view."><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.5fr)] lg:gap-14"><RichContent blocks={project.problem} /><div className="grid content-start gap-8 border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0">{project.audience ? <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Audience</p><p className="mt-3 text-sm leading-7 text-white/66">{project.audience}</p></div> : null}<ListBlock label="Goals" items={project.goals} /></div></div></StorySection> : null}

          {hasContribution && contributionNumber ? <StorySection number={contributionNumber} eyebrow="The contribution" title="A clear view of what I owned."><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.5fr)] lg:gap-14"><div><p className="text-xl font-medium tracking-[-0.03em] text-white sm:text-2xl">{project.role}</p><ListBlock label="Responsibilities" items={project.responsibilities} /></div>{project.relatedSkills?.length ? <div className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Capabilities applied</p><div className="mt-4 flex flex-wrap gap-2">{project.relatedSkills.map((skill) => <span key={skill._id ?? skill.name} className="site-chip">{skill.name}</span>)}</div></div> : null}</div></StorySection> : null}

          {hasProcess && processNumber ? <StorySection number={processNumber} eyebrow="The work" title="From decisions to the working product."><div className="grid gap-12 lg:grid-cols-2 lg:gap-16"><div>{hasRichContent(project.process) ? <><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Process</p><div className="mt-5"><RichContent blocks={project.process} /></div></> : null}</div><div className="border-t border-white/10 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">{hasRichContent(project.solution) ? <><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Solution</p><div className="mt-5"><RichContent blocks={project.solution} /></div></> : null}</div></div></StorySection> : null}

          {hasResults && resultsNumber ? <StorySection number={resultsNumber} eyebrow="The result" title="Proof over promises."><div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.48fr)] lg:gap-16"><div>{project.metrics?.length ? <div className="border-y border-white/10">{project.metrics.map((metric) => <div key={`${metric.label}-${metric.value}`} className="flex items-start justify-between gap-8 border-b border-white/10 py-5 last:border-b-0"><div><p className="text-3xl font-semibold tracking-[-0.05em] text-blue-100 sm:text-4xl">{metric.value}</p><p className="mt-2 text-sm font-medium text-white/78">{metric.label}</p>{metric.note ? <p className="mt-1 text-xs leading-5 text-white/48">{metric.note}</p> : null}</div><Sparkles className="mt-1 shrink-0 text-blue-300/70" size={17} aria-hidden="true" /></div>)}</div> : null}{hasRichContent(project.results) ? <div className="mt-8"><RichContent blocks={project.results} /></div> : null}</div><div className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"><ListBlock label="Impact" items={project.impact} /></div></div></StorySection> : null}

          {hasBuildNotes && buildNotesNumber ? <StorySection number={buildNotesNumber} eyebrow="Build notes" title="The tools and details that carried it through."><div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.52fr)] lg:gap-14"><div><ExpandableTechStack techStack={project.techStack} initialLimit={10} />{project.features.length ? <div className="mt-10"><ListBlock label="Selected product details" items={project.features} initialLimit={10} /></div> : null}</div><div className="border-t border-white/10 pt-7 lg:border-l lg:border-t-0 lg:pl-9 lg:pt-0"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Explore further</p><div className="mt-4 grid gap-3">{project.demoVideoUrl ? <a href={project.demoVideoUrl} target="_blank" rel="noreferrer" className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-medium">Watch demo <Play size={16} aria-hidden="true" /></a> : null}{project.links?.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="site-link inline-flex min-h-11 items-center gap-2 text-sm font-medium">{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</div></div></div>{project.projectPdfUrl ? <ProjectPdfViewer src={project.projectPdfUrl} projectTitle={project.title} /> : null}{gallery.length ? <ProjectImageGallery images={gallery} projectTitle={project.title} /> : null}</StorySection> : null}

          {hasRelatedContent && relatedContentNumber ? (
            <StorySection number={relatedContentNumber} eyebrow="Connected work" title="Proof and writing from this project.">
              <div className="grid gap-10">
                {relatedContent?.proofs.length ? <ExpandableProofsList proofs={relatedContent.proofs} initialLimit={5} /> : null}
                {relatedContent?.articles.length ? <ExpandableArticlesList articles={relatedContent.articles} initialLimit={5} /> : null}
              </div>
            </StorySection>
          ) : null}
        </div>

        <section className="works-section-reveal pb-16 pt-4 sm:pb-20 lg:pb-28">
          <div className="border-t border-white/20 pt-8 sm:pt-10">
            <p className="site-eyebrow">{`Works / ${number} of ${String(total).padStart(2, "0")}`}</p>
            <h2 className="mt-5 max-w-4xl text-balance text-3xl font-semibold leading-[0.98] tracking-[-0.055em] text-white sm:text-4xl lg:text-5xl">Have a similar problem to solve? <span className="text-blue-400">Let&apos;s talk.</span></h2>
            <div className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><Link href="/contact" className="site-button-primary">Start a conversation <ArrowUpRight size={17} aria-hidden="true" /></Link><Link href="/works" className="site-button-secondary">View all works <Code2 size={17} aria-hidden="true" /></Link>{nextProject ? <Link href={`/works/${nextProject.slug}`} className="site-button-secondary">Next: {nextProject.title} <ArrowRight size={17} aria-hidden="true" /></Link> : null}</div>
          </div>
        </section>
      </div>
    </article>
  );
}

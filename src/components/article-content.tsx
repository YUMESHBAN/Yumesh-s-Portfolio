import type { ReactNode } from "react";

import { ArticleImage } from "@/components/article-image";
import { urlForImage } from "@/sanity/image";
import type { RichContentBlock, RichTextBlock } from "@/types/content";

type MarkDefinition = {
  _key?: string;
  _type?: string;
  href?: string;
};

type ImageBlock = {
  image?: unknown;
  src?: string;
  url?: string;
  alt?: string;
  caption?: string;
  layout?: "inline" | "wide" | "sideLeft" | "sideRight";
};

function blockText(block: RichTextBlock) {
  return block.children?.map((child) => child.text).join("").trim() ?? "";
}

function renderInline(block: RichTextBlock) {
  const markDefinitions = (block.markDefs ?? []) as MarkDefinition[];

  return block.children?.map((child, index) => {
    let content: ReactNode = child.text;

    child.marks?.forEach((mark) => {
      if (mark === "strong") content = <strong key={`strong-${index}`}>{content}</strong>;
      if (mark === "em") content = <em key={`em-${index}`}>{content}</em>;
      if (mark === "highlight") content = <mark key={`highlight-${index}`} className="bg-blue-300/15 px-1 text-blue-100">{content}</mark>;
      if (mark === "code") content = <code key={`code-${index}`} className="rounded bg-white/10 px-1.5 py-0.5 text-[0.88em] text-blue-100">{content}</code>;

      const definition = markDefinitions.find((item) => item._key === mark);
      if (definition?._type === "link" && definition.href) {
        content = <a key={`link-${index}-${mark}`} href={definition.href} target="_blank" rel="noreferrer" className="text-blue-200 underline decoration-blue-300/50 underline-offset-4 hover:text-blue-100">{content}</a>;
      }
    });

    return <span key={child._key ?? index}>{content}</span>;
  });
}

function imageSource(block: ImageBlock) {
  return block.src ?? block.url ?? (block.image ? urlForImage(block.image as Parameters<typeof urlForImage>[0])?.width(1800).height(1200).fit("max").url() : undefined);
}

function ArticleImageBlock({ block }: { block: ImageBlock }) {
  const src = imageSource(block);

  if (!src) return null;

  const layout = block.layout ?? "inline";
  const layoutClass = {
    inline: "max-w-3xl",
    wide: "article-content-media-wide max-w-5xl",
    sideLeft: "article-content-media-side lg:float-left lg:mr-9 lg:max-w-[42%]",
    sideRight: "article-content-media-side lg:float-right lg:ml-9 lg:max-w-[42%]",
  }[layout];

  return <ArticleImage src={src} alt={block.alt || "Article image"} caption={block.caption} className={layoutClass} sizes={layout === "wide" ? "(min-width: 1280px) 1024px, 100vw" : "(min-width: 1024px) 680px, 100vw"} />;
}

function renderTextBlock(block: RichTextBlock, key: string) {
  if (!blockText(block)) return null;

  if (block.style === "h2") return <h2 key={key} className="article-content-heading mt-14 text-3xl font-semibold leading-[1.02] tracking-[-0.045em] text-white sm:mt-16 sm:text-4xl">{renderInline(block)}</h2>;
  if (block.style === "h3") return <h3 key={key} className="article-content-subheading mt-10 text-xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-2xl">{renderInline(block)}</h3>;
  if (block.style === "blockquote") return <blockquote key={key} className="my-10 border-l-2 border-blue-300/65 pl-6 text-xl leading-8 text-white/82 sm:text-2xl sm:leading-9">{renderInline(block)}</blockquote>;

  return <p key={key} className="article-content-paragraph whitespace-pre-line text-lg leading-8 text-white/68">{renderInline(block)}</p>;
}

export function ArticleContent({ blocks }: { blocks: RichContentBlock[] }) {
  const content: ReactNode[] = [];

  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index];
    const key = block._key ?? `${block._type}-${index}`;

    if (block._type === "block" && block.listItem) {
      const listType = block.listItem;
      const items: RichTextBlock[] = [];

      while (index < blocks.length) {
        const candidate = blocks[index];
        if (candidate._type !== "block" || candidate.listItem !== listType) break;
        if (blockText(candidate)) items.push(candidate);
        index += 1;
      }

      index -= 1;
      const List = listType === "number" ? "ol" : "ul";
      content.push(
        <List key={key} className={`article-content-list ml-6 mt-7 ${listType === "number" ? "list-decimal" : "list-disc"} space-y-3 marker:text-blue-300`}>
          {items.map((item, itemIndex) => <li key={item._key ?? itemIndex} className="pl-2 text-lg leading-8 text-white/68">{renderInline(item)}</li>)}
        </List>,
      );
      continue;
    }

    if (block._type === "block") {
      content.push(renderTextBlock(block, key));
      continue;
    }

    if (block._type === "imageWithMeta") {
      content.push(<ArticleImageBlock key={key} block={block as ImageBlock} />);
      continue;
    }

    if (block._type === "calloutBlock") {
      content.push(
        <aside key={key} className="article-content-callout border-l-2 border-blue-300/65 bg-blue-300/[0.055] px-5 py-5 sm:px-6">
          {block.tone ? <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/75">{block.tone}</p> : null}
          {block.title ? <h3 className="mt-2 text-lg font-semibold text-white">{block.title}</h3> : null}
          {block.body ? <p className="mt-2 text-sm leading-7 text-white/68">{block.body}</p> : null}
        </aside>,
      );
      continue;
    }

    if (block._type === "codeBlock") {
      content.push(block.code ? <pre key={key} className="article-content-code overflow-x-auto border border-white/10 bg-black/30 p-5 text-sm leading-7 text-blue-100/85"><code>{block.code}</code></pre> : null);
      continue;
    }

    const takeaway = block as unknown as { label?: string; body?: string };
    if (takeaway.body) {
      content.push(
        <aside key={key} className="article-content-takeaway border-y border-blue-300/35 py-6 sm:px-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.17em] text-blue-200/80">{takeaway.label || "Key takeaway"}</p>
          <p className="mt-3 text-xl font-medium leading-8 tracking-[-0.02em] text-white/86">{takeaway.body}</p>
        </aside>,
      );
    }
  }

  return <div className="article-content flow-root">{content}</div>;
}

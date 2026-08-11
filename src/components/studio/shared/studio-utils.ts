"use client";

export type SlugValue = {
  _type?: "slug";
  current?: string;
};

export type PortableTextSpan = {
  _key: string;
  _type: "span";
  marks: string[];
  text: string;
};

export type PortableTextBlock = {
  _key: string;
  _type: "block";
  children: PortableTextSpan[];
  markDefs: [];
  style: "normal" | "h2" | "h3" | "blockquote";
  listItem?: "bullet" | "number";
};

export type CalloutBlock = {
  _key: string;
  _type: "calloutBlock";
  title?: string;
  body?: string;
  tone?: "Note" | "Tip" | "Warning" | "Result";
};

export type KeyTakeawayBlock = {
  _key: string;
  _type: "keyTakeawayBlock";
  label?: string;
  body?: string;
};

export type CodeBlock = {
  _key: string;
  _type: "codeBlock";
  language?: string;
  code?: string;
};

export type ImageWithMetaBlock = {
  _key?: string;
  _type: "imageWithMeta";
  alt?: string;
  caption?: string;
  image?: unknown;
  src?: string;
  layout?: "inline" | "wide" | "sideLeft" | "sideRight";
};

export type RichContentBlock = PortableTextBlock | CalloutBlock | KeyTakeawayBlock | CodeBlock | ImageWithMetaBlock;

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function splitLines(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function joinLines(value?: string[]) {
  return value?.length ? value.join("\n") : "";
}

function keyFromText(prefix: string, index: number) {
  return `${prefix}-${index}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createTextBlock(
  text: string,
  index = 0,
  style: PortableTextBlock["style"] = "normal",
  listItem?: PortableTextBlock["listItem"],
): PortableTextBlock {
  return {
    _key: keyFromText("block", index),
    _type: "block",
    style,
    markDefs: [],
    ...(listItem ? { listItem } : {}),
    children: [
      {
        _key: keyFromText("span", index),
        _type: "span",
        marks: [],
        text,
      },
    ],
  };
}

export function textToPortableBlocks(value: string): PortableTextBlock[] {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => createTextBlock(paragraph, index));
}

export function portableBlocksToText(blocks?: RichContentBlock[]) {
  if (!blocks?.length) {
    return "";
  }

  return blocks
    .map((block) => {
      if (block._type === "block") {
        return block.children?.map((child) => child.text).join("") ?? "";
      }

      if (block._type === "calloutBlock") {
        return [block.title, block.body].filter(Boolean).join("\n");
      }

      if (block._type === "keyTakeawayBlock") {
        return [block.label, block.body].filter(Boolean).join("\n");
      }

      if (block._type === "codeBlock") {
        return block.code ?? "";
      }

      if (block._type === "imageWithMeta") {
        return [block.caption, block.alt].filter(Boolean).join("\n");
      }

      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function normalizeRichContent(blocks?: RichContentBlock[]) {
  return blocks?.filter((block) => {
    if (block._type === "block") {
      return block.children?.some((child) => child.text.trim());
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

    return true;
  });
}

export function cleanOptionalFields<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, fieldValue]) => {
      if (fieldValue === undefined || fieldValue === null) {
        return false;
      }

      if (typeof fieldValue === "string" && fieldValue.trim() === "") {
        return false;
      }

      return true;
    }),
  ) as T;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

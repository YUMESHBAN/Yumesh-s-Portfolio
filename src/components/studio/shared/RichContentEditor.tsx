"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, Bold, Code2, Heading2, Heading3, Highlighter, ImagePlus, Italic, List, ListOrdered, MessageSquare, Pilcrow, Plus, Quote, Trash2, Upload } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { useClient } from "sanity";

import { createTextBlock, getErrorMessage, type CalloutBlock, type CodeBlock, type ImageWithMetaBlock, type KeyTakeawayBlock, type PortableTextBlock, type RichContentBlock } from "./studio-utils";

type RichContentEditorProps = {
  label: string;
  value: RichContentBlock[];
  onChange: (value: RichContentBlock[]) => void;
  allowImages?: boolean;
  allowTakeaways?: boolean;
};

function keyFromType(type: string) {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getBlockText(block: PortableTextBlock) {
  return block.children?.map((child) => child.text).join("") ?? "";
}

function updateBlockText(block: PortableTextBlock, text: string): PortableTextBlock {
  const firstChild = block.children[0] ?? {
    _key: keyFromType("span"),
    _type: "span" as const,
    marks: [],
    text: "",
  };

  return {
    ...block,
    children: [{ ...firstChild, text }],
  };
}

function toggleMark(block: PortableTextBlock, start: number, end: number, mark: string): PortableTextBlock {
  if (start === end) {
    return block;
  }

  const text = getBlockText(block);
  const marksAtPosition = text.split("").map(() => [] as string[]);
  let offset = 0;

  block.children.forEach((child) => {
    child.text.split("").forEach((_, characterIndex) => {
      marksAtPosition[offset + characterIndex] = child.marks ?? [];
    });
    offset += child.text.length;
  });

  const selectedMarks = marksAtPosition.slice(start, end);
  const removeMark = selectedMarks.length > 0 && selectedMarks.every((marks) => marks.includes(mark));
  const spans: PortableTextBlock["children"] = [];

  text.split("").forEach((character, index) => {
    const marks = marksAtPosition[index] ?? [];
    const nextMarks = index >= start && index < end ? (removeMark ? marks.filter((item) => item !== mark) : [...new Set([...marks, mark])]) : marks;
    const previous = spans[spans.length - 1];

    if (previous && previous.marks.join("|") === nextMarks.join("|")) {
      previous.text += character;
    } else {
      spans.push({ _key: keyFromType("span"), _type: "span", marks: nextMarks, text: character });
    }
  });

  return { ...block, children: spans };
}

export default function RichContentEditor({ label, value, onChange, allowImages = false, allowTakeaways = false }: RichContentEditorProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const textareas = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  function addTextBlock(style: PortableTextBlock["style"], listItem?: PortableTextBlock["listItem"]) {
    onChange([...value, createTextBlock("", value.length, style, listItem)]);
  }

  function addCallout() {
    const block: CalloutBlock = {
      _key: keyFromType("callout"),
      _type: "calloutBlock",
      tone: "Note",
      title: "",
      body: "",
    };

    onChange([...value, block]);
  }

  function addCode() {
    const block: CodeBlock = {
      _key: keyFromType("code"),
      _type: "codeBlock",
      language: "text",
      code: "",
    };

    onChange([...value, block]);
  }

  function addTakeaway() {
    const block: KeyTakeawayBlock = {
      _key: keyFromType("takeaway"),
      _type: "keyTakeawayBlock",
      label: "Key takeaway",
      body: "",
    };

    onChange([...value, block]);
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>, replaceIndex?: number) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const asset = await client.assets.upload("image", file, { filename: file.name });
      const image: ImageWithMetaBlock = {
        _key: keyFromType("image"),
        _type: "imageWithMeta",
        image: { _type: "image", asset: { _type: "reference", _ref: asset._id } },
        src: asset.url,
        alt: file.name,
        caption: "",
        layout: "inline",
      };

      if (replaceIndex === undefined) {
        onChange([...value, image]);
      } else {
        const existing = value[replaceIndex];
        if (existing?._type === "imageWithMeta") {
          updateBlock(replaceIndex, {
            ...existing,
            image: image.image,
            src: image.src,
            alt: existing.alt || image.alt,
          });
        }
      }
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function updateBlock(index: number, nextBlock: RichContentBlock) {
    onChange(value.map((block, blockIndex) => (blockIndex === index ? nextBlock : block)));
  }

  function removeBlock(index: number) {
    onChange(value.filter((_, blockIndex) => blockIndex !== index));
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= value.length) {
      return;
    }

    const next = [...value];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    onChange(next);
  }

  function applyMark(index: number, block: PortableTextBlock, mark: string) {
    const textarea = textareas.current[block._key ?? String(index)];
    if (!textarea) {
      return;
    }

    updateBlock(index, toggleMark(block, textarea.selectionStart, textarea.selectionEnd, mark));
    textarea.focus();
  }

  function blockControls(index: number, labelText: string, removeLabel: string) {
    return (
      <div className="studio-rich-block-meta">
        <span>{labelText}</span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => moveBlock(index, -1)} className="studio-icon-button" aria-label="Move block up" disabled={index === 0}>
            <ArrowUp size={15} />
          </button>
          <button type="button" onClick={() => moveBlock(index, 1)} className="studio-icon-button" aria-label="Move block down" disabled={index === value.length - 1}>
            <ArrowDown size={15} />
          </button>
          <button type="button" onClick={() => removeBlock(index)} className="studio-icon-button studio-icon-button-danger" aria-label={removeLabel}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="studio-rich-editor">
      <div className="studio-form-section-header">
        <h3 className="studio-form-section-title">{label}</h3>
        <div className="studio-rich-toolbar">
          <button type="button" onClick={() => addTextBlock("normal")} className="studio-btn-secondary">
            <Pilcrow size={15} />
            Paragraph
          </button>
          <button type="button" onClick={() => addTextBlock("h2")} className="studio-icon-button" title="Add heading 2" aria-label="Add heading 2">
            <Heading2 size={16} />
          </button>
          <button type="button" onClick={() => addTextBlock("h3")} className="studio-icon-button" title="Add heading 3" aria-label="Add heading 3">
            <Heading3 size={16} />
          </button>
          <button type="button" onClick={() => addTextBlock("blockquote")} className="studio-icon-button" title="Add quote" aria-label="Add quote">
            <Quote size={16} />
          </button>
          <button type="button" onClick={() => addTextBlock("normal", "bullet")} className="studio-icon-button" title="Add bullet" aria-label="Add bullet">
            <List size={16} />
          </button>
          <button type="button" onClick={() => addTextBlock("normal", "number")} className="studio-icon-button" title="Add numbered list item" aria-label="Add numbered list item">
            <ListOrdered size={16} />
          </button>
          <button type="button" onClick={addCallout} className="studio-icon-button" title="Add callout" aria-label="Add callout">
            <MessageSquare size={16} />
          </button>
          <button type="button" onClick={addCode} className="studio-icon-button" title="Add code block" aria-label="Add code block">
            <Code2 size={16} />
          </button>
          {allowTakeaways ? (
            <button type="button" onClick={addTakeaway} className="studio-icon-button" title="Add key takeaway" aria-label="Add key takeaway">
              <Highlighter size={16} />
            </button>
          ) : null}
          {allowImages ? (
            <label className="studio-btn-secondary cursor-pointer" title="Add image">
              <ImagePlus size={16} />
              Add image
              <input type="file" accept="image/*" onChange={(event) => uploadImage(event)} className="sr-only" />
            </label>
          ) : null}
        </div>
      </div>

      {uploading ? <p className="studio-help-text">Uploading image…</p> : null}
      {error ? <p className="studio-error">{error}</p> : null}

      {value.length ? (
        <div className="studio-rich-blocks">
          {value.map((block, index) => {
            if (block._type === "block") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  {blockControls(index, block.listItem === "number" ? "Numbered list" : block.listItem ? "Bullet" : block.style === "normal" ? "Paragraph" : block.style, "Remove block")}
                  <div className="mb-2 flex flex-wrap gap-1" aria-label="Text formatting">
                    {[
                      ["strong", Bold, "Bold"],
                      ["em", Italic, "Italic"],
                      ["highlight", Highlighter, "Highlight"],
                      ["code", Code2, "Inline code"],
                    ].map(([mark, Icon, markLabel]) => {
                      const FormatIcon = Icon as typeof Bold;
                      return <button key={mark as string} type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyMark(index, block, mark as string)} className="studio-icon-button" title={markLabel as string} aria-label={markLabel as string}><FormatIcon size={14} /></button>;
                    })}
                  </div>
                  <textarea
                    ref={(element) => {
                      textareas.current[block._key ?? String(index)] = element;
                    }}
                    value={getBlockText(block)}
                    onChange={(event) => updateBlock(index, updateBlockText(block, event.target.value))}
                    className="studio-form-textarea"
                    rows={block.style === "normal" ? 3 : 2}
                    placeholder={block.style === "normal" ? "Write a paragraph..." : "Write a heading..."}
                  />
                </div>
              );
            }

            if (block._type === "calloutBlock") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  {blockControls(index, "Callout", "Remove callout")}
                  <div className="studio-form-grid">
                    <label className="studio-field">
                      <span className="studio-form-label">Tone</span>
                      <select
                        value={block.tone ?? "Note"}
                        onChange={(event) => updateBlock(index, { ...block, tone: event.target.value as CalloutBlock["tone"] })}
                        className="studio-form-select"
                      >
                        {["Note", "Tip", "Warning", "Result"].map((tone) => (
                          <option key={tone} value={tone}>
                            {tone}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="studio-field">
                      <span className="studio-form-label">Title</span>
                      <input
                        value={block.title ?? ""}
                        onChange={(event) => updateBlock(index, { ...block, title: event.target.value })}
                        className="studio-form-input"
                        placeholder="Important result"
                      />
                    </label>
                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Body</span>
                      <textarea
                        value={block.body ?? ""}
                        onChange={(event) => updateBlock(index, { ...block, body: event.target.value })}
                        className="studio-form-textarea"
                        rows={3}
                      />
                    </label>
                  </div>
                </div>
              );
            }

            if (block._type === "codeBlock") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  {blockControls(index, "Code", "Remove code block")}
                  <label className="studio-field">
                    <span className="studio-form-label">Language</span>
                    <input
                      value={block.language ?? "text"}
                      onChange={(event) => updateBlock(index, { ...block, language: event.target.value })}
                      className="studio-form-input"
                    />
                  </label>
                  <label className="studio-field">
                    <span className="studio-form-label">Code</span>
                    <textarea
                      value={block.code ?? ""}
                      onChange={(event) => updateBlock(index, { ...block, code: event.target.value })}
                      className="studio-form-textarea studio-form-textarea-tall"
                      rows={8}
                    />
                  </label>
                </div>
              );
            }

            if (block._type === "keyTakeawayBlock") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  {blockControls(index, "Key takeaway", "Remove key takeaway")}
                  <div className="studio-form-grid">
                    <label className="studio-field">
                      <span className="studio-form-label">Label</span>
                      <input value={block.label ?? ""} onChange={(event) => updateBlock(index, { ...block, label: event.target.value })} className="studio-form-input" />
                    </label>
                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Takeaway</span>
                      <textarea value={block.body ?? ""} onChange={(event) => updateBlock(index, { ...block, body: event.target.value })} className="studio-form-textarea" rows={3} />
                    </label>
                  </div>
                </div>
              );
            }

            if (block._type === "imageWithMeta") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  {blockControls(index, "Image", "Remove image")}
                  <div className="studio-form-grid">
                    {block.src ? <Image src={block.src} alt={block.alt || "Article image preview"} width={960} height={640} className="max-h-72 rounded-md object-cover" /> : <p className="studio-help-text">Image uploaded without a preview URL.</p>}
                    <label className="studio-field">
                      <span className="studio-form-label">Layout</span>
                      <select value={block.layout ?? "inline"} onChange={(event) => updateBlock(index, { ...block, layout: event.target.value as ImageWithMetaBlock["layout"] })} className="studio-form-select">
                        <option value="inline">Inline</option>
                        <option value="wide">Wide</option>
                        <option value="sideLeft">Side left</option>
                        <option value="sideRight">Side right</option>
                      </select>
                    </label>
                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Alt text</span>
                      <input value={block.alt ?? ""} onChange={(event) => updateBlock(index, { ...block, alt: event.target.value })} className="studio-form-input" placeholder="Describe the image" />
                    </label>
                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Caption</span>
                      <input value={block.caption ?? ""} onChange={(event) => updateBlock(index, { ...block, caption: event.target.value })} className="studio-form-input" placeholder="Optional caption" />
                    </label>
                    <div className="studio-field studio-field-wide flex flex-wrap gap-2">
                      <label className="studio-btn-secondary cursor-pointer">
                        <Upload size={15} />
                        Replace image
                        <input type="file" accept="image/*" onChange={(event) => uploadImage(event, index)} className="sr-only" />
                      </label>
                      <button type="button" onClick={() => removeBlock(index)} className="studio-btn-delete">
                        <Trash2 size={15} />
                        Remove image
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      ) : (
        <button type="button" onClick={() => addTextBlock("normal")} className="studio-btn-secondary">
          <Plus size={16} />
          Add first block
        </button>
      )}
    </div>
  );
}

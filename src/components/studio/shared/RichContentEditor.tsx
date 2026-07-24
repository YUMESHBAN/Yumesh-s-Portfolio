"use client";

import { Code2, Heading2, Heading3, List, MessageSquare, Pilcrow, Plus, Trash2 } from "lucide-react";

import { createTextBlock, type CalloutBlock, type CodeBlock, type PortableTextBlock, type RichContentBlock } from "./studio-utils";

type RichContentEditorProps = {
  label: string;
  value: RichContentBlock[];
  onChange: (value: RichContentBlock[]) => void;
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

export default function RichContentEditor({ label, value, onChange }: RichContentEditorProps) {
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

  function updateBlock(index: number, nextBlock: RichContentBlock) {
    onChange(value.map((block, blockIndex) => (blockIndex === index ? nextBlock : block)));
  }

  function removeBlock(index: number) {
    onChange(value.filter((_, blockIndex) => blockIndex !== index));
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
          <button type="button" onClick={() => addTextBlock("normal", "bullet")} className="studio-icon-button" title="Add bullet" aria-label="Add bullet">
            <List size={16} />
          </button>
          <button type="button" onClick={addCallout} className="studio-icon-button" title="Add callout" aria-label="Add callout">
            <MessageSquare size={16} />
          </button>
          <button type="button" onClick={addCode} className="studio-icon-button" title="Add code block" aria-label="Add code block">
            <Code2 size={16} />
          </button>
        </div>
      </div>

      {value.length ? (
        <div className="studio-rich-blocks">
          {value.map((block, index) => {
            if (block._type === "block") {
              return (
                <div key={block._key ?? index} className="studio-rich-block">
                  <div className="studio-rich-block-meta">
                    <span>{block.listItem ? "Bullet" : block.style === "normal" ? "Paragraph" : block.style}</span>
                    <button type="button" onClick={() => removeBlock(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove block">
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <textarea
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
                  <div className="studio-rich-block-meta">
                    <span>Callout</span>
                    <button type="button" onClick={() => removeBlock(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove callout">
                      <Trash2 size={15} />
                    </button>
                  </div>
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
                  <div className="studio-rich-block-meta">
                    <span>Code</span>
                    <button type="button" onClick={() => removeBlock(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove code block">
                      <Trash2 size={15} />
                    </button>
                  </div>
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

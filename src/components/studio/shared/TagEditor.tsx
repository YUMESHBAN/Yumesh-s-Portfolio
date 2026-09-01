"use client";

import { Plus, X } from "lucide-react";
import { useState, type KeyboardEvent } from "react";

type TagEditorProps = { tags: string[]; onChange: (tags: string[]) => void };

export default function TagEditor({ tags, onChange }: TagEditorProps) {
  const [draft, setDraft] = useState("");
  function addTag() {
    const tag = draft.trim();
    if (!tag || tags.some((item) => item.toLowerCase() === tag.toLowerCase())) return;
    onChange([...tags, tag]);
    setDraft("");
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") { event.preventDefault(); addTag(); }
  }
  return <div className="studio-tag-editor">
    <div className="studio-tag-list">{tags.map((tag) => <span key={tag} className="studio-tag">{tag}<button type="button" onClick={() => onChange(tags.filter((item) => item !== tag))} aria-label={`Remove ${tag}`}><X size={13} /></button></span>)}</div>
    <div className="studio-tag-editor-input"><input value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={handleKeyDown} className="studio-form-input" placeholder="Type a tag and press Enter" /><button type="button" onClick={addTag} className="studio-btn-secondary"><Plus size={16} /> Add</button></div>
  </div>;
}

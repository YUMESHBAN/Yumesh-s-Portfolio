"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { KeyboardEvent } from "react";

type EditableStringListProps = {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
  description?: string;
};

export default function EditableStringList({ label, values, onChange, placeholder, description }: EditableStringListProps) {
  const rows = values.length ? values : [""];

  function update(index: number, value: string) {
    onChange(rows.map((row, rowIndex) => (rowIndex === index ? value : row)));
  }

  function remove(index: number) {
    const next = rows.filter((_, rowIndex) => rowIndex !== index);
    onChange(next.length ? next : [""]);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number) {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const next = [...rows];
    next.splice(index + 1, 0, "");
    onChange(next);
  }

  return (
    <div className="studio-editable-list">
      <div className="studio-editable-list-header">
        <span className="studio-form-label">{label}</span>
        <button type="button" className="studio-btn-text" onClick={() => onChange([...rows, ""])}>
          <Plus size={15} /> Add item
        </button>
      </div>
      <p className="studio-help-text">{description ? `${description} ` : ""}Press Enter to add another item. Use arrows to arrange the website order.</p>
      {rows.map((value, index) => (
        <div key={`${index}-${value}`} className="studio-editable-list-row">
          <input value={value} onChange={(event) => update(index, event.target.value)} onKeyDown={(event) => handleKeyDown(event, index)} className="studio-form-input" placeholder={placeholder} />
          <button type="button" className="studio-icon-button" onClick={() => move(index, -1)} disabled={index === 0} aria-label={`Move ${label} item up`}><ArrowUp size={15} /></button>
          <button type="button" className="studio-icon-button" onClick={() => move(index, 1)} disabled={index === rows.length - 1} aria-label={`Move ${label} item down`}><ArrowDown size={15} /></button>
          <button type="button" className="studio-icon-button studio-icon-button-danger" onClick={() => remove(index)} aria-label={`Remove ${label} item`}><Trash2 size={15} /></button>
        </div>
      ))}
    </div>
  );
}

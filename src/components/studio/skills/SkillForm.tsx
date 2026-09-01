"use client";

import { Plus, Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useClient } from "sanity";

import { cleanOptionalFields, joinLines, splitLines } from "../shared/studio-utils";

const skillStatuses = ["published", "draft", "hidden"] as const;
const skillLevels = ["Learning", "Working", "Strong"] as const;
const defaultCategorySuggestions = ["Frontend", "Backend", "Database", "CMS", "Tools", "Soft Skills"];

export type SkillStatus = (typeof skillStatuses)[number];
export type SkillCategory = string;
export type SkillLevel = (typeof skillLevels)[number];

export type SkillDocument = {
  _id?: string;
  _type?: "skill";
  status?: SkillStatus;
  name?: string;
  iconName?: string;
  aliases?: string[];
  category?: SkillCategory;
  level?: SkillLevel;
  featured?: boolean;
  order?: number;
};

type SkillFormState = {
  status: SkillStatus;
  name: string;
  iconName: string;
  aliases: string;
  category: SkillCategory;
  level: SkillLevel;
  featured: boolean;
  order: number;
};

type SkillFormProps = {
  skill?: SkillDocument | null;
  categorySuggestions: string[];
  onComplete: () => void;
};

function skillToFormState(skill?: SkillDocument | null): SkillFormState {
  return {
    status: skill?.status ?? "published",
    name: skill?.name ?? "",
    iconName: skill?.iconName ?? "",
    aliases: joinLines(skill?.aliases),
    category: skill?.category ?? "Frontend",
    level: skill?.level ?? "Working",
    featured: skill?.featured ?? false,
    order: skill?.order ?? 99,
  };
}

export default function SkillForm({ skill, categorySuggestions, onComplete }: SkillFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<SkillFormState>(() => skillToFormState(skill));
  const categoryOptions = Array.from(new Set([...defaultCategorySuggestions, ...categorySuggestions])).sort();
  const [isCreatingCategory, setIsCreatingCategory] = useState(() => !categoryOptions.includes(formData.category));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(skill?._id);

  function updateField<Key extends keyof SkillFormState>(field: Key, value: SkillFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const category = formData.category.trim();

    if (!name) {
      setError("Skill name is required.");
      return;
    }

    if (!category) {
      setError("Category is required.");
      return;
    }

    setSaving(true);

    const payload = {
      _type: "skill" as const,
      status: formData.status,
      name,
      iconName: formData.iconName.trim(),
      aliases: splitLines(formData.aliases),
      category,
      level: formData.level,
      featured: formData.featured,
      order: Number.isFinite(Number(formData.order)) ? Number(formData.order) : 99,
    };

    const unsetFields = ["iconName"].filter((field) => !String(payload[field as keyof typeof payload] ?? "").trim());

    try {
      if (skill?._id) {
        let patch = client.patch(skill._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save skill.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Skills</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${skill?.name}` : "Add New Skill"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close skill form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Skill Details</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <select value={formData.status} onChange={(event) => updateField("status", event.target.value as SkillStatus)} className="studio-form-select">
                {skillStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Name *</span>
              <input required value={formData.name} onChange={(event) => updateField("name", event.target.value)} className="studio-form-input" />
            </label>

            <div className="studio-field studio-field-wide">
              <span className="studio-form-label">Category *</span>
              <div className="studio-category-options" role="radiogroup" aria-label="Skill category">
                {categoryOptions.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="radio"
                    aria-checked={!isCreatingCategory && formData.category === category}
                    onClick={() => {
                      setIsCreatingCategory(false);
                      updateField("category", category);
                    }}
                    className={`studio-category-option ${!isCreatingCategory && formData.category === category ? "is-selected" : ""}`}
                  >
                    {category}
                  </button>
                ))}
                <button
                  type="button"
                  role="radio"
                  aria-checked={isCreatingCategory}
                  onClick={() => {
                    setIsCreatingCategory(true);
                    updateField("category", "");
                  }}
                  className={`studio-category-option ${isCreatingCategory ? "is-selected" : ""}`}
                >
                  <Plus size={14} aria-hidden="true" />
                  New category
                </button>
              </div>
              {isCreatingCategory ? (
                <input
                  required
                  autoFocus
                  value={formData.category}
                  onChange={(event) => updateField("category", event.target.value)}
                  className="studio-form-input"
                  placeholder="e.g. DevOps"
                />
              ) : null}
              <span className="studio-category-hint">Select a category above, or choose New category to create one.</span>
            </div>

            <label className="studio-field">
              <span className="studio-form-label">Level</span>
              <select value={formData.level} onChange={(event) => updateField("level", event.target.value as SkillLevel)} className="studio-form-select">
                {skillLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Simple Icons Slug</span>
              <input value={formData.iconName} onChange={(event) => updateField("iconName", event.target.value)} className="studio-form-input" placeholder="nodedotjs, react, figma" />
              <span className="studio-help-text">Optional. Used when no built-in logo match exists.</span>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Display Order</span>
              <input type="number" value={formData.order} onChange={(event) => updateField("order", Number(event.target.value))} className="studio-form-input" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Aliases</span>
              <textarea
                value={formData.aliases}
                onChange={(event) => updateField("aliases", event.target.value)}
                className="studio-form-textarea"
                rows={4}
                placeholder={"React.js\nReactJS"}
              />
            </label>

            <label className="studio-checkbox-field">
              <input type="checkbox" checked={formData.featured} onChange={(event) => updateField("featured", event.target.checked)} />
              <span>Feature this skill</span>
            </label>
          </div>
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-form-actions">
          <button type="button" onClick={onComplete} className="studio-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="studio-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Skill"}
          </button>
        </div>
      </form>
    </div>
  );
}

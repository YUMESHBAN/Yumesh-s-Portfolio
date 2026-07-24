"use client";

import { Plus, Save, Trash2, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { useClient } from "sanity";

import { cleanOptionalFields, joinLines, splitLines } from "../shared/studio-utils";

const educationLevels = ["Primary", "Secondary", "+2", "Bachelor", "Master", "PhD", "Diploma", "Other"] as const;
const educationStatuses = ["published", "draft", "hidden"] as const;

export type EducationLevel = (typeof educationLevels)[number];
type EducationStatus = (typeof educationStatuses)[number];

export type EducationResultDocument = {
  _key?: string;
  _type?: "educationResult";
  label?: string;
  percentage?: number;
  note?: string;
  showOnWebsite?: boolean;
};

export type EducationDocument = {
  _id?: string;
  _type?: "education";
  status?: EducationStatus;
  institution?: string;
  degree?: string;
  level?: EducationLevel;
  dateRange?: string;
  location?: string;
  summary?: string;
  gradeSystem?: string;
  courses?: string[];
  honors?: string[];
  achievements?: string[];
  resultEntries?: EducationResultDocument[];
  showResultStats?: boolean;
  showResultEntries?: boolean;
  showOnWebsite?: boolean;
  order?: number;
};

type EducationFormState = {
  status: EducationStatus;
  institution: string;
  degree: string;
  level: EducationLevel;
  dateRange: string;
  location: string;
  summary: string;
  gradeSystem: string;
  courses: string;
  honors: string;
  achievements: string;
  resultEntries: EducationResultDocument[];
  showResultStats: boolean;
  showResultEntries: boolean;
  showOnWebsite: boolean;
  order: number;
};

type EducationFormProps = {
  education?: EducationDocument | null;
  onComplete: () => void;
};

function newResultEntry(): EducationResultDocument {
  return {
    _key: `education-result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    _type: "educationResult",
    label: "",
    percentage: undefined,
    note: "",
    showOnWebsite: true,
  };
}

function normalizeResultEntry(entry: EducationResultDocument): EducationResultDocument {
  return {
    _key: entry._key ?? `education-result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    _type: "educationResult",
    label: entry.label ?? "",
    percentage: typeof entry.percentage === "number" ? entry.percentage : undefined,
    note: entry.note ?? "",
    showOnWebsite: entry.showOnWebsite ?? true,
  };
}

function educationToFormState(education?: EducationDocument | null): EducationFormState {
  return {
    status: education?.status ?? "published",
    institution: education?.institution ?? "",
    degree: education?.degree ?? "",
    level: education?.level ?? "Bachelor",
    dateRange: education?.dateRange ?? "",
    location: education?.location ?? "",
    summary: education?.summary ?? "",
    gradeSystem: education?.gradeSystem ?? "",
    courses: joinLines(education?.courses),
    honors: joinLines(education?.honors),
    achievements: joinLines(education?.achievements),
    resultEntries: education?.resultEntries?.length ? education.resultEntries.map(normalizeResultEntry) : [newResultEntry()],
    showResultStats: education?.showResultStats ?? true,
    showResultEntries: education?.showResultEntries ?? true,
    showOnWebsite: education?.showOnWebsite ?? true,
    order: education?.order ?? 99,
  };
}

function visibleStats(entries: EducationResultDocument[]) {
  const visibleEntries = entries.filter(
    (entry) => entry.showOnWebsite !== false && entry.label?.trim() && typeof entry.percentage === "number" && Number.isFinite(entry.percentage),
  );

  if (!visibleEntries.length) {
    return null;
  }

  const highest = visibleEntries.reduce((best, entry) => ((entry.percentage ?? 0) > (best.percentage ?? 0) ? entry : best), visibleEntries[0]);
  const average = visibleEntries.reduce((sum, entry) => sum + (entry.percentage ?? 0), 0) / visibleEntries.length;

  return {
    count: visibleEntries.length,
    highestLabel: highest.label,
    highestPercentage: highest.percentage,
    averagePercentage: Number(average.toFixed(2)),
  };
}

export default function EducationForm({ education, onComplete }: EducationFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<EducationFormState>(() => educationToFormState(education));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(education?._id);
  const previewStats = useMemo(() => visibleStats(formData.resultEntries), [formData.resultEntries]);

  function updateField<Key extends keyof EducationFormState>(field: Key, value: EducationFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function updateResultEntry(index: number, field: keyof EducationResultDocument, value: string | number | boolean | undefined) {
    setFormData((previous) => ({
      ...previous,
      resultEntries: previous.resultEntries.map((entry, entryIndex) =>
        entryIndex === index
          ? {
              ...entry,
              [field]: value,
            }
          : entry,
      ),
    }));
  }

  function addResultEntry() {
    setFormData((previous) => ({
      ...previous,
      resultEntries: [...previous.resultEntries, newResultEntry()],
    }));
  }

  function removeResultEntry(index: number) {
    setFormData((previous) => {
      const nextEntries = previous.resultEntries.filter((_, entryIndex) => entryIndex !== index);

      return {
        ...previous,
        resultEntries: nextEntries.length ? nextEntries : [newResultEntry()],
      };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formData.institution.trim() || !formData.degree.trim()) {
      setError("Institution and degree are required.");
      return;
    }

    const resultEntries = formData.resultEntries
      .map((entry) => ({
        _key: entry._key ?? `education-result-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        _type: "educationResult" as const,
        label: entry.label?.trim() ?? "",
        percentage: typeof entry.percentage === "number" ? entry.percentage : Number.NaN,
        note: entry.note?.trim() || undefined,
        showOnWebsite: entry.showOnWebsite ?? true,
      }))
      .filter((entry) => entry.label && Number.isFinite(entry.percentage));

    setSaving(true);

    const payload = {
      _type: "education" as const,
      status: formData.status,
      institution: formData.institution.trim(),
      degree: formData.degree.trim(),
      level: formData.level,
      dateRange: formData.dateRange.trim(),
      location: formData.location.trim(),
      summary: formData.summary.trim(),
      gradeSystem: formData.gradeSystem.trim(),
      courses: splitLines(formData.courses),
      honors: splitLines(formData.honors),
      achievements: splitLines(formData.achievements),
      resultEntries,
      showResultStats: formData.showResultStats,
      showResultEntries: formData.showResultEntries,
      showOnWebsite: formData.showOnWebsite,
      order: Number.isFinite(Number(formData.order)) ? Number(formData.order) : 99,
    };

    const unsetFields = ["dateRange", "location", "summary", "gradeSystem"].filter(
      (field) => !String(payload[field as keyof typeof payload] ?? "").trim(),
    );

    try {
      if (education?._id) {
        let patch = client.patch(education._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save education.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Education</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${education?.institution}` : "Add New Education"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close education form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Education Details</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <select value={formData.status} onChange={(event) => updateField("status", event.target.value as EducationStatus)} className="studio-form-select">
                {educationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Institution *</span>
              <input
                required
                value={formData.institution}
                onChange={(event) => updateField("institution", event.target.value)}
                className="studio-form-input"
                placeholder="Tribhuvan University"
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Degree / Program *</span>
              <input
                required
                value={formData.degree}
                onChange={(event) => updateField("degree", event.target.value)}
                className="studio-form-input"
                placeholder="BSc.CSIT"
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Level</span>
              <select value={formData.level} onChange={(event) => updateField("level", event.target.value as EducationLevel)} className="studio-form-select">
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Display Order</span>
              <input
                type="number"
                value={formData.order}
                onChange={(event) => updateField("order", Number(event.target.value))}
                className="studio-form-input"
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Date Range</span>
              <input
                value={formData.dateRange}
                onChange={(event) => updateField("dateRange", event.target.value)}
                className="studio-form-input"
                placeholder="May 2022 - Apr 2026"
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Location</span>
              <input
                value={formData.location}
                onChange={(event) => updateField("location", event.target.value)}
                className="studio-form-input"
                placeholder="Bhaktapur, Nepal"
              />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Summary</span>
              <textarea
                value={formData.summary}
                onChange={(event) => updateField("summary", event.target.value)}
                className="studio-form-textarea"
                rows={3}
                placeholder="Short public summary of this education entry."
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Grade System</span>
              <input
                value={formData.gradeSystem}
                onChange={(event) => updateField("gradeSystem", event.target.value)}
                className="studio-form-input"
                placeholder="Percentage, GPA, CGPA"
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Relevant Courses</span>
              <textarea
                value={formData.courses}
                onChange={(event) => updateField("courses", event.target.value)}
                className="studio-form-textarea"
                rows={4}
                placeholder={"Data Structures\nDatabase Systems"}
              />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Honors</span>
              <textarea
                value={formData.honors}
                onChange={(event) => updateField("honors", event.target.value)}
                className="studio-form-textarea"
                rows={4}
                placeholder={"Ranked 1st in 4th semester"}
              />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Achievements</span>
              <textarea
                value={formData.achievements}
                onChange={(event) => updateField("achievements", event.target.value)}
                className="studio-form-textarea"
                rows={4}
                placeholder={"80%+ overall percentage\nRanked 1st in 4th and 6th semesters"}
              />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Manual Percentage Results</h3>
            <button type="button" onClick={addResultEntry} className="studio-btn-secondary">
              <Plus size={16} />
              Add Result
            </button>
          </div>

          <div className="studio-result-table">
            <div className="studio-result-table-head">
              <span>Label</span>
              <span>Percentage</span>
              <span>Note</span>
              <span>Show</span>
              <span />
            </div>

            {formData.resultEntries.map((entry, index) => (
              <div key={entry._key ?? index} className="studio-result-row">
                <input
                  value={entry.label ?? ""}
                  onChange={(event) => updateResultEntry(index, "label", event.target.value)}
                  className="studio-form-input"
                  placeholder="Semester 1"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={entry.percentage ?? ""}
                  onChange={(event) => updateResultEntry(index, "percentage", event.target.value ? Number(event.target.value) : undefined)}
                  className="studio-form-input"
                  placeholder="90.8"
                />
                <input
                  value={entry.note ?? ""}
                  onChange={(event) => updateResultEntry(index, "note", event.target.value)}
                  className="studio-form-input"
                  placeholder="Optional note"
                />
                <label className="studio-mini-checkbox">
                  <input
                    type="checkbox"
                    checked={entry.showOnWebsite ?? true}
                    onChange={(event) => updateResultEntry(index, "showOnWebsite", event.target.checked)}
                  />
                  <span>Show</span>
                </label>
                <button type="button" onClick={() => removeResultEntry(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove result">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {previewStats ? (
            <div className="studio-result-preview">
              <div>
                <span>Visible rows</span>
                <strong>{previewStats.count}</strong>
              </div>
              <div>
                <span>Highest</span>
                <strong>
                  {previewStats.highestPercentage}% / {previewStats.highestLabel}
                </strong>
              </div>
              <div>
                <span>Average</span>
                <strong>{previewStats.averagePercentage}%</strong>
              </div>
            </div>
          ) : (
            <p className="studio-help-text">Add visible result rows to preview highest and average percentage.</p>
          )}
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Website Visibility</h3>
          <div className="studio-form-grid">
            <label className="studio-checkbox-field">
              <input
                type="checkbox"
                checked={formData.showOnWebsite}
                onChange={(event) => updateField("showOnWebsite", event.target.checked)}
              />
              <span>Show this education entry on website</span>
            </label>

            <label className="studio-checkbox-field">
              <input
                type="checkbox"
                checked={formData.showResultStats}
                onChange={(event) => updateField("showResultStats", event.target.checked)}
              />
              <span>Show highest and average percentage</span>
            </label>

            <label className="studio-checkbox-field">
              <input
                type="checkbox"
                checked={formData.showResultEntries}
                onChange={(event) => updateField("showResultEntries", event.target.checked)}
              />
              <span>Show individual result rows</span>
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
            {saving ? "Saving..." : "Save Education"}
          </button>
        </div>
      </form>
    </div>
  );
}

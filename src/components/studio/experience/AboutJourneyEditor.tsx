"use client";

import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useClient } from "sanity";

import { aboutJourney } from "@/content/about-journey";
import type { AboutJourney, AboutJourneyChapter } from "@/types/content";

import { getErrorMessage } from "../shared/studio-utils";

type JourneyChapterForm = AboutJourneyChapter & {
  _key: string;
  _type: "aboutJourneyChapter";
};

type JourneyFormState = Omit<AboutJourney, "chapters"> & {
  chapters: JourneyChapterForm[];
};

type AboutJourneyDocument = Partial<Omit<AboutJourney, "chapters">> & {
  _id?: string;
  chapters?: Array<Partial<JourneyChapterForm>>;
};

const journeyQuery = `*[_type == "aboutJourney"][0]{
  _id,
  eyebrow,
  rangeLabel,
  title,
  introduction,
  chapters[]{_key, _type, era, title, context, dateRange, location, story, lesson, outcome}
}`;

function toFormState(document?: AboutJourneyDocument | null): JourneyFormState {
  const source = document?.chapters?.length ? document : aboutJourney;

  return {
    eyebrow: source.eyebrow ?? aboutJourney.eyebrow,
    rangeLabel: source.rangeLabel ?? aboutJourney.rangeLabel,
    title: source.title ?? aboutJourney.title,
    introduction: source.introduction ?? aboutJourney.introduction,
    chapters: (source.chapters ?? aboutJourney.chapters).map((chapter, index) => {
      const editableChapter = chapter as Partial<JourneyChapterForm>;

      return {
        _key: editableChapter._key ?? `about-journey-${index + 1}`,
        _type: "aboutJourneyChapter",
        era: chapter.era ?? "",
        title: chapter.title ?? "",
        context: chapter.context ?? "",
        dateRange: chapter.dateRange ?? "",
        location: chapter.location ?? "",
        story: chapter.story ?? "",
        lesson: chapter.lesson ?? "",
        outcome: chapter.outcome ?? "",
      };
    }),
  };
}

function newJourneyChapter(index: number): JourneyChapterForm {
  return {
    _key: `about-journey-${Date.now()}-${index + 1}`,
    _type: "aboutJourneyChapter",
    era: "",
    title: "",
    context: "",
    dateRange: "",
    location: "",
    story: "",
    lesson: "",
    outcome: "",
  };
}

export default function AboutJourneyEditor() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<JourneyFormState>(() => toFormState());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchJourney = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const document = await client.fetch<AboutJourneyDocument | null>(journeyQuery);
      setFormData(toFormState(document));
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  function updateSection(field: Exclude<keyof JourneyFormState, "chapters">, value: string) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function updateChapter(index: number, field: keyof AboutJourneyChapter, value: string) {
    setFormData((previous) => ({
      ...previous,
      chapters: previous.chapters.map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, [field]: value } : chapter,
      ),
    }));
  }

  function moveChapter(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;

    setFormData((previous) => {
      if (targetIndex < 0 || targetIndex >= previous.chapters.length) {
        return previous;
      }

      const chapters = [...previous.chapters];
      [chapters[index], chapters[targetIndex]] = [chapters[targetIndex], chapters[index]];

      return { ...previous, chapters };
    });
  }

  function addChapter() {
    setFormData((previous) => ({
      ...previous,
      chapters: [...previous.chapters, newJourneyChapter(previous.chapters.length)],
    }));
  }

  function removeChapter(index: number) {
    setFormData((previous) => ({
      ...previous,
      chapters: previous.chapters.filter((_, chapterIndex) => chapterIndex !== index),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload: JourneyFormState = {
      eyebrow: formData.eyebrow.trim(),
      rangeLabel: formData.rangeLabel.trim(),
      title: formData.title.trim(),
      introduction: formData.introduction.trim(),
      chapters: formData.chapters.map((chapter) => ({
        ...chapter,
        era: chapter.era.trim(),
        title: chapter.title.trim(),
        context: chapter.context.trim(),
        dateRange: chapter.dateRange.trim(),
        location: chapter.location.trim(),
        story: chapter.story.trim(),
        lesson: chapter.lesson.trim(),
        outcome: chapter.outcome.trim(),
      })),
    };

    try {
      await client.createIfNotExists({
        _id: "aboutJourney",
        _type: "aboutJourney",
        ...payload,
      });
      await client.patch("aboutJourney").set(payload).commit();
      setSuccess("About journey saved.");
      await fetchJourney();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="studio-loading">Loading About journey...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="studio-form-container studio-form-stack">
      <section className="studio-form-section">
        <h2 className="studio-form-section-title">Section introduction</h2>
        <div className="studio-form-grid">
          <label className="studio-field">
            <span className="studio-form-label">Eyebrow *</span>
            <input required value={formData.eyebrow} onChange={(event) => updateSection("eyebrow", event.target.value)} className="studio-form-input" />
          </label>
          <label className="studio-field">
            <span className="studio-form-label">Timeline Range *</span>
            <input required value={formData.rangeLabel} onChange={(event) => updateSection("rangeLabel", event.target.value)} className="studio-form-input" />
          </label>
          <label className="studio-field studio-field-wide">
            <span className="studio-form-label">Heading *</span>
            <input required value={formData.title} onChange={(event) => updateSection("title", event.target.value)} className="studio-form-input" />
          </label>
          <label className="studio-field studio-field-wide">
            <span className="studio-form-label">Introduction *</span>
            <textarea required rows={3} value={formData.introduction} onChange={(event) => updateSection("introduction", event.target.value)} className="studio-form-textarea" />
          </label>
        </div>
      </section>

      <section className="studio-form-section">
        <h2 className="studio-form-section-title">Journey chapters</h2>
        <p className="studio-category-hint">The order below matches the timeline order on the About page.</p>
        <div className="studio-journey-editor">
          {formData.chapters.map((chapter, index) => (
            <fieldset key={chapter._key} className="studio-journey-chapter">
              <legend>Chapter {String(index + 1).padStart(2, "0")}</legend>
              <div className="mb-4 flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => moveChapter(index, -1)}
                  disabled={index === 0}
                  className="studio-btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Move ${chapter.title} up`}
                >
                  <ArrowUp size={15} />
                  Move up
                </button>
                <button
                  type="button"
                  onClick={() => moveChapter(index, 1)}
                  disabled={index === formData.chapters.length - 1}
                  className="studio-btn-secondary disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Move ${chapter.title} down`}
                >
                  <ArrowDown size={15} />
                  Move down
                </button>
                <button
                  type="button"
                  onClick={() => removeChapter(index)}
                  className="studio-btn-secondary border-red-200 text-red-600 hover:border-red-300 hover:text-red-700"
                  aria-label={`Delete ${chapter.title || `chapter ${index + 1}`}`}
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
              <div className="studio-form-grid">
                <label className="studio-field">
                  <span className="studio-form-label">Year / Era *</span>
                  <input required value={chapter.era} onChange={(event) => updateChapter(index, "era", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">Date Range *</span>
                  <input required value={chapter.dateRange} onChange={(event) => updateChapter(index, "dateRange", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field studio-field-wide">
                  <span className="studio-form-label">Chapter Title *</span>
                  <input required value={chapter.title} onChange={(event) => updateChapter(index, "title", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">Role / Education Context *</span>
                  <input required value={chapter.context} onChange={(event) => updateChapter(index, "context", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">Location *</span>
                  <input required value={chapter.location} onChange={(event) => updateChapter(index, "location", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field studio-field-wide">
                  <span className="studio-form-label">Story *</span>
                  <textarea required rows={3} value={chapter.story} onChange={(event) => updateChapter(index, "story", event.target.value)} className="studio-form-textarea" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">What This Taught Me *</span>
                  <textarea required rows={3} value={chapter.lesson} onChange={(event) => updateChapter(index, "lesson", event.target.value)} className="studio-form-textarea" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">Proof From This Chapter *</span>
                  <textarea required rows={3} value={chapter.outcome} onChange={(event) => updateChapter(index, "outcome", event.target.value)} className="studio-form-textarea" />
                </label>
              </div>
            </fieldset>
          ))}
          <button type="button" onClick={addChapter} className="studio-btn-secondary w-fit">
            <Plus size={16} />
            Add chapter
          </button>
        </div>
      </section>

      {error ? <p className="studio-error">{error}</p> : null}
      {success ? <p className="studio-success">{success}</p> : null}

      <div className="studio-form-actions">
        <button type="submit" disabled={saving} className="studio-btn-primary">
          <Save size={16} />
          {saving ? "Saving..." : "Save About Journey"}
        </button>
      </div>
    </form>
  );
}

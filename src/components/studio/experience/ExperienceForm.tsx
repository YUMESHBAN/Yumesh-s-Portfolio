"use client";

import { Save, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useClient } from "sanity";

import { cleanOptionalFields, getErrorMessage } from "../shared/studio-utils";
import EditableStringList from "../shared/EditableStringList";
import { CalendarDateInput, DateRangePicker } from "../shared/DateRangePicker";

const experienceStatuses = ["published", "draft", "hidden"] as const;

type ExperienceStatus = (typeof experienceStatuses)[number];

type SkillOption = {
  _id: string;
  name?: string;
  category?: string;
};

type SkillReference = {
  _key?: string;
  _type?: "reference";
  _ref?: string;
};

export type ExperienceDocument = {
  _id?: string;
  _type?: "experience";
  status?: ExperienceStatus;
  company?: string;
  role?: string;
  employmentType?: string;
  location?: string;
  workMode?: string;
  companyUrl?: string;
  startDate?: string;
  endDate?: string;
  dateRange?: string;
  current?: boolean;
  summary?: string;
  responsibilities?: string[];
  achievements?: string[];
  featuredOnHomepage?: boolean;
  homepageOrder?: number;
  relatedSkills?: SkillReference[];
  skills?: string[];
};

type ExperienceFormState = {
  status: ExperienceStatus;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  workMode: string;
  companyUrl: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  current: boolean;
  summary: string;
  responsibilities: string[];
  achievements: string[];
  featuredOnHomepage: boolean;
  relatedSkillIds: string[];
};

type ExperienceFormProps = {
  experience?: ExperienceDocument | null;
  onComplete: () => void;
};

function keyFromId(id: string) {
  return `skill-ref-${id.replace(/[^a-zA-Z0-9]/g, "-")}`;
}

function refsFromIds(ids: string[]) {
  return ids.map((id) => ({
    _key: keyFromId(id),
    _type: "reference" as const,
    _ref: id,
  }));
}

function experienceToFormState(experience?: ExperienceDocument | null): ExperienceFormState {
  return {
    status: experience?.status ?? "published",
    company: experience?.company ?? "",
    role: experience?.role ?? "",
    employmentType: experience?.employmentType ?? "Full-time",
    location: experience?.location ?? "Kathmandu, Nepal",
    workMode: experience?.workMode ?? "Hybrid",
    companyUrl: experience?.companyUrl ?? "",
    startDate: experience?.startDate ?? "",
    endDate: experience?.endDate ?? "",
    dateRange: experience?.dateRange ?? "",
    current: experience?.current ?? false,
    summary: experience?.summary ?? "",
    responsibilities: experience?.responsibilities?.length ? experience.responsibilities : [""],
    achievements: experience?.achievements?.length ? experience.achievements : [""],
    featuredOnHomepage: experience?.featuredOnHomepage ?? false,
    relatedSkillIds: experience?.relatedSkills?.map((skill) => skill._ref).filter((id): id is string => Boolean(id)) ?? [],
  };
}

export default function ExperienceForm({ experience, onComplete }: ExperienceFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<ExperienceFormState>(() => experienceToFormState(experience));
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(experience?._id);
  const selectedSkillSet = useMemo(() => new Set(formData.relatedSkillIds), [formData.relatedSkillIds]);

  const fetchSkills = useCallback(async () => {
    try {
      const data = await client.fetch<SkillOption[]>(`*[_type == "skill"] | order(order asc, name asc){_id, name, category}`);
      setSkills(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    }
  }, [client]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  function updateField<Key extends keyof ExperienceFormState>(field: Key, value: ExperienceFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function toggleSkill(skillId: string) {
    setFormData((previous) => {
      const nextIds = previous.relatedSkillIds.includes(skillId)
        ? previous.relatedSkillIds.filter((id) => id !== skillId)
        : [...previous.relatedSkillIds, skillId];

      return { ...previous, relatedSkillIds: nextIds };
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!formData.company.trim() || !formData.role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setSaving(true);

    const payload = {
      _type: "experience" as const,
      status: formData.status,
      company: formData.company.trim(),
      role: formData.role.trim(),
      employmentType: formData.employmentType.trim(),
      location: formData.location.trim(),
      workMode: formData.workMode.trim(),
      companyUrl: formData.companyUrl.trim(),
      startDate: formData.startDate,
      endDate: formData.current ? "" : formData.endDate,
      dateRange: formData.dateRange.trim(),
      current: formData.current,
      summary: formData.summary.trim(),
      responsibilities: formData.responsibilities.map((item) => item.trim()).filter(Boolean),
      achievements: formData.achievements.map((item) => item.trim()).filter(Boolean),
      featuredOnHomepage: formData.featuredOnHomepage,
      homepageOrder: experience?.homepageOrder ?? 99,
      relatedSkills: refsFromIds(formData.relatedSkillIds),
    };

    const unsetFields = ["employmentType", "location", "workMode", "companyUrl", "startDate", "endDate", "dateRange", "summary"].filter(
      (field) => !String(payload[field as keyof typeof payload] ?? "").trim(),
    );

    try {
      if (experience?._id) {
        let patch = client.patch(experience._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save experience.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Experience</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${experience?.role}` : "Add New Experience"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close experience form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Role Details</h3>
          <div className="studio-form-grid">
            <div className="studio-field">
              <span className="studio-form-label">Status</span>
              <div className="studio-segmented-control" aria-label="Experience status">
                {experienceStatuses.map((status) => <button key={status} type="button" className={formData.status === status ? "is-active" : ""} onClick={() => updateField("status", status)}>{status}</button>)}
              </div>
            </div>

            <label className="studio-field">
              <span className="studio-form-label">Company *</span>
              <input required value={formData.company} onChange={(event) => updateField("company", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Role *</span>
              <input required value={formData.role} onChange={(event) => updateField("role", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Employment Type</span>
              <input value={formData.employmentType} onChange={(event) => updateField("employmentType", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Work Mode</span>
              <input value={formData.workMode} onChange={(event) => updateField("workMode", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Company URL</span>
              <input value={formData.companyUrl} onChange={(event) => updateField("companyUrl", event.target.value)} className="studio-form-input" placeholder="https://..." />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Location</span>
              <input value={formData.location} onChange={(event) => updateField("location", event.target.value)} className="studio-form-input" />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Timeline</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Start Date</span>
              <CalendarDateInput label="start date" value={formData.startDate} onChange={(startDate) => updateField("startDate", startDate)} />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">End Date</span>
              <CalendarDateInput label="end date" value={formData.endDate} disabled={formData.current} onChange={(endDate) => updateField("endDate", endDate)} />
            </label>

            <DateRangePicker label="Display Date Range" value={formData.dateRange} present={formData.current} onChange={(dateRange) => updateField("dateRange", dateRange)} onPresentChange={(current) => updateField("current", current)} />

          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Content</h3>
          <div className="studio-form-grid">
            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Summary</span>
              <textarea value={formData.summary} onChange={(event) => updateField("summary", event.target.value)} className="studio-form-textarea" rows={4} />
            </label>

            <EditableStringList label="Responsibilities" values={formData.responsibilities} onChange={(values) => updateField("responsibilities", values)} placeholder="Describe one responsibility" />
            <EditableStringList label="Achievements" values={formData.achievements} onChange={(values) => updateField("achievements", values)} placeholder="Describe one achievement" />
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Homepage feature</h3>
          <div className="studio-form-grid">
            <label className="studio-checkbox-field">
              <input type="checkbox" checked={formData.featuredOnHomepage} onChange={(event) => updateField("featuredOnHomepage", event.target.checked)} />
              <span>Show this role in Experience &amp; outcomes</span>
            </label>

            <p className="studio-help-text">Arrange featured roles from the Experience overview after saving.</p>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Related Skills</h3>
          {skills.length ? (
            <div className="studio-tag-list">
              {skills.map((skill) => (
                <label key={skill._id} className="studio-checkbox-field">
                  <input type="checkbox" checked={selectedSkillSet.has(skill._id)} onChange={() => toggleSkill(skill._id)} />
                  <span>{skill.name ?? "Untitled skill"}</span>
                </label>
              ))}
            </div>
          ) : (
            <p className="studio-help-text">Add skills first to connect them to this experience.</p>
          )}
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-form-actions">
          <button type="button" onClick={onComplete} className="studio-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="studio-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Experience"}
          </button>
        </div>
      </form>
    </div>
  );
}

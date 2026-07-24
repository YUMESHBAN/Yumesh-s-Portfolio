"use client";

import { Save, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useClient } from "sanity";

import { cleanOptionalFields, getErrorMessage } from "../shared/studio-utils";

const certificationStatuses = ["published", "draft", "hidden"] as const;

type CertificationStatus = (typeof certificationStatuses)[number];

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

export type CertificationDocument = {
  _id?: string;
  _type?: "certification";
  status?: CertificationStatus;
  title?: string;
  issuer?: string;
  date?: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  description?: string;
  credentialUrl?: string;
  credentialFile?: unknown;
  relatedSkills?: SkillReference[];
  order?: number;
};

type CertificationFormState = {
  status: CertificationStatus;
  title: string;
  issuer: string;
  date: string;
  issueDate: string;
  expiryDate: string;
  credentialId: string;
  description: string;
  credentialUrl: string;
  relatedSkillIds: string[];
  order: number;
};

type CertificationFormProps = {
  certification?: CertificationDocument | null;
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

function certificationToFormState(certification?: CertificationDocument | null): CertificationFormState {
  return {
    status: certification?.status ?? "published",
    title: certification?.title ?? "",
    issuer: certification?.issuer ?? "",
    date: certification?.date ?? "",
    issueDate: certification?.issueDate ?? "",
    expiryDate: certification?.expiryDate ?? "",
    credentialId: certification?.credentialId ?? "",
    description: certification?.description ?? "",
    credentialUrl: certification?.credentialUrl ?? "",
    relatedSkillIds: certification?.relatedSkills?.map((skill) => skill._ref).filter((id): id is string => Boolean(id)) ?? [],
    order: certification?.order ?? 99,
  };
}

export default function CertificationForm({ certification, onComplete }: CertificationFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<CertificationFormState>(() => certificationToFormState(certification));
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(certification?._id);

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

  function updateField<Key extends keyof CertificationFormState>(field: Key, value: CertificationFormState[Key]) {
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

    const title = formData.title.trim();

    if (!title) {
      setError("Certification title is required.");
      return;
    }

    setSaving(true);

    const payload = {
      _type: "certification" as const,
      status: formData.status,
      title,
      issuer: formData.issuer.trim(),
      date: formData.date.trim(),
      issueDate: formData.issueDate,
      expiryDate: formData.expiryDate,
      credentialId: formData.credentialId.trim(),
      description: formData.description.trim(),
      credentialUrl: formData.credentialUrl.trim(),
      relatedSkills: refsFromIds(formData.relatedSkillIds),
      order: Number.isFinite(Number(formData.order)) ? Number(formData.order) : 99,
    };

    const unsetFields = ["issuer", "date", "issueDate", "expiryDate", "credentialId", "description", "credentialUrl"].filter(
      (field) => !String(payload[field as keyof typeof payload] ?? "").trim(),
    );

    try {
      if (certification?._id) {
        let patch = client.patch(certification._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save certification.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Certifications</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${certification?.title}` : "Add New Certification"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close certification form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Credential Details</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <select value={formData.status} onChange={(event) => updateField("status", event.target.value as CertificationStatus)} className="studio-form-select">
                {certificationStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Title *</span>
              <input required value={formData.title} onChange={(event) => updateField("title", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Issuer</span>
              <input value={formData.issuer} onChange={(event) => updateField("issuer", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Display Date</span>
              <input value={formData.date} onChange={(event) => updateField("date", event.target.value)} className="studio-form-input" placeholder="2025 or Nov 2025" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Issue Date</span>
              <input type="date" value={formData.issueDate} onChange={(event) => updateField("issueDate", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Expiry Date</span>
              <input type="date" value={formData.expiryDate} onChange={(event) => updateField("expiryDate", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Credential ID</span>
              <input value={formData.credentialId} onChange={(event) => updateField("credentialId", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Credential URL</span>
              <input value={formData.credentialUrl} onChange={(event) => updateField("credentialUrl", event.target.value)} className="studio-form-input" placeholder="https://..." />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Display Order</span>
              <input type="number" value={formData.order} onChange={(event) => updateField("order", Number(event.target.value))} className="studio-form-input" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Description</span>
              <textarea value={formData.description} onChange={(event) => updateField("description", event.target.value)} className="studio-form-textarea" rows={4} />
            </label>
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
            <p className="studio-help-text">Add skills first to connect them to certifications.</p>
          )}
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-form-actions">
          <button type="button" onClick={onComplete} className="studio-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={saving} className="studio-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Certification"}
          </button>
        </div>
      </form>
    </div>
  );
}

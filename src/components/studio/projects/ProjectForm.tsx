"use client";

import { ImagePlus, Plus, Save, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useClient } from "sanity";

import RichContentEditor from "../shared/RichContentEditor";
import {
  cleanOptionalFields,
  getErrorMessage,
  joinLines,
  normalizeRichContent,
  slugify,
  splitLines,
  type RichContentBlock,
  type SlugValue,
} from "../shared/studio-utils";

const projectStatuses = ["published", "draft", "hidden"] as const;
const projectTypes = ["Company", "Freelance", "Academic", "Learning"] as const;

type ProjectStatus = (typeof projectStatuses)[number];
type ProjectType = (typeof projectTypes)[number];

type MetricDocument = {
  _key?: string;
  _type?: "metricItem";
  label?: string;
  value?: string;
  note?: string;
};

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

type ImageWithMetaDocument = {
  _key?: string;
  _type?: "imageWithMeta";
  image?: unknown;
  alt?: string;
  caption?: string;
};

export type ProjectDocument = {
  _id?: string;
  _type?: "project";
  status?: ProjectStatus;
  title?: string;
  slug?: SlugValue;
  type?: ProjectType;
  association?: string;
  dateRange?: string;
  projectYear?: string;
  duration?: string;
  teamSize?: string;
  summary?: string;
  role?: string;
  audience?: string;
  goals?: string[];
  responsibilities?: string[];
  problem?: RichContentBlock[];
  process?: RichContentBlock[];
  solution?: RichContentBlock[];
  results?: RichContentBlock[];
  metrics?: MetricDocument[];
  relatedSkills?: SkillReference[];
  techStack?: string[];
  features?: string[];
  impact?: string[];
  repoUrl?: string;
  liveUrl?: string;
  logo?: ImageWithMetaDocument;
  featuredImage?: ImageWithMetaDocument;
  gallery?: ImageWithMetaDocument[];
  featured?: boolean;
  order?: number;
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
};

type ProjectFormState = {
  status: ProjectStatus;
  title: string;
  slug: string;
  type: ProjectType;
  association: string;
  dateRange: string;
  projectYear: string;
  duration: string;
  teamSize: string;
  summary: string;
  role: string;
  audience: string;
  goals: string;
  responsibilities: string;
  problem: RichContentBlock[];
  process: RichContentBlock[];
  solution: RichContentBlock[];
  results: RichContentBlock[];
  metrics: MetricDocument[];
  relatedSkillIds: string[];
  techStack: string;
  features: string;
  impact: string;
  repoUrl: string;
  liveUrl: string;
  logo?: ImageWithMetaDocument;
  featuredImage?: ImageWithMetaDocument;
  gallery: ImageWithMetaDocument[];
  featured: boolean;
  order: number;
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
};

type ProjectFormProps = {
  project?: ProjectDocument | null;
  onComplete: () => void;
};

function keyFromText(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function newMetric(): MetricDocument {
  return {
    _key: keyFromText("metric"),
    _type: "metricItem",
    label: "",
    value: "",
    note: "",
  };
}

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

function projectToFormState(project?: ProjectDocument | null): ProjectFormState {
  return {
    status: project?.status ?? "published",
    title: project?.title ?? "",
    slug: project?.slug?.current ?? "",
    type: project?.type ?? "Company",
    association: project?.association ?? "",
    dateRange: project?.dateRange ?? "",
    projectYear: project?.projectYear ?? "",
    duration: project?.duration ?? "",
    teamSize: project?.teamSize ?? "",
    summary: project?.summary ?? "",
    role: project?.role ?? "",
    audience: project?.audience ?? "",
    goals: joinLines(project?.goals),
    responsibilities: joinLines(project?.responsibilities),
    problem: project?.problem ?? [],
    process: project?.process ?? [],
    solution: project?.solution ?? [],
    results: project?.results ?? [],
    metrics: project?.metrics?.length ? project.metrics : [newMetric()],
    relatedSkillIds: project?.relatedSkills?.map((skill) => skill._ref).filter((id): id is string => Boolean(id)) ?? [],
    techStack: joinLines(project?.techStack),
    features: joinLines(project?.features),
    impact: joinLines(project?.impact),
    repoUrl: project?.repoUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    logo: project?.logo,
    featuredImage: project?.featuredImage,
    gallery: project?.gallery ?? [],
    featured: project?.featured ?? false,
    order: project?.order ?? 99,
    seoTitle: project?.seoTitle ?? "",
    seoDescription: project?.seoDescription ?? "",
    canonicalPath: project?.canonicalPath ?? "",
  };
}

function usableMetrics(metrics: MetricDocument[]) {
  return metrics
    .map((metric) => ({
      _key: metric._key ?? keyFromText("metric"),
      _type: "metricItem" as const,
      label: metric.label?.trim() ?? "",
      value: metric.value?.trim() ?? "",
      note: metric.note?.trim() || undefined,
    }))
    .filter((metric) => metric.label && metric.value);
}

function usableGallery(gallery: ImageWithMetaDocument[]) {
  return gallery.filter((item) => Boolean(item.image));
}

export default function ProjectForm({ project, onComplete }: ProjectFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<ProjectFormState>(() => projectToFormState(project));
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(project?._id);
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

  function updateField<Key extends keyof ProjectFormState>(field: Key, value: ProjectFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function updateTitle(title: string) {
    setFormData((previous) => ({
      ...previous,
      title,
      slug: isEditing && previous.slug ? previous.slug : slugify(title),
    }));
  }

  function toggleSkill(skillId: string) {
    setFormData((previous) => {
      const nextIds = previous.relatedSkillIds.includes(skillId)
        ? previous.relatedSkillIds.filter((id) => id !== skillId)
        : [...previous.relatedSkillIds, skillId];

      return { ...previous, relatedSkillIds: nextIds };
    });
  }

  function updateMetric(index: number, field: keyof MetricDocument, value: string) {
    setFormData((previous) => ({
      ...previous,
      metrics: previous.metrics.map((metric, metricIndex) => (metricIndex === index ? { ...metric, [field]: value } : metric)),
    }));
  }

  function addMetric() {
    setFormData((previous) => ({ ...previous, metrics: [...previous.metrics, newMetric()] }));
  }

  function removeMetric(index: number) {
    setFormData((previous) => {
      const nextMetrics = previous.metrics.filter((_, metricIndex) => metricIndex !== index);
      return { ...previous, metrics: nextMetrics.length ? nextMetrics : [newMetric()] };
    });
  }

  async function uploadImage(file: File, altFallback: string) {
    const asset = await client.assets.upload("image", file, { filename: file.name });

    return {
      _key: keyFromText("image"),
      _type: "imageWithMeta" as const,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      },
      alt: altFallback || file.name,
      caption: "",
    };
  }

  async function handleFeaturedImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const image = await uploadImage(file, formData.title || file.name);
      updateField("featuredImage", image);
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const logo = await uploadImage(file, `${formData.title || "Project"} logo`);
      updateField("logo", logo);
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const images = await Promise.all(files.map((file) => uploadImage(file, `${formData.title || "Project"} screenshot`)));
      setFormData((previous) => ({ ...previous, gallery: [...previous.gallery, ...images] }));
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function updateFeaturedImage(field: "alt" | "caption", value: string) {
    setFormData((previous) => ({
      ...previous,
      featuredImage: previous.featuredImage ? { ...previous.featuredImage, [field]: value } : previous.featuredImage,
    }));
  }

  function updateGalleryImage(index: number, field: "alt" | "caption", value: string) {
    setFormData((previous) => ({
      ...previous,
      gallery: previous.gallery.map((image, imageIndex) => (imageIndex === index ? { ...image, [field]: value } : image)),
    }));
  }

  function removeGalleryImage(index: number) {
    setFormData((previous) => ({ ...previous, gallery: previous.gallery.filter((_, imageIndex) => imageIndex !== index) }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const title = formData.title.trim();
    const slug = slugify(formData.slug || formData.title);

    if (!title || !slug) {
      setError("Project title and slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      _type: "project" as const,
      status: formData.status,
      title,
      slug: { _type: "slug", current: slug },
      type: formData.type,
      association: formData.association.trim(),
      dateRange: formData.dateRange.trim(),
      projectYear: formData.projectYear.trim(),
      duration: formData.duration.trim(),
      teamSize: formData.teamSize.trim(),
      summary: formData.summary.trim(),
      role: formData.role.trim(),
      audience: formData.audience.trim(),
      goals: splitLines(formData.goals),
      responsibilities: splitLines(formData.responsibilities),
      problem: normalizeRichContent(formData.problem),
      process: normalizeRichContent(formData.process),
      solution: normalizeRichContent(formData.solution),
      results: normalizeRichContent(formData.results),
      metrics: usableMetrics(formData.metrics),
      relatedSkills: refsFromIds(formData.relatedSkillIds),
      techStack: splitLines(formData.techStack),
      features: splitLines(formData.features),
      impact: splitLines(formData.impact),
      repoUrl: formData.repoUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      logo: formData.logo?.image ? formData.logo : undefined,
      featuredImage: formData.featuredImage?.image ? formData.featuredImage : undefined,
      gallery: usableGallery(formData.gallery),
      featured: formData.featured,
      order: Number.isFinite(Number(formData.order)) ? Number(formData.order) : 99,
      seoTitle: formData.seoTitle.trim(),
      seoDescription: formData.seoDescription.trim(),
      canonicalPath: formData.canonicalPath.trim(),
    };

    const unsetFields = [
      "association",
      "dateRange",
      "projectYear",
      "duration",
      "teamSize",
      "summary",
      "role",
      "audience",
      "repoUrl",
      "liveUrl",
      "seoTitle",
      "seoDescription",
      "canonicalPath",
      ...(!payload.logo ? ["logo"] : []),
      ...(!payload.featuredImage ? ["featuredImage"] : []),
    ].filter((field) => !String(payload[field as keyof typeof payload] ?? "").trim());

    try {
      if (project?._id) {
        let patch = client.patch(project._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Projects</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${project?.title}` : "Add New Project"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close project form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Basic Information</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <select value={formData.status} onChange={(event) => updateField("status", event.target.value as ProjectStatus)} className="studio-form-select">
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Project Title *</span>
              <input required value={formData.title} onChange={(event) => updateTitle(event.target.value)} className="studio-form-input" placeholder="Merry Crochets" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Slug *</span>
              <input required value={formData.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} className="studio-form-input studio-form-input-bg" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Project Type</span>
              <select value={formData.type} onChange={(event) => updateField("type", event.target.value as ProjectType)} className="studio-form-select">
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Association</span>
              <input value={formData.association} onChange={(event) => updateField("association", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Date Range</span>
              <input value={formData.dateRange} onChange={(event) => updateField("dateRange", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Project Year</span>
              <input value={formData.projectYear} onChange={(event) => updateField("projectYear", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Duration</span>
              <input value={formData.duration} onChange={(event) => updateField("duration", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Team Size</span>
              <input value={formData.teamSize} onChange={(event) => updateField("teamSize", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Summary</span>
              <textarea value={formData.summary} onChange={(event) => updateField("summary", event.target.value)} className="studio-form-textarea" rows={4} />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Your Role</span>
              <input value={formData.role} onChange={(event) => updateField("role", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Audience</span>
              <textarea value={formData.audience} onChange={(event) => updateField("audience", event.target.value)} className="studio-form-textarea" rows={3} />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Case Study Structure</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Goals</span>
              <textarea value={formData.goals} onChange={(event) => updateField("goals", event.target.value)} className="studio-form-textarea" rows={5} placeholder={"Increase conversions\nImprove content editing"} />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Responsibilities</span>
              <textarea value={formData.responsibilities} onChange={(event) => updateField("responsibilities", event.target.value)} className="studio-form-textarea" rows={5} placeholder={"Frontend implementation\nCMS modeling"} />
            </label>
          </div>

          <div className="studio-form-stack">
            <RichContentEditor label="Problem" value={formData.problem} onChange={(value) => updateField("problem", value)} />
            <RichContentEditor label="Process" value={formData.process} onChange={(value) => updateField("process", value)} />
            <RichContentEditor label="Solution" value={formData.solution} onChange={(value) => updateField("solution", value)} />
            <RichContentEditor label="Results" value={formData.results} onChange={(value) => updateField("results", value)} />
          </div>
        </section>

        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Metrics</h3>
            <button type="button" onClick={addMetric} className="studio-btn-secondary">
              <Plus size={16} />
              Add Metric
            </button>
          </div>

          <div className="studio-result-table">
            <div className="studio-metric-table-head">
              <span>Label</span>
              <span>Value</span>
              <span>Note</span>
              <span />
            </div>
            {formData.metrics.map((metric, index) => (
              <div key={metric._key ?? index} className="studio-metric-row">
                <input value={metric.label ?? ""} onChange={(event) => updateMetric(index, "label", event.target.value)} className="studio-form-input" placeholder="Performance" />
                <input value={metric.value ?? ""} onChange={(event) => updateMetric(index, "value", event.target.value)} className="studio-form-input" placeholder="95+" />
                <input value={metric.note ?? ""} onChange={(event) => updateMetric(index, "note", event.target.value)} className="studio-form-input" placeholder="Lighthouse score" />
                <button type="button" onClick={() => removeMetric(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove metric">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Skills and Legacy Details</h3>
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
            <p className="studio-help-text">Add skills first to connect them to this project.</p>
          )}

          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Tech Stack</span>
              <textarea value={formData.techStack} onChange={(event) => updateField("techStack", event.target.value)} className="studio-form-textarea" rows={5} />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Features</span>
              <textarea value={formData.features} onChange={(event) => updateField("features", event.target.value)} className="studio-form-textarea" rows={5} />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Impact</span>
              <textarea value={formData.impact} onChange={(event) => updateField("impact", event.target.value)} className="studio-form-textarea" rows={5} />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Repository URL</span>
              <input value={formData.repoUrl} onChange={(event) => updateField("repoUrl", event.target.value)} className="studio-form-input" />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Live URL</span>
              <input value={formData.liveUrl} onChange={(event) => updateField("liveUrl", event.target.value)} className="studio-form-input" />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Media</h3>
            <span className="studio-help-inline">{uploading ? "Uploading..." : "Stored in Sanity assets"}</span>
          </div>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Project Logo</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="studio-form-input" />
            </label>

            {formData.logo?.image ? (
              <button type="button" onClick={() => updateField("logo", undefined)} className="studio-btn-cancel">
                Remove Project Logo
              </button>
            ) : null}

            <label className="studio-field">
              <span className="studio-form-label">Featured Image</span>
              <input type="file" accept="image/*" onChange={handleFeaturedImageUpload} className="studio-form-input" />
            </label>

            {formData.featuredImage?.image ? (
              <>
                <label className="studio-field">
                  <span className="studio-form-label">Featured Alt Text</span>
                  <input value={formData.featuredImage.alt ?? ""} onChange={(event) => updateFeaturedImage("alt", event.target.value)} className="studio-form-input" />
                </label>
                <label className="studio-field">
                  <span className="studio-form-label">Featured Caption</span>
                  <input value={formData.featuredImage.caption ?? ""} onChange={(event) => updateFeaturedImage("caption", event.target.value)} className="studio-form-input" />
                </label>
                <button type="button" onClick={() => updateField("featuredImage", undefined)} className="studio-btn-cancel">
                  Remove Featured Image
                </button>
              </>
            ) : null}

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Gallery Images</span>
              <input type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="studio-form-input" />
            </label>
          </div>

          {formData.gallery.length ? (
            <div className="studio-gallery-editor">
              {formData.gallery.map((image, index) => (
                <div key={image._key ?? index} className="studio-gallery-item">
                  <div className="studio-gallery-placeholder">
                    <ImagePlus size={22} />
                    <span>{image.alt || `Image ${index + 1}`}</span>
                  </div>
                  <input value={image.alt ?? ""} onChange={(event) => updateGalleryImage(index, "alt", event.target.value)} className="studio-form-input" placeholder="Alt text" />
                  <input value={image.caption ?? ""} onChange={(event) => updateGalleryImage(index, "caption", event.target.value)} className="studio-form-input" placeholder="Caption" />
                  <button type="button" onClick={() => removeGalleryImage(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove gallery image">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">SEO and Display</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Featured Order</span>
              <input type="number" value={formData.order} onChange={(event) => updateField("order", Number(event.target.value))} className="studio-form-input" min={1} />
            </label>

            <label className="studio-checkbox-field">
              <input type="checkbox" checked={formData.featured} onChange={(event) => updateField("featured", event.target.checked)} />
              <span>Featured on homepage</span>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">SEO Title</span>
              <input value={formData.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Canonical Path</span>
              <input value={formData.canonicalPath} onChange={(event) => updateField("canonicalPath", event.target.value)} className="studio-form-input" placeholder="/projects/project-slug" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">SEO Description</span>
              <textarea value={formData.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} className="studio-form-textarea" rows={3} />
            </label>
          </div>
        </section>

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-form-actions">
          <button type="button" onClick={onComplete} className="studio-btn-cancel">
            Cancel
          </button>
          <button type="submit" disabled={saving || uploading} className="studio-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Project"}
          </button>
        </div>
      </form>
    </div>
  );
}

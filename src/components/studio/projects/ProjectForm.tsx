"use client";

import Image from "next/image";
import { ArrowLeft, ArrowRight, FileText, ImagePlus, MoveLeft, MoveRight, Plus, Save, Search, Trash2, Upload, Video, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useClient } from "sanity";

import RichContentEditor from "../shared/RichContentEditor";
import EditableStringList from "../shared/EditableStringList";
import { DateRangePicker, YearPicker } from "../shared/DateRangePicker";
import {
  cleanOptionalFields,
  getErrorMessage,
  normalizeRichContent,
  slugify,
  type RichContentBlock,
  type SlugValue,
} from "../shared/studio-utils";

const projectStatuses = ["published", "draft", "hidden"] as const;
const projectTypes = ["Company", "Freelance", "Academic", "Learning"] as const;
const formSteps = ["Basics", "Case study", "Tech & links", "Media", "Review & publish"] as const;

type ProjectStatus = (typeof projectStatuses)[number];
type ProjectType = (typeof projectTypes)[number];

type MetricDocument = {
  _key?: string;
  _type?: "metricItem";
  label?: string;
  value?: string;
  note?: string;
};

type ProjectLinkDocument = {
  _key?: string;
  _type?: "linkItem";
  label?: string;
  href?: string;
  type?: string;
};

type SkillOption = {
  _id: string;
  name?: string;
  category?: string;
  aliases?: string[];
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
  src?: string;
};

type FileDocument = {
  _type?: "file";
  asset?: unknown;
  url?: string;
  originalFilename?: string;
};

type PendingRemoval = {
  kind: "logo" | "featuredImage" | "demoVideo" | "projectPdf" | "gallery";
  label: string;
  index?: number;
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
  links?: ProjectLinkDocument[];
  demoVideo?: FileDocument;
  demoVideoUrl?: string;
  projectPdf?: FileDocument;
  projectPdfUrl?: string;
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
  goals: string[];
  responsibilities: string[];
  problem: RichContentBlock[];
  process: RichContentBlock[];
  solution: RichContentBlock[];
  results: RichContentBlock[];
  metrics: MetricDocument[];
  relatedSkillIds: string[];
  techStack: string[];
  features: string[];
  impact: string[];
  repoUrl: string;
  liveUrl: string;
  links: ProjectLinkDocument[];
  demoVideo?: FileDocument;
  demoVideoUrl: string;
  projectPdf?: FileDocument;
  projectPdfUrl: string;
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

function newProjectLink(): ProjectLinkDocument {
  return { _key: keyFromText("link"), _type: "linkItem", label: "", href: "", type: "Other" };
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

function ensureStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    const list = val.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
    return list.length ? list : [""];
  }
  if (typeof val === "string" && val.trim()) {
    const list = val.split("\n").map((s) => s.trim()).filter(Boolean);
    return list.length ? list : [""];
  }
  return [""];
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
    goals: ensureStringArray(project?.goals),
    responsibilities: ensureStringArray(project?.responsibilities),
    problem: project?.problem ?? [],
    process: project?.process ?? [],
    solution: project?.solution ?? [],
    results: project?.results ?? [],
    metrics: project?.metrics?.length ? project.metrics : [newMetric()],
    relatedSkillIds: project?.relatedSkills?.map((skill) => skill._ref).filter((id): id is string => Boolean(id)) ?? [],
    techStack: ensureStringArray(project?.techStack),
    features: ensureStringArray(project?.features),
    impact: ensureStringArray(project?.impact),
    repoUrl: project?.repoUrl ?? "",
    liveUrl: project?.liveUrl ?? "",
    links: project?.links ?? [],
    demoVideo: project?.demoVideo,
    demoVideoUrl: project?.demoVideoUrl ?? "",
    projectPdf: project?.projectPdf,
    projectPdfUrl: project?.projectPdfUrl ?? "",
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

function PreviewRichContent({ blocks }: { blocks: RichContentBlock[] }) {
  function inline(children: Extract<RichContentBlock, { _type: "block" }>['children']): ReactNode {
    return children.map((child) => {
      let content: ReactNode = child.text;
      if (child.marks.includes("strong")) content = <strong>{content}</strong>;
      if (child.marks.includes("em")) content = <em>{content}</em>;
      if (child.marks.includes("code")) content = <code>{content}</code>;
      return <span key={child._key}>{content}</span>;
    });
  }

  return <div className="studio-preview-rich-content">{blocks.map((block) => {
    if (block._type !== "block") return null;
    const content = inline(block.children);
    if (block.style === "h2") return <h2 key={block._key}>{content}</h2>;
    if (block.style === "h3") return <h3 key={block._key}>{content}</h3>;
    if (block.style === "blockquote") return <blockquote key={block._key}>{content}</blockquote>;
    if (block.listItem) return <p key={block._key} className="studio-preview-list-item">• {content}</p>;
    return <p key={block._key}>{content}</p>;
  })}</div>;
}

function imageForSave(image?: ImageWithMetaDocument) {
  if (!image?.image) {
    return undefined;
  }

  const { src: _src, ...savedImage } = image;
  return savedImage;
}

function usableGallery(gallery: ImageWithMetaDocument[]) {
  return gallery.map(imageForSave).filter((item): item is NonNullable<typeof item> => Boolean(item));
}

function fileForSave(file?: FileDocument) {
  if (!file?.asset) {
    return undefined;
  }

  const { url: _url, originalFilename: _originalFilename, ...savedFile } = file;
  return savedFile;
}

function uniqueTechStack(...groups: string[][]) {
  const seen = new Set<string>();
  return groups.flat().map((item) => item.trim()).filter((item) => {
    const key = item.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export default function ProjectForm({ project, onComplete }: ProjectFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<ProjectFormState>(() => projectToFormState(project));
  const [skills, setSkills] = useState<SkillOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [pendingRemoval, setPendingRemoval] = useState<PendingRemoval | null>(null);
  const [skillSearch, setSkillSearch] = useState("");

  const isEditing = Boolean(project?._id);
  const selectedSkillSet = useMemo(() => new Set(formData.relatedSkillIds), [formData.relatedSkillIds]);
  const filteredSkills = useMemo(() => {
    const query = skillSearch.trim().toLowerCase();
    if (!query) return skills;

    return skills.filter((skill) => [skill.name, skill.category, ...(skill.aliases ?? [])].some((value) => value?.toLowerCase().includes(query)));
  }, [skillSearch, skills]);
  const selectedTechnicalSkillNames = useMemo(
    () => skills.filter((skill) => selectedSkillSet.has(skill._id) && skill.category !== "Soft Skills").map((skill) => skill.name ?? "").filter(Boolean),
    [selectedSkillSet, skills],
  );
  const projectOnlyTechStack = useMemo(() => {
    const selectedNames = new Set(selectedTechnicalSkillNames.map((skill) => skill.toLowerCase()));
    return formData.techStack.filter((item) => !selectedNames.has(item.trim().toLowerCase()));
  }, [formData.techStack, selectedTechnicalSkillNames]);

  const fetchSkills = useCallback(async () => {
    try {
      const data = await client.fetch<SkillOption[]>(`*[_type == "skill"] | order(order asc, name asc){_id, name, category, aliases}`);
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

  function updateProjectLink(index: number, field: "label" | "href", value: string) {
    setFormData((previous) => ({ ...previous, links: previous.links.map((link, linkIndex) => linkIndex === index ? { ...link, [field]: value } : link) }));
  }

  function addProjectLink() {
    setFormData((previous) => ({ ...previous, links: [...previous.links, newProjectLink()] }));
  }

  function removeProjectLink(index: number) {
    setFormData((previous) => ({ ...previous, links: previous.links.filter((_, linkIndex) => linkIndex !== index) }));
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
      src: asset.url,
    };
  }

  async function uploadFile(file: File) {
    const asset = await client.assets.upload("file", file, { filename: file.name, contentType: file.type });

    return {
      _type: "file" as const,
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      url: asset.url,
      originalFilename: file.name,
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

  async function handleFileUpload(event: ChangeEvent<HTMLInputElement>, field: "demoVideo" | "projectPdf") {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const uploadedFile = await uploadFile(file);
      updateField(field, uploadedFile);
      updateField(field === "demoVideo" ? "demoVideoUrl" : "projectPdfUrl", uploadedFile.url);
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

  function moveGalleryImage(index: number, direction: -1 | 1) {
    setFormData((previous) => {
      const destination = index + direction;
      if (destination < 0 || destination >= previous.gallery.length) {
        return previous;
      }

      const gallery = [...previous.gallery];
      [gallery[index], gallery[destination]] = [gallery[destination], gallery[index]];
      return { ...previous, gallery };
    });
  }

  function confirmRemoval() {
    if (!pendingRemoval) {
      return;
    }

    if (pendingRemoval.kind === "gallery" && pendingRemoval.index !== undefined) {
      removeGalleryImage(pendingRemoval.index);
    } else if (pendingRemoval.kind === "logo") {
      updateField("logo", undefined);
    } else if (pendingRemoval.kind === "featuredImage") {
      updateField("featuredImage", undefined);
    } else if (pendingRemoval.kind === "demoVideo") {
      updateField("demoVideo", undefined);
      updateField("demoVideoUrl", "");
    } else if (pendingRemoval.kind === "projectPdf") {
      updateField("projectPdf", undefined);
      updateField("projectPdfUrl", "");
    }

    setPendingRemoval(null);
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
      goals: formData.goals.map((item) => item.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.map((item) => item.trim()).filter(Boolean),
      problem: normalizeRichContent(formData.problem),
      process: normalizeRichContent(formData.process),
      solution: normalizeRichContent(formData.solution),
      results: normalizeRichContent(formData.results),
      metrics: usableMetrics(formData.metrics),
      relatedSkills: refsFromIds(formData.relatedSkillIds),
      techStack: uniqueTechStack(selectedTechnicalSkillNames, formData.techStack),
      features: formData.features.map((item) => item.trim()).filter(Boolean),
      impact: formData.impact.map((item) => item.trim()).filter(Boolean),
      repoUrl: formData.repoUrl.trim(),
      liveUrl: formData.liveUrl.trim(),
      links: formData.links.map((link) => ({ _key: link._key ?? keyFromText("link"), _type: "linkItem" as const, label: link.label?.trim() ?? "", href: link.href?.trim() ?? "", type: "Other" })).filter((link) => link.label && link.href),
      logo: imageForSave(formData.logo),
      featuredImage: imageForSave(formData.featuredImage),
      demoVideo: fileForSave(formData.demoVideo),
      projectPdf: fileForSave(formData.projectPdf),
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
      "links",
      "seoTitle",
      "seoDescription",
      "canonicalPath",
      ...(!payload.logo ? ["logo"] : []),
      ...(!payload.featuredImage ? ["featuredImage"] : []),
      ...(!payload.demoVideo ? ["demoVideo"] : []),
      ...(!payload.projectPdf ? ["projectPdf"] : []),
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
        <div className="studio-stepper" aria-label="Project form steps">
          {formSteps.map((step, index) => (
            <button
              key={step}
              type="button"
              onClick={() => setActiveStep(index)}
              className={`studio-stepper-item ${activeStep === index ? "is-active" : ""} ${activeStep > index ? "is-complete" : ""}`}
              aria-current={activeStep === index ? "step" : undefined}
            >
              <span>{index + 1}</span>
              {step}
            </button>
          ))}
        </div>

        {activeStep === 0 ? (
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Basic Information</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <div className="studio-status-control" role="group" aria-label="Project status">
                {projectStatuses.map((status) => <button key={status} type="button" onClick={() => updateField("status", status)} className={formData.status === status ? "is-active" : ""}>{status}</button>)}
              </div>
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Project Title *</span>
              <input required value={formData.title} onChange={(event) => updateTitle(event.target.value)} className="studio-form-input" placeholder="Merry Crochets" />
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

            <DateRangePicker label="Date Range" value={formData.dateRange} onChange={(dateRange) => updateField("dateRange", dateRange)} />

            <YearPicker label="Project Year" value={formData.projectYear} onChange={(projectYear) => updateField("projectYear", projectYear)} />

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
        ) : null}

        {activeStep === 1 ? (
          <>
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Case Study Structure</h3>
          <div className="studio-form-grid">
            <EditableStringList
              label="Goals"
              description="What this project needed to achieve for users or the business."
              values={formData.goals}
              onChange={(values) => updateField("goals", values)}
              placeholder="Increase conversions"
            />
            <EditableStringList
              label="Responsibilities"
              description="The work you personally owned or delivered."
              values={formData.responsibilities}
              onChange={(values) => updateField("responsibilities", values)}
              placeholder="Frontend implementation"
            />
          </div>

          <div className="studio-form-stack">
            <RichContentEditor label="Problem" description="Describe the original user or business challenge." value={formData.problem} onChange={(value) => updateField("problem", value)} />
            <RichContentEditor label="Process" description="Show the research, decisions, and approach that led to the outcome." value={formData.process} onChange={(value) => updateField("process", value)} />
            <RichContentEditor label="Solution" description="Explain what you built and how it addressed the problem." value={formData.solution} onChange={(value) => updateField("solution", value)} />
            <RichContentEditor label="Results" description="Record evidence: measurable outcomes, completed deliverables, or launch results." value={formData.results} onChange={(value) => updateField("results", value)} />
          </div>
        </section>
        <section className="studio-form-section studio-content-preview">
          <h3 className="studio-form-section-title">Case study preview</h3>
          <div className="studio-website-preview">
            <p className="studio-eyebrow">{formData.type} project</p>
            <h2>{formData.title || "Your project title"}</h2>
            <p>{formData.summary || "Your summary will appear here."}</p>
            {([ ["Problem", formData.problem], ["Process", formData.process], ["Solution", formData.solution], ["Results", formData.results] ] as const).map(([heading, blocks]) =>
              blocks.some((block) => block._type === "block" && block.children.some((child) => child.text.trim())) ? <div key={heading}><h3>{heading}</h3><PreviewRichContent blocks={blocks} /></div> : null,
            )}
          </div>
        </section>
        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Metrics</h3>
            <p className="studio-help-text">Use numbers or concrete evidence that supports the Results section.</p>
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
          </>
        ) : null}

        {activeStep === 2 ? (
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Related Skills &amp; Tech Stack</h3>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <label className="studio-search-wrapper w-full sm:w-80">
              <span className="sr-only">Search skills</span>
              <Search size={16} className="studio-search-icon" aria-hidden="true" />
              <input value={skillSearch} onChange={(event) => setSkillSearch(event.target.value)} className="studio-search-input" placeholder="Search skills, categories, or aliases" />
            </label>
            <p className="studio-help-text">{filteredSkills.length} of {skills.length} skills</p>
          </div>
          {skills.length ? (
            filteredSkills.length ? <div className="studio-tag-list mt-4">
              {filteredSkills.map((skill) => (
                <label key={skill._id} className="studio-checkbox-field">
                  <input type="checkbox" checked={selectedSkillSet.has(skill._id)} onChange={() => toggleSkill(skill._id)} />
                  <span>{skill.name ?? "Untitled skill"}</span>
                </label>
              ))}
            </div> : <p className="studio-help-text mt-4">No skills match “{skillSearch.trim()}”. Try a different term.</p>
          ) : (
            <p className="studio-help-text">Add skills first to connect them to this project.</p>
          )}

          {selectedTechnicalSkillNames.length ? <div className="mt-4"><p className="studio-form-label">Included automatically in Tech Stack</p><div className="mt-2 flex flex-wrap gap-2">{selectedTechnicalSkillNames.map((skill) => <span key={skill} className="studio-tag">{skill}</span>)}</div></div> : null}

          <div className="studio-form-grid">
            <EditableStringList label="Additional tech stack" values={projectOnlyTechStack} onChange={(techStack) => updateField("techStack", techStack)} placeholder="Stripe" />
            <EditableStringList label="Features" description="Key user-facing capabilities included in this project." values={formData.features} onChange={(features) => updateField("features", features)} placeholder="Accessible content editor" />
            <EditableStringList label="Impact" description="Why the results mattered to users, the client, or the business." values={formData.impact} onChange={(impact) => updateField("impact", impact)} placeholder="Reduced publishing time" />
            <label className="studio-field">
              <span className="studio-form-label">Repository URL</span>
              <input value={formData.repoUrl} onChange={(event) => updateField("repoUrl", event.target.value)} className="studio-form-input" />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Live URL</span>
              <input value={formData.liveUrl} onChange={(event) => updateField("liveUrl", event.target.value)} className="studio-form-input" />
            </label>
            <div className="studio-field studio-field-wide">
              <div className="studio-editable-list-header">
                <span className="studio-form-label">Additional project links</span>
                <button type="button" onClick={addProjectLink} className="studio-btn-text"><Plus size={15} /> Add link</button>
              </div>
              <p className="studio-help-text">Optional resources shown under Project resources on the public case study.</p>
              {formData.links.length ? <div className="studio-project-links-list">
                {formData.links.map((link, index) => <div key={link._key ?? index} className="studio-project-link-row">
                  <input value={link.label ?? ""} onChange={(event) => updateProjectLink(index, "label", event.target.value)} className="studio-form-input" placeholder="View Figma design" />
                  <input type="url" value={link.href ?? ""} onChange={(event) => updateProjectLink(index, "href", event.target.value)} className="studio-form-input" placeholder="https://figma.com/..." />
                  <button type="button" onClick={() => removeProjectLink(index)} className="studio-icon-button studio-icon-button-danger" aria-label="Remove project link"><Trash2 size={16} /></button>
                </div>)}
              </div> : null}
            </div>
          </div>
        </section>
        ) : null}

        {activeStep === 3 ? (
        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Media</h3>
            <span className="studio-help-inline">{uploading ? "Uploading..." : "Stored in Sanity assets"}</span>
          </div>
          <p className="studio-help-text">Add the assets that best explain this project. Hover an uploaded asset to replace or remove it.</p>
          <div className="studio-asset-grid">
            {formData.logo?.src ? (
              <div className="studio-asset-card studio-asset-card-logo">
                <Image src={formData.logo.src} alt={formData.logo.alt || "Project logo"} fill sizes="180px" className="object-contain p-5" />
                <div className="studio-asset-card-label">Project logo</div>
                <div className="studio-asset-card-actions">
                  <label className="studio-asset-action"><Upload size={15} /> Replace<input type="file" accept="image/*" onChange={handleLogoUpload} /></label>
                  <button type="button" className="studio-asset-action is-danger" onClick={() => setPendingRemoval({ kind: "logo", label: "project logo" })}><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            ) : (
              <label className="studio-asset-upload-tile"><ImagePlus size={20} /><strong>Add project logo</strong><span>PNG, JPG, or WEBP</span><input type="file" accept="image/*" onChange={handleLogoUpload} /></label>
            )}

            {formData.featuredImage?.src ? (
              <div className="studio-asset-card studio-asset-card-wide">
                <Image src={formData.featuredImage.src} alt={formData.featuredImage.alt || "Featured project image"} fill sizes="420px" className="object-cover" />
                <div className="studio-asset-card-label">Featured image</div>
                <div className="studio-asset-card-actions">
                  <label className="studio-asset-action"><Upload size={15} /> Replace<input type="file" accept="image/*" onChange={handleFeaturedImageUpload} /></label>
                  <button type="button" className="studio-asset-action is-danger" onClick={() => setPendingRemoval({ kind: "featuredImage", label: "featured image" })}><Trash2 size={15} /> Delete</button>
                </div>
                <details className="studio-asset-details">
                  <summary>Alt text and large-view caption</summary>
                  <label><span>Alt text</span><input value={formData.featuredImage.alt ?? ""} onChange={(event) => updateFeaturedImage("alt", event.target.value)} className="studio-form-input" /></label>
                  <label><span>Caption</span><input value={formData.featuredImage.caption ?? ""} onChange={(event) => updateFeaturedImage("caption", event.target.value)} className="studio-form-input" /></label>
                </details>
              </div>
            ) : (
              <label className="studio-asset-upload-tile studio-asset-upload-tile-wide"><ImagePlus size={20} /><strong>Add featured image</strong><span>The main visual shown on the project</span><input type="file" accept="image/*" onChange={handleFeaturedImageUpload} /></label>
            )}

            {formData.demoVideoUrl ? (
              <div className="studio-asset-card studio-asset-card-wide">
                <video src={formData.demoVideoUrl} controls muted playsInline preload="metadata" className="h-full w-full object-cover" />
                <div className="studio-asset-card-label">Demo video</div>
                <div className="studio-asset-card-actions">
                  <label className="studio-asset-action"><Upload size={15} /> Replace<input type="file" accept="video/mp4,video/webm" onChange={(event) => handleFileUpload(event, "demoVideo")} /></label>
                  <button type="button" className="studio-asset-action is-danger" onClick={() => setPendingRemoval({ kind: "demoVideo", label: "demo video" })}><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            ) : (
              <label className="studio-asset-upload-tile"><Video size={20} /><strong>Add demo video</strong><span>MP4 or WEBM · muted loop</span><input type="file" accept="video/mp4,video/webm" onChange={(event) => handleFileUpload(event, "demoVideo")} /></label>
            )}

            {formData.projectPdfUrl ? (
              <div className="studio-asset-card studio-pdf-card">
                <FileText size={30} />
                <strong>Project PDF</strong>
                <a href={formData.projectPdfUrl} target="_blank" rel="noreferrer">Open document</a>
                <div className="studio-asset-card-actions">
                  <label className="studio-asset-action"><Upload size={15} /> Replace<input type="file" accept="application/pdf" onChange={(event) => handleFileUpload(event, "projectPdf")} /></label>
                  <button type="button" className="studio-asset-action is-danger" onClick={() => setPendingRemoval({ kind: "projectPdf", label: "project PDF" })}><Trash2 size={15} /> Delete</button>
                </div>
              </div>
            ) : (
              <label className="studio-asset-upload-tile"><FileText size={20} /><strong>Add project PDF</strong><span>Case study or supporting document</span><input type="file" accept="application/pdf" onChange={(event) => handleFileUpload(event, "projectPdf")} /></label>
            )}

            {formData.gallery.map((image, index) => (
              <div key={image._key ?? index} className="studio-asset-card">
                {image.src ? <Image src={image.src} alt={image.alt || `Gallery image ${index + 1}`} fill sizes="240px" className="object-cover" /> : <ImagePlus size={20} />}
                <div className="studio-asset-card-label">Gallery image {index + 1}</div>
                <div className="studio-asset-card-actions">
                  <button type="button" className="studio-asset-action" onClick={() => moveGalleryImage(index, -1)} disabled={index === 0} aria-label={`Move gallery image ${index + 1} earlier`} title="Move earlier"><MoveLeft size={15} /> Earlier</button>
                  <button type="button" className="studio-asset-action" onClick={() => moveGalleryImage(index, 1)} disabled={index === formData.gallery.length - 1} aria-label={`Move gallery image ${index + 1} later`} title="Move later"><MoveRight size={15} /> Later</button>
                  <button type="button" className="studio-asset-action is-danger" onClick={() => setPendingRemoval({ kind: "gallery", index, label: `gallery image ${index + 1}` })}><Trash2 size={15} /> Delete</button>
                </div>
                <details className="studio-asset-details">
                  <summary>Alt text and large-view caption</summary>
                  <label><span>Alt text</span><input value={image.alt ?? ""} onChange={(event) => updateGalleryImage(index, "alt", event.target.value)} className="studio-form-input" /></label>
                  <label><span>Caption</span><input value={image.caption ?? ""} onChange={(event) => updateGalleryImage(index, "caption", event.target.value)} className="studio-form-input" /></label>
                </details>
              </div>
            ))}

            <label className="studio-asset-upload-tile"><ImagePlus size={20} /><strong>Add gallery images</strong><span>Supporting project screens</span><input type="file" accept="image/*" multiple onChange={handleGalleryUpload} /></label>
          </div>

          {pendingRemoval ? (
            <div className="studio-media-confirm" role="alert">
              <span>Remove {pendingRemoval.label}? This will be applied when you save the project.</span>
              <div><button type="button" className="studio-btn-cancel" onClick={() => setPendingRemoval(null)}>Cancel</button><button type="button" className="studio-btn-delete" onClick={confirmRemoval}>Remove</button></div>
            </div>
          ) : null}
        </section>
        ) : null}

        {activeStep === 4 ? (
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Review & Publish</h3>
          <div className="studio-project-review">
            <div>
              <span>Project</span>
              <strong>{formData.title || "Untitled project"}</strong>
              <p>{[formData.type, formData.association].filter(Boolean).join(" / ") || "Project details not added yet"}</p>
            </div>
            <div>
              <span>Media</span>
              <p>{[formData.featuredImage?.image && "Image", formData.demoVideo && "Video", formData.projectPdf && "PDF"].filter(Boolean).join(" · ") || "No media added"}</p>
            </div>
            <div>
              <span>Status</span>
              <p>{formData.status}</p>
            </div>
          </div>
          <div className="studio-form-grid">
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
              <input value={formData.canonicalPath} onChange={(event) => updateField("canonicalPath", event.target.value)} className="studio-form-input" placeholder="/works/project-slug" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">SEO Description</span>
              <textarea value={formData.seoDescription} onChange={(event) => updateField("seoDescription", event.target.value)} className="studio-form-textarea" rows={3} />
            </label>
          </div>
        </section>
        ) : null}

        {error ? <p className="studio-error">{error}</p> : null}

        <div className="studio-form-actions">
          <button type="button" onClick={onComplete} className="studio-btn-cancel">
            Cancel
          </button>
          {activeStep > 0 ? (
            <button type="button" onClick={() => setActiveStep((step) => step - 1)} className="studio-btn-secondary">
              <ArrowLeft size={16} />
              Back
            </button>
          ) : null}
          {activeStep < formSteps.length - 1 ? (
            <button type="button" onClick={() => setActiveStep((step) => step + 1)} className="studio-btn-primary">
              Next
              <ArrowRight size={16} />
            </button>
          ) : (
            <button type="submit" disabled={saving || uploading} className="studio-btn-primary">
              <Save size={16} />
              {saving ? "Saving..." : "Save Project"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

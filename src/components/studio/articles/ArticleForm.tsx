"use client";

import Image from "next/image";
import { ImagePlus, Save, Trash2, Upload, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { useClient } from "sanity";

import RichContentEditor from "../shared/RichContentEditor";
import {
  cleanOptionalFields,
  joinLines,
  normalizeRichContent,
  portableBlocksToText,
  slugify,
  splitLines,
  textToPortableBlocks,
  type RichContentBlock,
  type SlugValue,
} from "../shared/studio-utils";

const articleStatuses = ["published", "draft", "hidden"] as const;

type ArticleStatus = (typeof articleStatuses)[number];

type ImageWithMetaDocument = {
  _key?: string;
  _type?: "imageWithMeta";
  image?: unknown;
  alt?: string;
  caption?: string;
  src?: string;
};

type ContentOption = {
  _id: string;
  title?: string;
  status?: ArticleStatus;
};

type ContentReference = {
  _key?: string;
  _type?: "reference";
  _ref?: string;
};

export type ArticleDocument = {
  _id?: string;
  _type?: "article";
  status?: ArticleStatus;
  title?: string;
  slug?: SlugValue;
  category?: string;
  excerpt?: string;
  publishedAt?: string;
  updatedAt?: string;
  tags?: string[];
  body?: RichContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalPath?: string;
  featuredOnHomepage?: boolean;
  homepageOrder?: number;
  featuredOnArchive?: boolean;
  archiveOrder?: number;
  coverImage?: ImageWithMetaDocument;
  relatedProjects?: ContentReference[];
  relatedArticles?: ContentReference[];
};

type ArticleFormState = {
  status: ArticleStatus;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  publishedAt: string;
  updatedAt: string;
  tags: string;
  body: RichContentBlock[];
  seoTitle: string;
  seoDescription: string;
  canonicalPath: string;
  featuredOnHomepage: boolean;
  homepageOrder: number;
  featuredOnArchive: boolean;
  archiveOrder: number;
  coverImage?: ImageWithMetaDocument;
  relatedProjectIds: string[];
  relatedArticleIds: string[];
};

type ArticleFormProps = {
  article?: ArticleDocument | null;
  onComplete: () => void;
};

function today() {
  return new Date().toISOString().slice(0, 10);
}

function normalizeArticleBody(body?: RichContentBlock[]) {
  return body?.length ? body : textToPortableBlocks("");
}

function keyFromText(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function refsFromIds(ids: string[]) {
  return ids.map((id) => ({
    _key: `reference-${id.replace(/[^a-zA-Z0-9]/g, "-")}`,
    _type: "reference" as const,
    _ref: id,
  }));
}

function imageForSave(image?: ImageWithMetaDocument, altFallback = "Article cover image") {
  if (!image?.image) {
    return undefined;
  }

  const savedImage = { ...image };
  delete savedImage.src;
  return { ...savedImage, alt: image.alt?.trim() || altFallback };
}

function contentForSave(blocks: RichContentBlock[], altFallback: string) {
  return normalizeRichContent(blocks)?.map((block) => {
    if (block._type !== "imageWithMeta") {
      return block;
    }

    const savedImage = { ...block };
    delete savedImage.src;
    return { ...savedImage, alt: block.alt?.trim() || altFallback };
  });
}

function articleToFormState(article?: ArticleDocument | null): ArticleFormState {
  return {
    status: article ? article.status ?? "published" : "draft",
    title: article?.title ?? "",
    slug: article?.slug?.current ?? "",
    category: article?.category ?? "",
    excerpt: article?.excerpt ?? "",
    publishedAt: article?.publishedAt ?? today(),
    updatedAt: article?.updatedAt ?? "",
    tags: joinLines(article?.tags),
    body: normalizeArticleBody(article?.body),
    seoTitle: article?.seoTitle ?? "",
    seoDescription: article?.seoDescription ?? "",
    canonicalPath: article?.canonicalPath ?? "",
    featuredOnHomepage: article?.featuredOnHomepage ?? false,
    homepageOrder: article?.homepageOrder ?? 99,
    featuredOnArchive: article?.featuredOnArchive ?? false,
    archiveOrder: article?.archiveOrder ?? 99,
    coverImage: article?.coverImage,
    relatedProjectIds: article?.relatedProjects?.map((project) => project._ref).filter((id): id is string => Boolean(id)) ?? [],
    relatedArticleIds: article?.relatedArticles?.map((relatedArticle) => relatedArticle._ref).filter((id): id is string => Boolean(id)) ?? [],
  };
}

export default function ArticleForm({ article, onComplete }: ArticleFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<ArticleFormState>(() => articleToFormState(article));
  const [projects, setProjects] = useState<ContentOption[]>([]);
  const [relatedArticles, setRelatedArticles] = useState<ContentOption[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(article?._id);
  const selectedProjectIds = useMemo(() => new Set(formData.relatedProjectIds), [formData.relatedProjectIds]);
  const selectedArticleIds = useMemo(() => new Set(formData.relatedArticleIds), [formData.relatedArticleIds]);

  const fetchRelatedContent = useCallback(async () => {
    try {
      const [projectOptions, articleOptions] = await Promise.all([
        client.fetch<ContentOption[]>(`*[_type == "project"] | order(title asc) {_id, title}`),
        client.fetch<ContentOption[]>(`*[_type == "article"] | order(publishedAt desc, title asc) {_id, title, status}`),
      ]);

      setProjects(projectOptions);
      setRelatedArticles(articleOptions.filter((item) => item._id !== article?._id));
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Failed to load related content.");
    }
  }, [article?._id, client]);

  useEffect(() => {
    fetchRelatedContent();
  }, [fetchRelatedContent]);

  function updateField<Key extends keyof ArticleFormState>(field: Key, value: ArticleFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function updateTitle(title: string) {
    setFormData((previous) => ({
      ...previous,
      title,
      slug: isEditing && previous.slug ? previous.slug : slugify(title),
    }));
  }

  function toggleRelatedContent(field: "relatedProjectIds" | "relatedArticleIds", id: string) {
    setFormData((previous) => {
      const ids = previous[field];

      if (ids.includes(id)) {
        return { ...previous, [field]: ids.filter((item) => item !== id) };
      }

      if (ids.length >= 3) {
        setError("Choose up to three related items.");
        return previous;
      }

      setError("");
      return { ...previous, [field]: [...ids, id] };
    });
  }

  async function handleCoverImageUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    try {
      const asset = await client.assets.upload("image", file, { filename: file.name });
      updateField("coverImage", {
        _key: keyFromText("cover"),
        _type: "imageWithMeta",
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: asset._id,
          },
        },
        alt: formData.title || file.name,
        caption: "",
        src: asset.url,
      });
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Failed to upload cover image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function updateCoverImage(field: "alt" | "caption", value: string) {
    setFormData((previous) => ({
      ...previous,
      coverImage: previous.coverImage ? { ...previous.coverImage, [field]: value } : previous.coverImage,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const title = formData.title.trim();
    const slug = slugify(formData.slug || formData.title);

    if (!title || !slug) {
      setError("Article title and slug are required.");
      return;
    }

    setSaving(true);

    const payload = {
      _type: "article" as const,
      status: formData.status,
      title,
      slug: { _type: "slug", current: slug },
      category: formData.category.trim(),
      excerpt: formData.excerpt.trim(),
      publishedAt: formData.publishedAt,
      updatedAt: formData.updatedAt,
      tags: splitLines(formData.tags),
      body: contentForSave(formData.body, title),
      seoTitle: formData.seoTitle.trim(),
      seoDescription: formData.seoDescription.trim(),
      canonicalPath: formData.canonicalPath.trim(),
      featuredOnHomepage: formData.featuredOnHomepage,
      homepageOrder: formData.homepageOrder,
      featuredOnArchive: formData.featuredOnArchive,
      archiveOrder: formData.archiveOrder,
      coverImage: imageForSave(formData.coverImage, title),
      relatedProjects: formData.relatedProjectIds.length ? refsFromIds(formData.relatedProjectIds) : undefined,
      relatedArticles: formData.relatedArticleIds.length ? refsFromIds(formData.relatedArticleIds) : undefined,
    };

    const unsetFields = [
      "category",
      "excerpt",
      "publishedAt",
      "updatedAt",
      "seoTitle",
      "seoDescription",
      "canonicalPath",
      ...(!payload.coverImage ? ["coverImage"] : []),
      ...(!payload.relatedProjects ? ["relatedProjects"] : []),
      ...(!payload.relatedArticles ? ["relatedArticles"] : []),
    ].filter(
      (field) => !String(payload[field as keyof typeof payload] ?? "").trim(),
    );

    try {
      if (article?._id) {
        let patch = client.patch(article._id).set(cleanOptionalFields(payload));
        if (unsetFields.length) {
          patch = patch.unset(unsetFields);
        }
        await patch.commit();
      } else {
        await client.create(cleanOptionalFields(payload));
      }

      onComplete();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-form-container">
      <div className="studio-form-header">
        <div>
          <p className="studio-eyebrow">Articles</p>
          <h2 className="studio-form-title">{isEditing ? `Edit ${article?.title}` : "Add New Article"}</h2>
        </div>
        <button type="button" onClick={onComplete} className="studio-icon-button" aria-label="Close article form">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="studio-form-stack">
        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Article Basics</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">Status</span>
              <select value={formData.status} onChange={(event) => updateField("status", event.target.value as ArticleStatus)} className="studio-form-select">
                {articleStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Title *</span>
              <input required value={formData.title} onChange={(event) => updateTitle(event.target.value)} className="studio-form-input" placeholder="Who is Yumesh Ban?" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Slug *</span>
              <input required value={formData.slug} onChange={(event) => updateField("slug", slugify(event.target.value))} className="studio-form-input studio-form-input-bg" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Category</span>
              <input value={formData.category} onChange={(event) => updateField("category", event.target.value)} className="studio-form-input" placeholder="Career, Tutorial, Case Study" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Published Date</span>
              <input type="date" value={formData.publishedAt} onChange={(event) => updateField("publishedAt", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Updated Date</span>
              <input type="date" value={formData.updatedAt} onChange={(event) => updateField("updatedAt", event.target.value)} className="studio-form-input" />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Excerpt</span>
              <textarea value={formData.excerpt} onChange={(event) => updateField("excerpt", event.target.value)} className="studio-form-textarea" rows={3} />
            </label>

            <label className="studio-field studio-field-wide">
              <span className="studio-form-label">Tags</span>
              <input value={formData.tags} onChange={(event) => updateField("tags", event.target.value)} className="studio-form-input" placeholder="Yumesh Ban, Next.js, Portfolio" />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <RichContentEditor label="Article Content" value={formData.body} onChange={(value) => updateField("body", value)} allowImages allowTakeaways />
          {!formData.body.length && portableBlocksToText(formData.body) ? null : null}
        </section>

        <section className="studio-form-section">
          <div className="studio-form-section-header">
            <h3 className="studio-form-section-title">Cover image</h3>
            <span className="studio-help-inline">{uploading ? "Uploading..." : "Optional hero for the article page"}</span>
          </div>

          {formData.coverImage?.src ? (
            <div className="studio-asset-card studio-asset-card-wide">
              <Image src={formData.coverImage.src} alt={formData.coverImage.alt || "Article cover image"} fill sizes="560px" className="object-cover" />
              <div className="studio-asset-card-label">Article cover image</div>
              <div className="studio-asset-card-actions">
                <label className="studio-asset-action">
                  <Upload size={15} />
                  Replace
                  <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
                </label>
                <button type="button" className="studio-asset-action is-danger" onClick={() => updateField("coverImage", undefined)}>
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
              <details className="studio-asset-details" open>
                <summary>Edit image details</summary>
                <label>
                  <span>Alt text</span>
                  <input value={formData.coverImage.alt ?? ""} onChange={(event) => updateCoverImage("alt", event.target.value)} className="studio-form-input" />
                </label>
                <label>
                  <span>Caption</span>
                  <input value={formData.coverImage.caption ?? ""} onChange={(event) => updateCoverImage("caption", event.target.value)} className="studio-form-input" />
                </label>
              </details>
            </div>
          ) : (
            <label className="studio-asset-upload-tile studio-asset-upload-tile-wide">
              <ImagePlus size={20} />
              <strong>Add cover image</strong>
              <span>The opening visual for this article</span>
              <input type="file" accept="image/*" onChange={handleCoverImageUpload} />
            </label>
          )}
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Related work</h3>
          <p className="studio-help-text">Choose up to three projects and three articles to show at the end of this article.</p>
          <div className="studio-form-grid">
            <fieldset className="studio-field studio-field-wide">
              <legend className="studio-form-label">Related projects ({formData.relatedProjectIds.length}/3)</legend>
              <div className="studio-tag-list">
                {projects.map((project) => {
                  const checked = selectedProjectIds.has(project._id);
                  return (
                    <label key={project._id} className="studio-checkbox-field">
                      <input type="checkbox" checked={checked} disabled={!checked && formData.relatedProjectIds.length >= 3} onChange={() => toggleRelatedContent("relatedProjectIds", project._id)} />
                      <span>{project.title || "Untitled project"}</span>
                    </label>
                  );
                })}
                {!projects.length ? <span className="studio-help-text">No projects available yet.</span> : null}
              </div>
            </fieldset>

            <fieldset className="studio-field studio-field-wide">
              <legend className="studio-form-label">Related articles ({formData.relatedArticleIds.length}/3)</legend>
              <div className="studio-tag-list">
                {relatedArticles.map((relatedArticle) => {
                  const checked = selectedArticleIds.has(relatedArticle._id);
                  return (
                    <label key={relatedArticle._id} className="studio-checkbox-field">
                      <input type="checkbox" checked={checked} disabled={!checked && formData.relatedArticleIds.length >= 3} onChange={() => toggleRelatedContent("relatedArticleIds", relatedArticle._id)} />
                      <span>{relatedArticle.title || "Untitled article"}</span>
                    </label>
                  );
                })}
                {!relatedArticles.length ? <span className="studio-help-text">No other articles available yet.</span> : null}
              </div>
            </fieldset>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Homepage feature</h3>
          <div className="studio-form-grid">
            <label className="studio-checkbox-field">
              <input type="checkbox" checked={formData.featuredOnHomepage} onChange={(event) => updateField("featuredOnHomepage", event.target.checked)} />
              <span>Show this article in Notes from building</span>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Homepage order</span>
              <input type="number" min="1" value={formData.homepageOrder} onChange={(event) => updateField("homepageOrder", Number(event.target.value) || 99)} className="studio-form-input" disabled={!formData.featuredOnHomepage} />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">Article archive</h3>
          <div className="studio-form-grid">
            <label className="studio-checkbox-field">
              <input type="checkbox" checked={formData.featuredOnArchive} onChange={(event) => updateField("featuredOnArchive", event.target.checked)} />
              <span>Use as the lead story in the article archive</span>
            </label>

            <label className="studio-field">
              <span className="studio-form-label">Archive order</span>
              <input type="number" min="1" value={formData.archiveOrder} onChange={(event) => updateField("archiveOrder", Number(event.target.value) || 99)} className="studio-form-input" />
            </label>
          </div>
        </section>

        <section className="studio-form-section">
          <h3 className="studio-form-section-title">SEO</h3>
          <div className="studio-form-grid">
            <label className="studio-field">
              <span className="studio-form-label">SEO Title</span>
              <input value={formData.seoTitle} onChange={(event) => updateField("seoTitle", event.target.value)} className="studio-form-input" />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Canonical Path</span>
              <input value={formData.canonicalPath} onChange={(event) => updateField("canonicalPath", event.target.value)} className="studio-form-input" placeholder="/articles/article-slug" />
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
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
}

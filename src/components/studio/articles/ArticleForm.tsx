"use client";

import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
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
  };
}

export default function ArticleForm({ article, onComplete }: ArticleFormProps) {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [formData, setFormData] = useState<ArticleFormState>(() => articleToFormState(article));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEditing = Boolean(article?._id);

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
      body: normalizeRichContent(formData.body),
      seoTitle: formData.seoTitle.trim(),
      seoDescription: formData.seoDescription.trim(),
      canonicalPath: formData.canonicalPath.trim(),
      featuredOnHomepage: formData.featuredOnHomepage,
      homepageOrder: formData.homepageOrder,
    };

    const unsetFields = ["category", "excerpt", "publishedAt", "updatedAt", "seoTitle", "seoDescription", "canonicalPath"].filter(
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
          <RichContentEditor label="Article Content" value={formData.body} onChange={(value) => updateField("body", value)} />
          {!formData.body.length && portableBlocksToText(formData.body) ? null : null}
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
          <button type="submit" disabled={saving} className="studio-btn-primary">
            <Save size={16} />
            {saving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </form>
    </div>
  );
}

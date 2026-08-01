"use client";

import { CalendarDays, EyeOff, FileText, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage, portableBlocksToText } from "../shared/studio-utils";

import ArticleForm, { type ArticleDocument } from "./ArticleForm";

const articleQuery = `*[_type == "article"] | order(publishedAt desc, _createdAt desc) {
  _id,
  _type,
  status,
  title,
  slug,
  category,
  excerpt,
  publishedAt,
  updatedAt,
  tags,
  body,
  seoTitle,
  seoDescription,
  canonicalPath,
  featuredOnHomepage,
  homepageOrder
}`;

export default function ArticleDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [articles, setArticles] = useState<ArticleDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingArticle, setEditingArticle] = useState<ArticleDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTag, setFilterTag] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<ArticleDocument[]>(articleQuery);
      setArticles(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const tags = useMemo(() => Array.from(new Set(articles.flatMap((article) => article.tags ?? []))).sort(), [articles]);

  const filteredArticles = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return articles.filter((article) => {
      const searchable = [article.title, article.excerpt, article.tags?.join(" "), portableBlocksToText(article.body)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesTag = filterTag === "all" || article.tags?.includes(filterTag);
      const matchesStatus = filterStatus === "all" || (article.status ?? "published") === filterStatus;

      return matchesSearch && matchesTag && matchesStatus;
    });
  }, [articles, filterStatus, filterTag, searchTerm]);

  function handleAddNew() {
    setEditingArticle(null);
    setView("form");
  }

  function handleEdit(article: ArticleDocument) {
    setEditingArticle(article);
    setView("form");
  }

  async function handleDelete(article: ArticleDocument) {
    if (!article._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${article.title}"? This removes it from Sanity.`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(article._id);
      setArticles((currentArticles) => currentArticles.filter((item) => item._id !== article._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingArticle(null);
    fetchArticles();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <ArticleForm article={editingArticle} onComplete={handleFormComplete} />
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Personal Brand SEO</p>
          <h1 className="studio-header-title">Article Overview</h1>
          <p className="studio-header-subtitle">Publish search-friendly writing for your portfolio and Google identity.</p>
        </div>

        <div className="studio-filters">
          <div className="studio-search-wrapper">
            <Search className="studio-search-icon" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="studio-search-input"
              placeholder="Search articles..."
            />
          </div>

          <select value={filterTag} onChange={(event) => setFilterTag(event.target.value)} className="studio-select">
            <option value="all">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="studio-select">
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Total Articles</p>
          <p className="studio-stat-value studio-stat-blue">{articles.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Published</p>
          <p className="studio-stat-value studio-stat-green">{articles.filter((article) => (article.status ?? "published") === "published").length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">SEO Titles</p>
          <p className="studio-stat-value studio-stat-orange">{articles.filter((article) => Boolean(article.seoTitle)).length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Homepage Features</p>
          <p className="studio-stat-value studio-stat-pink">{articles.filter((article) => article.featuredOnHomepage).length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading articles...</div>
      ) : filteredArticles.length === 0 ? (
        <div className="studio-empty">No articles found.</div>
      ) : (
        <div className="studio-grid studio-grid-3">
          {filteredArticles.map((article) => (
            <article key={article._id} className="studio-card">
              <div className="studio-card-content">
                <div className="studio-card-topline">
                  <span className="studio-badge studio-badge-info">
                    <FileText size={12} />
                    Article
                  </span>
                  <span className="studio-badge studio-badge-neutral">
                    <CalendarDays size={12} />
                    {article.publishedAt ?? "Draft"}
                  </span>
                  {article.featuredOnHomepage ? <span className="studio-badge studio-badge-info">Homepage #{article.homepageOrder ?? 99}</span> : null}
                  {article.status === "hidden" ? (
                    <span className="studio-badge studio-badge-neutral">
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  ) : null}
                </div>

                <h2 className="studio-card-title" title={article.title}>
                  {article.title}
                </h2>
                <p className="studio-card-meta">{article.slug?.current ? `/articles/${article.slug.current}` : "No slug"}</p>
                <p className="studio-card-description">{article.excerpt || portableBlocksToText(article.body) || "No article content added yet."}</p>

                {article.tags?.length ? (
                  <div className="studio-tag-list">
                    {article.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="studio-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="studio-actions">
                  <button type="button" onClick={() => handleEdit(article)} className="studio-btn-edit">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(article)}
                    className="studio-btn-delete"
                    title="Delete article"
                    aria-label={`Delete ${article.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <button type="button" onClick={handleAddNew} className="studio-fab">
        <Plus size={20} />
        <span className="studio-fab-text">Add Article</span>
      </button>
    </div>
  );
}

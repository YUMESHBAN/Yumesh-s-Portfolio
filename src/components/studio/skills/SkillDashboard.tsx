"use client";

import { EyeOff, Pencil, Plus, Search, Star, Tag, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

import SkillForm, { type SkillDocument } from "./SkillForm";

const skillQuery = `*[_type == "skill"] | order(order asc, name asc) {
  _id,
  _type,
  status,
  name,
  iconName,
  aliases,
  category,
  level,
  featured,
  order
}`;

export default function SkillDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [skills, setSkills] = useState<SkillDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingSkill, setEditingSkill] = useState<SkillDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<SkillDocument[]>(skillQuery);
      setSkills(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const categories = useMemo(
    () => Array.from(new Set(skills.map((skill) => skill.category).filter((category): category is string => Boolean(category)))).sort(),
    [skills],
  );

  const filteredSkills = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return skills.filter((skill) => {
      const searchable = [skill.name, skill.iconName, skill.category, skill.level, skill.aliases?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesCategory = filterCategory === "all" || skill.category === filterCategory;
      const matchesStatus = filterStatus === "all" || (skill.status ?? "published") === filterStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [filterCategory, filterStatus, searchTerm, skills]);

  function handleAddNew() {
    setEditingSkill(null);
    setView("form");
  }

  function handleEdit(skill: SkillDocument) {
    setEditingSkill(skill);
    setView("form");
  }

  async function handleDelete(skill: SkillDocument) {
    if (!skill._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${skill.name}"? This removes it from Sanity.`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(skill._id);
      setSkills((currentSkills) => currentSkills.filter((item) => item._id !== skill._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingSkill(null);
    fetchSkills();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <SkillForm skill={editingSkill} categorySuggestions={categories} onComplete={handleFormComplete} />
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Reusable Skill Library</p>
          <h1 className="studio-header-title">Skills Overview</h1>
          <p className="studio-header-subtitle">Create reusable skills that can be connected to projects, experience, and certifications.</p>
        </div>

        <div className="studio-filters">
          <div className="studio-search-wrapper">
            <Search className="studio-search-icon" size={16} />
            <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} className="studio-search-input" placeholder="Search skills..." />
          </div>

          <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} className="studio-select">
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
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
          <p className="studio-stat-label">Total Skills</p>
          <p className="studio-stat-value studio-stat-blue">{skills.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Featured</p>
          <p className="studio-stat-value studio-stat-green">{skills.filter((skill) => skill.featured).length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Categories</p>
          <p className="studio-stat-value studio-stat-orange">{categories.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Hidden</p>
          <p className="studio-stat-value studio-stat-pink">{skills.filter((skill) => skill.status === "hidden").length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading skills...</div>
      ) : filteredSkills.length === 0 ? (
        <div className="studio-empty">No skills found.</div>
      ) : (
        <div className="studio-grid studio-grid-3">
          {filteredSkills.map((skill) => (
            <article key={skill._id} className="studio-card">
              <div className="studio-card-content">
                <div className="studio-card-topline">
                  <span className="studio-badge studio-badge-info">
                    <Tag size={12} />
                    {skill.category ?? "Skill"}
                  </span>
                  {skill.featured ? (
                    <span className="studio-badge studio-badge-featured">
                      <Star size={12} />
                      Featured
                    </span>
                  ) : null}
                  {skill.status === "hidden" ? (
                    <span className="studio-badge studio-badge-neutral">
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  ) : null}
                </div>

                <h2 className="studio-card-title">{skill.name}</h2>
                <p className="studio-card-meta">{[skill.level, skill.iconName].filter(Boolean).join(" / ") || "No level added"}</p>

                {skill.aliases?.length ? (
                  <div className="studio-tag-list">
                    {skill.aliases.slice(0, 4).map((alias) => (
                      <span key={alias} className="studio-tag">
                        {alias}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="studio-card-footer">
                  <span>Order {skill.order ?? 99}</span>
                  <span>{skill.status ?? "published"}</span>
                </div>

                <div className="studio-actions">
                  <button type="button" onClick={() => handleEdit(skill)} className="studio-btn-edit">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button type="button" onClick={() => handleDelete(skill)} className="studio-btn-delete" aria-label={`Delete ${skill.name}`}>
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
        <span className="studio-fab-text">Add Skill</span>
      </button>
    </div>
  );
}

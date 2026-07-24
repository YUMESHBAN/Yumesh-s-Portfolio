"use client";

import { Eye, EyeOff, GraduationCap, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

import EducationForm, { type EducationDocument } from "./EducationForm";

const educationQuery = `*[_type == "education"] | order(order asc, _createdAt desc) {
  _id,
  _type,
  status,
  institution,
  degree,
  level,
  dateRange,
  location,
  summary,
  gradeSystem,
  courses,
  honors,
  achievements,
  resultEntries[]{
    _key,
    _type,
    label,
    percentage,
    note,
    showOnWebsite
  },
  showResultStats,
  showResultEntries,
  showOnWebsite,
  order
}`;

function getVisibleResults(education: EducationDocument) {
  return (education.resultEntries ?? []).filter(
    (entry) => entry.showOnWebsite !== false && entry.label?.trim() && typeof entry.percentage === "number" && Number.isFinite(entry.percentage),
  );
}

function getEducationAverage(education: EducationDocument) {
  const results = getVisibleResults(education);

  if (!results.length) {
    return null;
  }

  const average = results.reduce((sum, entry) => sum + (entry.percentage ?? 0), 0) / results.length;

  return Number(average.toFixed(2));
}

function getEducationHighest(education: EducationDocument) {
  const results = getVisibleResults(education);

  if (!results.length) {
    return null;
  }

  return results.reduce((best, entry) => ((entry.percentage ?? 0) > (best.percentage ?? 0) ? entry : best), results[0]);
}

export default function EducationDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [educationItems, setEducationItems] = useState<EducationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingEducation, setEditingEducation] = useState<EducationDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [showHidden, setShowHidden] = useState(true);
  const [error, setError] = useState("");

  const fetchEducation = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<EducationDocument[]>(educationQuery);
      setEducationItems(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const levels = useMemo(
    () => Array.from(new Set(educationItems.map((item) => item.level).filter(Boolean))).sort(),
    [educationItems],
  );

  const filteredEducation = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return educationItems.filter((item) => {
      const searchable = [item.institution, item.degree, item.level, item.location, item.summary, item.achievements?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesLevel = filterLevel === "all" || item.level === filterLevel;
      const matchesVisibility = showHidden || item.showOnWebsite !== false;

      return matchesSearch && matchesLevel && matchesVisibility;
    });
  }, [educationItems, filterLevel, searchTerm, showHidden]);

  function handleAddNew() {
    setEditingEducation(null);
    setView("form");
  }

  function handleEdit(education: EducationDocument) {
    setEditingEducation(education);
    setView("form");
  }

  async function handleDelete(education: EducationDocument) {
    if (!education._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${education.institution}"? This removes it from Sanity.`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(education._id);
      setEducationItems((currentItems) => currentItems.filter((item) => item._id !== education._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingEducation(null);
    fetchEducation();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <EducationForm education={editingEducation} onComplete={handleFormComplete} />
      </div>
    );
  }

  const totalResultRows = educationItems.reduce((total, item) => total + (item.resultEntries?.length ?? 0), 0);
  const visibleEducationCount = educationItems.filter((item) => item.showOnWebsite !== false).length;

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Academic Results</p>
          <h1 className="studio-header-title">Education Overview</h1>
          <p className="studio-header-subtitle">Manage education stages, manual percentages, highest result, average result, and website visibility.</p>
        </div>

        <div className="studio-filters">
          <div className="studio-search-wrapper">
            <Search className="studio-search-icon" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="studio-search-input"
              placeholder="Search education..."
            />
          </div>

          <select value={filterLevel} onChange={(event) => setFilterLevel(event.target.value)} className="studio-select">
            <option value="all">All Levels</option>
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowHidden((current) => !current)}
            className={`studio-filter-btn ${showHidden ? "studio-filter-btn-active" : "studio-filter-btn-inactive"}`}
          >
            {showHidden ? <Eye size={15} /> : <EyeOff size={15} />}
            Hidden
          </button>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Education</p>
          <p className="studio-stat-value studio-stat-blue">{educationItems.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Shown</p>
          <p className="studio-stat-value studio-stat-green">{visibleEducationCount}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Result Rows</p>
          <p className="studio-stat-value studio-stat-orange">{totalResultRows}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Levels</p>
          <p className="studio-stat-value studio-stat-pink">{levels.length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading education...</div>
      ) : filteredEducation.length === 0 ? (
        <div className="studio-empty">No education entries found.</div>
      ) : (
        <div className="studio-grid">
          {filteredEducation.map((education) => {
            const highest = getEducationHighest(education);
            const average = getEducationAverage(education);
            const visibleResults = getVisibleResults(education);

            return (
              <article key={education._id} className="studio-card">
                <div className="studio-card-content">
                  <div className="studio-card-topline">
                    <span className="studio-badge studio-badge-info">
                      <GraduationCap size={12} />
                      {education.level ?? "Education"}
                    </span>
                    <span className={`studio-badge ${education.showOnWebsite === false ? "studio-badge-neutral" : "studio-badge-success"}`}>
                      {education.status === "hidden" || education.showOnWebsite === false ? "Hidden" : education.status ?? "Visible"}
                    </span>
                  </div>

                  <h2 className="studio-card-title" title={education.institution}>
                    {education.institution}
                  </h2>
                  <p className="studio-card-meta">{education.degree}</p>
                  <p className="studio-card-meta">{[education.dateRange, education.location].filter(Boolean).join(" / ") || "No timeline added"}</p>
                  <p className="studio-card-description">{education.summary || "No summary added yet."}</p>

                  <div className="studio-education-metrics">
                    <div>
                      <span>Rows</span>
                      <strong>{visibleResults.length}</strong>
                    </div>
                    <div>
                      <span>Highest</span>
                      <strong>{highest ? `${highest.percentage}%` : "-"}</strong>
                    </div>
                    <div>
                      <span>Average</span>
                      <strong>{average ? `${average}%` : "-"}</strong>
                    </div>
                  </div>

                  {highest ? <p className="studio-card-meta">Highest row: {highest.label}</p> : null}

                  <div className="studio-actions">
                    <button type="button" onClick={() => handleEdit(education)} className="studio-btn-edit">
                      <Pencil size={16} />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(education)}
                      className="studio-btn-delete"
                      title="Delete education"
                      aria-label={`Delete ${education.institution}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <button type="button" onClick={handleAddNew} className="studio-fab">
        <Plus size={20} />
        <span className="studio-fab-text">Add Education</span>
      </button>
    </div>
  );
}

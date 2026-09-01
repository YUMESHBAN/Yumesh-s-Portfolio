"use client";

import { ArrowDown, ArrowUp, BookOpenText, BriefcaseBusiness, EyeOff, MapPin, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

import ExperienceForm, { type ExperienceDocument } from "./ExperienceForm";
import AboutJourneyEditor from "./AboutJourneyEditor";

const experienceQuery = `*[_type == "experience"] | order(featuredOnHomepage desc, homepageOrder asc, current desc, startDate desc, _createdAt desc) {
  _id,
  _type,
  status,
  company,
  role,
  employmentType,
  location,
  workMode,
  companyUrl,
  startDate,
  endDate,
  dateRange,
  current,
  summary,
  responsibilities,
  achievements,
  featuredOnHomepage,
  homepageOrder,
  relatedSkills,
  skills
}`;

export default function ExperienceDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [experiences, setExperiences] = useState<ExperienceDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form" | "journey">("list");
  const [editingExperience, setEditingExperience] = useState<ExperienceDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const fetchExperiences = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<ExperienceDocument[]>(experienceQuery);
      setExperiences(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const filteredExperiences = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return experiences.filter((experience) => {
      const searchable = [
        experience.company,
        experience.role,
        experience.employmentType,
        experience.location,
        experience.workMode,
        experience.summary,
        experience.skills?.join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = filterStatus === "all" || (experience.status ?? "published") === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [experiences, filterStatus, searchTerm]);

  function handleAddNew() {
    setEditingExperience(null);
    setView("form");
  }

  function handleEdit(experience: ExperienceDocument) {
    setEditingExperience(experience);
    setView("form");
  }

  async function moveHomepageExperience(experience: ExperienceDocument, direction: -1 | 1) {
    const ordered = experiences.filter((item) => item.featuredOnHomepage).sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99));
    const index = ordered.findIndex((item) => item._id === experience._id);
    const neighbor = ordered[index + direction];
    if (!experience._id || !neighbor?._id) return;

    try {
      await client.transaction().patch(experience._id, { set: { homepageOrder: neighbor.homepageOrder ?? index + direction + 1 } }).patch(neighbor._id, { set: { homepageOrder: experience.homepageOrder ?? index + 1 } }).commit();
      fetchExperiences();
    } catch (moveError) {
      setError(getErrorMessage(moveError));
    }
  }

  async function handleDelete(experience: ExperienceDocument) {
    if (!experience._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${experience.role}" at "${experience.company}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(experience._id);
      setExperiences((currentExperiences) => currentExperiences.filter((item) => item._id !== experience._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingExperience(null);
    fetchExperiences();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <ExperienceForm experience={editingExperience} onComplete={handleFormComplete} />
      </div>
    );
  }

  if (view === "journey") {
    return (
      <div className="studio-page-container">
        <div className="studio-header">
          <div>
            <p className="studio-eyebrow">About Page Narrative</p>
            <h1 className="studio-header-title">About Journey</h1>
            <p className="studio-header-subtitle">Edit the section introduction and journey chapters shown on the About page.</p>
          </div>
          <div className="studio-header-actions">
            <button type="button" onClick={() => setView("list")} className="studio-btn-secondary">
              <BriefcaseBusiness size={16} />
              Experience list
            </button>
          </div>
        </div>
        <AboutJourneyEditor />
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Career Timeline</p>
          <h1 className="studio-header-title">Experience Overview</h1>
          <p className="studio-header-subtitle">Homepage entries are listed first in their website display order, followed by the remaining roles.</p>
        </div>

      </div>

      <div className="studio-experience-controls">
        <div className="studio-search-wrapper studio-experience-search-wrapper">
          <Search className="studio-search-icon" size={16} />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="studio-search-input"
            placeholder="Search by company, role, or skill..."
          />
        </div>
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="studio-select studio-experience-status-select" aria-label="Filter experiences by status">
          <option value="all">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="hidden">Hidden</option>
        </select>
        <button type="button" onClick={() => setView("journey")} className="studio-btn-secondary">
          <BookOpenText size={16} />
          About journey
        </button>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Total Roles</p>
          <p className="studio-stat-value studio-stat-blue">{experiences.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Current</p>
          <p className="studio-stat-value studio-stat-green">{experiences.filter((experience) => experience.current).length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Companies</p>
          <p className="studio-stat-value studio-stat-orange">{new Set(experiences.map((experience) => experience.company).filter(Boolean)).size}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Homepage Features</p>
          <p className="studio-stat-value studio-stat-pink">{experiences.filter((experience) => experience.featuredOnHomepage).length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading experience...</div>
      ) : filteredExperiences.length === 0 ? (
        <div className="studio-empty">No experience entries found.</div>
      ) : (
        <div className="studio-timeline-list">
          {filteredExperiences.map((experience) => (
            <article key={experience._id} className="studio-timeline-card">
              <div className="studio-timeline-marker" />
              <div className="studio-timeline-content">
                <div className="studio-card-topline">
                  <span className="studio-badge studio-badge-info">{experience.employmentType ?? "Role"}</span>
                  {experience.current ? <span className="studio-badge studio-badge-success">Current</span> : null}
                  {experience.featuredOnHomepage ? <span className="studio-badge studio-badge-info">Featured on homepage</span> : null}
                  {experience.status === "hidden" ? (
                    <span className="studio-badge studio-badge-neutral">
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  ) : null}
                </div>

                <h2 className="studio-card-title">{experience.role}</h2>
                <p className="studio-card-meta">
                  {experience.company} / {experience.dateRange || "No date range"}
                </p>
                <p className="studio-location-line">
                  <MapPin size={14} />
                  {[experience.location, experience.workMode].filter(Boolean).join(" / ") || "Location not added"}
                </p>
                <p className="studio-card-description">{experience.summary || "No summary added yet."}</p>

                {experience.skills?.length ? (
                  <div className="studio-tag-list">
                    {experience.skills.slice(0, 5).map((skill) => (
                      <span key={skill} className="studio-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="studio-actions">
                  {experience.featuredOnHomepage ? (
                    <>
                      <button type="button" onClick={() => moveHomepageExperience(experience, -1)} className="studio-icon-button" aria-label="Move homepage feature earlier" disabled={experiences.filter((item) => item.featuredOnHomepage).sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99)).findIndex((item) => item._id === experience._id) === 0}><ArrowUp size={16} /></button>
                      <button type="button" onClick={() => moveHomepageExperience(experience, 1)} className="studio-icon-button" aria-label="Move homepage feature later" disabled={experiences.filter((item) => item.featuredOnHomepage).sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99)).findIndex((item) => item._id === experience._id) === experiences.filter((item) => item.featuredOnHomepage).length - 1}><ArrowDown size={16} /></button>
                    </>
                  ) : null}
                  <button type="button" onClick={() => handleEdit(experience)} className="studio-btn-edit">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(experience)}
                    className="studio-btn-delete"
                    title="Delete experience"
                    aria-label={`Delete ${experience.role}`}
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
        <span className="studio-fab-text">Add Experience</span>
      </button>
    </div>
  );
}

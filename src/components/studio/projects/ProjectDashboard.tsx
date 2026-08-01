"use client";

import { ExternalLink, EyeOff, LayoutGrid, List, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

import ProjectForm, { type ProjectDocument } from "./ProjectForm";

type ProjectView = "grid" | "list";

const projectQuery = `*[_type == "project"] | order(featured desc, order asc, _createdAt desc) {
  _id,
  _type,
  status,
  title,
  slug,
  type,
  association,
  dateRange,
  projectYear,
  duration,
  teamSize,
  summary,
  role,
  audience,
  goals,
  responsibilities,
  problem,
  process,
  solution,
  results,
  metrics,
  relatedSkills,
  techStack,
  features,
  impact,
  repoUrl,
  liveUrl,
  demoVideo,
  "demoVideoUrl": demoVideo.asset->url,
  projectPdf,
  "projectPdfUrl": projectPdf.asset->url,
  logo{image, alt, caption, "src": image.asset->url},
  featuredImage{image, alt, caption, "src": image.asset->url},
  gallery[]{image, alt, caption, "src": image.asset->url},
  featured,
  order,
  seoTitle,
  seoDescription,
  canonicalPath
}`;

export default function ProjectDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [viewMode, setViewMode] = useState<ProjectView>("grid");
  const [editingProject, setEditingProject] = useState<ProjectDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<ProjectDocument[]>(projectQuery);
      setProjects(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const projectTypes = useMemo(
    () => Array.from(new Set(projects.map((project) => project.type).filter(Boolean))).sort(),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return projects.filter((project) => {
      const searchable = [project.title, project.summary, project.association, project.role, project.techStack?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesType = filterType === "all" || project.type === filterType;
      const matchesFeatured = !showFeaturedOnly || project.featured;

      return matchesSearch && matchesType && matchesFeatured;
    });
  }, [filterType, projects, searchTerm, showFeaturedOnly]);

  function handleAddNew() {
    setEditingProject(null);
    setView("form");
  }

  function handleEdit(project: ProjectDocument) {
    setEditingProject(project);
    setView("form");
  }

  async function handleDelete(project: ProjectDocument) {
    if (!project._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${project.title}"? This removes it from Sanity.`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(project._id);
      setProjects((currentProjects) => currentProjects.filter((item) => item._id !== project._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingProject(null);
    fetchProjects();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <ProjectForm project={editingProject} onComplete={handleFormComplete} />
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Portfolio CMS</p>
          <h1 className="studio-header-title">Project Overview</h1>
          <p className="studio-header-subtitle">Create, edit, feature, and order your public portfolio projects.</p>
        </div>

        <div className="studio-filters">
          <div className="studio-segmented-control" aria-label="Project view mode">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "is-active" : ""}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "is-active" : ""}
              aria-label="List view"
              title="List view"
            >
              <List size={16} />
            </button>
          </div>

          <div className="studio-search-wrapper">
            <Search className="studio-search-icon" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="studio-search-input"
              placeholder="Search projects..."
            />
          </div>

          <select value={filterType} onChange={(event) => setFilterType(event.target.value)} className="studio-select">
            <option value="all">All Types</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setShowFeaturedOnly((current) => !current)}
            className={`studio-filter-btn ${showFeaturedOnly ? "studio-filter-btn-active" : "studio-filter-btn-inactive"}`}
          >
            <Star size={15} />
            Featured
          </button>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Total Projects</p>
          <p className="studio-stat-value studio-stat-blue">{projects.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Featured</p>
          <p className="studio-stat-value studio-stat-green">{projects.filter((project) => project.featured).length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Company</p>
          <p className="studio-stat-value studio-stat-orange">{projects.filter((project) => project.type === "Company").length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Live Links</p>
          <p className="studio-stat-value studio-stat-pink">{projects.filter((project) => Boolean(project.liveUrl)).length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="studio-empty">No projects found.</div>
      ) : viewMode === "grid" ? (
        <div className="studio-grid">
          {filteredProjects.map((project) => (
            <article key={project._id} className="studio-card">
              <div className="studio-card-content">
                <div className="studio-card-topline">
                  <span className="studio-badge studio-badge-info">{project.type ?? "Project"}</span>
                  {project.featured ? (
                    <span className="studio-badge studio-badge-featured">
                      <Star size={12} />
                      Featured
                    </span>
                  ) : null}
                  {project.status === "hidden" ? (
                    <span className="studio-badge studio-badge-neutral">
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  ) : null}
                </div>

                <h2 className="studio-card-title" title={project.title}>
                  {project.title}
                </h2>
                <p className="studio-card-meta">
                  {[project.association, project.dateRange].filter(Boolean).join(" / ") || "No association added"}
                </p>
                <p className="studio-card-description">{project.summary || "No summary added yet."}</p>

                {project.techStack?.length ? (
                  <div className="studio-tag-list">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span key={tech} className="studio-tag">
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 ? <span className="studio-tag">+{project.techStack.length - 4}</span> : null}
                  </div>
                ) : null}

                <div className="studio-card-footer">
                  <span>Order {project.order ?? 99}</span>
                  <span>{project.status ?? "published"}</span>
                  {project.liveUrl ? (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="studio-inline-link">
                      <ExternalLink size={14} />
                      Live
                    </a>
                  ) : null}
                </div>

                <div className="studio-actions">
                  <button type="button" onClick={() => handleEdit(project)} className="studio-btn-edit">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project)}
                    className="studio-btn-delete"
                    title="Delete project"
                    aria-label={`Delete ${project.title}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="studio-table-wrapper">
          <table className="studio-table">
            <thead className="studio-table-head">
              <tr>
                <th className="studio-table-th">Project</th>
                <th className="studio-table-th">Type</th>
                <th className="studio-table-th">Association</th>
                <th className="studio-table-th">Featured</th>
                <th className="studio-table-th studio-table-actions">Actions</th>
              </tr>
            </thead>
            <tbody className="studio-table-body">
              {filteredProjects.map((project) => (
                <tr key={project._id} className="studio-table-row">
                  <td className="studio-table-td">
                    <strong>{project.title}</strong>
                    <span>{project.slug?.current ? `/${project.slug.current}` : "No slug"}</span>
                  </td>
                  <td className="studio-table-td">{project.type ?? "Project"}</td>
                  <td className="studio-table-td">{project.association ?? "-"}</td>
                  <td className="studio-table-td">{project.featured ? "Yes" : "No"}</td>
                  <td className="studio-table-td">
                    <div className="studio-row-actions">
                      <button type="button" onClick={() => handleEdit(project)} className="studio-icon-button" aria-label={`Edit ${project.title}`}>
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(project)}
                        className="studio-icon-button studio-icon-button-danger"
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" onClick={handleAddNew} className="studio-fab">
        <Plus size={20} />
        <span className="studio-fab-text">Add Project</span>
      </button>
    </div>
  );
}

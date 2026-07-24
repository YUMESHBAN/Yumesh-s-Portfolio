"use client";

import {
  Award,
  BriefcaseBusiness,
  Database,
  FileText,
  FolderKanban,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Pencil,
  Plus,
  Settings,
  Tag,
  UserRound,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ComponentType } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

type DocumentType =
  | "personProfile"
  | "siteSettings"
  | "project"
  | "article"
  | "experience"
  | "education"
  | "skill"
  | "certification";

type DocumentSummary = {
  _id: string;
  _type: DocumentType;
  title?: string;
  subtitle?: string;
  updatedAt?: string;
};

type DocumentsData = {
  profileCount: number;
  settingsCount: number;
  projectCount: number;
  articleCount: number;
  experienceCount: number;
  educationCount: number;
  skillCount: number;
  certificationCount: number;
  imageAssetCount: number;
  fileAssetCount: number;
  recent: DocumentSummary[];
  identity: DocumentSummary[];
  projects: DocumentSummary[];
  articles: DocumentSummary[];
  experiences: DocumentSummary[];
  education: DocumentSummary[];
  skills: DocumentSummary[];
  certifications: DocumentSummary[];
};

type DocumentSection = {
  title: string;
  description: string;
  count: number;
  docs: DocumentSummary[];
  icon: ComponentType<{ size?: number; className?: string }>;
  dashboardHref?: string;
  createType?: DocumentType;
  createLabel?: string;
};

const documentsQuery = `{
  "profileCount": count(*[_type == "personProfile"]),
  "settingsCount": count(*[_type == "siteSettings"]),
  "projectCount": count(*[_type == "project"]),
  "articleCount": count(*[_type == "article"]),
  "experienceCount": count(*[_type == "experience"]),
  "educationCount": count(*[_type == "education"]),
  "skillCount": count(*[_type == "skill"]),
  "certificationCount": count(*[_type == "certification"]),
  "imageAssetCount": count(*[_type == "sanity.imageAsset"]),
  "fileAssetCount": count(*[_type == "sanity.fileAsset"]),
  "recent": *[_type in ["personProfile", "siteSettings", "project", "article", "experience", "education", "skill", "certification"]] | order(_updatedAt desc)[0...8]{
    _id,
    _type,
    "title": coalesce(name, title, role, institution),
    "subtitle": coalesce(headline, siteUrl, association, company, degree, category, issuer, publishedAt),
    "updatedAt": _updatedAt
  },
  "identity": *[_type in ["personProfile", "siteSettings"]] | order(_type asc)[0...4]{
    _id,
    _type,
    "title": coalesce(name, title),
    "subtitle": coalesce(headline, siteUrl),
    "updatedAt": _updatedAt
  },
  "projects": *[_type == "project"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": title,
    "subtitle": coalesce(association, type),
    "updatedAt": _updatedAt
  },
  "articles": *[_type == "article"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": title,
    "subtitle": publishedAt,
    "updatedAt": _updatedAt
  },
  "experiences": *[_type == "experience"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": role,
    "subtitle": company,
    "updatedAt": _updatedAt
  },
  "education": *[_type == "education"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": institution,
    "subtitle": coalesce(level, degree),
    "updatedAt": _updatedAt
  },
  "skills": *[_type == "skill"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": name,
    "subtitle": category,
    "updatedAt": _updatedAt
  },
  "certifications": *[_type == "certification"] | order(_updatedAt desc)[0...4]{
    _id,
    _type,
    "title": title,
    "subtitle": issuer,
    "updatedAt": _updatedAt
  }
}`;

const emptyData: DocumentsData = {
  profileCount: 0,
  settingsCount: 0,
  projectCount: 0,
  articleCount: 0,
  experienceCount: 0,
  educationCount: 0,
  skillCount: 0,
  certificationCount: 0,
  imageAssetCount: 0,
  fileAssetCount: 0,
  recent: [],
  identity: [],
  projects: [],
  articles: [],
  experiences: [],
  education: [],
  skills: [],
  certifications: [],
};

function formatDate(value?: string) {
  if (!value) {
    return "Not updated yet";
  }

  return new Date(value).toLocaleDateString();
}

function editIntentUrl(document: DocumentSummary) {
  return `/studio/intent/edit/id=${encodeURIComponent(document._id)};type=${encodeURIComponent(document._type)}`;
}

const createTemplateByType: Partial<Record<DocumentType, string>> = {
  project: "project-from-dashboard",
  article: "article-from-dashboard",
  experience: "experience-from-dashboard",
  skill: "skill-from-dashboard",
  certification: "certification-from-dashboard",
};

function createIntentUrl(type: DocumentType) {
  return `/studio/intent/create/template=${encodeURIComponent(createTemplateByType[type] ?? type)};type=${encodeURIComponent(type)}`;
}

export default function DocumentsDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [data, setData] = useState<DocumentsData>(emptyData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const documentsData = await client.fetch<DocumentsData>(documentsQuery);
      setData({ ...emptyData, ...documentsData });
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  function navigateTo(path: string) {
    window.location.assign(path);
  }

  const sections = useMemo<DocumentSection[]>(
    () => [
      {
        title: "Identity and Site Settings",
        description: "Profile, bio, social links, domain, SEO defaults, CV file, and Open Graph image.",
        count: data.profileCount + data.settingsCount,
        docs: data.identity,
        icon: UserRound,
        dashboardHref: "/studio/profile",
      },
      {
        title: "Projects",
        description: "Portfolio case studies, tech stacks, featured order, links, impact, and screenshots.",
        count: data.projectCount,
        docs: data.projects,
        icon: FolderKanban,
        dashboardHref: "/studio/project",
        createType: "project",
        createLabel: "New Project",
      },
      {
        title: "Articles",
        description: "SEO-friendly writing, search intent pages, tags, excerpts, and article bodies.",
        count: data.articleCount,
        docs: data.articles,
        icon: FileText,
        dashboardHref: "/studio/article",
        createType: "article",
        createLabel: "New Article",
      },
      {
        title: "Experience",
        description: "Career timeline, roles, work mode, achievements, skills, and current roles.",
        count: data.experienceCount,
        docs: data.experiences,
        icon: BriefcaseBusiness,
        dashboardHref: "/studio/experience",
        createType: "experience",
        createLabel: "New Experience",
      },
      {
        title: "Education",
        description: "Primary, secondary, +2, bachelor, future education, result rows, and visibility.",
        count: data.educationCount,
        docs: data.education,
        icon: GraduationCap,
        dashboardHref: "/studio/education",
        createType: "education",
        createLabel: "New Education",
      },
      {
        title: "Skills",
        description: "Frontend, backend, CMS, database, tools, soft skills, levels, and display order.",
        count: data.skillCount,
        docs: data.skills,
        icon: Tag,
        dashboardHref: "/studio/skill",
        createType: "skill",
        createLabel: "New Skill",
      },
      {
        title: "Certifications",
        description: "Certificates, issuers, dates, descriptions, credential links, and credential files.",
        count: data.certificationCount,
        docs: data.certifications,
        icon: Award,
        dashboardHref: "/studio/certification",
        createType: "certification",
        createLabel: "New Certificate",
      },
      {
        title: "Media and Files",
        description: "Sanity image and file assets used for profile images, screenshots, CV, and credentials.",
        count: data.imageAssetCount + data.fileAssetCount,
        docs: [],
        icon: ImageIcon,
        dashboardHref: "/studio/desk",
      },
    ],
    [data],
  );

  const totalManagedDocuments =
    data.profileCount +
    data.settingsCount +
    data.projectCount +
    data.articleCount +
    data.experienceCount +
    data.educationCount +
    data.skillCount +
    data.certificationCount;

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Content Map</p>
          <h1 className="studio-header-title">Documents Dashboard</h1>
          <p className="studio-header-subtitle">
            Organized sections for every document type in the portfolio, with direct paths to custom dashboards and fallback advanced editing.
          </p>
        </div>

        <div className="studio-header-actions">
          <button type="button" onClick={() => navigateTo("/studio/desk")} className="studio-btn-secondary">
            <Database size={16} />
            Advanced Editor
          </button>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Documents</p>
          <p className="studio-stat-value studio-stat-blue">{totalManagedDocuments}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Sections</p>
          <p className="studio-stat-value studio-stat-green">{sections.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Media</p>
          <p className="studio-stat-value studio-stat-orange">{data.imageAssetCount + data.fileAssetCount}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Recent</p>
          <p className="studio-stat-value studio-stat-pink">{data.recent.length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading documents...</div>
      ) : (
        <>
          <div className="studio-documents-grid">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <section key={section.title} className="studio-document-section">
                  <div className="studio-document-section-header">
                    <div className="studio-document-section-icon">
                      <Icon size={22} />
                    </div>
                    <div>
                      <h2>{section.title}</h2>
                      <p>{section.description}</p>
                    </div>
                    <strong>{section.count}</strong>
                  </div>

                  <div className="studio-document-actions">
                    {section.dashboardHref ? (
                      <button type="button" onClick={() => navigateTo(section.dashboardHref!)} className="studio-btn-secondary">
                        <Layers size={16} />
                        Dashboard
                      </button>
                    ) : null}
                    {section.createType ? (
                      <button type="button" onClick={() => navigateTo(createIntentUrl(section.createType!))} className="studio-btn-secondary">
                        <Plus size={16} />
                        {section.createLabel ?? "Create"}
                      </button>
                    ) : null}
                  </div>

                  <div className="studio-document-list">
                    {section.docs.length ? (
                      section.docs.map((document) => (
                        <button
                          key={document._id}
                          type="button"
                          onClick={() => navigateTo(editIntentUrl(document))}
                          className="studio-document-row"
                        >
                          <span>
                            <strong>{document.title ?? "Untitled"}</strong>
                            <small>{document.subtitle ?? document._type}</small>
                          </span>
                          <span>
                            <small>{formatDate(document.updatedAt)}</small>
                            <Pencil size={15} />
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="studio-document-empty">No recent documents in this section.</div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>

          <section className="studio-panel studio-document-recent-panel">
            <div className="studio-panel-header">
              <h2>Recently Updated Across Studio</h2>
              <button type="button" onClick={() => navigateTo("/studio/desk")} className="studio-btn-secondary">
                <Settings size={16} />
                Advanced Editing
              </button>
            </div>
            <div className="studio-recent-list">
              {data.recent.length ? (
                data.recent.map((document) => (
                  <button
                    key={document._id}
                    type="button"
                    onClick={() => navigateTo(editIntentUrl(document))}
                    className="studio-recent-item studio-recent-button"
                  >
                    <span className="studio-badge studio-badge-neutral">{document._type}</span>
                    <div>
                      <strong>{document.title ?? "Untitled"}</strong>
                      <span>{document.subtitle ?? "No subtitle"}</span>
                    </div>
                    <time>{formatDate(document.updatedAt)}</time>
                  </button>
                ))
              ) : (
                <div className="studio-empty studio-empty-compact">No recent updates yet.</div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

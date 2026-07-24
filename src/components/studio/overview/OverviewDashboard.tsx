"use client";

import { ArrowRight, Award, BriefcaseBusiness, FileText, FolderKanban, GraduationCap, Search, Settings, Tag, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

type RecentDocument = {
  _id: string;
  _type: string;
  title?: string;
  subtitle?: string;
  updatedAt?: string;
};

type OverviewData = {
  profile?: {
    name?: string;
    headline?: string;
    finalSemesterPercentage?: string;
  } | null;
  settings?: {
    siteUrl?: string;
    title?: string;
  } | null;
  projectCount: number;
  featuredProjectCount: number;
  articleCount: number;
  experienceCount: number;
  educationCount: number;
  skillCount: number;
  certificationCount: number;
  recent: RecentDocument[];
};

const overviewQuery = `{
  "profile": *[_type == "personProfile"][0]{
    name,
    headline,
    finalSemesterPercentage
  },
  "settings": *[_type == "siteSettings"][0]{
    siteUrl,
    title
  },
  "projectCount": count(*[_type == "project"]),
  "featuredProjectCount": count(*[_type == "project" && featured == true]),
  "articleCount": count(*[_type == "article"]),
  "experienceCount": count(*[_type == "experience"]),
  "educationCount": count(*[_type == "education"]),
  "skillCount": count(*[_type == "skill"]),
  "certificationCount": count(*[_type == "certification"]),
  "recent": *[_type in ["project", "article", "experience", "education", "skill", "certification"]] | order(_updatedAt desc)[0...6]{
    _id,
    _type,
    "title": coalesce(title, role, institution, name),
    "subtitle": coalesce(company, association, publishedAt, degree, category, issuer),
    "updatedAt": _updatedAt
  }
}`;

const quickLinks = [
  { href: "/studio/profile", label: "Profile", icon: UserRound },
  { href: "/studio/project", label: "Projects", icon: FolderKanban },
  { href: "/studio/article", label: "Articles", icon: FileText },
  { href: "/studio/experience", label: "Experience", icon: BriefcaseBusiness },
  { href: "/studio/education", label: "Education", icon: GraduationCap },
  { href: "/studio/skill", label: "Skills", icon: Tag },
  { href: "/studio/certification", label: "Certifications", icon: Award },
  { href: "/studio/documents", label: "Documents", icon: Settings },
];

export default function OverviewDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverview = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const overviewData = await client.fetch<OverviewData>(overviewQuery);
      setData(overviewData);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  function navigateTo(path: string) {
    window.location.assign(path);
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Yumesh Ban Portfolio</p>
          <h1 className="studio-header-title">Studio Dashboard</h1>
          <p className="studio-header-subtitle">{data?.profile?.headline ?? "Full Stack Developer in Kathmandu, Nepal"}</p>
        </div>

        <div className="studio-header-actions">
          <button type="button" onClick={() => navigateTo("/studio/profile")} className="studio-btn-secondary">
            <Search size={16} />
            SEO Settings
          </button>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Projects</p>
          <p className="studio-stat-value studio-stat-blue">{data?.projectCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Featured</p>
          <p className="studio-stat-value studio-stat-green">{data?.featuredProjectCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Articles</p>
          <p className="studio-stat-value studio-stat-orange">{data?.articleCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Skills</p>
          <p className="studio-stat-value studio-stat-pink">{data?.skillCount ?? 0}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading dashboard...</div>
      ) : (
        <div className="studio-overview-grid">
          <section className="studio-panel">
            <div className="studio-panel-header">
              <h2>Quick Actions</h2>
            </div>
            <div className="studio-quick-grid">
              {quickLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a key={item.href} href={item.href} className="studio-quick-link">
                    <Icon size={20} />
                    <span>{item.label}</span>
                    <ArrowRight size={16} />
                  </a>
                );
              })}
            </div>
          </section>

          <section className="studio-panel">
            <div className="studio-panel-header">
              <h2>Identity Snapshot</h2>
            </div>
            <div className="studio-snapshot-list">
              <div>
                <span>Name</span>
                <strong>{data?.profile?.name ?? "Yumesh Ban"}</strong>
              </div>
              <div>
                <span>Site URL</span>
                <strong>{data?.settings?.siteUrl ?? "Add domain in profile settings"}</strong>
              </div>
              <div>
                <span>Final Semester</span>
                <strong>{data?.profile?.finalSemesterPercentage ?? "90.8%"}</strong>
              </div>
              <div>
                <span>Certifications</span>
                <strong>{data?.certificationCount ?? 0}</strong>
              </div>
            </div>
          </section>

          <section className="studio-panel studio-panel-wide">
            <div className="studio-panel-header">
              <h2>Recently Updated</h2>
            </div>
            <div className="studio-recent-list">
              {data?.recent?.length ? (
                data.recent.map((document) => (
                  <div key={document._id} className="studio-recent-item">
                    <span className="studio-badge studio-badge-neutral">{document._type}</span>
                    <div>
                      <strong>{document.title ?? "Untitled"}</strong>
                      <span>{document.subtitle ?? "No subtitle"}</span>
                    </div>
                    <time>{document.updatedAt ? new Date(document.updatedAt).toLocaleDateString() : ""}</time>
                  </div>
                ))
              ) : (
                <div className="studio-empty studio-empty-compact">No recent updates yet.</div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

"use client";

import { Award, ExternalLink, EyeOff, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useClient } from "sanity";

import { getErrorMessage } from "../shared/studio-utils";

import CertificationForm, { type CertificationDocument } from "./CertificationForm";

const certificationQuery = `*[_type == "certification"] | order(order asc, date desc, _createdAt desc) {
  _id,
  _type,
  status,
  title,
  issuer,
  date,
  issueDate,
  expiryDate,
  credentialId,
  description,
  credentialUrl,
  credentialFile,
  relatedSkills,
  order
}`;

export default function CertificationDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [certifications, setCertifications] = useState<CertificationDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingCertification, setEditingCertification] = useState<CertificationDocument | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const fetchCertifications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<CertificationDocument[]>(certificationQuery);
      setCertifications(data);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const filteredCertifications = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return certifications.filter((certification) => {
      const searchable = [
        certification.title,
        certification.issuer,
        certification.date,
        certification.credentialId,
        certification.description,
        certification.credentialUrl,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = !search || searchable.includes(search);
      const matchesStatus = filterStatus === "all" || (certification.status ?? "published") === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [certifications, filterStatus, searchTerm]);

  function handleAddNew() {
    setEditingCertification(null);
    setView("form");
  }

  function handleEdit(certification: CertificationDocument) {
    setEditingCertification(certification);
    setView("form");
  }

  async function handleDelete(certification: CertificationDocument) {
    if (!certification._id) {
      return;
    }

    const confirmed = window.confirm(`Delete "${certification.title}"? This removes it from Sanity.`);
    if (!confirmed) {
      return;
    }

    try {
      await client.delete(certification._id);
      setCertifications((currentCertifications) => currentCertifications.filter((item) => item._id !== certification._id));
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    }
  }

  function handleFormComplete() {
    setView("list");
    setEditingCertification(null);
    fetchCertifications();
  }

  if (view === "form") {
    return (
      <div className="studio-page-container-form">
        <CertificationForm certification={editingCertification} onComplete={handleFormComplete} />
      </div>
    );
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Learning Proof</p>
          <h1 className="studio-header-title">Certifications Overview</h1>
          <p className="studio-header-subtitle">Organize certificates, credentials, recognitions, proof links, and related skills.</p>
        </div>

        <div className="studio-filters">
          <div className="studio-search-wrapper">
            <Search className="studio-search-icon" size={16} />
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="studio-search-input"
              placeholder="Search certifications..."
            />
          </div>

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
          <p className="studio-stat-label">Total</p>
          <p className="studio-stat-value studio-stat-blue">{certifications.length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Published</p>
          <p className="studio-stat-value studio-stat-green">{certifications.filter((certification) => (certification.status ?? "published") === "published").length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">With Links</p>
          <p className="studio-stat-value studio-stat-orange">{certifications.filter((certification) => Boolean(certification.credentialUrl)).length}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Hidden</p>
          <p className="studio-stat-value studio-stat-pink">{certifications.filter((certification) => certification.status === "hidden").length}</p>
        </div>
      </div>

      {error ? <p className="studio-error">{error}</p> : null}

      {loading ? (
        <div className="studio-loading">Loading certifications...</div>
      ) : filteredCertifications.length === 0 ? (
        <div className="studio-empty">No certifications found.</div>
      ) : (
        <div className="studio-grid studio-grid-3">
          {filteredCertifications.map((certification) => (
            <article key={certification._id} className="studio-card">
              <div className="studio-card-content">
                <div className="studio-card-topline">
                  <span className="studio-badge studio-badge-info">
                    <Award size={12} />
                    {certification.issuer ?? "Issuer"}
                  </span>
                  {certification.status === "hidden" ? (
                    <span className="studio-badge studio-badge-neutral">
                      <EyeOff size={12} />
                      Hidden
                    </span>
                  ) : null}
                </div>

                <h2 className="studio-card-title">{certification.title}</h2>
                <p className="studio-card-meta">{[certification.date, certification.credentialId].filter(Boolean).join(" / ") || "No credential metadata"}</p>
                <p className="studio-card-description">{certification.description || "No description added yet."}</p>

                <div className="studio-card-footer">
                  <span>Order {certification.order ?? 99}</span>
                  {certification.credentialUrl ? (
                    <a href={certification.credentialUrl} target="_blank" rel="noreferrer" className="studio-inline-link">
                      <ExternalLink size={14} />
                      Credential
                    </a>
                  ) : (
                    <span>{certification.status ?? "published"}</span>
                  )}
                </div>

                <div className="studio-actions">
                  <button type="button" onClick={() => handleEdit(certification)} className="studio-btn-edit">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(certification)}
                    className="studio-btn-delete"
                    aria-label={`Delete ${certification.title}`}
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
        <span className="studio-fab-text">Add Certificate</span>
      </button>
    </div>
  );
}

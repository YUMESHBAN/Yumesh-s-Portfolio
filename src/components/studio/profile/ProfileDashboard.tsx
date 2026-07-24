"use client";

import { ExternalLink, Save, UserRound } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useClient } from "sanity";

import {
  cleanOptionalFields,
  getErrorMessage,
  joinLines,
  portableBlocksToText,
  splitLines,
  textToPortableBlocks,
  type PortableTextBlock,
} from "../shared/studio-utils";

type SocialLink = {
  _key?: string;
  _type?: "linkItem";
  label?: string;
  href?: string;
  type?: string;
};

type PersonProfileDocument = {
  _id?: string;
  name?: string;
  headline?: string;
  heroEyebrow?: string;
  heroTitle?: string;
  availability?: string;
  location?: string;
  email?: string;
  phone?: string;
  shortBio?: string;
  longBio?: PortableTextBlock[];
  degree?: string;
  overallPercentage?: string;
  finalSemesterPercentage?: string;
  ctaLinks?: SocialLink[];
  socialLinks?: SocialLink[];
};

type SiteSettingsDocument = {
  _id?: string;
  siteUrl?: string;
  title?: string;
  description?: string;
  keywords?: string[];
};

type DashboardData = {
  profile?: PersonProfileDocument | null;
  settings?: SiteSettingsDocument | null;
  skillCount: number;
  projectCount: number;
  articleCount: number;
};

type ProfileFormState = {
  name: string;
  headline: string;
  heroEyebrow: string;
  heroTitle: string;
  availability: string;
  location: string;
  email: string;
  phone: string;
  shortBio: string;
  longBio: string;
  degree: string;
  overallPercentage: string;
  finalSemesterPercentage: string;
  ctaLinks: string;
  socialLinks: string;
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
  keywords: string;
};

const dashboardQuery = `{
  "profile": *[_type == "personProfile"][0]{
    _id,
    name,
    headline,
    heroEyebrow,
    heroTitle,
    availability,
    location,
    email,
    phone,
    shortBio,
    longBio,
    degree,
    overallPercentage,
    finalSemesterPercentage,
    ctaLinks,
    socialLinks
  },
  "settings": *[_type == "siteSettings"][0]{
    _id,
    siteUrl,
    title,
    description,
    keywords
  },
  "skillCount": count(*[_type == "skill"]),
  "projectCount": count(*[_type == "project"]),
  "articleCount": count(*[_type == "article"])
}`;

function socialLinksToText(links?: SocialLink[]) {
  return links?.length ? links.map((link) => `${link.label ?? ""} | ${link.href ?? ""}`.trim()).join("\n") : "";
}

function socialTextToLinks(value: string): SocialLink[] {
  const links: SocialLink[] = [];

  value.split(/\r?\n/).forEach((line, index) => {
    const separator = line.includes("|") ? "|" : ",";
    const [label, href] = line.split(separator).map((part) => part.trim());

    if (!label || !href) {
      return;
    }

    links.push({
      _key: `social-${index}-${Math.random().toString(36).slice(2, 8)}`,
      _type: "linkItem",
      label,
      href,
      type: "Other",
    });
  });

  return links;
}

function dashboardToFormState(data?: DashboardData | null): ProfileFormState {
  const profile = data?.profile;
  const settings = data?.settings;

  return {
    name: profile?.name ?? "Yumesh Ban",
    headline: profile?.headline ?? "Full Stack Developer in Kathmandu, Nepal",
    heroEyebrow: profile?.heroEyebrow ?? "",
    heroTitle: profile?.heroTitle ?? "",
    availability: profile?.availability ?? "",
    location: profile?.location ?? "Kathmandu, Nepal",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    shortBio: profile?.shortBio ?? "",
    longBio: portableBlocksToText(profile?.longBio),
    degree: profile?.degree ?? "BSc.CSIT, Tribhuvan University",
    overallPercentage: profile?.overallPercentage ?? "80%+",
    finalSemesterPercentage: profile?.finalSemesterPercentage ?? "90.8%",
    ctaLinks: socialLinksToText(profile?.ctaLinks),
    socialLinks: socialLinksToText(profile?.socialLinks),
    siteUrl: settings?.siteUrl ?? "",
    siteTitle: settings?.title ?? "Yumesh Ban - Full Stack Developer in Kathmandu, Nepal",
    siteDescription: settings?.description ?? "",
    keywords: joinLines(settings?.keywords),
  };
}

export default function ProfileDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [formData, setFormData] = useState<ProfileFormState>(() => dashboardToFormState(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await client.fetch<DashboardData>(dashboardQuery);
      setDashboardData(data);
      setFormData(dashboardToFormState(data));
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  function updateField<Key extends keyof ProfileFormState>(field: Key, value: ProfileFormState[Key]) {
    setFormData((previous) => ({ ...previous, [field]: value }));
  }

  function navigateTo(path: string) {
    window.location.assign(path);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim() || !formData.headline.trim()) {
      setError("Name and headline are required.");
      return;
    }

    if (!formData.siteTitle.trim() || !formData.siteUrl.trim()) {
      setError("Site title and site URL are required for SEO settings.");
      return;
    }

    setSaving(true);

    const profileId = dashboardData?.profile?._id ?? "personProfile";
    const settingsId = dashboardData?.settings?._id ?? "siteSettings";

    const profilePayload = {
      _type: "personProfile",
      name: formData.name.trim(),
      headline: formData.headline.trim(),
      heroEyebrow: formData.heroEyebrow.trim(),
      heroTitle: formData.heroTitle.trim(),
      availability: formData.availability.trim(),
      location: formData.location.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      shortBio: formData.shortBio.trim(),
      longBio: textToPortableBlocks(formData.longBio),
      degree: formData.degree.trim(),
      overallPercentage: formData.overallPercentage.trim(),
      finalSemesterPercentage: formData.finalSemesterPercentage.trim(),
      ctaLinks: socialTextToLinks(formData.ctaLinks),
      socialLinks: socialTextToLinks(formData.socialLinks),
    };

    const settingsPayload = {
      _type: "siteSettings",
      siteUrl: formData.siteUrl.trim(),
      title: formData.siteTitle.trim(),
      description: formData.siteDescription.trim(),
      keywords: splitLines(formData.keywords),
    };

    const profileUnset = [
      "heroEyebrow",
      "heroTitle",
      "availability",
      "location",
      "email",
      "phone",
      "shortBio",
      "degree",
      "overallPercentage",
      "finalSemesterPercentage",
    ].filter(
      (field) => !String(profilePayload[field as keyof typeof profilePayload] ?? "").trim(),
    );
    const settingsUnset = ["description"].filter((field) => !String(settingsPayload[field as keyof typeof settingsPayload] ?? "").trim());

    try {
      await client.createIfNotExists({
        _id: profileId,
        _type: "personProfile",
        name: profilePayload.name,
        headline: profilePayload.headline,
      });

      await client.createIfNotExists({
        _id: settingsId,
        _type: "siteSettings",
        siteUrl: settingsPayload.siteUrl,
        title: settingsPayload.title,
      });

      let profilePatch = client.patch(profileId).set(cleanOptionalFields(profilePayload));
      if (profileUnset.length) {
        profilePatch = profilePatch.unset(profileUnset);
      }

      let settingsPatch = client.patch(settingsId).set(cleanOptionalFields(settingsPayload));
      if (settingsUnset.length) {
        settingsPatch = settingsPatch.unset(settingsUnset);
      }

      await Promise.all([profilePatch.commit(), settingsPatch.commit()]);
      setSuccess("Profile and SEO settings saved.");
      fetchDashboardData();
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="studio-page-container">
      <div className="studio-header">
        <div>
          <p className="studio-eyebrow">Official Identity</p>
          <h1 className="studio-header-title">Profile and SEO Settings</h1>
          <p className="studio-header-subtitle">Control the personal-brand content that supports searches for Yumesh Ban.</p>
        </div>

        <div className="studio-header-actions">
          <button type="button" onClick={() => navigateTo("/studio/documents")} className="studio-btn-secondary">
            <ExternalLink size={16} />
            Documents
          </button>
        </div>
      </div>

      <div className="studio-stats-grid">
        <div className="studio-stat-card">
          <p className="studio-stat-label">Projects</p>
          <p className="studio-stat-value studio-stat-blue">{dashboardData?.projectCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Articles</p>
          <p className="studio-stat-value studio-stat-green">{dashboardData?.articleCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Skills</p>
          <p className="studio-stat-value studio-stat-orange">{dashboardData?.skillCount ?? 0}</p>
        </div>
        <div className="studio-stat-card">
          <p className="studio-stat-label">Final Semester</p>
          <p className="studio-stat-value studio-stat-pink">{formData.finalSemesterPercentage || "90.8%"}</p>
        </div>
      </div>

      {loading ? (
        <div className="studio-loading">Loading profile...</div>
      ) : (
        <form onSubmit={handleSubmit} className="studio-form-container studio-form-stack">
          <div className="studio-form-header">
            <div>
              <p className="studio-eyebrow">Person Profile</p>
              <h2 className="studio-form-title">
                <UserRound size={22} />
                Yumesh Ban
              </h2>
            </div>
          </div>

          <section className="studio-form-section">
            <h3 className="studio-form-section-title">Identity</h3>
            <div className="studio-form-grid">
              <label className="studio-field">
                <span className="studio-form-label">Full Name *</span>
                <input
                  required
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Headline *</span>
                <input
                  required
                  value={formData.headline}
                  onChange={(event) => updateField("headline", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Hero Eyebrow</span>
                <input value={formData.heroEyebrow} onChange={(event) => updateField("heroEyebrow", event.target.value)} className="studio-form-input" />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Hero Title</span>
                <input value={formData.heroTitle} onChange={(event) => updateField("heroTitle", event.target.value)} className="studio-form-input" />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Availability</span>
                <input value={formData.availability} onChange={(event) => updateField("availability", event.target.value)} className="studio-form-input" />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Location</span>
                <input
                  value={formData.location}
                  onChange={(event) => updateField("location", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Email</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Phone</span>
                <input value={formData.phone} onChange={(event) => updateField("phone", event.target.value)} className="studio-form-input" />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Degree</span>
                <input value={formData.degree} onChange={(event) => updateField("degree", event.target.value)} className="studio-form-input" />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Overall Percentage</span>
                <input
                  value={formData.overallPercentage}
                  onChange={(event) => updateField("overallPercentage", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Final Semester Percentage</span>
                <input
                  value={formData.finalSemesterPercentage}
                  onChange={(event) => updateField("finalSemesterPercentage", event.target.value)}
                  className="studio-form-input"
                />
              </label>
            </div>
          </section>

          <section className="studio-form-section">
            <h3 className="studio-form-section-title">Biography</h3>
            <label className="studio-field">
              <span className="studio-form-label">Short Bio</span>
              <textarea
                value={formData.shortBio}
                onChange={(event) => updateField("shortBio", event.target.value)}
                className="studio-form-textarea"
                rows={3}
              />
            </label>
            <label className="studio-field">
              <span className="studio-form-label">Long Bio</span>
              <textarea
                value={formData.longBio}
                onChange={(event) => updateField("longBio", event.target.value)}
                className="studio-form-textarea studio-form-textarea-tall"
                rows={8}
              />
            </label>
          </section>

          <section className="studio-form-section">
            <h3 className="studio-form-section-title">Social and SEO</h3>
            <div className="studio-form-grid">
              <label className="studio-field">
                <span className="studio-form-label">Social Links</span>
                <textarea
                  value={formData.socialLinks}
                  onChange={(event) => updateField("socialLinks", event.target.value)}
                  className="studio-form-textarea"
                  rows={5}
                  placeholder={"GitHub | https://github.com/YUMESHBAN\nLinkedIn | https://www.linkedin.com/in/ban-yumesh"}
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">CTA Links</span>
                <textarea
                  value={formData.ctaLinks}
                  onChange={(event) => updateField("ctaLinks", event.target.value)}
                  className="studio-form-textarea"
                  rows={5}
                  placeholder={"View Projects | /projects\nContact | /contact"}
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Keywords</span>
                <textarea
                  value={formData.keywords}
                  onChange={(event) => updateField("keywords", event.target.value)}
                  className="studio-form-textarea"
                  rows={5}
                  placeholder={"Yumesh Ban\nFull Stack Developer\nKathmandu Nepal"}
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Site URL *</span>
                <input
                  required
                  value={formData.siteUrl}
                  onChange={(event) => updateField("siteUrl", event.target.value)}
                  className="studio-form-input"
                  placeholder="https://yumeshban.com"
                />
              </label>

              <label className="studio-field">
                <span className="studio-form-label">Site Title *</span>
                <input
                  required
                  value={formData.siteTitle}
                  onChange={(event) => updateField("siteTitle", event.target.value)}
                  className="studio-form-input"
                />
              </label>

              <label className="studio-field studio-field-wide">
                <span className="studio-form-label">Site Description</span>
                <textarea
                  value={formData.siteDescription}
                  onChange={(event) => updateField("siteDescription", event.target.value)}
                  className="studio-form-textarea"
                  rows={3}
                />
              </label>
            </div>
          </section>

          {error ? <p className="studio-error">{error}</p> : null}
          {success ? <p className="studio-success">{success}</p> : null}

          <div className="studio-form-actions">
            <button type="submit" disabled={saving} className="studio-btn-primary">
              <Save size={16} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

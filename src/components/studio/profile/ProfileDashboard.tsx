"use client";

import { ExternalLink, FileText, Save, Upload, UserRound, X } from "lucide-react";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
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
import { SocialLinkIcon } from "@/components/social-link-icon";
import TagEditor from "../shared/TagEditor";

type SocialLink = {
  _key?: string;
  _type?: "linkItem";
  label?: string;
  href?: string;
  type?: string;
};

type AboutManifestoItem = {
  _key?: string;
  _type?: "aboutManifestoItem";
  lineOne?: string;
  lineTwoLead?: string;
  accent?: string;
  lineTwoTail?: string;
  summary?: string;
  description?: string;
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
  socialLinks?: SocialLink[];
  aboutManifesto?: AboutManifestoItem[];
};

type SiteSettingsDocument = {
  _id?: string;
  siteUrl?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  cvFile?: {
    _type?: "file";
    asset?: {
      _id?: string;
      originalFilename?: string;
      url?: string;
    };
  };
};

type SiteSettingsPayload = {
  _type: "siteSettings";
  siteUrl: string;
  title: string;
  description: string;
  keywords: string[];
  cvFile?: {
    _type: "file";
    asset: { _type: "reference"; _ref: string };
  };
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
  socialLinks: string;
  aboutManifesto: AboutManifestoItem[];
  siteUrl: string;
  siteTitle: string;
  siteDescription: string;
  keywords: string;
  cvFileAssetId?: string;
  cvFileName?: string;
  cvUrl?: string;
};

const socialPlatforms = ["GitHub", "LinkedIn", "Twitter", "Instagram", "Facebook", "YouTube", "Dev.to", "Dribbble"] as const;
type SocialPlatform = (typeof socialPlatforms)[number];
const profileSteps = ["Identity", "Biography", "Manifesto", "Publishing & SEO"] as const;

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
    socialLinks,
    aboutManifesto
  },
  "settings": *[_type == "siteSettings"][0]{
    _id,
    siteUrl,
    title,
    description,
    keywords,
    cvFile{
      _type,
      asset->{
        _id,
        originalFilename,
        url
      }
    }
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

function normalisePlatformLabel(label?: string, href?: string): SocialPlatform | undefined {
  const value = `${label ?? ""} ${href ?? ""}`.toLowerCase();
  if (value.includes("github")) return "GitHub";
  if (value.includes("linkedin")) return "LinkedIn";
  if (value.includes("twitter") || value.includes("x.com")) return "Twitter";
  if (value.includes("instagram")) return "Instagram";
  if (value.includes("facebook")) return "Facebook";
  if (value.includes("youtube")) return "YouTube";
  if (value.includes("dev.to")) return "Dev.to";
  if (value.includes("dribbble")) return "Dribbble";
  return undefined;
}

function socialUrlsFromText(value: string): Partial<Record<SocialPlatform, string>> {
  return socialTextToLinks(value).reduce<Partial<Record<SocialPlatform, string>>>((urls, link) => {
    const platform = normalisePlatformLabel(link.label, link.href);
    if (platform) urls[platform] = link.href;
    return urls;
  }, {});
}

function updateSocialUrl(value: string, platform: SocialPlatform, href: string) {
  const links = socialTextToLinks(value);
  const retainedLinks = links.filter((link) => normalisePlatformLabel(link.label, link.href) !== platform);
  const trimmedHref = href.trim();

  if (trimmedHref) {
    retainedLinks.push({
      _key: `social-${platform.toLowerCase().replace(/[^a-z]/g, "")}`,
      _type: "linkItem",
      label: platform,
      href: trimmedHref,
      type: "Social",
    });
  }

  return socialLinksToText(retainedLinks);
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
    socialLinks: socialLinksToText(profile?.socialLinks),
    aboutManifesto: profile?.aboutManifesto ?? [],
    siteUrl: settings?.siteUrl ?? "",
    siteTitle: settings?.title ?? "Yumesh Ban - Full Stack Developer in Kathmandu, Nepal",
    siteDescription: settings?.description ?? "",
    keywords: joinLines(settings?.keywords),
    cvFileAssetId: settings?.cvFile?.asset?._id,
    cvFileName: settings?.cvFile?.asset?.originalFilename,
    cvUrl: settings?.cvFile?.asset?.url,
  };
}

export default function ProfileDashboard() {
  const client = useClient({ apiVersion: "2026-03-01" });
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [formData, setFormData] = useState<ProfileFormState>(() => dashboardToFormState(null));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCv, setUploadingCv] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeStep, setActiveStep] = useState(0);

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

  function updateManifestoItem(
    index: number,
    field: Exclude<keyof AboutManifestoItem, "_key" | "_type">,
    value: string,
  ) {
    setFormData((previous) => ({
      ...previous,
      aboutManifesto: previous.aboutManifesto.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function navigateTo(path: string) {
    window.location.assign(path);
  }

  async function uploadCvFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please select a valid PDF file for your resume.");
      return;
    }

    setError("");
    setUploadingCv(true);

    try {
      const asset = await client.assets.upload("file", file, {
        filename: file.name,
        contentType: "application/pdf",
      });

      setFormData((previous) => ({
        ...previous,
        cvFileAssetId: asset._id,
        cvFileName: asset.originalFilename ?? file.name,
        cvUrl: asset.url,
      }));
      setSuccess("Resume PDF uploaded. Click 'Save Profile' below to publish.");
    } catch (uploadError) {
      setError(getErrorMessage(uploadError));
    } finally {
      setUploadingCv(false);
    }
  }

  function removeCvFile() {
    setFormData((previous) => ({
      ...previous,
      cvFileAssetId: undefined,
      cvFileName: undefined,
      cvUrl: undefined,
    }));
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
      socialLinks: socialTextToLinks(formData.socialLinks),
      aboutManifesto: formData.aboutManifesto.map((item, index) => ({
        _key: item._key ?? `manifesto-${index + 1}`,
        _type: "aboutManifestoItem" as const,
        lineOne: item.lineOne?.trim(),
        lineTwoLead: item.lineTwoLead?.trim(),
        accent: item.accent?.trim(),
        ...(item.lineTwoTail?.trim() ? { lineTwoTail: item.lineTwoTail.trim() } : {}),
        summary: item.summary?.trim(),
        description: item.description?.trim(),
      })),
    };

    const settingsPayload: SiteSettingsPayload = {
      _type: "siteSettings",
      siteUrl: formData.siteUrl.trim(),
      title: formData.siteTitle.trim(),
      description: formData.siteDescription.trim(),
      keywords: splitLines(formData.keywords),
    };

    if (formData.cvFileAssetId) {
      settingsPayload.cvFile = {
        _type: "file",
        asset: {
          _type: "reference",
          _ref: formData.cvFileAssetId,
        },
      };
    }

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
    const settingsUnset = ["description", "cvFile"].filter((field) => {
      if (field === "cvFile") return !formData.cvFileAssetId;
      return !String(settingsPayload[field as keyof typeof settingsPayload] ?? "").trim();
    });

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

          <nav className="studio-stepper studio-profile-stepper" aria-label="Profile sections">
            {profileSteps.map((step, index) => (
              <button key={step} type="button" onClick={() => setActiveStep(index)} className={`studio-stepper-item ${activeStep === index ? "is-active" : ""} ${activeStep > index ? "is-complete" : ""}`}>
                <span>{index + 1}</span>{step}
              </button>
            ))}
          </nav>

          {activeStep === 0 ? <section className="studio-form-section">
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
          </section> : null}

          {activeStep === 1 ? <section className="studio-form-section">
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
          </section> : null}

          {activeStep === 2 ? <section className="studio-form-section">
            <h3 className="studio-form-section-title">About Page Manifesto</h3>
            <p className="studio-category-hint">
              These three principles appear in the “How I show up” section. The description is revealed on hover or keyboard focus.
            </p>
            <div className="studio-manifesto-editor">
              {formData.aboutManifesto.map((item, index) => (
                <fieldset key={item._key ?? index} className="studio-manifesto-item">
                  <legend>Principle {String(index + 1).padStart(2, "0")}</legend>
                  <div className="studio-form-grid">
                    <label className="studio-field">
                      <span className="studio-form-label">First Line *</span>
                      <input
                        required
                        value={item.lineOne ?? ""}
                        onChange={(event) => updateManifestoItem(index, "lineOne", event.target.value)}
                        className="studio-form-input"
                        placeholder="I make the"
                      />
                    </label>

                    <label className="studio-field">
                      <span className="studio-form-label">Second Line Lead *</span>
                      <input
                        required
                        value={item.lineTwoLead ?? ""}
                        onChange={(event) => updateManifestoItem(index, "lineTwoLead", event.target.value)}
                        className="studio-form-input"
                        placeholder="problem"
                      />
                    </label>

                    <label className="studio-field">
                      <span className="studio-form-label">Blue Accent *</span>
                      <input
                        required
                        value={item.accent ?? ""}
                        onChange={(event) => updateManifestoItem(index, "accent", event.target.value)}
                        className="studio-form-input"
                        placeholder="clear."
                      />
                    </label>

                    <label className="studio-field">
                      <span className="studio-form-label">Text After Accent</span>
                      <input
                        value={item.lineTwoTail ?? ""}
                        onChange={(event) => updateManifestoItem(index, "lineTwoTail", event.target.value)}
                        className="studio-form-input"
                        placeholder="work. (optional)"
                      />
                    </label>

                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Short Summary *</span>
                      <input
                        required
                        value={item.summary ?? ""}
                        onChange={(event) => updateManifestoItem(index, "summary", event.target.value)}
                        className="studio-form-input"
                        placeholder="Understand before adding."
                      />
                    </label>

                    <label className="studio-field studio-field-wide">
                      <span className="studio-form-label">Hover-Reveal Description *</span>
                      <textarea
                        required
                        value={item.description ?? ""}
                        onChange={(event) => updateManifestoItem(index, "description", event.target.value)}
                        className="studio-form-textarea"
                        rows={3}
                      />
                    </label>
                  </div>
                </fieldset>
              ))}
            </div>
          </section> : null}

          {activeStep === 3 ? <section className="studio-form-section">
            <h3 className="studio-form-section-title">Resume PDF (CV File)</h3>
            <p className="studio-category-hint">
              Upload your resume as a PDF file. Once uploaded and saved, all &quot;Resume&quot; and &quot;Download CV&quot; buttons across the website will serve this exact PDF.
            </p>
            <div className="studio-form-grid">
              <div className="studio-field studio-field-wide">
                <span className="studio-form-label">Resume PDF File</span>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <label className="studio-btn-secondary cursor-pointer inline-flex items-center gap-2">
                    <Upload size={16} />
                    {uploadingCv ? "Uploading PDF..." : "Upload Resume PDF"}
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={uploadCvFile}
                      disabled={uploadingCv}
                      className="hidden"
                    />
                  </label>

                  {formData.cvFileName || formData.cvUrl ? (
                  <div className="flex items-center gap-2.5 rounded-lg border border-black/10 bg-paper px-3.5 py-2 text-sm text-ink">
                      <FileText size={16} className="text-moss" />
                      <span className="max-w-[260px] truncate font-medium">
                        {formData.cvFileName || "Uploaded Resume.pdf"}
                      </span>
                      {formData.cvUrl ? (
                        <a
                          href={formData.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-moss underline hover:text-ink"
                        >
                          Preview PDF
                        </a>
                      ) : null}
                      <button
                        type="button"
                        onClick={removeCvFile}
                        className="ml-1 text-ink/50 transition hover:text-red-600"
                        title="Remove resume file"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-sm text-ink/50">No uploaded PDF (currently falling back to static file).</span>
                  )}
                </div>
              </div>
            </div>
          </section> : null}

          {activeStep === 3 ? <section className="studio-form-section">
            <h3 className="studio-form-section-title">Social and SEO</h3>
            <div className="studio-form-grid">
              <div className="studio-field studio-field-wide">
                <span className="studio-form-label">Social Profiles</span>
                <p className="studio-category-hint">Add one URL per platform. The matching icon is used wherever this profile is shown on the website.</p>
                <div className="studio-social-links-grid">
                  {socialPlatforms.map((platform) => {
                    const urls = socialUrlsFromText(formData.socialLinks);

                    return (
                      <label key={platform} className="studio-social-link-field">
                        <span><SocialLinkIcon label={platform} size={16} />{platform}</span>
                        <input
                          type="url"
                          value={urls[platform] ?? ""}
                          onChange={(event) => updateField("socialLinks", updateSocialUrl(formData.socialLinks, platform, event.target.value))}
                          className="studio-form-input"
                          placeholder={`https://${platform === "Twitter" ? "x.com" : platform === "Dev.to" ? "dev.to" : `${platform.toLowerCase()}.com`}/...`}
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="studio-field">
                <span className="studio-form-label">Keywords</span>
                <p className="studio-category-hint">Add focused search terms visitors may use to find your work.</p>
                <TagEditor tags={splitLines(formData.keywords)} onChange={(keywords) => updateField("keywords", keywords.join("\n"))} />
              </div>

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
          </section> : null}

          {error ? <p className="studio-error">{error}</p> : null}
          {success ? <p className="studio-success">{success}</p> : null}

          <div className="studio-form-actions">
            <button type="button" onClick={() => setActiveStep((step) => Math.max(0, step - 1))} disabled={activeStep === 0} className="studio-btn-cancel">Previous</button>
            {activeStep < profileSteps.length - 1 ? <button type="button" onClick={() => setActiveStep((step) => Math.min(profileSteps.length - 1, step + 1))} className="studio-btn-secondary">Next section</button> : null}
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

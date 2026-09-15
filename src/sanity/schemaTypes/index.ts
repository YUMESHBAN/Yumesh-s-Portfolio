import { defineField, defineType } from "sanity";
import {
  BarChartIcon,
  BookIcon,
  CaseIcon,
  CogIcon,
  DocumentTextIcon,
  ProjectsIcon,
  TagIcon,
  UserIcon,
} from "@sanity/icons";

const statusOptions = [
  { title: "Published", value: "published" },
  { title: "Draft", value: "draft" },
  { title: "Hidden", value: "hidden" },
];

const statusField = defineField({
  name: "status",
  title: "Status",
  type: "string",
  options: { list: statusOptions, layout: "radio" },
  initialValue: "published",
  description: "Documents without a status are treated as published for backwards compatibility.",
});

const slugField = defineField({
  name: "slug",
  title: "Slug",
  type: "slug",
  options: { source: "title", maxLength: 96 },
  validation: (Rule) => Rule.required(),
});

const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO title",
    type: "string",
  }),
  defineField({
    name: "seoDescription",
    title: "SEO description",
    type: "text",
    rows: 3,
  }),
  defineField({
    name: "canonicalPath",
    title: "Canonical path",
    type: "string",
    description: "Optional path such as /works/merry-crochets. Leave blank to use the generated page path.",
  }),
  defineField({
    name: "seoImage",
    title: "SEO image",
    type: "imageWithMeta",
  }),
];

const skillReferenceField = defineField({
  name: "relatedSkills",
  title: "Related skills",
  type: "array",
  of: [{ type: "reference", to: [{ type: "skill" }] }],
});

export const schemaTypes = [
  defineType({
    name: "imageWithMeta",
    title: "Image With Metadata",
    type: "object",
    fields: [
      defineField({
        name: "image",
        title: "Image",
        type: "image",
        options: { hotspot: true },
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "alt",
        title: "Alt text",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "caption", title: "Caption", type: "string" }),
      defineField({
        name: "layout",
        title: "Article layout",
        type: "string",
        options: {
          list: [
            { title: "Inline", value: "inline" },
            { title: "Wide", value: "wide" },
            { title: "Side left", value: "sideLeft" },
            { title: "Side right", value: "sideRight" },
          ],
        },
        initialValue: "inline",
      }),
    ],
    preview: {
      select: {
        title: "alt",
        subtitle: "caption",
        media: "image",
      },
    },
  }),
  defineType({
    name: "linkItem",
    title: "Link",
    type: "object",
    fields: [
      defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "href", title: "URL or path", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "type",
        title: "Type",
        type: "string",
        options: {
          list: ["Live", "Repository", "Case Study", "Social", "Credential", "Download", "Other"],
        },
        initialValue: "Other",
      }),
    ],
    preview: {
      select: {
        title: "label",
        subtitle: "href",
      },
    },
  }),
  defineType({
    name: "projectDocument",
    title: "Project Document",
    type: "object",
    fields: [
      defineField({ name: "title", title: "Title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "file", title: "PDF file", type: "file", options: { accept: "application/pdf" }, validation: (Rule) => Rule.required() }),
    ],
    preview: {
      select: { title: "title" },
    },
  }),
  defineType({
    name: "metricItem",
    title: "Metric",
    type: "object",
    fields: [
      defineField({ name: "label", title: "Label", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "value", title: "Value", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "note", title: "Note", type: "string" }),
    ],
    preview: {
      select: {
        title: "label",
        value: "value",
        note: "note",
      },
      prepare({ title, value, note }) {
        return {
          title: `${title}: ${value}`,
          subtitle: note,
        };
      },
    },
  }),
  defineType({
    name: "calloutBlock",
    title: "Callout",
    type: "object",
    fields: [
      defineField({ name: "title", title: "Title", type: "string" }),
      defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
      defineField({
        name: "tone",
        title: "Tone",
        type: "string",
        options: { list: ["Note", "Tip", "Warning", "Result", "Finding", "Conclusion"] },
        initialValue: "Note",
      }),
    ],
    preview: {
      select: {
        title: "title",
        body: "body",
        tone: "tone",
      },
      prepare({ title, body, tone }) {
        return {
          title: title || `${tone || "Note"} callout`,
          subtitle: body,
        };
      },
    },
  }),
  defineType({
    name: "keyTakeawayBlock",
    title: "Key Takeaway",
    type: "object",
    fields: [
      defineField({ name: "label", title: "Label", type: "string", initialValue: "Key takeaway" }),
      defineField({ name: "body", title: "Takeaway", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
    ],
    preview: {
      select: { title: "label", subtitle: "body" },
      prepare({ title, subtitle }) {
        return { title: title || "Key takeaway", subtitle };
      },
    },
  }),
  defineType({
    name: "codeBlock",
    title: "Code Block",
    type: "object",
    fields: [
      defineField({ name: "language", title: "Language", type: "string", initialValue: "text" }),
      defineField({ name: "code", title: "Code", type: "text", rows: 8, validation: (Rule) => Rule.required() }),
    ],
    preview: {
      select: {
        title: "language",
        code: "code",
      },
      prepare({ title, code }) {
        return {
          title: `${title || "text"} code`,
          subtitle: code,
        };
      },
    },
  }),
  defineType({
    name: "richContent",
    title: "Rich Content",
    type: "array",
    of: [
      {
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "Heading 2", value: "h2" },
          { title: "Heading 3", value: "h3" },
          { title: "Quote", value: "blockquote" },
        ],
        lists: [
          { title: "Bullet", value: "bullet" },
          { title: "Numbered", value: "number" },
        ],
        marks: {
          decorators: [
            { title: "Strong", value: "strong" },
            { title: "Emphasis", value: "em" },
            { title: "Code", value: "code" },
            { title: "Highlight", value: "highlight" },
          ],
          annotations: [
            {
              name: "link",
              title: "Link",
              type: "object",
              fields: [
                defineField({
                  name: "href",
                  title: "URL",
                  type: "url",
                  validation: (Rule) => Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                }),
              ],
            },
          ],
        },
      },
      { type: "imageWithMeta" },
      { type: "calloutBlock" },
      { type: "keyTakeawayBlock" },
      { type: "codeBlock" },
    ],
  }),
  defineType({
    name: "educationResult",
    title: "Education Result",
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Label",
        type: "string",
        description: "Example: Semester 1, Grade 10, +2 Grade 12, Final Semester.",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "percentage",
        title: "Percentage",
        type: "number",
        description: "Enter the percentage only, for example 90.8.",
        validation: (Rule) => Rule.min(0).max(100),
      }),
      defineField({
        name: "note",
        title: "Note",
        type: "string",
        description: "Optional context such as rank, board, or result type.",
      }),
      defineField({
        name: "showOnWebsite",
        title: "Show this result on website",
        type: "boolean",
        initialValue: true,
      }),
    ],
    preview: {
      select: {
        title: "label",
        percentage: "percentage",
        showOnWebsite: "showOnWebsite",
      },
      prepare({ title, percentage, showOnWebsite }) {
        return {
          title,
          subtitle: `${percentage ?? "No"}%${showOnWebsite === false ? " - Hidden" : ""}`,
        };
      },
    },
  }),
  defineType({
    name: "aboutJourneyChapter",
    title: "About Journey Chapter",
    type: "object",
    fields: [
      defineField({ name: "era", title: "Year / era", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "context", title: "Role or education context", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "dateRange", title: "Date range", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "location", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "story", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      defineField({ name: "lesson", title: "What this taught me", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      defineField({ name: "outcome", title: "Proof from this chapter", type: "text", rows: 2, validation: (Rule) => Rule.required() }),
    ],
    preview: {
      select: { title: "title", subtitle: "era" },
    },
  }),
  defineType({
    name: "aboutJourney",
    title: "About Page Journey",
    type: "document",
    icon: CaseIcon,
    description: "Editorial copy and chapters for the journey section on the About page.",
    fields: [
      defineField({ name: "eyebrow", title: "Section eyebrow", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "rangeLabel", title: "Timeline range", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "title", title: "Section heading", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "introduction", title: "Section introduction", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      defineField({
        name: "chapters",
        title: "Journey chapters",
        type: "array",
        of: [{ type: "aboutJourneyChapter" }],
        validation: (Rule) => Rule.required().length(4),
      }),
    ],
    preview: {
      select: { title: "title", subtitle: "rangeLabel" },
    },
  }),
  defineType({
    name: "personProfile",
    title: "Person Profile",
    type: "document",
    icon: UserIcon,
    description: "Main identity content for the official Yumesh Ban website.",
    fields: [
      defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "headline", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "heroEyebrow", title: "Hero eyebrow", type: "string" }),
      defineField({ name: "heroTitle", title: "Hero title", type: "string" }),
      defineField({ name: "availability", title: "Availability", type: "string" }),
      defineField({ name: "location", type: "string" }),
      defineField({ name: "email", type: "string" }),
      defineField({ name: "phone", type: "string" }),
      defineField({ name: "profileImage", type: "image", options: { hotspot: true } }),
      defineField({ name: "shortBio", type: "text", rows: 3 }),
      defineField({ name: "longBio", type: "richContent" }),
      defineField({ name: "degree", type: "string" }),
      defineField({ name: "overallPercentage", type: "string" }),
      defineField({ name: "finalSemesterPercentage", type: "string" }),
      defineField({
        name: "aboutManifesto",
        title: "About page manifesto",
        type: "array",
        description: "The three principles shown in the large manifesto section on the About page.",
        validation: (Rule) => Rule.max(3),
        of: [
          {
            name: "aboutManifestoItem",
            title: "Manifesto principle",
            type: "object",
            fields: [
              defineField({
                name: "lineOne",
                title: "First line",
                type: "string",
                description: "Example: I make the",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "lineTwoLead",
                title: "Second line before highlight",
                type: "string",
                description: "Example: problem",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "accent",
                title: "Blue highlighted text",
                type: "string",
                description: "Example: clear.",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "lineTwoTail",
                title: "Second line after highlight",
                type: "string",
                description: "Optional text after the blue highlight, such as work.",
              }),
              defineField({
                name: "summary",
                title: "Short statement",
                type: "string",
                description: "Visible before the hover or keyboard reveal.",
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: "description",
                title: "Reveal description",
                type: "text",
                rows: 3,
                description: "The fuller explanation revealed on hover or keyboard focus.",
                validation: (Rule) => Rule.required(),
              }),
            ],
            preview: {
              select: {
                lineOne: "lineOne",
                lineTwoLead: "lineTwoLead",
                accent: "accent",
                subtitle: "summary",
              },
              prepare({ lineOne, lineTwoLead, accent, subtitle }) {
                return {
                  title: [lineOne, lineTwoLead, accent].filter(Boolean).join(" "),
                  subtitle,
                };
              },
            },
          },
        ],
      }),
      defineField({
        name: "ctaLinks",
        title: "CTA links",
        type: "array",
        of: [{ type: "linkItem" }],
      }),
      defineField({
        name: "socialLinks",
        title: "Social links",
        type: "array",
        of: [{ type: "linkItem" }],
      }),
    ],
    preview: {
      select: {
        title: "name",
        subtitle: "headline",
        media: "profileImage",
      },
    },
  }),
  defineType({
    name: "siteSettings",
    title: "Site Settings",
    type: "document",
    icon: CogIcon,
    description: "Global SEO, domain, CV, and social preview settings.",
    fields: [
      defineField({ name: "siteUrl", type: "url", validation: (Rule) => Rule.required() }),
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "description", type: "text", rows: 3 }),
      defineField({ name: "keywords", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "cvFile", title: "CV file", type: "file" }),
      defineField({ name: "openGraphImage", type: "image", options: { hotspot: true } }),
    ],
    preview: {
      select: {
        title: "title",
        subtitle: "siteUrl",
        media: "openGraphImage",
      },
    },
  }),
  defineType({
    name: "project",
    title: "Project",
    type: "document",
    icon: ProjectsIcon,
    description: "Portfolio case studies and project cards shown on the public website.",
    orderings: [
      {
        title: "Featured order",
        name: "featuredOrder",
        by: [
          { field: "featured", direction: "desc" },
          { field: "order", direction: "asc" },
          { field: "title", direction: "asc" },
        ],
      },
    ],
    fields: [
      statusField,
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      slugField,
      defineField({
        name: "type",
        type: "string",
        options: { list: ["Company", "Freelance", "Academic", "Learning"] },
      }),
      defineField({ name: "association", type: "string" }),
      defineField({ name: "dateRange", type: "string" }),
      defineField({ name: "projectYear", title: "Project year", type: "string" }),
      defineField({ name: "duration", type: "string" }),
      defineField({ name: "teamSize", title: "Team size", type: "string" }),
      defineField({ name: "summary", type: "text", rows: 4 }),
      defineField({ name: "role", type: "string" }),
      defineField({ name: "audience", title: "Audience", type: "text", rows: 2 }),
      defineField({ name: "goals", title: "Goals", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "responsibilities", title: "Responsibilities", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "problem", title: "Problem", type: "richContent" }),
      defineField({ name: "process", title: "Process", type: "richContent" }),
      defineField({ name: "solution", title: "Solution", type: "richContent" }),
      defineField({ name: "results", title: "Results", type: "richContent" }),
      defineField({ name: "metrics", title: "Metrics", type: "array", of: [{ type: "metricItem" }] }),
      skillReferenceField,
      defineField({ name: "techStack", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "features", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "impact", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "repoUrl", type: "url" }),
      defineField({ name: "liveUrl", type: "url" }),
      defineField({ name: "links", title: "Additional links", type: "array", of: [{ type: "linkItem" }] }),
      defineField({ name: "additionalDocuments", title: "Additional project documents", type: "array", of: [{ type: "projectDocument" }] }),
      defineField({ name: "logo", title: "Project logo", type: "imageWithMeta" }),
      defineField({ name: "featuredImage", title: "Featured image", type: "imageWithMeta" }),
      defineField({ name: "demoVideo", title: "Demo video", type: "file", options: { accept: "video/mp4,video/webm" } }),
      defineField({ name: "projectPdf", title: "Project PDF", type: "file", options: { accept: "application/pdf" } }),
      defineField({ name: "gallery", title: "Gallery", type: "array", of: [{ type: "imageWithMeta" }] }),
      defineField({ name: "screenshots", type: "array", of: [{ type: "image", options: { hotspot: true } }] }),
      defineField({ name: "featured", type: "boolean", initialValue: false }),
      defineField({ name: "order", type: "number", initialValue: 99 }),
      ...seoFields,
    ],
    preview: {
      select: {
        title: "title",
        type: "type",
        status: "status",
        featured: "featured",
        order: "order",
        media: "featuredImage.image",
      },
      prepare({ title, type, status, featured, order, media }) {
        return {
          title,
          subtitle: `${status || "published"} - ${type || "Project"}${featured ? ` - Featured #${order ?? 99}` : ""}`,
          media,
        };
      },
    },
  }),
  defineType({
    name: "experience",
    title: "Experience",
    type: "document",
    icon: CaseIcon,
    description: "Professional and freelance timeline entries.",
    orderings: [
      {
        title: "Current first",
        name: "currentFirst",
        by: [
          { field: "current", direction: "desc" },
          { field: "startDate", direction: "desc" },
        ],
      },
    ],
    fields: [
      statusField,
      defineField({ name: "company", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "role", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "employmentType", type: "string" }),
      defineField({ name: "location", type: "string" }),
      defineField({ name: "workMode", type: "string" }),
      defineField({ name: "companyUrl", title: "Company URL", type: "url" }),
      defineField({ name: "companyLogo", title: "Company logo", type: "imageWithMeta" }),
      defineField({ name: "startDate", type: "date" }),
      defineField({ name: "endDate", type: "date" }),
      defineField({ name: "dateRange", type: "string" }),
      defineField({ name: "current", type: "boolean", initialValue: false }),
      defineField({ name: "featuredOnHomepage", title: "Feature on homepage", type: "boolean", initialValue: false }),
      defineField({
        name: "homepageOrder",
        title: "Homepage order",
        type: "number",
        initialValue: 99,
        hidden: ({ document }) => !document?.featuredOnHomepage,
      }),
      defineField({ name: "summary", type: "text", rows: 3 }),
      defineField({ name: "responsibilities", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "achievements", type: "array", of: [{ type: "string" }] }),
      skillReferenceField,
      defineField({ name: "skills", type: "array", of: [{ type: "string" }] }),
      defineField({
        name: "relatedProjects",
        title: "Related projects",
        type: "array",
        of: [{ type: "reference", to: [{ type: "project" }] }],
      }),
    ],
    preview: {
      select: {
        title: "role",
        company: "company",
        dateRange: "dateRange",
        current: "current",
        status: "status",
        media: "companyLogo.image",
      },
      prepare({ title, company, dateRange, current, status, media }) {
        return {
          title,
          subtitle: `${status || "published"} - ${company || "Company"} - ${dateRange || "Timeline"}${current ? " - Current" : ""}`,
          media,
        };
      },
    },
  }),
  defineType({
    name: "education",
    title: "Education",
    type: "document",
    icon: BookIcon,
    description: "Academic history and results.",
    fields: [
      statusField,
      defineField({ name: "institution", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "degree", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "level",
        title: "Education level",
        type: "string",
        options: {
          list: ["Primary", "Secondary", "+2", "Bachelor", "Master", "PhD", "Diploma", "Other"],
        },
      }),
      defineField({ name: "dateRange", type: "string" }),
      defineField({ name: "location", type: "string" }),
      defineField({ name: "summary", type: "text", rows: 3 }),
      defineField({ name: "gradeSystem", title: "Grade system", type: "string" }),
      defineField({ name: "courses", title: "Relevant courses", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "honors", title: "Honors", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "achievements", type: "array", of: [{ type: "string" }] }),
      defineField({
        name: "resultEntries",
        title: "Percentage results",
        type: "array",
        description: "Manual percentage rows. Use this for semesters, school grades, +2 years, and future education.",
        of: [{ type: "educationResult" }],
      }),
      defineField({ name: "proofFile", title: "Proof file", type: "file" }),
      defineField({
        name: "showResultStats",
        title: "Show highest and average percentage",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "showResultEntries",
        title: "Show individual result rows",
        type: "boolean",
        initialValue: true,
      }),
      defineField({
        name: "showOnWebsite",
        title: "Show this education on website",
        type: "boolean",
        initialValue: true,
      }),
      defineField({ name: "order", type: "number", initialValue: 99 }),
    ],
    preview: {
      select: {
        title: "institution",
        degree: "degree",
        level: "level",
        dateRange: "dateRange",
        status: "status",
        showOnWebsite: "showOnWebsite",
      },
      prepare({ title, degree, level, dateRange, status, showOnWebsite }) {
        return {
          title,
          subtitle: `${status || "published"} - ${level || degree || "Education"} - ${dateRange || "Dates"}${
            showOnWebsite === false ? " - Hidden" : ""
          }`,
        };
      },
    },
  }),
  defineType({
    name: "skill",
    title: "Skill",
    type: "document",
    icon: TagIcon,
    description: "Reusable skills that can be connected to projects and experience.",
    fields: [
      statusField,
      defineField({ name: "name", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "iconName", title: "Icon name", type: "string" }),
      defineField({ name: "aliases", type: "array", of: [{ type: "string" }] }),
      defineField({
        name: "category",
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: "level",
        type: "string",
        options: { list: ["Learning", "Working", "Strong"] },
      }),
      defineField({ name: "featured", type: "boolean", initialValue: false }),
      defineField({ name: "order", type: "number", initialValue: 99 }),
    ],
    preview: {
      select: {
        title: "name",
        category: "category",
        level: "level",
        status: "status",
      },
      prepare({ title, category, level, status }) {
        return {
          title,
          subtitle: `${status || "published"} - ${category || "Skill"} - ${level || "Level"}`,
        };
      },
    },
  }),
  defineType({
    name: "stackCategory",
    title: "Stack Category",
    type: "document",
    icon: TagIcon,
    description: "The category heading and introduction used by the homepage stack showcase.",
    fields: [
      statusField,
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "label",
        title: "Section label",
        type: "string",
        description: "For example: 01 / Interface.",
      }),
      defineField({ name: "description", type: "text", rows: 3, validation: (Rule) => Rule.required() }),
      defineField({ name: "image", title: "Category fallback image", type: "imageWithMeta" }),
      defineField({ name: "order", type: "number", initialValue: 99 }),
    ],
    preview: {
      select: { title: "title", subtitle: "label", status: "status", media: "image.image" },
      prepare({ title, subtitle, status, media }) {
        return { title, subtitle: `${status || "published"}${subtitle ? ` - ${subtitle}` : ""}`, media };
      },
    },
  }),
  defineType({
    name: "skillShowcase",
    title: "Skill Showcase",
    type: "document",
    icon: DocumentTextIcon,
    description: "A skill-specific proof item for the homepage stack showcase.",
    fields: [
      statusField,
      defineField({
        name: "skill",
        title: "Skill",
        type: "reference",
        to: [{ type: "skill" }],
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({
        name: "description",
        title: "What I built",
        type: "text",
        rows: 4,
        validation: (Rule) => Rule.required(),
      }),
      defineField({ name: "project", title: "Related project", type: "reference", to: [{ type: "project" }] }),
      defineField({ name: "showOnRelatedProject", title: "Show on related project page", type: "boolean", initialValue: true }),
      defineField({ name: "image", title: "Showcase image", type: "imageWithMeta" }),
      defineField({ name: "demoVideo", title: "Showcase video", type: "file", options: { accept: "video/mp4,video/webm" } }),
      defineField({ name: "highlights", title: "Highlights", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "order", type: "number", initialValue: 99 }),
    ],
    preview: {
      select: { title: "title", skill: "skill.name", project: "project.title", status: "status", media: "image.image" },
      prepare({ title, skill, project, status, media }) {
        return { title, subtitle: `${status || "published"} - ${skill || "No skill"}${project ? ` - ${project}` : ""}`, media };
      },
    },
  }),
  defineType({
    name: "certification",
    title: "Certification",
    type: "document",
    icon: BarChartIcon,
    description: "Certificates, recognitions, and learning proof.",
    fields: [
      statusField,
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      defineField({ name: "issuer", type: "string" }),
      defineField({ name: "date", type: "string" }),
      defineField({ name: "issueDate", title: "Issue date", type: "date" }),
      defineField({ name: "expiryDate", title: "Expiry date", type: "date" }),
      defineField({ name: "credentialId", title: "Credential ID", type: "string" }),
      defineField({ name: "description", type: "text", rows: 3 }),
      defineField({ name: "credentialUrl", type: "url" }),
      defineField({ name: "credentialFile", type: "file" }),
      skillReferenceField,
      defineField({ name: "order", type: "number", initialValue: 99 }),
    ],
    preview: {
      select: {
        title: "title",
        issuer: "issuer",
        date: "date",
        status: "status",
      },
      prepare({ title, issuer, date, status }) {
        return {
          title,
          subtitle: `${status || "published"} - ${issuer || "Issuer"} - ${date || "Date"}`,
        };
      },
    },
  }),
  defineType({
    name: "article",
    title: "Article",
    type: "document",
    icon: DocumentTextIcon,
    description: "SEO-friendly articles and personal brand writing.",
    orderings: [
      {
        title: "Newest first",
        name: "publishedAtDesc",
        by: [{ field: "publishedAt", direction: "desc" }],
      },
    ],
    fields: [
      statusField,
      defineField({ name: "title", type: "string", validation: (Rule) => Rule.required() }),
      slugField,
      defineField({ name: "category", type: "string" }),
      defineField({ name: "excerpt", type: "text", rows: 3 }),
      defineField({ name: "publishedAt", type: "date" }),
      defineField({ name: "updatedAt", title: "Updated date", type: "date" }),
      defineField({ name: "featuredOnHomepage", title: "Feature on homepage", type: "boolean", initialValue: false }),
      defineField({
        name: "homepageOrder",
        title: "Homepage order",
        type: "number",
        initialValue: 99,
        hidden: ({ document }) => !document?.featuredOnHomepage,
      }),
      defineField({ name: "featuredOnArchive", title: "Feature in article archive", type: "boolean", initialValue: false }),
      defineField({ name: "archiveOrder", title: "Archive order", type: "number", initialValue: 99 }),
      defineField({ name: "coverImage", title: "Cover image", type: "imageWithMeta" }),
      defineField({ name: "tags", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "showOnRelatedProject", title: "Show on related project pages", type: "boolean", initialValue: true }),
      defineField({ name: "body", type: "richContent" }),
      defineField({
        name: "relatedProjects",
        title: "Related projects",
        type: "array",
        of: [{ type: "reference", to: [{ type: "project" }] }],
      }),
      defineField({
        name: "relatedArticles",
        title: "Related articles",
        type: "array",
        of: [{ type: "reference", to: [{ type: "article" }] }],
      }),
      ...seoFields,
    ],
    preview: {
      select: {
        title: "title",
        subtitle: "publishedAt",
        status: "status",
        media: "coverImage.image",
      },
      prepare({ title, subtitle, status, media }) {
        return {
          title,
          subtitle: `${status || "published"} - ${subtitle || "No publish date"}`,
          media,
        };
      },
    },
  }),
];

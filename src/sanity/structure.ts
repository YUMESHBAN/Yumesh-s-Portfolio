import {
  AddDocumentIcon,
  BarChartIcon,
  BookIcon,
  CaseIcon,
  CogIcon,
  DashboardIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  EditIcon,
  LaunchIcon,
  ProjectsIcon,
  SearchIcon,
  SparklesIcon,
  StarIcon,
  TagIcon,
  TrendUpwardIcon,
  UserIcon,
} from "@sanity/icons";
import type { ComponentType } from "react";
import type { StructureResolver } from "sanity/structure";

const singletonTypes = new Set(["personProfile", "siteSettings", "aboutJourney"]);

function singletonItem(
  S: Parameters<StructureResolver>[0],
  typeName: "personProfile" | "siteSettings" | "aboutJourney",
  title: string,
  icon: ComponentType,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .id(typeName)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

function filteredListItem(
  S: Parameters<StructureResolver>[0],
  schemaType: string,
  title: string,
  icon: ComponentType,
  filter: string,
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(S.documentTypeList(schemaType).title(title).filter(filter));
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Yumesh Portfolio Dashboard")
    .items([
      S.listItem()
        .title("Start Here")
        .icon(DashboardIcon)
        .child(
          S.list()
            .title("Portfolio Control Center")
            .items([
              singletonItem(S, "personProfile", "Edit Yumesh Profile", UserIcon),
              singletonItem(S, "siteSettings", "Edit Site, SEO and CV", CogIcon),
              S.divider(),
              S.listItem()
                .title("Add New Project")
                .icon(AddDocumentIcon)
                .child(
                  S.documentWithInitialValueTemplate("project-from-dashboard", {
                    featured: true,
                    order: 99,
                  })
                    .schemaType("project")
                    .title("New Project"),
                ),
              S.listItem()
                .title("Add New Article")
                .icon(EditIcon)
                .child(
                  S.documentWithInitialValueTemplate("article-from-dashboard", {
                    publishedAt: new Date().toISOString().slice(0, 10),
                  })
                    .schemaType("article")
                    .title("New Article"),
                ),
              S.listItem()
                .title("Add New Experience")
                .icon(CaseIcon)
                .child(
                  S.documentWithInitialValueTemplate("experience-from-dashboard", {
                    current: false,
                    workMode: "Hybrid",
                  })
                    .schemaType("experience")
                    .title("New Experience"),
                ),
              S.divider(),
              filteredListItem(S, "project", "Featured Projects", StarIcon, '_type == "project" && featured == true'),
              filteredListItem(S, "article", "Published Articles", DocumentTextIcon, '_type == "article" && defined(publishedAt)'),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Identity and SEO")
        .icon(SearchIcon)
        .child(
          S.list()
            .title("Identity and SEO")
            .items([
              singletonItem(S, "personProfile", "Person Profile", UserIcon),
              singletonItem(S, "siteSettings", "Site Settings", EarthGlobeIcon),
              S.listItem()
                .title("SEO Articles")
                .icon(DocumentTextIcon)
                .child(S.documentTypeList("article").title("SEO Articles").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
            ]),
        ),

      S.listItem()
        .title("Projects")
        .icon(ProjectsIcon)
        .child(
          S.list()
            .title("Project CRUD")
            .items([
              S.documentTypeListItem("project").title("All Projects").icon(ProjectsIcon),
              filteredListItem(S, "project", "Company Projects", CaseIcon, '_type == "project" && type == "Company"'),
              filteredListItem(S, "project", "Academic Projects", BookIcon, '_type == "project" && type == "Academic"'),
              filteredListItem(S, "project", "Freelance Projects", SparklesIcon, '_type == "project" && type == "Freelance"'),
              filteredListItem(S, "project", "Learning Projects", TrendUpwardIcon, '_type == "project" && type == "Learning"'),
            ]),
        ),

      S.listItem()
        .title("Career Timeline")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Career Timeline")
            .items([
              S.documentTypeListItem("experience").title("Experience").icon(CaseIcon),
              singletonItem(S, "aboutJourney", "About Page Journey", TrendUpwardIcon),
              filteredListItem(S, "experience", "Current Roles", LaunchIcon, '_type == "experience" && current == true'),
              S.documentTypeListItem("education").title("Education").icon(BookIcon),
              S.documentTypeListItem("certification").title("Certifications").icon(BarChartIcon),
            ]),
        ),

      S.listItem()
        .title("Skills")
        .icon(TagIcon)
        .child(
          S.list()
            .title("Skills by Category")
            .items([
              S.documentTypeListItem("skill").title("All Skills").icon(TagIcon),
              filteredListItem(S, "skill", "Frontend", TagIcon, '_type == "skill" && category == "Frontend"'),
              filteredListItem(S, "skill", "Backend", TagIcon, '_type == "skill" && category == "Backend"'),
              filteredListItem(S, "skill", "CMS", TagIcon, '_type == "skill" && category == "CMS"'),
              filteredListItem(S, "skill", "Database", TagIcon, '_type == "skill" && category == "Database"'),
              filteredListItem(S, "skill", "Tools", TagIcon, '_type == "skill" && category == "Tools"'),
              filteredListItem(S, "skill", "Soft Skills", TagIcon, '_type == "skill" && category == "Soft Skills"'),
            ]),
        ),

      S.listItem()
        .title("Stack Showcase")
        .icon(SparklesIcon)
        .child(
          S.list()
            .title("Homepage Stack Showcase")
            .items([
              S.documentTypeListItem("stackCategory").title("Categories").icon(TagIcon),
              S.documentTypeListItem("skillShowcase").title("Skill Proofs").icon(DocumentTextIcon),
            ]),
        ),

      S.listItem()
        .title("All Documents")
        .icon(DashboardIcon)
        .child(
          S.list()
            .title("Advanced CRUD")
            .items(S.documentTypeListItems().filter((listItem) => !singletonTypes.has(listItem.getId() ?? ""))),
        ),
    ]);

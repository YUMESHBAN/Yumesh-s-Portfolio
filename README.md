# Yumesh Ban Portfolio

Official personal brand portfolio for Yumesh Ban, built with Next.js and Sanity.

## What This Project Does

- Shows Yumesh Ban as a full stack developer from Kathmandu, Nepal.
- Publishes SEO-friendly pages for searches like "Yumesh Ban" and "Who is Yumesh Ban".
- Uses Sanity Studio as a custom content dashboard for profile, SEO, projects, articles, experience, education, skills, and certifications.

## Beginner Map

- `src/app` contains website pages.
- `src/content/fallback.ts` contains local portfolio data used before Sanity is connected.
- `src/sanity/schemaTypes/index.ts` defines the fields shown in Sanity Studio.
- `src/sanity/structure.ts` customizes the Studio dashboard/sidebar.
- `src/components/studio` contains the custom Studio dashboards mounted at `/studio/...`.
- `src/lib/content.ts` loads Sanity content first and falls back to local data.
- `src/app/studio/[[...tool]]` embeds Sanity Studio inside the Next.js app.
- `scripts/seed-sanity.ts` uploads the fallback data into Sanity.

## Commands

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
npm.cmd run studio
npm.cmd run seed:sanity
```

## Node Version

Use Node.js `20.19+` or `22.12+`. Sanity Studio commands can fail on Node `22.11.0`, even though the Next.js site can still build.

## Sanity Setup

Create `.env.local` from `.env.example`, then fill:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=
SANITY_REVALIDATE_SECRET=
```

Run `npm.cmd run seed:sanity` after adding a write token to load the starting portfolio content into Sanity.

## Custom Sanity Dashboard

Open `/studio` after starting the dev server.

CRUD means Create, Read, Update, and Delete. In this project, CRUD means you can add, view, edit, and remove portfolio content from Sanity Studio without touching code.

The custom Studio sidebar is organized as:

- `/studio/overview`: quick stats and shortcuts.
- `/studio/profile`: profile, academic result, social links, site title, keywords, and SEO settings.
- `/studio/project`: CornyClouds-style project dashboard where projects can be added, edited, filtered, featured, ordered, and deleted.
- `/studio/article`: article dashboard for SEO writing such as "Who is Yumesh Ban?"
- `/studio/experience`: career timeline dashboard for developer roles, freelance work, and internships.
- `/studio/education`: education dashboard for primary, secondary, +2, bachelor, and future education result percentages, highest/average stats, and website visibility.
- `/studio/skill`: reusable skill library for connecting skills to projects, experience, and certifications.
- `/studio/certification`: certification and credential dashboard.
- `/studio/documents`: organized documents dashboard with sections for profile/settings, projects, articles, experience, education, skills, certifications, and media/files.
- `/studio/desk`: fallback advanced Sanity document editor, hidden from the main sidebar.

The older `/dashboard` route redirects to `/studio`; Studio is the only admin interface.

## Launch Checklist

1. Create a real Sanity project and replace `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. Add a Sanity write token as `SANITY_API_TOKEN`.
3. Run `npm.cmd run seed:sanity` to upload the starter portfolio content.
4. Deploy the project to Vercel.
5. Attach a custom domain such as `yumeshban.com`, `yumeshban.dev`, or `yumeshban.com.np`.
6. Add a Sanity webhook pointing to `/api/revalidate`.
7. Open Google Search Console, verify the domain, and submit `/sitemap.xml`.
8. Use URL Inspection in Search Console for the homepage and `/about`.

import { createClient } from "@sanity/client";

import { loadLocalEnv } from "./load-env";

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !token) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_TOKEN. Add them to your environment before seeding Sanity.");
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-03-01", useCdn: false });

function span(text: string, marks: string[] = []) {
  return { _key: `span-${Math.random().toString(36).slice(2, 8)}`, _type: "span", text, marks };
}

function textBlock(text: string, index: number, style: "normal" | "h2" = "normal") {
  return { _key: `block-${index}`, _type: "block", style, markDefs: [], children: [span(text)] };
}

function highlightedBlock(before: string, highlighted: string, after: string, index: number) {
  return {
    _key: `block-${index}`,
    _type: "block",
    style: "normal",
    markDefs: [],
    children: [span(before), span(highlighted, ["highlight"]), span(after)],
  };
}

const project = await client.fetch<{ _id: string; featuredImage?: Record<string, unknown> } | null>(
  `*[_type == "project" && slug.current == "merry-crochets"][0]{_id, featuredImage}`,
);

if (!project) {
  throw new Error("The Merry Crochets project was not found. Seed the project before its related article.");
}

const slug = "merry-crochets-nextjs-sanity-stripe-clerk";
const existingId = await client.fetch<string | null>(`*[_type == "article" && slug.current == $slug][0]._id`, { slug });
const articleId = existingId ?? `article-${slug}`;
const sharedImage = project.featuredImage?.image
  ? {
      _key: "merry-crochets-image",
      _type: "imageWithMeta",
      image: project.featuredImage.image,
      alt: "Merry Crochets storefront",
      caption: "Merry Crochets / a CMS-backed commerce experience",
    }
  : null;

const body = [
  textBlock("Merry Crochets is a full-stack e-commerce platform for authentic Nepali crochet products. I treated it as more than a storefront: the work had to support discovery, checkout, content updates, and the operational work behind each order.", 1),
  textBlock("The brief", 2, "h2"),
  highlightedBlock("The main goal was a ", "commerce experience that feels simple for customers and manageable for the people updating it.", " That meant designing the customer-facing journey and the content workflow as one product.", 3),
  {
    _key: "takeaway-1",
    _type: "keyTakeawayBlock",
    label: "Key takeaway",
    body: "A polished storefront only stays useful when the product, content, and order workflows behind it are equally considered.",
  },
  textBlock("What the platform needed", 4, "h2"),
  textBlock("The scope combined product browsing, cart and wishlist flows, payment, authentication, admin access, transactional email, and CMS-backed content. Each part affects the others: product information has to be structured for both presentation and management, while the purchase flow needs clear states for customers and the team handling orders.", 5),
  {
    _key: "finding-1",
    _type: "calloutBlock",
    tone: "Finding",
    title: "Content is part of the product system",
    body: "Sanity was used so product and editorial content could evolve without turning routine changes into code deployments.",
  },
  textBlock("How the build came together", 6, "h2"),
  textBlock("Next.js and TypeScript provided the application foundation. Sanity handled structured content, Stripe supported payments, Clerk protected customer and admin flows, and Nodemailer supported the email layer. The stack was chosen as a set of focused responsibilities rather than as a checklist of tools.", 7),
  ...(sharedImage ? [{ ...sharedImage, _key: "merry-crochets-image-inline", layout: "sideRight" }] : []),
  textBlock("The build followed three connected concerns:", 8),
  {
    _key: "list-1",
    _type: "block",
    style: "normal",
    listItem: "number",
    markDefs: [],
    children: [span("Make product discovery and shopping flows straightforward on every screen size.")],
  },
  {
    _key: "list-2",
    _type: "block",
    style: "normal",
    listItem: "number",
    markDefs: [],
    children: [span("Model content so new products and storefront changes can be managed through the CMS.")],
  },
  {
    _key: "list-3",
    _type: "block",
    style: "normal",
    listItem: "number",
    markDefs: [],
    children: [span("Protect customer and admin actions while keeping checkout and communication clear.")],
  },
  textBlock("What this project demonstrates", 9, "h2"),
  textBlock("Merry Crochets demonstrates full-stack product thinking: a visible interface backed by deliberate content modeling, authenticated workflows, payments, and operational details. It is a useful example of how I approach a real product problem from the customer experience through to the system that supports it.", 10),
  {
    _key: "conclusion-1",
    _type: "calloutBlock",
    tone: "Conclusion",
    title: "A complete product, not just a frontend",
    body: "The strongest outcome is the connection between the storefront people use and the workflow that keeps it current, secure, and ready to operate.",
  },
];

await client.createOrReplace({
  _id: articleId,
  _type: "article",
  status: "published",
  title: "How I Built Merry Crochets with Next.js, Sanity, Stripe, and Clerk",
  slug: { _type: "slug", current: slug },
  category: "Case Study",
  excerpt: "A full-stack commerce case study: connecting an approachable storefront with CMS content, payments, authentication, and the operational workflow behind it.",
  publishedAt: "2026-06-15",
  updatedAt: new Date().toISOString().slice(0, 10),
  tags: ["Next.js", "Sanity", "E-commerce", "Stripe", "Clerk"],
  featuredOnHomepage: true,
  homepageOrder: 1,
  featuredOnArchive: true,
  archiveOrder: 1,
  ...(sharedImage ? { coverImage: { ...sharedImage, _key: "merry-crochets-cover" } } : {}),
  body,
  relatedProjects: [{ _key: "related-project-merry-crochets", _type: "reference", _ref: project._id }],
  seoTitle: "Merry Crochets: a full-stack e-commerce case study",
  seoDescription: "How I built Merry Crochets with Next.js, Sanity, Stripe, Clerk, and a CMS-backed commerce workflow.",
  canonicalPath: `/articles/${slug}`,
});

console.log(`Seeded ${articleId} into ${projectId}/${dataset}.`);

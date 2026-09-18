export const semanticIconOptions = [
  { value: "responsive", title: "Responsive layout" },
  { value: "route", title: "Routing" },
  { value: "database", title: "Data" },
  { value: "sparkles", title: "Interaction" },
  { value: "code", title: "Code and APIs" },
  { value: "shield", title: "Authentication" },
  { value: "credit-card", title: "Payments" },
  { value: "boxes", title: "Content modelling" },
  { value: "send", title: "Content delivery" },
  { value: "layout-dashboard", title: "Dashboard" },
  { value: "newspaper", title: "Publishing" },
  { value: "shopping-cart", title: "Commerce" },
  { value: "search", title: "Discovery" },
  { value: "chart", title: "Analytics" },
  { value: "trophy", title: "Ranking" },
  { value: "key", title: "Authorization" },
  { value: "test", title: "Testing" },
  { value: "image", title: "Media" },
  { value: "network", title: "Information architecture" },
  { value: "workflow", title: "Workflow" },
  { value: "badge-check", title: "Quality assurance" },
  { value: "file-search", title: "Technical analysis" },
  { value: "users", title: "Collaboration" },
] as const;

export type SemanticIconName = (typeof semanticIconOptions)[number]["value"];

const defaultSemanticIcons: Record<string, SemanticIconName> = {
  "Responsive UI Engineering": "responsive",
  "Client-side Routing": "route",
  "State Management & Local Persistence": "database",
  "Interaction, Theme & Motion Design": "sparkles",
  "Django & Django REST Framework": "code",
  "REST API Design": "code",
  "Authentication & Authorization": "shield",
  "Payments, Webhooks & Integrations": "credit-card",
  "Content Modelling": "boxes",
  "Content Delivery & Fallbacks": "send",
  "Admin & Dashboard Design": "layout-dashboard",
  "Editorial Publishing Workflows": "newspaper",
  "MongoDB & Mongoose": "database",
  "SQLite & Django ORM": "database",
  "Data Modelling": "database",
  "Commerce & Inventory Data": "shopping-cart",
  "Product Discovery & Catalog Data": "search",
  "Learning, Analytics & Result Data": "chart",
  "Recommendation & Ranking Data": "trophy",
  NextAuth: "key",
  "Sentry & Clarity": "chart",
  "Jest & Testing Library": "test",
  "Cloudinary & Multer": "image",
  "Information Architecture": "network",
  "UX Workflow Design": "workflow",
  "Quality Assurance & Release Readiness": "badge-check",
  "Technical Communication & Limitation Analysis": "file-search",
  "Collaboration & Problem Solving": "users",
};

export function getSemanticIconName(name: string, semanticIconName?: string): SemanticIconName {
  if (semanticIconOptions.some((option) => option.value === semanticIconName)) {
    return semanticIconName as SemanticIconName;
  }

  return defaultSemanticIcons[name] ?? "sparkles";
}

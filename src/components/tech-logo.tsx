"use client";

import Image from "next/image";
import {
  BadgeCheck,
  Boxes,
  Braces,
  ChartNoAxesCombined,
  CreditCard,
  Database,
  FileSearch,
  ImageIcon,
  KeyRound,
  LayoutDashboard,
  MonitorSmartphone,
  Network,
  Newspaper,
  Route,
  Search,
  Send,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TestTube2,
  Trophy,
  UsersRound,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

import { getSemanticIconName, type SemanticIconName } from "@/lib/skill-icons";

const techLogos: Record<string, string> = {
  "Next.js": "/tech-icons/nextdotjs.svg",
  NextJS: "/tech-icons/nextdotjs.svg",
  React: "/tech-icons/react.svg",
  TypeScript: "/tech-icons/typescript.svg",
  JavaScript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  "Tailwind CSS": "/tech-icons/tailwindcss.svg",
  TailwindCSS: "/tech-icons/tailwindcss.svg",
  "Node.js": "/tech-icons/nodedotjs.svg",
  NodeJS: "/tech-icons/nodedotjs.svg",
  "Express.js": "/tech-icons/express.svg",
  ExpressJS: "/tech-icons/express.svg",
  MongoDB: "/tech-icons/mongodb.svg",
  SQLite: "/tech-icons/sqlite.svg",
  MariaDB: "/tech-icons/mariadb.svg",
  Django: "/tech-icons/django.svg",
  "Sanity CMS": "/tech-icons/sanity.svg",
  Sanity: "/tech-icons/sanity.svg",
  Stripe: "https://cdn.simpleicons.org/stripe/635BFF",
  Clerk: "https://cdn.simpleicons.org/clerk/6C47FF",
  Vercel: "https://cdn.simpleicons.org/vercel/FFFFFF",
  Git: "/tech-icons/git.svg",
  Figma: "/tech-icons/figma.svg",
  Photoshop: "/tech-icons/adobephotoshop.svg",
  Java: "https://cdn.simpleicons.org/openjdk/FFFFFF",
  JWT: "https://cdn.simpleicons.org/jsonwebtokens/FFFFFF",
};

const semanticIcons: Record<SemanticIconName, LucideIcon> = {
  responsive: MonitorSmartphone,
  route: Route,
  database: Database,
  sparkles: Sparkles,
  code: Braces,
  shield: ShieldCheck,
  "credit-card": CreditCard,
  boxes: Boxes,
  send: Send,
  "layout-dashboard": LayoutDashboard,
  newspaper: Newspaper,
  "shopping-cart": ShoppingCart,
  search: Search,
  chart: ChartNoAxesCombined,
  trophy: Trophy,
  key: KeyRound,
  test: TestTube2,
  image: ImageIcon,
  network: Network,
  workflow: Workflow,
  "badge-check": BadgeCheck,
  "file-search": FileSearch,
  users: UsersRound,
};

export function TechLogo({ name, iconName, semanticIconName }: { name: string; iconName?: string; semanticIconName?: string }) {
  const logo = techLogos[name] ?? (iconName ? `https://cdn.simpleicons.org/${encodeURIComponent(iconName)}/FFFFFF` : undefined);
  const [failed, setFailed] = useState(false);
  const SemanticIcon = semanticIcons[getSemanticIconName(name, semanticIconName)];

  useEffect(() => {
    setFailed(false);
  }, [logo]);

  return (
    <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
      {!logo || failed ? <SemanticIcon size={24} strokeWidth={1.8} aria-hidden="true" /> : null}
      {logo && !failed ? (
        <Image
          src={logo}
          alt=""
          width={24}
          height={24}
          className="absolute size-6 object-contain"
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}

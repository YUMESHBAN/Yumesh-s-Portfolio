"use client";

import Image from "next/image";
import { useState } from "react";

const techLogos: Record<string, string> = {
  "Next.js": "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
  NextJS: "https://cdn.simpleicons.org/nextdotjs/FFFFFF",
  React: "https://cdn.simpleicons.org/react/61DAFB",
  TypeScript: "https://cdn.simpleicons.org/typescript/3178C6",
  JavaScript: "https://cdn.simpleicons.org/javascript/F7DF1E",
  "Tailwind CSS": "https://cdn.simpleicons.org/tailwindcss/38BDF8",
  TailwindCSS: "https://cdn.simpleicons.org/tailwindcss/38BDF8",
  "Node.js": "https://cdn.simpleicons.org/nodedotjs/5FA04E",
  NodeJS: "https://cdn.simpleicons.org/nodedotjs/5FA04E",
  "Express.js": "https://cdn.simpleicons.org/express/FFFFFF",
  ExpressJS: "https://cdn.simpleicons.org/express/FFFFFF",
  MongoDB: "https://cdn.simpleicons.org/mongodb/47A248",
  SQLite: "https://cdn.simpleicons.org/sqlite/3F9CD6",
  MariaDB: "https://cdn.simpleicons.org/mariadb/1F305F",
  Django: "https://cdn.simpleicons.org/django/44B78B",
  "Sanity CMS": "https://cdn.simpleicons.org/sanity/F03E2F",
  Sanity: "https://cdn.simpleicons.org/sanity/F03E2F",
  Stripe: "https://cdn.simpleicons.org/stripe/635BFF",
  Clerk: "https://cdn.simpleicons.org/clerk/6C47FF",
  Vercel: "https://cdn.simpleicons.org/vercel/FFFFFF",
  Git: "https://cdn.simpleicons.org/git/F05032",
  Figma: "https://cdn.simpleicons.org/figma/F24E1E",
  Photoshop: "https://cdn.simpleicons.org/adobephotoshop/31A8FF",
  Java: "https://cdn.simpleicons.org/openjdk/FFFFFF",
  JWT: "https://cdn.simpleicons.org/jsonwebtokens/FFFFFF",
};

function initials(name: string) {
  return name
    .split(/[\s.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TechLogo({ name, iconName }: { name: string; iconName?: string }) {
  const logo = techLogos[name] ?? (iconName ? `https://cdn.simpleicons.org/${encodeURIComponent(iconName)}/FFFFFF` : undefined);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
      <span aria-hidden="true">{initials(name)}</span>
      {logo && !failed ? (
        <Image
          src={logo}
          alt=""
          width={24}
          height={24}
          className={`absolute size-6 object-contain transition-opacity ${loaded ? "opacity-100" : "opacity-0"}`}
          unoptimized
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : null}
    </span>
  );
}

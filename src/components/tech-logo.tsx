"use client";

import Image from "next/image";
import { useState } from "react";

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
  const [failed, setFailed] = useState(false);

  return (
    <span className="relative grid size-12 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-semibold text-white">
      {!logo || failed ? <span aria-hidden="true">{initials(name)}</span> : null}
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

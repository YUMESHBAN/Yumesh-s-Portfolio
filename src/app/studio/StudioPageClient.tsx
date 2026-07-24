"use client";

import { usePathname } from "next/navigation";
import { NextStudio } from "next-sanity/studio";

import StudioLayout from "@/components/StudioLayout";

import config from "../../../sanity.config";

export default function StudioPageClient() {
  const pathname = usePathname();

  return (
    <StudioLayout>
      <NextStudio key={pathname ?? "studio"} config={config} />
    </StudioLayout>
  );
}

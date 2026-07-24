"use client";

import { usePathname } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { PersonProfile, SiteSettings } from "@/types/content";

type SiteChromeProps = {
  children: React.ReactNode;
  profile: PersonProfile;
  settings: SiteSettings;
};

export function SiteChrome({ children, profile, settings }: SiteChromeProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith("/studio");

  if (isStudioRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader profile={profile} settings={settings} />
      <main className="site-surface">{children}</main>
      <SiteFooter profile={profile} settings={settings} />
    </>
  );
}

import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import "@/app/globals.css";
import { JsonLd } from "@/components/json-ld";
import { SiteChrome } from "@/components/site-chrome";
import { getPersonProfile, getSiteSettings } from "@/lib/content";
import { personJsonLd, websiteJsonLd } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.siteUrl),
    title: {
      default: settings.title,
      template: "%s | Yumesh Ban",
    },
    description: settings.description,
    keywords: settings.keywords,
    authors: [{ name: "Yumesh Ban", url: settings.siteUrl }],
    creator: "Yumesh Ban",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: settings.siteUrl,
      title: settings.title,
      description: settings.description,
      siteName: "Yumesh Ban",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.title,
      description: settings.description,
      creator: "@YumeshBan",
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0c",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [profile, settings] = await Promise.all([getPersonProfile(), getSiteSettings()]);

  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <JsonLd data={websiteJsonLd(settings)} />
        <JsonLd data={personJsonLd(profile, settings)} />
        <SiteChrome profile={profile} settings={settings}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}

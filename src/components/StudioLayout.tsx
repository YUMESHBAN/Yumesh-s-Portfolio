"use client";

import { usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";

import StudioNavbar from "@/components/StudioNavbar";

type StudioLayoutProps = {
  children: ReactNode;
};

export default function StudioLayout({ children }: StudioLayoutProps) {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlOverflow = html.style.overflow;
    const originalBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.classList.add("portfolio-studio-page");

    return () => {
      html.style.overflow = originalHtmlOverflow;
      body.style.overflow = originalBodyOverflow;
      html.classList.remove("portfolio-studio-page");
    };
  }, []);

  return (
    <div className="portfolio-studio-wrapper">
      <StudioNavbar />
      <main className="portfolio-studio-content">
        <div key={pathname}>{children}</div>
      </main>
      <style jsx global>{`
        .sanity-studio-navbar,
        [data-ui="Navbar"] {
          display: none !important;
        }

        html.portfolio-studio-page,
        html.portfolio-studio-page body {
          height: 100% !important;
          overflow: hidden !important;
          color-scheme: light !important;
        }

        .portfolio-studio-wrapper {
          position: fixed;
          inset: 0;
          display: flex;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #f8f7f2;
        }

        .portfolio-studio-content {
          flex: 1;
          height: 100vh;
          margin-left: var(--studio-sidebar-width, 264px);
          overflow: auto;
          transition: margin-left 180ms ease;
        }

        @media (max-width: 1023px) {
          .portfolio-studio-content {
            height: calc(100vh - 64px);
            margin-top: 64px;
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
}

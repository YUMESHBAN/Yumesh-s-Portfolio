"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ComponentType } from "react";
import {
  BriefcaseBusiness,
  Award,
  ChevronLeft,
  ChevronRight,
  Database,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  LayoutDashboard,
  Menu,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  icon: ComponentType<{ size?: number }>;
};

const navItems: NavItem[] = [
  { label: "Overview", path: "/studio/overview", icon: LayoutDashboard },
  { label: "Profile", path: "/studio/profile", icon: UserRound },
  { label: "Projects", path: "/studio/project", icon: FolderKanban },
  { label: "Articles", path: "/studio/article", icon: FileText },
  { label: "Experience", path: "/studio/experience", icon: BriefcaseBusiness },
  { label: "Education", path: "/studio/education", icon: GraduationCap },
  { label: "Stack showcase", path: "/studio/skill", icon: Sparkles },
  { label: "Certifications", path: "/studio/certification", icon: Award },
  { label: "Documents", path: "/studio/documents", icon: Database },
];

function isActivePath(pathname: string | null, itemPath: string) {
  if (!pathname) {
    return false;
  }

  if (itemPath === "/studio/overview") {
    return pathname === "/studio" || pathname.startsWith(itemPath);
  }

  return pathname.startsWith(itemPath);
}

export default function StudioNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem("portfolio-studio-sidebar-collapsed") === "true";
  });

  useEffect(() => {
    const width = isCollapsed ? "82px" : "264px";
    document.documentElement.style.setProperty("--studio-sidebar-width", width);
    window.localStorage.setItem("portfolio-studio-sidebar-collapsed", String(isCollapsed));
  }, [isCollapsed]);

  function navigateTo(path: string) {
    setIsOpen(false);
    router.push(path);
    router.refresh();
  }

  return (
    <>
      <div className="studio-mobile-bar">
        <Link href="/studio/overview" className="studio-mobile-brand">
          <LayoutDashboard size={20} />
          <span>Studio</span>
        </Link>
        <button type="button" onClick={() => setIsOpen((current) => !current)} className="studio-icon-button" aria-label="Toggle studio navigation">
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isOpen ? <button type="button" className="studio-mobile-overlay" onClick={() => setIsOpen(false)} aria-label="Close studio navigation" /> : null}

      <aside className={`studio-sidebar ${isOpen ? "is-open" : ""} ${isCollapsed ? "is-collapsed" : ""}`}>
        <div className="studio-sidebar-brand">
          <Link href="/studio/overview" className="studio-brand-mark" onClick={() => setIsOpen(false)}>
            <span>YB</span>
            {!isCollapsed ? (
              <div>
                <strong>Yumesh Ban</strong>
                <small>Portfolio Studio</small>
              </div>
            ) : null}
          </Link>
        </div>

        <nav className="studio-sidebar-nav" aria-label="Studio dashboard navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActivePath(pathname, item.path);

            return (
              <button
                key={item.path}
                type="button"
                title={isCollapsed ? item.label : undefined}
                onClick={() => navigateTo(item.path)}
                className={`studio-nav-link ${active ? "is-active" : ""}`}
              >
                <Icon size={18} />
                {!isCollapsed ? <span>{item.label}</span> : null}
              </button>
            );
          })}
        </nav>

        <div className="studio-sidebar-footer">
          <button
            type="button"
            onClick={() => setIsCollapsed((current) => !current)}
            className="studio-nav-link studio-collapse-link"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!isCollapsed ? <span>Collapse</span> : null}
          </button>

          <Link href="/" className="studio-nav-link" title={isCollapsed ? "View site" : undefined}>
            <Home size={18} />
            {!isCollapsed ? <span>View Site</span> : null}
          </Link>
        </div>
      </aside>
    </>
  );
}

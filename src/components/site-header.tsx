"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Download, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import type { PersonProfile, SiteSettings } from "@/types/content";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/articles", label: "Writing" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({
  profile,
  settings,
}: {
  profile: PersonProfile;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let animationFrame: number | undefined;
    const updateScrollState = () => {
      if (animationFrame) return;

      animationFrame = window.requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);
        animationFrame = undefined;
      });
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === "/works") {
      return pathname === href || pathname?.startsWith(`${href}/`);
    }

    return pathname === href || (href !== "/" && pathname?.startsWith(href));
  };

  const navLinkClass = (href: string) => {
    return [
      "relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70",
      isActive(href) ? "bg-white/[0.14] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" : "",
    ].join(" ");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto border border-transparent bg-[#101115]/92 px-4 backdrop-blur-2xl will-change-[width,max-width,height,margin,border-radius,box-shadow] transition-[margin,width,max-width,height,min-height,border-color,border-radius,background-color,box-shadow] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          isScrolled
            ? `mt-3 ${menuOpen ? "min-h-16" : "h-16"} w-[calc(100%-1.5rem)] max-w-6xl rounded-2xl border-white/[0.12] shadow-[0_18px_34px_-18px_rgba(132,164,231,0.36),0_6px_16px_-14px_rgba(96,165,250,0.22)]`
            : `${menuOpen ? "min-h-[76px]" : "h-[76px]"} w-full max-w-[100vw]`
          }`}
      >
        <div className={`site-container relative flex ${isScrolled ? "h-16" : "h-[76px]"} items-center justify-between gap-4 px-0 transition-[height] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none`}>
          <Link
            href="/"
            className="group inline-flex min-w-0 items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70"
            aria-label={`${profile.name} home`}
          >
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden">
              <Image
                src="/images/yb-logo-abstract.png"
                alt="Yumesh Ban Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold tracking-[-0.02em] text-white transition-colors group-hover:text-blue-200">{profile.name}</span>
            </span>
          </Link>

        <nav
          className={`absolute left-1/2 hidden transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none xl:flex ${
            isScrolled ? "-translate-x-1/2" : "-translate-x-1/2 lg:translate-x-[calc(-50%+16rem)]"
          }`}
          aria-label="Primary navigation"
        >
          <div className="flex items-center rounded-xl border border-white/[0.13] bg-white/[0.06] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
            {navItems.map((item) => {
              const itemIsActive = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={navLinkClass(item.href)}
                  aria-current={itemIsActive ? "page" : undefined}
                >
                  {itemIsActive ? (
                    <span className="size-1 rounded-full bg-blue-200 shadow-[0_0_8px_rgba(191,219,254,0.9)]" aria-hidden="true" />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <a
          href={settings.cvUrl}
          className="ml-auto hidden items-center gap-2 rounded-xl border border-blue-300/30 bg-blue-300/[0.1] px-4 py-2.5 text-sm font-medium text-blue-100 transition hover:border-blue-200/60 hover:bg-blue-300 hover:text-[#0b0b0c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 xl:inline-flex"
          aria-label="Download Yumesh Ban CV"
        >
          Resume
          <Download size={16} />
        </a>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="grid size-10 place-items-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-white transition hover:border-blue-300/40 hover:bg-blue-300/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/70 xl:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        </div>

      {menuOpen ? (
        <nav className="site-container grid gap-1 border-t border-white/[0.07] px-0 pb-4 pt-3 xl:hidden" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`${navLinkClass(item.href)} rounded-lg px-3 py-3`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={settings.cvUrl}
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-300 px-4 py-3 text-sm font-medium text-[#0b0b0c] transition hover:bg-blue-200"
          >
            Resume
            <Download size={16} />
          </a>
        </nav>
      ) : null}
      </div>
    </header>
  );
}

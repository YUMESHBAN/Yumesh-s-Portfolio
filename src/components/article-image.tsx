"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type ArticleImageProps = {
  src: string;
  alt: string;
  caption?: string;
  className: string;
  sizes: string;
};

export function ArticleImage({ src, alt, caption, className, sizes }: ArticleImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeModal = useCallback(() => {
    setIsExpanded(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isExpanded) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeModal, isExpanded]);

  return <>
    <figure className={`article-content-media ${className}`}>
      <button ref={triggerRef} type="button" onClick={() => setIsExpanded(true)} className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300" aria-label={`Expand ${alt}`}>
        <div className="overflow-hidden border border-white/10 bg-black/25">
          <Image src={src} alt={alt} width={1800} height={1200} sizes={sizes} className="h-auto w-full transition duration-500 group-hover:scale-[1.015]" />
        </div>
      </button>
      {caption ? <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{caption}</figcaption> : null}
    </figure>

    {isExpanded ? createPortal(
      <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-xl sm:p-8" role="dialog" aria-modal="true" aria-label="Expanded article image" onClick={closeModal}>
        <div ref={dialogRef} className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#101116] shadow-2xl" onClick={(event) => event.stopPropagation()}>
          <button ref={closeButtonRef} type="button" onClick={closeModal} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black" aria-label="Close enlarged image"><X size={20} /></button>
          <div className="relative min-h-0 bg-black"><Image src={src} alt={alt} width={1800} height={1200} className="max-h-[72vh] w-full object-contain" priority /></div>
          {caption ? <div className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-white/75">{caption}</div> : null}
        </div>
      </div>,
      document.body,
    ) : null}
  </>;
}

"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { ImageWithMeta } from "@/types/content";

type ProjectImageGalleryProps = {
  images: ImageWithMeta[];
  projectTitle: string;
};

export function ProjectImageGallery({ images, projectTitle }: ProjectImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeImage = activeIndex === null ? undefined : images[activeIndex];
  const activeSrc = activeImage?.url ?? activeImage?.src;

  const closeModal = useCallback(() => {
    setActiveIndex(null);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousDocumentOverflow = document.documentElement.style.overflow;
    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []);

      if (!focusableElements.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousDocumentOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, closeModal]);

  return <>
    <div className="mt-12 grid gap-5 border-t border-white/10 pt-8 sm:grid-cols-2">
      {images.map((image, index) => {
        const src = image.url ?? image.src;
        return src ? <button key={src} type="button" onClick={(event) => { triggerRef.current = event.currentTarget; setActiveIndex(index); }} className="group overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300">
          <div className="relative aspect-[16/10] bg-[#08090d]"><Image src={src} alt={image.alt || `${projectTitle} gallery screenshot`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-contain p-3 sm:p-4 transition duration-500 group-hover:scale-[1.025]" /></div>
        </button> : null;
      })}
    </div>
    {activeSrc ? createPortal(<div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-xl sm:p-8" role="dialog" aria-modal="true" aria-label="Expanded project image" onClick={closeModal}>
      <div ref={dialogRef} className="relative flex max-h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#101116] shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <button ref={closeButtonRef} type="button" onClick={closeModal} className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-white transition hover:bg-black" aria-label="Close enlarged image"><X size={20} /></button>
        <div className="relative min-h-0 bg-black"><Image src={activeSrc} alt={activeImage?.alt || `${projectTitle} gallery screenshot`} width={1600} height={1000} className="max-h-[72vh] w-full object-contain" priority /></div>
        {activeImage?.caption?.trim() ? (
          <div className="border-t border-white/10 px-5 py-4 text-sm leading-6 text-white/75">{activeImage.caption.trim()}</div>
        ) : null}
      </div>
    </div>, document.body) : null}
  </>;
}

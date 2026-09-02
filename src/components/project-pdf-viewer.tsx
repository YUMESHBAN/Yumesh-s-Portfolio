"use client";

import { Download, ExternalLink, FileText, X } from "lucide-react";
import { useId, useState } from "react";

type ProjectPdfViewerProps = {
  src: string;
  projectTitle: string;
};

export function ProjectPdfViewer({ src, projectTitle }: ProjectPdfViewerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const viewerId = useId();

  return (
    <section className="mt-12 border-y border-white/10 py-5 sm:py-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-8">
        <div className="flex min-w-0 items-start gap-3">
          <FileText className="mt-0.5 shrink-0 text-blue-300" size={18} aria-hidden="true" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-blue-200/70">Project document</p>
            <h3 className="mt-1 text-lg font-semibold tracking-[-0.025em] text-white">{projectTitle} PDF</h3>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:justify-end">
          <button
            type="button"
            className="site-button-primary min-h-10 px-4 py-2.5 text-xs"
            aria-expanded={isOpen}
            aria-controls={viewerId}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <><X size={15} aria-hidden="true" />Close</> : <><FileText size={15} aria-hidden="true" />Preview</>}
          </button>
          <a href={src} target="_blank" rel="noreferrer" className="site-link inline-flex min-h-10 items-center gap-1.5 text-xs font-medium">
            Open PDF <ExternalLink size={15} aria-hidden="true" />
          </a>
          <a href={src} download className="site-link inline-flex min-h-10 items-center gap-1.5 text-xs font-medium" aria-label={`Download ${projectTitle} PDF`}>
            Download <Download size={15} aria-hidden="true" />
          </a>
        </div>
      </div>

      {isOpen ? (
        <div id={viewerId} className="mt-5 border border-white/10 bg-black/25 p-3 sm:mt-6 sm:p-4">
          <object data={src} type="application/pdf" className="h-[min(65svh,30rem)] min-h-64 w-full border border-white/10 bg-[#08090d] sm:h-[65svh] sm:min-h-[30rem]" aria-label={`${projectTitle} PDF viewer`}>
            <p className="p-6 text-sm leading-6 text-white/65">
              Your browser cannot display this PDF inline. <a href={src} target="_blank" rel="noreferrer" className="text-blue-200 underline underline-offset-4">Open it in a new tab</a> instead.
            </p>
          </object>
        </div>
      ) : null}
    </section>
  );
}

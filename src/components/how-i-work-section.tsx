"use client";

import { useEffect, useRef, useState } from "react";

import { WorkflowPanel, workflowSteps } from "@/components/workflow-panel";

const phaseLines = [
  "Start with the conversation.",
  "Structure before features.",
  "Progress through focused work.",
  "Confidence comes from checks.",
  "Feedback becomes direction.",
  "Ready for the real world.",
] as const;

export function HowIWorkSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const sectionElement = sectionRef.current;
    if (!sectionElement || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setActiveStep(0);
          setIsPinned(false);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(sectionElement);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionPreference.matches || isPinned || !isInView) return;

    const interval = window.setInterval(() => {
      setActiveStep((currentStep) => (currentStep + 1) % workflowSteps.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [isPinned, isInView]);

  useEffect(() => () => {
    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
  }, []);

  function selectStep(index: number) {
    setActiveStep(index);
    setIsPinned(true);

    if (resumeTimerRef.current) window.clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = window.setTimeout(() => {
      setIsPinned(false);
      resumeTimerRef.current = null;
    }, 3000);
  }

  return (
    <section ref={sectionRef} className="site-section">
      <div className="site-container grid gap-10 lg:grid-cols-[2fr_3fr] lg:gap-4 lg:items-start">
        <div className="self-start">
          <p className="site-eyebrow">How I work</p>
          <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Good products start with the right questions.
          </h2>
          <p className="site-muted mt-5 max-w-lg leading-7">
            I turn early ideas into focused web products through clear decisions, careful building, and practical iteration.
          </p>
          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-white/65">
            <span className="h-px w-8 bg-blue-400" aria-hidden="true" />
            <span key={activeStep} className="workflow-phase-line">{phaseLines[activeStep]}</span>
          </div>
        </div>

        <WorkflowPanel activeStep={activeStep} isPinned={isPinned} onSelectStep={selectStep} />
      </div>
    </section>
  );
}

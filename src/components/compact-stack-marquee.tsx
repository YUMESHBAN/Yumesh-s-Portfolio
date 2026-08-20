"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { TechLogo } from "@/components/tech-logo";
import type { ImageWithMeta, Skill, SkillShowcase, StackCategory } from "@/types/content";

type ProvenSkill = {
  key: string;
  index: number;
  skill: Skill;
  proofs: SkillShowcase[];
  proof: SkillShowcase;
  image?: ImageWithMeta;
};

function normalise(value: string) {
  return value.trim().toLocaleLowerCase();
}

function sameSkill(skill: Skill, proofSkill: SkillShowcase["skill"]) {
  if (skill._id && proofSkill._id) {
    return skill._id === proofSkill._id;
  }

  return normalise(skill.name) === normalise(proofSkill.name) && normalise(skill.category) === normalise(proofSkill.category ?? "");
}

function itemKey(skill: Skill) {
  return skill._id ?? `${normalise(skill.category)}-${normalise(skill.name)}`;
}

export function CompactStackMarquee({
  skills,
  showcases,
}: {
  skills: Skill[];
  categories: StackCategory[];
  showcases: SkillShowcase[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const marqueeViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const mosaicButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const clickPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusPreview = useRef(false);
  const suppressNextClickRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; offset: number } | null>(null);
  const isDraggingRef = useRef(false);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [rovingKey, setRovingKey] = useState<string | null>(null);
  const [isClickPaused, setIsClickPaused] = useState(false);
  const [ignoreMarqueeHoverPause, setIgnoreMarqueeHoverPause] = useState(false);
  const [marqueeDelay, setMarqueeDelay] = useState("0s");
  const [activeProofIndex, setActiveProofIndex] = useState(0);

  const provenSkills = useMemo<ProvenSkill[]>(() => {
    return [...skills]
      .sort((a, b) => a.order - b.order)
      .flatMap((skill) => {
        const matchingProofs = showcases.filter((showcase) => sameSkill(skill, showcase.skill));

        if (!matchingProofs.length) return [];

        const firstProof = matchingProofs[0];
        return [{
          key: itemKey(skill),
          index: 0,
          skill,
          proofs: matchingProofs,
          proof: firstProof,
          image: firstProof.image ?? firstProof.project?.featuredImage,
        }];
      })
      .map((item, index) => ({ ...item, index }));
  }, [showcases, skills]);

  const effectiveRovingKey = provenSkills.some((item) => item.key === rovingKey) ? rovingKey : provenSkills[0]?.key ?? null;
  const activeKey = previewKey ?? pinnedKey;
  const activeItem = provenSkills.find((item) => item.key === activeKey);
  const marqueeDurationSeconds = Math.max(28, provenSkills.length * 2.6);
  const duration = `${marqueeDurationSeconds}s`;
  const mosaicRows = provenSkills.reduce<ProvenSkill[][]>((rows, item) => {
    const currentRow = rows.at(-1);
    const currentRowSize = currentRow ? ((rows.length - 1) % 2 === 0 ? 3 : 2) : 0;

    if (!currentRow || currentRow.length === currentRowSize) rows.push([item]);
    else currentRow.push(item);

    return rows;
  }, []);

  useEffect(() => {
    setActiveProofIndex(0);
  }, [activeKey]);

  const currentProof = activeItem?.proofs[activeProofIndex] ?? activeItem?.proofs[0];
  const currentImage = currentProof ? (currentProof.image ?? currentProof.project?.featuredImage) : undefined;

  useEffect(() => () => {
    if (clickPauseTimeoutRef.current) clearTimeout(clickPauseTimeoutRef.current);
  }, []);

  useEffect(() => {
    if (!pinnedKey) return;
    const pinnedItem = provenSkills.find((item) => item.key === pinnedKey);
    if (!pinnedItem) return;

    function handleResize() {
      if (pinnedItem) centerMarqueeOn(pinnedItem);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pinnedKey, provenSkills]);

  function focusItem(index: number) {
    const next = provenSkills[index];
    if (!next) return;

    setRovingKey(next.key);
    setPreviewKey(next.key);
    buttonRefs.current.get(next.key)?.focus();
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusItem((index + 1) % provenSkills.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusItem((index - 1 + provenSkills.length) % provenSkills.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(provenSkills.length - 1);
    }
  }

  function focusMosaicItem(index: number) {
    const next = provenSkills[index];
    if (!next) return;

    setRovingKey(next.key);
    setPreviewKey(next.key);
    mosaicButtonRefs.current.get(next.key)?.focus();
  }

  function handleMosaicKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      focusMosaicItem((index + 1) % provenSkills.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusMosaicItem((index - 1 + provenSkills.length) % provenSkills.length);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      focusMosaicItem(Math.min(index + 3, provenSkills.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusMosaicItem(Math.max(index - 3, 0));
    } else if (event.key === "Home") {
      event.preventDefault();
      focusMosaicItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusMosaicItem(provenSkills.length - 1);
    }
  }

  function centerMarqueeOn(item: ProvenSkill, trigger?: HTMLButtonElement | null) {
    const viewport = marqueeViewportRef.current;
    const button = buttonRefs.current.get(item.key);
    const listItem = button?.parentElement;
    const group = groupRef.current ?? listItem?.parentElement;

    if (!viewport || !button || !listItem || !group) return;

    const groupWidth = group.clientWidth;
    if (!groupWidth) return;

    let itemCenter = listItem.offsetLeft + button.offsetWidth / 2;
    if (trigger && trigger.parentElement && group.nextElementSibling?.contains(trigger)) {
      itemCenter = trigger.parentElement.offsetLeft + groupWidth + trigger.offsetWidth / 2;
    }

    const progress = (itemCenter - viewport.clientWidth / 2) / groupWidth;
    const normalizedProgress = progress - Math.floor(progress);

    const delayStr = `-${(marqueeDurationSeconds * normalizedProgress).toFixed(3)}s`;
    setMarqueeDelay(delayStr);

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(-${(normalizedProgress * groupWidth).toFixed(2)}px)`;
    }
  }

  function togglePinned(item: ProvenSkill, trigger: HTMLButtonElement) {
    if (suppressNextClickRef.current) return;

    if (pinnedKey === item.key) {
      closePanel();
      return;
    }

    lastTriggerRef.current = trigger;
    setRovingKey(item.key);
    setPreviewKey(null);
    setPinnedKey(item.key);
    setIsClickPaused(true);
    setIgnoreMarqueeHoverPause(Boolean(marqueeViewportRef.current?.contains(trigger)));
    centerMarqueeOn(item, trigger);

    if (clickPauseTimeoutRef.current) {
      clearTimeout(clickPauseTimeoutRef.current);
      clickPauseTimeoutRef.current = null;
    }
  }

  function closePanel(restoreFocus = false) {
    const returnKey = activeItem?.key ?? effectiveRovingKey;
    setPreviewKey(null);
    setPinnedKey(null);
    setIsClickPaused(false);
    setIgnoreMarqueeHoverPause(false);

    if (trackRef.current) {
      trackRef.current.style.transform = "";
      trackRef.current.style.animation = "";
      trackRef.current.style.animationPlayState = "";
    }

    if (clickPauseTimeoutRef.current) {
      clearTimeout(clickPauseTimeoutRef.current);
      clickPauseTimeoutRef.current = null;
    }

    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      if (marqueeViewportRef.current?.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    }

    if (restoreFocus && returnKey) {
      suppressFocusPreview.current = true;
      (lastTriggerRef.current ?? buttonRefs.current.get(returnKey))?.focus({ preventScroll: true });
      setTimeout(() => {
        suppressFocusPreview.current = false;
      }, 200);
    }
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const touch = e.touches[0];
    const track = trackRef.current;
    const viewport = marqueeViewportRef.current;
    if (!touch || !track || !viewport) return;

    const trackRect = track.getBoundingClientRect();
    const viewportRect = viewport.getBoundingClientRect();
    const currentOffset = trackRect.left - viewportRect.left;

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      offset: currentOffset,
    };
    isDraggingRef.current = false;
  }

  function handleTouchMove(e: React.TouchEvent<HTMLDivElement>) {
    if (!touchStartRef.current || !trackRef.current || !marqueeViewportRef.current) return;

    const touch = e.touches[0];
    if (!touch) return;

    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    if (!isDraggingRef.current && Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current) {
      const track = trackRef.current;
      const groupWidth = groupRef.current?.clientWidth || (track.clientWidth / 2);
      if (!groupWidth) return;

      let newOffset = touchStartRef.current.offset + deltaX;
      let wrapped = newOffset % groupWidth;
      if (wrapped > 0) wrapped -= groupWidth;

      track.style.transform = `translateX(${wrapped.toFixed(2)}px)`;
      track.style.animationPlayState = "paused";
    }
  }

  function handleTouchEnd() {
    if (!touchStartRef.current || !trackRef.current) return;

    if (isDraggingRef.current) {
      const track = trackRef.current;
      const groupWidth = groupRef.current?.clientWidth || (track.clientWidth / 2);

      if (groupWidth && marqueeViewportRef.current) {
        const trackRect = track.getBoundingClientRect();
        const viewportRect = marqueeViewportRef.current.getBoundingClientRect();
        const currentOffset = trackRect.left - viewportRect.left;
        let wrapped = currentOffset % groupWidth;
        if (wrapped > 0) wrapped -= groupWidth;

        const progress = -wrapped / groupWidth;
        const normalizedProgress = progress - Math.floor(progress);

        setMarqueeDelay(`-${(marqueeDurationSeconds * normalizedProgress).toFixed(3)}s`);
      }

      if (!pinnedKey) {
        track.style.transform = "";
        track.style.animationPlayState = "";
      } else {
        track.style.animationPlayState = "paused";
      }

      suppressNextClickRef.current = true;
      setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 100);
    }

    touchStartRef.current = null;
    isDraggingRef.current = false;
  }

  function renderItem(item: ProvenSkill, duplicate = false) {
    const selected = activeItem?.key === item.key;
    const triggerId = `stack-marquee-trigger-${item.index}`;

    return (
      <li key={`${duplicate ? "duplicate" : "primary"}-${item.key}`} className="stack-marquee-item">
        <button
          ref={duplicate ? undefined : (node) => {
            if (node) buttonRefs.current.set(item.key, node);
            else buttonRefs.current.delete(item.key);
          }}
          id={duplicate ? undefined : triggerId}
          type="button"
          tabIndex={duplicate ? -1 : effectiveRovingKey === item.key ? 0 : -1}
          className={`stack-marquee-button ${selected ? "is-active" : ""}`}
          aria-expanded={duplicate ? undefined : selected}
          aria-controls={duplicate ? undefined : "stack-proof-disclosure"}
          onMouseDown={(event) => {
            if (duplicate) event.preventDefault();
          }}
          onPointerEnter={() => {
            setRovingKey(item.key);
            setPreviewKey(item.key);
          }}
          onPointerLeave={() => {
            if (pinnedKey) {
              setPreviewKey((current) => current === item.key ? null : current);
            } else setPreviewKey(null);
          }}
          onFocus={() => {
            if (!duplicate) {
              setRovingKey(item.key);
              if (!suppressFocusPreview.current) setPreviewKey(item.key);
            }
          }}
          onClick={(event) => {
            if (suppressNextClickRef.current) return;
            togglePinned(item, event.currentTarget);
          }}
          onKeyDown={(event) => !duplicate && handleItemKeyDown(event, item.index)}
        >
          <span className="stack-marquee-logo">
            <TechLogo name={item.skill.name} iconName={item.skill.iconName} />
          </span>
          <span className="stack-marquee-name">{item.skill.name}</span>
        </button>
      </li>
    );
  }

  if (!provenSkills.length) return null;

  return (
    <section
      ref={sectionRef}
      className="site-section compact-stack-section"
      aria-labelledby="compact-stack-title"
      onPointerLeave={(event) => {
        const relatedTarget = event.relatedTarget;
        if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) setPreviewKey(null);
      }}
      onBlurCapture={(event) => {
        const relatedTarget = event.relatedTarget;
        if (!(relatedTarget instanceof Node) || !event.currentTarget.contains(relatedTarget)) setPreviewKey(null);
      }}
      onKeyDownCapture={(event) => {
        if (event.key === "Escape" && activeItem) {
          event.preventDefault();
          closePanel(true);
        }
      }}
    >
      <div className="site-container">
        <div className="compact-stack-heading-grid">
          <div>
            <p className="site-eyebrow">Current stack</p>
            <h2 id="compact-stack-title" className="compact-stack-title">Tools I ship with</h2>
          </div>
        </div>

        <div className="compact-stack-rail">
          <div
            ref={marqueeViewportRef}
            className="stack-marquee-viewport"
            data-paused={isClickPaused ? "true" : "false"}
            data-ignore-hover-pause={ignoreMarqueeHoverPause ? "true" : "false"}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onPointerEnter={() => {
              if (!isClickPaused) setIgnoreMarqueeHoverPause(false);
            }}
            style={{ "--stack-marquee-duration": duration, "--stack-marquee-delay": marqueeDelay } as CSSProperties}
          >
            <div ref={trackRef} className="stack-marquee-track">
              <ul ref={groupRef} className="stack-marquee-group" aria-label="Technologies with project proof">
                {provenSkills.map((item) => renderItem(item))}
              </ul>
              <ul className="stack-marquee-group stack-marquee-copy" aria-hidden="true">
                {provenSkills.map((item) => renderItem(item, true))}
              </ul>
            </div>
          </div>

          <div className="compact-stack-mosaic" role="group" aria-label="Choose a technology to view its project proof">
            {mosaicRows.map((row, rowIndex) => (
              <div className={`compact-stack-mosaic-row ${row.length === 2 ? "is-short" : ""}`} key={`mosaic-row-${rowIndex}`}>
                {row.map((item) => {
                  const selected = activeItem?.key === item.key;

                  return (
                    <button
                      ref={(node) => {
                        if (node) mosaicButtonRefs.current.set(item.key, node);
                        else mosaicButtonRefs.current.delete(item.key);
                      }}
                      key={item.key}
                      type="button"
                      tabIndex={effectiveRovingKey === item.key ? 0 : -1}
                      className={`compact-stack-mosaic-tile ${selected ? "is-active" : ""}`}
                      aria-label={`${item.skill.name}: view project proof`}
                      aria-expanded={selected}
                      aria-controls="stack-proof-disclosure"
                      onPointerEnter={() => {
                        setRovingKey(item.key);
                        setPreviewKey(item.key);
                      }}
                      onPointerLeave={() => {
                        if (pinnedKey) setPreviewKey((current) => current === item.key ? null : current);
                        else setPreviewKey(null);
                      }}
                      onFocus={() => {
                        setRovingKey(item.key);
                        if (!suppressFocusPreview.current) setPreviewKey(item.key);
                      }}
                      onClick={(event) => togglePinned(item, event.currentTarget)}
                      onKeyDown={(event) => handleMosaicKeyDown(event, item.index)}
                    >
                      <span className="compact-stack-mosaic-tile-surface">
                        <TechLogo name={item.skill.name} iconName={item.skill.iconName} />
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="compact-stack-details">
          {!activeItem ? (
            <p className="compact-stack-support">A focused toolkit for thoughtful, production-ready web experiences—from interface craft and content systems to backend foundations, collaboration, and problem-solving.</p>
          ) : null}

          <div id="stack-proof-disclosure" className={`stack-proof-disclosure ${activeItem ? "is-open" : ""}`}>
            <div className="stack-proof-disclosure-clip">
              {activeItem && currentProof ? (
              <article
                className="stack-proof-card"
                role="region"
                aria-label={`${activeItem.skill.name} project proof`}
              >
                <div className="stack-proof-media">
                  {currentImage?.url || currentImage?.src ? (
                    <Image
                      key={currentImage.url ?? currentImage.src}
                      src={currentImage.url ?? currentImage.src ?? ""}
                      alt={currentImage.alt || `${currentProof.title} proof`}
                      fill
                      sizes="(min-width: 768px) 34vw, 100vw"
                      className="object-contain p-5"
                    />
                  ) : (
                    <div className="stack-proof-media-fallback">
                      <span className="stack-marquee-logo stack-proof-fallback-logo">
                        <TechLogo name={activeItem.skill.name} iconName={activeItem.skill.iconName} />
                      </span>
                      <p>{currentProof.title}</p>
                    </div>
                  )}
                </div>

                <div className="stack-proof-copy">
                  <button type="button" className="stack-proof-close" onClick={() => closePanel(false)} aria-label="Close stack proof">
                    <X size={18} aria-hidden="true" />
                  </button>
                  <div className="flex flex-wrap items-center gap-2 pr-12">
                    <p className="stack-proof-kicker">{activeItem.skill.category} / {activeItem.skill.name}</p>
                    {activeItem.proofs.length > 1 ? (
                      <div className="stack-proof-carousel-nav" aria-label="Cycle project proofs">
                        <span className="stack-proof-carousel-counter">
                          Proof {activeProofIndex + 1} of {activeItem.proofs.length}
                        </span>
                        <button
                          type="button"
                          className="stack-proof-carousel-btn"
                          onClick={() => setActiveProofIndex((prev) => (prev - 1 + activeItem.proofs.length) % activeItem.proofs.length)}
                          aria-label="Previous proof"
                        >
                          <ChevronLeft size={13} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="stack-proof-carousel-btn"
                          onClick={() => setActiveProofIndex((prev) => (prev + 1) % activeItem.proofs.length)}
                          aria-label="Next proof"
                        >
                          <ChevronRight size={13} aria-hidden="true" />
                        </button>
                      </div>
                    ) : null}
                  </div>
                  <h3>{currentProof.title}</h3>
                  {currentProof.project ? (
                    <p className="stack-proof-context">
                      {currentProof.project.title}
                      {currentProof.project.role || currentProof.project.type ? ` / ${currentProof.project.role ?? currentProof.project.type}` : ""}
                    </p>
                  ) : null}
                  <p className="stack-proof-description">{currentProof.description}</p>
                  {currentProof.highlights?.length ? (
                    <ul className="stack-proof-highlights" aria-label="Proof highlights">
                      {currentProof.highlights.slice(0, 3).map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  ) : null}
                  {currentProof.project?.slug ? (
                    <Link href={`/works/${currentProof.project.slug}`} className="site-link stack-proof-link">
                      View project details
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </Link>
                  ) : null}
                </div>
              </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

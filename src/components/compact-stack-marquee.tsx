"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";

import { TechLogo } from "@/components/tech-logo";
import type { ImageWithMeta, Skill, SkillShowcase, StackCategory } from "@/types/content";

type ProvenSkill = {
  key: string;
  index: number;
  skill: Skill;
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
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>());
  const mosaicButtonRefs = useRef(new Map<string, HTMLButtonElement>());
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const clickPauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressFocusPreview = useRef(false);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const [pinnedKey, setPinnedKey] = useState<string | null>(null);
  const [rovingKey, setRovingKey] = useState<string | null>(null);
  const [isClickPaused, setIsClickPaused] = useState(false);
  const [ignoreMarqueeHoverPause, setIgnoreMarqueeHoverPause] = useState(false);
  const [marqueeDelay, setMarqueeDelay] = useState("0s");

  const provenSkills = useMemo<ProvenSkill[]>(() => {
    return [...skills]
      .sort((a, b) => a.order - b.order)
      .flatMap((skill) => {
        const proof = showcases.find((showcase) => sameSkill(skill, showcase.skill));

        if (!proof) return [];

        return [{
          key: itemKey(skill),
          index: 0,
          skill,
          proof,
          image: proof.image ?? proof.project?.featuredImage,
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

  useEffect(() => () => {
    if (clickPauseTimeoutRef.current) clearTimeout(clickPauseTimeoutRef.current);
  }, []);

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

  function centerMarqueeOn(item: ProvenSkill) {
    const viewport = marqueeViewportRef.current;
    const button = buttonRefs.current.get(item.key);
    const listItem = button?.parentElement;
    const group = listItem?.parentElement;

    if (!viewport || !button || !listItem || !group) return;

    const groupWidth = group.clientWidth;
    if (!groupWidth) return;

    const itemCenter = listItem.offsetLeft + button.offsetWidth / 2;
    const progress = (itemCenter + groupWidth - viewport.clientWidth / 2) / groupWidth;
    const normalizedProgress = progress - Math.floor(progress);

    setMarqueeDelay(`-${(marqueeDurationSeconds * normalizedProgress).toFixed(3)}s`);
  }

  function togglePinned(item: ProvenSkill, trigger: HTMLButtonElement) {
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
    centerMarqueeOn(item);

    if (clickPauseTimeoutRef.current) clearTimeout(clickPauseTimeoutRef.current);
    clickPauseTimeoutRef.current = setTimeout(() => {
      setPreviewKey(null);
      setPinnedKey(null);
      setIsClickPaused(false);
      clickPauseTimeoutRef.current = null;
    }, 5000);
  }

  function closePanel(restoreFocus = false) {
    const returnKey = activeItem?.key ?? effectiveRovingKey;
    setPreviewKey(null);
    setPinnedKey(null);
    setIsClickPaused(false);
    setIgnoreMarqueeHoverPause(Boolean(lastTriggerRef.current && marqueeViewportRef.current?.contains(lastTriggerRef.current)));

    if (clickPauseTimeoutRef.current) {
      clearTimeout(clickPauseTimeoutRef.current);
      clickPauseTimeoutRef.current = null;
    }

    if (restoreFocus && returnKey) {
      requestAnimationFrame(() => {
        suppressFocusPreview.current = true;
        (lastTriggerRef.current ?? buttonRefs.current.get(returnKey))?.focus({ preventScroll: true });
        suppressFocusPreview.current = false;
      });
    }
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
          onClick={(event) => togglePinned(item, event.currentTarget)}
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
            onPointerEnter={() => {
              if (!isClickPaused) setIgnoreMarqueeHoverPause(false);
            }}
            style={{ "--stack-marquee-duration": duration, "--stack-marquee-delay": marqueeDelay } as CSSProperties}
          >
            <div className="stack-marquee-track">
              <ul className="stack-marquee-group" aria-label="Technologies with project proof">
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
              {activeItem ? (
              <article
                className="stack-proof-card"
                role="region"
                aria-label={`${activeItem.skill.name} project proof`}
              >
                <div className="stack-proof-media">
                  {activeItem.image?.url || activeItem.image?.src ? (
                    <Image
                      src={activeItem.image.url ?? activeItem.image.src ?? ""}
                      alt={activeItem.image.alt || `${activeItem.proof.title} proof`}
                      fill
                      sizes="(min-width: 768px) 34vw, 100vw"
                      className="object-contain p-5"
                    />
                  ) : (
                    <div className="stack-proof-media-fallback">
                      <span className="stack-marquee-logo stack-proof-fallback-logo">
                        <TechLogo name={activeItem.skill.name} iconName={activeItem.skill.iconName} />
                      </span>
                      <p>{activeItem.proof.title}</p>
                    </div>
                  )}
                </div>

                <div className="stack-proof-copy">
                  <button type="button" className="stack-proof-close" onClick={() => closePanel(true)} aria-label="Close stack proof">
                    <X size={18} aria-hidden="true" />
                  </button>
                  <p className="stack-proof-kicker">{activeItem.skill.category} / {activeItem.skill.name}</p>
                  <h3>{activeItem.proof.title}</h3>
                  {activeItem.proof.project ? (
                    <p className="stack-proof-context">
                      {activeItem.proof.project.title}
                      {activeItem.proof.project.role || activeItem.proof.project.type ? ` / ${activeItem.proof.project.role ?? activeItem.proof.project.type}` : ""}
                    </p>
                  ) : null}
                  <p className="stack-proof-description">{activeItem.proof.description}</p>
                  {activeItem.proof.highlights?.length ? (
                    <ul className="stack-proof-highlights" aria-label="Proof highlights">
                      {activeItem.proof.highlights.slice(0, 3).map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  ) : null}
                  {activeItem.proof.project?.slug ? (
                    <Link href={`/works/${activeItem.proof.project.slug}`} className="site-link stack-proof-link">
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

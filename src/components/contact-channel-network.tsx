"use client";

import { useEffect, useRef } from "react";

const endpoint = { x: 210, y: 440 };

export function ContactChannelNetwork({ targetId, actionId }: { targetId: string; actionId: string }) {
  const networkRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const network = networkRef.current;
    const button = document.getElementById(targetId);
    const action = document.getElementById(actionId);
    const host = network?.parentElement;
    if (!network || !button || !action || !host) return;

    const originalTranslate = action.style.translate;
    let appliedOffset = { x: 0, y: 0 };

    const alignActionToEndpoint = () => {
      if (!window.matchMedia("(min-width: 1024px)").matches) {
        appliedOffset = { x: 0, y: 0 };
        action.style.translate = originalTranslate;
        return;
      }

      const networkRect = network.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const endpointX = networkRect.left + (endpoint.x / 420) * networkRect.width;
      const endpointY = networkRect.top + (endpoint.y / 440) * networkRect.height;
      const buttonCenterX = buttonRect.left + buttonRect.width / 2;
      const buttonTop = buttonRect.top;
      const deltaX = endpointX - buttonCenterX;
      const deltaY = endpointY - buttonTop;

      if (Math.abs(deltaX) < 0.5 && Math.abs(deltaY) < 0.5) return;

      appliedOffset = { x: appliedOffset.x + deltaX, y: appliedOffset.y + deltaY };
      action.style.translate = `${appliedOffset.x}px ${appliedOffset.y}px`;
    };

    alignActionToEndpoint();
    const observer = new ResizeObserver(alignActionToEndpoint);
    observer.observe(host);
    observer.observe(button);
    window.addEventListener("resize", alignActionToEndpoint);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", alignActionToEndpoint);
      action.style.translate = originalTranslate;
    };
  }, [actionId, targetId]);

  useEffect(() => {
    const supportsMotion = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");

    if (!supportsMotion.matches || !networkRef.current) return;

    const signals = Array.from(networkRef.current.querySelectorAll<SVGPathElement>("[data-contact-signal]"));
    const endpoint = networkRef.current.querySelector<SVGCircleElement>("[data-contact-endpoint]");
    const button = document.getElementById(targetId);
    const timers: number[] = [];
    const activeSignals = new Set<SVGPathElement>();

    function highlightContact() {
      endpoint?.classList.remove("is-arriving");
      button?.classList.remove("is-highlighted");
      void endpoint?.getBoundingClientRect();
      void button?.offsetWidth;
      endpoint?.classList.add("is-arriving");
      button?.classList.add("is-highlighted");

      timers.push(window.setTimeout(() => {
        endpoint?.classList.remove("is-arriving");
        button?.classList.remove("is-highlighted");
      }, 720));
    }

    function scheduleSignal() {
      const availableSignals = signals.filter((signal) => !activeSignals.has(signal));

      if (availableSignals.length) {
        const signal = availableSignals[Math.floor(Math.random() * availableSignals.length)];
        activeSignals.add(signal);
        signal.classList.add("is-active");

        const completeSignal = () => {
          signal.classList.remove("is-active");
          activeSignals.delete(signal);
          highlightContact();
        };

        signal.addEventListener("animationend", completeSignal, { once: true });
      }

      timers.push(window.setTimeout(scheduleSignal, 3600 + Math.random() * 5400));
    }

    [500, 1500, 2900].forEach((delay) => {
      timers.push(window.setTimeout(scheduleSignal, delay + Math.random() * 900));
    });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      signals.forEach((signal) => signal.classList.remove("is-active"));
      endpoint?.classList.remove("is-arriving");
      button?.classList.remove("is-highlighted");
    };
  }, [targetId]);

  return (
    <svg
      ref={networkRef}
      className="contact-network pointer-events-none absolute right-0 top-1/2 -z-10 hidden h-[28rem] w-[28rem] -translate-y-1/2 text-blue-300 lg:block"
      viewBox="0 0 420 440"
      fill="none"
      aria-hidden="true"
    >
      <g className="contact-network-base" stroke="currentColor" strokeWidth="1">
        <path d="M48 46L100 98H142V154L178 184H210V248" />
        <path d="M170 44V118L210 158V248" />
        <path d="M354 48L310 92H282V144H343V210C343 232 330 248 308 248H250L210 286" />
        <path d="M70 185H128L178 184L210 248" />
        <path d="M120 298H160L188 270L210 286" />
        <path d="M305 278H270L250 298V318H210" />
        <path d="M210 248V318V440" />
      </g>
      <g className="contact-network-signals" stroke="currentColor" strokeLinecap="round" strokeWidth="1.6">
        <path data-contact-signal className="contact-network-signal" pathLength="100" d="M48 46L100 98H142V154L178 184H210V248V318V440" />
        <path data-contact-signal className="contact-network-signal" pathLength="100" d="M170 44V118L210 158V248V318V440" />
        <path data-contact-signal className="contact-network-signal" pathLength="100" d="M354 48L310 92H282V144H343V210C343 232 330 248 308 248H250L210 286V318V440" />
        <path data-contact-signal className="contact-network-signal" pathLength="100" d="M70 185H128L178 184L210 248V318V440" />
        <path data-contact-signal className="contact-network-signal" pathLength="100" d="M120 298H160L188 270L210 286V318V440" />
      </g>
      <g className="contact-network-node" fill="#0b0b0c" stroke="currentColor" strokeWidth="1.25">
        <circle cx="48" cy="46" r="10" />
        <rect x="160" y="34" width="20" height="20" />
        <circle cx="354" cy="48" r="10" />
        <rect x="60" y="175" width="20" height="20" />
        <circle cx="178" cy="184" r="8" />
        <rect x="333" y="134" width="20" height="20" />
        <circle cx="120" cy="298" r="9" />
        <circle cx="305" cy="278" r="9" />
        <rect x="244" y="292" width="12" height="12" transform="rotate(45 250 298)" />
      </g>
      <g className="contact-network-node contact-network-node-merge" fill="currentColor">
        <circle cx="48" cy="46" r="2.5" />
        <rect x="167.5" y="41.5" width="5" height="5" />
        <circle cx="354" cy="48" r="2.5" />
        <rect x="67.5" y="182.5" width="5" height="5" />
        <circle cx="178" cy="184" r="2.5" />
        <rect x="340.5" y="141.5" width="5" height="5" />
        <circle cx="120" cy="298" r="2.5" />
        <circle cx="305" cy="278" r="2.5" />
        <circle cx="250" cy="298" r="2.5" />
        <circle cx="210" cy="248" r="4.5" />
        <circle data-contact-endpoint className="contact-network-endpoint" cx={endpoint.x} cy={endpoint.y} r="4" />
      </g>
    </svg>
  );
}

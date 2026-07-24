"use client";

import { useEffect, useState } from "react";

const greetings = ["Hello", "Namaste", "Hola", "Bonjour", "Ciao", "Hallo", "Olá", "こんにちは"];

export function GreetingRotator() {
  const [index, setIndex] = useState(0);
  const [shouldRotate, setShouldRotate] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => {
      setShouldRotate(!mediaQuery.matches);

      if (mediaQuery.matches) {
        setIndex(0);
      }
    };

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);

    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!shouldRotate) {
      return;
    }

    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % greetings.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [shouldRotate]);

  return (
    <p className="text-2xl font-semibold text-white sm:text-3xl">
      <span className="greeting-rotator" aria-hidden="true">
        <span key={greetings[index]} className="greeting-rotator-word">
          {greetings[index]}
        </span>
      </span>

      <span className="sr-only">Hello.</span>
    </p>
  );
}

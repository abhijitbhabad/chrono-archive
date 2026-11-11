"use client";

import { useEffect, useState } from "react";

const ERAS = [
  { id: "era-1", label: "BRUTALIST", year: "1999" },
  { id: "era-2", label: "SKEUOMORPH", year: "2012" },
  { id: "era-3", label: "LIQUID GLASS", year: "2026" },
  { id: "era-4", label: "HOLOGRAPHIC", year: "2050" },
];

export default function EraNavbar() {
  const [activeEra, setActiveEra] = useState("era-1");

  const activeIndex = ERAS.findIndex((era) => era.id === activeEra);
  const currentEra = ERAS[activeIndex] ?? ERAS[0];

  const scrollToEra = (id) => {
    setActiveEra(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let frameId;

    const handleScroll = () => {
      if (frameId) return;

      frameId = window.requestAnimationFrame(() => {
        const anchor = window.scrollY + window.innerHeight * 0.42;
        const visibleEra = ERAS.reduce((current, era) => {
          const section = document.getElementById(era.id);
          return section && section.offsetTop <= anchor ? era.id : current;
        }, ERAS[0].id);

        setActiveEra((current) => current === visibleEra ? current : visibleEra);
        frameId = undefined;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <nav className="era-dock" aria-label="Explore eras">
      <div className="era-dock__heading">
        <span className="era-dock__brand">
          <span className="era-dock__mark" aria-hidden="true">C</span>
          CHRONO <span className="text-zinc-600">/</span> INDEX
        </span>
        <span className="era-dock__current" aria-live="polite">
          <span>{String(activeIndex + 1).padStart(2, "0")}</span>
          <span className="text-zinc-600">/</span>
          {String(ERAS.length).padStart(2, "0")}
          <span className="era-dock__current-name">{currentEra.label}</span>
        </span>
      </div>

      <div
        className="era-dock__track"
        style={{ "--active-era": activeIndex }}
      >
        {ERAS.map((era, index) => {
          const isActive = activeEra === era.id;

          return (
            <button
              key={era.id}
              type="button"
              onClick={() => scrollToEra(era.id)}
              data-era-index={index}
              aria-current={isActive ? "location" : undefined}
              aria-label={`Era ${String(index + 1).padStart(2, "0")}: ${era.label}, ${era.year}`}
              className={`era-dock__item ${isActive ? "is-active" : ""}`}
            >
              <span className="era-dock__number">{String(index + 1).padStart(2, "0")}</span>
              <span className="era-dock__item-copy">
                <span className="era-dock__label">{era.label}</span>
                <span className="era-dock__year">{era.year}</span>
              </span>
              <span className="era-dock__dot" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

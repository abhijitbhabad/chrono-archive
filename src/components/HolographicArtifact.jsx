"use client";

const PARTICLES = Array.from({ length: 38 }, (_, index) => ({
  left: `${(index * 47 + 13) % 100}%`,
  top: `${(index * 67 + 19) % 100}%`,
  delay: `${-((index * 7) % 13)}s`,
  driftX: `${((index * 19) % 25) - 12}px`,
  driftY: `${((index * 11) % 27) - 13}px`,
  size: index % 8 === 0 ? "4px" : "2px",
}));

const SIGNALS = [
  "FIELD_STABLE",
  "ORBITAL_SYNC 99.8%",
  "NODE 07 ONLINE",
  "LIGHT-CONE OPEN",
];

export default function HolographicArtifact() {
  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    event.currentTarget.style.setProperty("--rotate-x", `${-y * 9}deg`);
    event.currentTarget.style.setProperty("--rotate-y", `${x * 11}deg`);
    event.currentTarget.style.setProperty("--pointer-x", `${x * 32}px`);
    event.currentTarget.style.setProperty("--pointer-y", `${y * 24}px`);
  };

  const resetPointer = (event) => {
    event.currentTarget.style.setProperty("--rotate-x", "0deg");
    event.currentTarget.style.setProperty("--rotate-y", "0deg");
    event.currentTarget.style.setProperty("--pointer-x", "0px");
    event.currentTarget.style.setProperty("--pointer-y", "0px");
  };

  return (
    <section
      aria-labelledby="holographic-title"
      className="void-artifact mt-10 w-full max-w-2xl"
    >
      <div
        className="void-artifact__card"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="void-artifact__grid" aria-hidden="true" />
        <div className="void-artifact__particles" aria-hidden="true">
          {PARTICLES.map((particle, index) => (
            <span
              key={index}
              className="void-artifact__particle"
              style={{
                left: particle.left,
                top: particle.top,
                "--drift-delay": particle.delay,
                "--drift-x": particle.driftX,
                "--drift-y": particle.driftY,
                "--particle-size": particle.size,
              }}
            />
          ))}
        </div>
        <div className="void-artifact__content">
          <header className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
                Era_04 / Spatial Interface
              </span>
              <h3 id="holographic-title" className="mt-1 text-xl font-bold tracking-tight text-zinc-100">
                Zero-gravity field
              </h3>
            </div>
            <span className="void-artifact__status">
              <span aria-hidden="true" />
              LIVE
            </span>
          </header>

          <div className="void-artifact__telemetry">
            <div className="void-artifact__orbit void-artifact__orbit--outer" aria-hidden="true" />
            <div className="void-artifact__orbit void-artifact__orbit--inner" aria-hidden="true" />
            <div className="void-artifact__core" aria-hidden="true" />
            <span className="void-artifact__coordinate void-artifact__coordinate--one">X: 04.2050</span>
            <span className="void-artifact__coordinate void-artifact__coordinate--two">Z: ∞</span>
            <span className="void-artifact__telemetry-label">GRAVITY / 0.00 G</span>
          </div>

          <div className="void-artifact__ticker" aria-label={`System telemetry: ${SIGNALS.join(", ")}`}>
            <span className="void-artifact__ticker-label">SYS.FEED</span>
            <div className="void-artifact__ticker-window" aria-hidden="true">
              <div className="void-artifact__ticker-track">
                {[0, 1].map((copy) => (
                  <span key={copy} className="void-artifact__ticker-copy">
                    {SIGNALS.map((signal) => (
                      <span key={`${copy}-${signal}`}>
                        <i />
                        {signal}
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-3 text-[10px] font-mono uppercase tracking-[0.16em] text-zinc-600">
        Move pointer across the field to adjust its perspective
      </p>
    </section>
  );
}

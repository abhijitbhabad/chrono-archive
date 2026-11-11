"use client";

import { useState } from "react";

const TINTS = [
  { name: "Ion orange", hex: "#ff4d00", rgb: "255, 77, 0" },
  { name: "Arctic blue", hex: "#56b4ff", rgb: "86, 180, 255" },
  { name: "Ultraviolet", hex: "#a879ff", rgb: "168, 121, 255" },
];

export default function LiquidGlassArtifact() {
  const [blur, setBlur] = useState(12);
  const [refraction, setRefraction] = useState(1.42);
  const [tint, setTint] = useState(TINTS[0]);
  const tintStrength = 0.1 + (refraction - 1) * 0.11;

  const lensStyle = {
    backdropFilter: `blur(${blur}px) saturate(${Math.round(110 + (refraction - 1) * 90)}%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(${Math.round(110 + (refraction - 1) * 90)}%)`,
    background: `linear-gradient(135deg, rgba(255,255,255,0.2), rgba(${tint.rgb},${tintStrength}))`,
    "--lens-tint": tint.hex,
    "--refraction": refraction,
  };

  return (
    <section
      aria-labelledby="glass-customizer-title"
      className="glass-customizer relative mt-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0d] p-5 font-sans shadow-2xl sm:p-7"
    >
      <header className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-zinc-500">
            Era_03 / Material Lab
          </span>
          <h3 id="glass-customizer-title" className="mt-1 text-xl font-bold tracking-tight text-zinc-100">
            Refractive glass
          </h3>
        </div>
        <span className="glass-customizer__readout">
          <span className="glass-customizer__readout-dot" aria-hidden="true" />
          LIVE PREVIEW
        </span>
      </header>

      <div className="glass-customizer__stage" aria-label="Live preview of the selected glass material">
        <div className="glass-customizer__light glass-customizer__light--one" aria-hidden="true" />
        <div className="glass-customizer__light glass-customizer__light--two" aria-hidden="true" />
        <div className="glass-customizer__stage-grid" aria-hidden="true" />
        <div className="glass-customizer__lens" style={lensStyle}>
          <div className="glass-customizer__lens-glint" aria-hidden="true" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div className="flex items-center justify-between gap-3 text-[9px] font-mono tracking-[0.16em] text-white/65">
              <span>OPTIC / 03</span>
              <span>n = {refraction.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/55">
                Spectral layer
              </span>
              <p className="mt-1 text-lg font-medium tracking-tight text-white">
                Light, held in motion.
              </p>
            </div>
          </div>
        </div>
        <span className="glass-customizer__stage-caption">INCIDENT LIGHT / 580 NM</span>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <label className="glass-customizer__control">
          <span className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-zinc-300">Backdrop blur</span>
            <output className="font-mono text-[11px] text-zinc-500">{blur}px</output>
          </span>
          <input
            type="range"
            min="0"
            max="24"
            step="1"
            value={blur}
            onChange={(event) => setBlur(Number(event.target.value))}
            className="glass-customizer__range"
            aria-label="Backdrop blur"
          />
        </label>

        <label className="glass-customizer__control">
          <span className="flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-zinc-300">Refraction index</span>
            <output className="font-mono text-[11px] text-zinc-500">{refraction.toFixed(2)}</output>
          </span>
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={refraction}
            onChange={(event) => setRefraction(Number(event.target.value))}
            className="glass-customizer__range"
            aria-label="Refraction index"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-zinc-500">
          Neon tint
        </span>
        <div className="flex items-center gap-2" role="group" aria-label="Neon glass tint">
          {TINTS.map((option) => (
            <button
              key={option.name}
              type="button"
              onClick={() => setTint(option)}
              aria-label={`Use ${option.name} tint`}
              aria-pressed={tint.name === option.name}
              className={`glass-customizer__swatch ${tint.name === option.name ? "is-selected" : ""}`}
              style={{ "--swatch-color": option.hex }}
            />
          ))}
          <span className="ml-1 text-[10px] font-mono text-zinc-400">{tint.name}</span>
        </div>
      </div>
    </section>
  );
}

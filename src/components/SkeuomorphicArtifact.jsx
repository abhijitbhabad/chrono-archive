"use client";

import { useState } from "react";

const SOURCES = ["RADIO", "TAPE", "AUX"];

export default function SkeuomorphicArtifact() {
  const [active, setActive] = useState(false);
  const [source, setSource] = useState("RADIO");

  return (
    <section
      aria-labelledby="skeuo-title"
      className="skeuo-console relative mt-10 w-full max-w-2xl rounded-[1.75rem] p-5 font-sans sm:p-7"
    >
      <div aria-hidden="true" className="skeuo-stitch" />

      <div className="relative z-10">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#ff7a3d]">
              Chrono Soundworks · Series 02
            </span>
            <h3 id="skeuo-title" className="mt-1 text-xl font-bold tracking-tight text-zinc-100">
              Tactile power switch
            </h3>
          </div>

          <div className={`skeuo-status ${active ? "is-on" : ""}`} role="status" aria-live="polite">
            <span className="skeuo-led" aria-hidden="true" />
            {active ? "POWER ON" : "STANDBY"}
          </div>
        </header>

        <div className="skeuo-metal mt-6 rounded-2xl p-4 sm:p-5">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                Select input
              </span>
              <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Audio source">
                {SOURCES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={source === option}
                    onClick={() => setSource(option)}
                    className={`skeuo-glass-button ${source === option ? "is-selected" : ""}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-zinc-400">
                {active
                  ? `${source} is routed through the analog relay.`
                  : "Choose a source, then throw the switch to connect it."}
              </p>
            </div>

            <div className="flex shrink-0 items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/25 px-4 py-3 shadow-[inset_0_2px_5px_rgba(0,0,0,0.5)] sm:min-w-44">
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                Power
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={active}
                aria-label="Power"
                onClick={() => setActive((current) => !current)}
                className={`skeuo-switch ${active ? "is-on" : ""}`}
              >
                <span className="skeuo-switch-label" aria-hidden="true">
                  <span>ON</span>
                  <span>OFF</span>
                </span>
                <span className="skeuo-switch-knob" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
            <span>Hand-finished · Analog relay</span>
            <span>Input: {source}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import WormIntro from "@/components/WormIntro";
import EraNavbar from "@/components/EraNavbar";
import BrutalistArtifact from "@/components/BrutalistArtifact";
import SkeuomorphicArtifact from "@/components/SkeuomorphicArtifact";
import LiquidGlassArtifact from "@/components/LiquidGlassArtifact";
import HolographicArtifact from "@/components/HolographicArtifact";
import SpatialExperience from "@/components/SpatialExperience";

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  return (
    <main className="archive-shell min-h-screen selection:bg-[#ff4d00] selection:text-white">
      <SpatialExperience />
      <div className="archive-atmosphere" aria-hidden="true">
        <div className="archive-atmosphere__orb" />
        <div className="archive-atmosphere__ring" />
      </div>

      <WormIntro onComplete={() => setIntroFinished(true)} />

      {introFinished && <EraNavbar />}

      <section
        id="era-1"
        className="era-section"
        data-era-index="0"
        style={{
          "--section-accent": "#a7ce45",
          "--section-surface": "#eeeade",
          "--section-ink": "#1c2016",
          "--section-index": '"01"',
        }}
      >
        <div className="era-section__portal" aria-hidden="true" />
        <span className="era-section__watermark" aria-hidden="true">01</span>
        <div className="era-section__layout">
          <header className="era-section__copy">
            <div className="era-section__eyebrow"><span>01</span> THE EARLY WEB <i /> 1999—2004</div>
            <h2 className="era-title era-title--mono">
              THE BRUTALIST
              <span>DAWN<span className="era-title__period">.</span></span>
            </h2>
            <p className="era-section__description">
              Before the rules, there was the web. Raw HTML, dial-up noise and neon pages built by hand in the first open frontier.
            </p>
            <div className="era-section__caption"><span /> FIELD NOTE 001 <span>THE FIRST CONNECTION</span></div>
          </header>
          <div className="era-section__artifact"><BrutalistArtifact /></div>
        </div>
      </section>

      <section
        id="era-2"
        className="era-section era-section--reverse"
        data-era-index="1"
        style={{
          "--section-accent": "#ffe0aa",
          "--section-surface": "#f04d2c",
          "--section-ink": "#fff3e8",
          "--section-index": '"02"',
        }}
      >
        <div className="era-section__portal" aria-hidden="true" />
        <span className="era-section__watermark" aria-hidden="true">02</span>
        <div className="era-section__layout">
          <header className="era-section__copy">
            <div className="era-section__eyebrow"><span>02</span> THE TACTILE AGE <i /> 2010—2015</div>
            <h2 className="era-title">
              MADE OF
              <span>MATTER<span className="era-title__period">.</span></span>
            </h2>
            <p className="era-section__description">
              Screens borrowed the familiar: stitched leather, polished glass and buttons that felt like they belonged in your hand.
            </p>
            <div className="era-section__caption"><span /> FIELD NOTE 002 <span>TOUCH BECOMES INTERFACE</span></div>
          </header>
          <div className="era-section__artifact"><SkeuomorphicArtifact /></div>
        </div>
      </section>

      <section
        id="era-3"
        className="era-section"
        data-era-index="2"
        style={{
          "--section-accent": "#328b8e",
          "--section-surface": "#deece8",
          "--section-ink": "#152323",
          "--section-index": '"03"',
        }}
      >
        <div className="era-section__portal" aria-hidden="true" />
        <span className="era-section__watermark" aria-hidden="true">03</span>
        <div className="era-section__layout">
          <header className="era-section__copy">
            <div className="era-section__eyebrow"><span>03</span> THE MATERIAL PRESENT <i /> 2026</div>
            <h2 className="era-title">
              LESS,
              <span>IN MOTION<span className="era-title__period">.</span></span>
            </h2>
            <p className="era-section__description">
              Interfaces dissolve into light. Tune the blur, bend and color of a surface that never quite sits still.
            </p>
            <div className="era-section__caption"><span /> FIELD NOTE 003 <span>DESIGNED TO DISAPPEAR</span></div>
          </header>
          <div className="era-section__artifact"><LiquidGlassArtifact /></div>
        </div>
      </section>

      <section
        id="era-4"
        className="era-section era-section--reverse era-section--final"
        data-era-index="3"
        style={{
          "--section-accent": "#c5a5ff",
          "--section-surface": "#20182e",
          "--section-ink": "#f5efff",
          "--section-index": '"04"',
        }}
      >
        <div className="era-section__portal" aria-hidden="true" />
        <span className="era-section__watermark" aria-hidden="true">04</span>
        <div className="era-section__layout">
          <header className="era-section__copy">
            <div className="era-section__eyebrow"><span>04</span> THE NEXT FRONTIER <i /> 2050—</div>
            <h2 className="era-title era-title--mono">
              BEYOND
              <span>THE SCREEN<span className="era-title__period">.</span></span>
            </h2>
            <p className="era-section__description">
              A world without edges. Spatial interfaces drift free of gravity and the screen becomes a place you enter.
            </p>
            <div className="era-section__caption"><span /> FIELD NOTE 004 <span>COMPUTING, UNBOUND</span></div>
          </header>
          <div className="era-section__artifact"><HolographicArtifact /></div>
        </div>
      </section>
    </main>
  );
}
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PARTICLE_COUNT = 150;

export default function WormIntro({ onComplete }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const portalRef = useRef(null);
  const copyRef = useRef(null);
  const timelineRef = useRef(null);
  const completeRef = useRef(onComplete);
  const finishedRef = useRef(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  const finishIntro = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsDone(true);
    completeRef.current?.();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const container = containerRef.current;
    if (!canvas || !context || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishIntro();
      return;
    }

    let width = 0;
    let height = 0;
    let frameId;
    let elapsed = 0;
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
      const angle = index * 2.39996;
      const radius = 0.1 + ((index * 37) % 100) / 100;
      return {
        angle,
        radius,
        speed: 0.04 + ((index * 13) % 18) / 900,
        size: index % 13 === 0 ? 1.8 : 0.8 + (index % 4) * 0.2,
      };
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const render = () => {
      elapsed += 0.006;
      context.clearRect(0, 0, width, height);

      const centerX = width * 0.5;
      const centerY = height * 0.48;
      const radius = Math.min(width, height) * 0.19;
      const breath = 1 + Math.sin(elapsed * 1.8) * 0.025;

      context.save();
      context.translate(centerX, centerY);

      const halo = context.createRadialGradient(0, 0, radius * 0.12, 0, 0, radius * 1.65);
      halo.addColorStop(0, "rgba(255, 91, 52, 0.15)");
      halo.addColorStop(0.45, "rgba(255, 91, 52, 0.045)");
      halo.addColorStop(1, "rgba(255, 91, 52, 0)");
      context.fillStyle = halo;
      context.beginPath();
      context.arc(0, 0, radius * 1.65, 0, Math.PI * 2);
      context.fill();

      context.globalCompositeOperation = "lighter";
      for (let ring = 0; ring < 4; ring += 1) {
        context.save();
        context.rotate(elapsed * (ring % 2 === 0 ? 0.13 : -0.1) + ring * 0.68);
        context.scale(1, 0.42 + ring * 0.09);
        context.beginPath();
        context.ellipse(0, 0, radius * (0.63 + ring * 0.16) * breath, radius * (0.63 + ring * 0.16) * breath, 0, 0, Math.PI * 2);
        context.strokeStyle = ring === 0
          ? "rgba(255, 184, 141, 0.9)"
          : `rgba(255, 91, 52, ${0.42 - ring * 0.055})`;
        context.lineWidth = ring === 0 ? 1.35 : 0.65;
        context.stroke();
        context.restore();
      }

      particles.forEach((particle) => {
        const angle = particle.angle + elapsed * particle.speed;
        const orbit = radius * particle.radius * breath;
        const x = Math.cos(angle) * orbit;
        const y = Math.sin(angle) * orbit * 0.58;
        const alpha = 0.22 + (Math.sin(angle * 2 + elapsed) + 1) * 0.18;

        context.beginPath();
        context.arc(x, y, particle.size, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 181, 139, ${alpha})`;
        context.fill();
      });

      const core = context.createRadialGradient(0, 0, 0, 0, 0, radius * 0.2);
      core.addColorStop(0, "rgba(255, 232, 209, 0.92)");
      core.addColorStop(0.2, "rgba(255, 91, 52, 0.52)");
      core.addColorStop(1, "rgba(255, 91, 52, 0)");
      context.fillStyle = core;
      context.beginPath();
      context.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
      context.fill();

      context.restore();
      context.globalCompositeOperation = "source-over";
      frameId = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = window.requestAnimationFrame(render);

    const timeline = gsap.timeline({ onComplete: finishIntro });
    timelineRef.current = timeline;
    timeline
      .fromTo(portalRef.current, { autoAlpha: 0, scale: 0.62, rotate: -18 }, {
        autoAlpha: 1,
        scale: 1,
        rotate: 0,
        duration: 1.05,
        ease: "expo.out",
      })
      .fromTo(copyRef.current, { autoAlpha: 0, y: 18, filter: "blur(8px)" }, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.7,
        ease: "power3.out",
      }, "-=0.28")
      .to({}, { duration: 1.05 })
      .to(container, {
        clipPath: "inset(0 0 100% 0 round 0 0 48% 48%)",
        duration: 0.85,
        ease: "power4.inOut",
      });

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frameId);
      timeline.kill();
      timelineRef.current = null;
    };
  }, [finishIntro]);

  const skipIntro = () => {
    timelineRef.current?.kill();
    gsap.to(containerRef.current, {
      autoAlpha: 0,
      scale: 1.025,
      duration: 0.35,
      ease: "power2.in",
      onComplete: finishIntro,
    });
  };

  if (isDone) return null;

  return (
    <div ref={containerRef} className="archive-intro">
      <div className="archive-intro__grain" aria-hidden="true" />
      <div className="archive-intro__topline">
        <span>AN INTERACTIVE HISTORY OF THE WEB</span>
        <span>VOL. 01 — 04</span>
      </div>
      <canvas ref={canvasRef} className="archive-intro__canvas" aria-hidden="true" />

      <div ref={portalRef} className="archive-intro__portal" aria-hidden="true">
        <span />
      </div>

      <div ref={copyRef} className="archive-intro__copy">
        <span className="archive-intro__eyebrow"><i /> A TEMPORAL MUSEUM</span>
        <h1>CHRONO<span>ARCHIVE</span></h1>
        <p>Four eras. One evolving interface.</p>
      </div>

      <div className="archive-intro__footer">
        <span>01 / THE FIRST CONNECTION</span>
        <button type="button" onClick={skipIntro}>
          ENTER ARCHIVE <span aria-hidden="true">↗</span>
        </button>
        <span>1999 — 2050</span>
      </div>
    </div>
  );
}

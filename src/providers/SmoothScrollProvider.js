"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0.6 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      respectReducedMotion: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const unsubscribeScroll = lenis.on("scroll", updateScrollTrigger);

    const updateLenis = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);

    gsap.ticker.lagSmoothing(0);

    const shell = document.querySelector(".archive-shell");
    const sections = gsap.utils.toArray(".era-section");
    const motion = gsap.matchMedia();
    let activeSection = sections[0];

    if (shell && sections.length) {
      const currentPosition = window.scrollY + window.innerHeight * 0.42;
      activeSection = sections.reduce((current, section) => (
        section.offsetTop <= currentPosition ? section : current
      ), sections[0]);
      gsap.set(shell, {
        "--active-accent": activeSection.style.getPropertyValue("--section-accent"),
        "--active-surface": activeSection.style.getPropertyValue("--section-surface"),
      });
    }

    motion.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        motionOkay: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions;

        if (reduceMotion) {
          gsap.set(".era-section__copy > *, .era-section__artifact", {
            autoAlpha: 1,
            clearProps: "transform,filter",
          });
        } else {
          sections.forEach((section) => {
            const revealItems = section.querySelectorAll(".era-section__copy > *, .era-section__artifact");

            gsap.fromTo(
              revealItems,
              { autoAlpha: 0, y: 42, scale: 0.975, filter: "blur(7px)" },
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                filter: "blur(0px)",
                duration: 1,
                stagger: 0.11,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  end: "top 36%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              },
            );

            gsap.fromTo(
              section.querySelector(".era-section__portal"),
              { autoAlpha: 0.32, scale: 0.58, rotate: -28 },
              {
                autoAlpha: 1,
                scale: 1.08,
                rotate: 32,
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1,
                },
              },
            );
          });
        }

        if (shell) {
          sections.forEach((section) => {
            const changeEra = () => {
              gsap.to(shell, {
                "--active-accent": section.style.getPropertyValue("--section-accent"),
                "--active-surface": section.style.getPropertyValue("--section-surface"),
                duration: reduceMotion ? 0 : 0.8,
                ease: "power2.out",
                overwrite: "auto",
              });
              window.dispatchEvent(new CustomEvent("chrono:era-change", {
                detail: { index: Number(section.dataset.eraIndex) },
              }));
            };

            ScrollTrigger.create({
              trigger: section,
              start: "top 42%",
              end: "bottom 42%",
              onEnter: changeEra,
              onEnterBack: changeEra,
            });
          });
        }

      },
    );

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh, { once: true });

    return () => {
      window.removeEventListener("load", refresh);
      motion.revert();
      unsubscribeScroll();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
"use client";

import { useEffect, useRef, useState } from "react";

const INTERACTIVE_SELECTOR = "button, a, input, select, textarea, [role='button'], .era-section__artifact";

function createPanner(context, x) {
  const panner = context.createStereoPanner();
  panner.pan.value = Math.max(-1, Math.min(1, (x / window.innerWidth) * 2 - 1));
  panner.connect(context.destination);
  return panner;
}

function playTone(context, output, frequency, endFrequency, duration, volume, type = "sine") {
  const now = context.currentTime;
  const oscillator = context.createOscillator();
  const envelope = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
  envelope.gain.setValueAtTime(0.0001, now);
  envelope.gain.exponentialRampToValueAtTime(volume, now + 0.008);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  oscillator.connect(envelope);
  envelope.connect(output);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.01);
  oscillator.addEventListener("ended", () => {
    oscillator.disconnect();
    envelope.disconnect();
  }, { once: true });
}

function playEraSound(context, eraIndex, x) {
  const output = createPanner(context, x);
  const now = context.currentTime;

  if (eraIndex === 0) {
    const length = Math.ceil(context.sampleRate * 0.055);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const samples = buffer.getChannelData(0);
    for (let i = 0; i < length; i += 1) samples[i] = Math.random() * 2 - 1;

    const noise = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const envelope = context.createGain();
    noise.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2100, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.055);
    filter.Q.value = 0.7;
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.018, now + 0.004);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
    noise.connect(filter);
    filter.connect(envelope);
    envelope.connect(output);
    noise.start(now);
    noise.stop(now + 0.06);
    noise.addEventListener("ended", () => {
      noise.disconnect();
      filter.disconnect();
      envelope.disconnect();
      output.disconnect();
    }, { once: true });
    return;
  }

  if (eraIndex === 1) {
    playTone(context, output, 980, 360, 0.065, 0.035, "triangle");
    playTone(context, output, 110, 72, 0.045, 0.025, "sine");
  } else if (eraIndex === 2) {
    playTone(context, output, 520, 1040, 0.14, 0.035, "sine");
    playTone(context, output, 780, 620, 0.12, 0.012, "sine");
  } else {
    playTone(context, output, 245, 330, 0.2, 0.025, "sine");
    playTone(context, output, 368, 495, 0.18, 0.012, "sine");
  }

  window.setTimeout(() => output.disconnect(), 260);
}

export default function SpatialExperience() {
  const cursorRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioEnabledRef = useRef(false);
  const activeEraRef = useRef(0);
  const lastEraCueRef = useRef({ index: -1, time: 0 });
  const lastHoveredRef = useRef(null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioUnavailable, setAudioUnavailable] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    let cursorX = pointerX;
    let cursorY = pointerY;
    let cursorEnabled = false;

    const updateCursorMode = () => {
      cursorEnabled = finePointer.matches && !reducedMotion.matches;
      root.classList.toggle("has-custom-cursor", cursorEnabled);
      if (!cursorEnabled) {
        cursor?.classList.remove("is-visible");
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = undefined;
      }
    };

    const renderCursor = () => {
      cursorX += (pointerX - cursorX) * 0.24;
      cursorY += (pointerY - cursorY) * 0.24;
      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }

      if (Math.abs(pointerX - cursorX) + Math.abs(pointerY - cursorY) > 0.2) {
        frameId = window.requestAnimationFrame(renderCursor);
      } else {
        frameId = undefined;
      }
    };

    const playSound = (index, x) => {
      const context = audioContextRef.current;
      if (!audioEnabledRef.current || !context || context.state !== "running") return;
      playEraSound(context, index, x);
    };

    const playEraChange = (index, x = window.innerWidth / 2) => {
      if (!Number.isInteger(index) || index < 0 || index > 3) return;
      activeEraRef.current = index;
      const context = audioContextRef.current;
      const now = context?.currentTime ?? 0;
      if (lastEraCueRef.current.index === index && now - lastEraCueRef.current.time < 0.45) return;
      lastEraCueRef.current = { index, time: now };
      playSound(index, x);
    };

    const onPointerMove = (event) => {
      if (!cursorEnabled || event.pointerType === "touch") return;
      pointerX = event.clientX;
      pointerY = event.clientY;
      root.classList.remove("is-keyboard");
      cursor?.classList.add("is-visible");
      if (!frameId) frameId = window.requestAnimationFrame(renderCursor);
    };

    const onPointerOver = (event) => {
      if (event.pointerType === "touch" || !(event.target instanceof Element)) return;
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target || target.classList.contains("spatial-sound-toggle")) return;
      if (event.relatedTarget instanceof Node && target.contains(event.relatedTarget)) return;

      lastHoveredRef.current = target;
      cursor?.classList.toggle("is-interactive", target.matches("button, a, input, select, textarea, [role='button']"));
      cursor?.classList.toggle("is-lens", target.matches(".era-section__artifact"));

      const eraElement = target.closest("[data-era-index]");
      const index = Number(eraElement?.dataset.eraIndex);
      const eraIndex = Number.isInteger(index) ? index : activeEraRef.current;
      playSound(eraIndex, event.clientX);
    };

    const onPointerOut = (event) => {
      if (!(event.target instanceof Element)) return;
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;
      if (target === lastHoveredRef.current) lastHoveredRef.current = null;
      cursor?.classList.remove("is-interactive", "is-lens");
    };

    const onEraChange = (event) => playEraChange(event.detail?.index);
    const onKeyDown = () => {
      root.classList.add("is-keyboard");
      cursor?.classList.remove("is-visible", "is-interactive", "is-lens");
    };
    const onPointerDown = () => cursor?.classList.add("is-pressed");
    const onPointerUp = () => cursor?.classList.remove("is-pressed");
    const onPointerLeave = () => cursor?.classList.remove("is-visible");

    updateCursorMode();
    finePointer.addEventListener("change", updateCursorMode);
    reducedMotion.addEventListener("change", updateCursorMode);
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("pointerup", onPointerUp);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("chrono:era-change", onEraChange);

    return () => {
      finePointer.removeEventListener("change", updateCursorMode);
      reducedMotion.removeEventListener("change", updateCursorMode);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("chrono:era-change", onEraChange);
      root.classList.remove("has-custom-cursor", "is-keyboard");
      if (frameId) window.cancelAnimationFrame(frameId);
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const toggleAudio = () => {
    if (typeof window.AudioContext !== "function") {
      setAudioUnavailable(true);
      return;
    }

    const context = audioContextRef.current ?? new window.AudioContext();
    audioContextRef.current = context;
    if (audioEnabledRef.current) {
      audioEnabledRef.current = false;
      setAudioEnabled(false);
      void context.suspend();
      return;
    }

    void context.resume().then(() => {
      audioEnabledRef.current = true;
      setAudioEnabled(true);
      setAudioUnavailable(false);
    }, () => {
      audioEnabledRef.current = false;
      setAudioEnabled(false);
      setAudioUnavailable(true);
    });
  };

  return (
    <>
      <button
        type="button"
        className={`spatial-sound-toggle${audioEnabled ? " is-on" : ""}`}
        aria-label={audioUnavailable ? "Audio unavailable" : `${audioEnabled ? "Disable" : "Enable"} spatial sound`}
        aria-pressed={audioEnabled}
        onClick={toggleAudio}
      >
        <span className="spatial-sound-toggle__indicator" aria-hidden="true" />
        {audioUnavailable ? "AUDIO UNAVAILABLE" : `SOUND ${audioEnabled ? "ON" : "OFF"}`}
      </button>
      <div ref={cursorRef} className="archive-cursor" aria-hidden="true">
        <span className="archive-cursor__lens" />
        <span className="archive-cursor__dot" />
      </div>
    </>
  );
}

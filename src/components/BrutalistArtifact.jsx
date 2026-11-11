"use client";

import { useState, useRef } from "react";

export default function BrutalistArtifact() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full max-w-2xl h-64 mt-10 border border-zinc-800 bg-[#0c0c0c] overflow-hidden rounded-xl font-mono cursor-crosshair group select-none shadow-2xl"
    >
      {/* Default Layer (Raw Brutalist View) */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between text-zinc-500">
        <div className="flex justify-between text-xs tracking-widest">
          <span>ARTIFACT_ID: 0x99A</span>
          <span>STATUS: DECAYED</span>
        </div>
        <div>
          <h4 className="text-xl font-bold text-zinc-300 mb-2">&lt;marquee&gt; WELCOME TO CYBERSPACE &lt;/marquee&gt;</h4>
          <p className="text-xs text-zinc-600">Hover lens to decrypt original net-archival code and unmask lost packets.</p>
        </div>
        <div className="text-[10px] text-zinc-700">ENCODING: UTF-8 // DIAL_UP_FREQ_56K</div>
      </div>

      {/* Holographic Decryption Lens Layer */}
      <div
        className="absolute inset-0 p-8 flex flex-col justify-between text-[#ff4d00] bg-[#120500] pointer-events-none transition-all duration-75"
        style={{
          clipPath: isHovered
            ? `circle(130px at ${mousePos.x}px ${mousePos.y}px)`
            : "circle(0px at 0px 0px)",
        }}
      >
        <div className="flex justify-between text-xs tracking-widest font-bold text-[#ff9966]">
          <span>[DECRYPTED_STREAM]</span>
          <span>SECURE_NODE</span>
        </div>
        <div>
          <h4 className="text-xl font-black text-[#ffecdb] mb-2 drop-shadow-[0_0_12px_#ff4d00]">
            ⚡ PROTOCOL_1999_ACTIVE
          </h4>
          <p className="text-xs text-[#ffccbb] leading-relaxed">
            [UNMASKED]: Raw sockets open. Initializing Netscape Navigator buffer emulation... Artifact integrity verified.
          </p>
        </div>
        <div className="text-[10px] text-[#ff9966]">ACCESS GRANTED // BYPASS_CODE: #000000</div>
      </div>
    </div>
  );
}
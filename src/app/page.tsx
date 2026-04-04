"use client";

import { useState } from "react";
import type { Viand } from "@/types/viand";
import KalderoDraw from "@/components/KalderoDraw";
import RecipeResult from "@/components/RecipeResult";
import AdBanner from "@/components/AdBanner";

// Triangle pennant colours — alternating for a festive string effect
const BANDERITAS = [
  "#bb3100", "#ffc96f", "#865c00", "#ff7851",
  "#c41f19", "#ff9385", "#bb3100", "#ffc96f",
  "#865c00", "#ff7851", "#c41f19", "#ff9385",
  "#bb3100", "#ffc96f", "#865c00", "#ff7851",
];

// Wavy banderitas rendered entirely in SVG
// String y-position in viewBox units for t in [0, 1]
const VW = 1000; // viewBox width
const VH = 72;   // viewBox height

const R2 = (n: number) => Math.round(n * 100) / 100;

function stringY(t: number): number {
  return R2(8 + 20 * (1 - Math.cos(t * Math.PI * 2 * 3)) / 2); // 8–28 range
}

// Tangent angle (degrees) of the string at position t
function stringAngle(t: number): number {
  const dy = 20 * Math.PI * 3 * Math.sin(t * Math.PI * 2 * 3); // dy/dt
  const dx = VW; // dx/dt (x goes 0→VW as t goes 0→1)
  return R2(Math.atan2(dy, dx) * (180 / Math.PI));
}

function WavyBanderitas() {
  const PW = 26; // pennant width in viewBox units
  const PH = 36; // pennant height in viewBox units
  const count = BANDERITAS.length;

  return (
    <div
      className="absolute top-0 left-0 w-full"
      style={{ height: VH, pointerEvents: "none" }}
      aria-hidden
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        {/* Pennants — rotated to follow string tangent */}
        {BANDERITAS.map((color, i) => {
          const t = i / (count - 1);
          const x = t * VW;
          const y = stringY(t);
          const angle = stringAngle(t);
          return (
            <g key={i} transform={`translate(${x},${y}) rotate(${angle})`}>
              <polygon
                points={`${-PW / 2},0 ${PW / 2},0 0,${PH}`}
                fill={color}
                opacity="0.92"
              />
            </g>
          );
        })}

        {/* Wavy string */}
        <polyline
          points={Array.from({ length: 201 }, (_, i) => {
            const t = i / 200;
            return `${t * VW},${stringY(t)}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(56,57,42,0.32)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Home() {
  const [winner, setWinner] = useState<Viand | null>(null);
  const [drawKey, setDrawKey] = useState(0);

  function handlePickNew() {
    setWinner(null);
    setDrawKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ── Sticky Nav ── */}
      <header
        className="shrink-0 z-50 flex items-center px-6 py-4"
        style={{
          background: "rgba(255,255,211,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          className="flex items-center gap-2 font-bbt text-2xl"
          style={{ color: "#bb3100" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.webp" alt="Anong Ulam icon" width={48} height={48} style={{ borderRadius: 10, objectFit: "cover" }} />
          Anong Ulam
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* ── Hero ── */}
        <section className="relative px-6 pt-8 pb-6 overflow-hidden text-center shrink-0">
          {/* Banderitas — wavy hanging string + triangle pennants */}
          <div
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: 72 }}
          >
            <WavyBanderitas />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto pt-6">
            <h1
              className="font-headline font-bbt leading-tight mb-3"
              style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", color: "#bb3100" }}
            >
              Kainan Na!
            </h1>
            <p
              className="text-base md:text-lg"
              style={{ color: "#38392a", opacity: 0.75 }}
            >
              Feeling undecided? Let the festive spirits choose your next
              delicious Filipino feast.
            </p>
          </div>
        </section>

        {/* ── Top Ad ── */}
        <div className="max-w-3xl mx-auto px-6 mb-4 shrink-0">
          <AdBanner adSlot="3237453338" />
        </div>

        {/* ── Kaldero Draw — flex-1 so it fills remaining space on initial view ── */}
        <div className="flex-1 flex flex-col justify-center">
          <KalderoDraw key={drawKey} onResult={(v) => setWinner(v)} />
        </div>

        {/* ── Recipe Result (appears after draw) ── */}
        {winner && <RecipeResult key={winner.id} viand={winner} onPickNew={handlePickNew} />}

        {/* ── Bottom Ad ── */}
        {winner && (
          <div className="max-w-3xl mx-auto px-6 mt-16 mb-16 shrink-0">
            <AdBanner adSlot="4734367837" />
          </div>
        )}
      </main>
    </div>
  );
}

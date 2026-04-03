"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
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

function stringY(t: number): number {
  return 8 + 20 * (1 - Math.cos(t * Math.PI * 2 * 3)) / 2; // 8–28 range
}

// Tangent angle (degrees) of the string at position t
function stringAngle(t: number): number {
  const dy = 20 * Math.PI * 3 * Math.sin(t * Math.PI * 2 * 3); // dy/dt
  const dx = VW; // dx/dt (x goes 0→VW as t goes 0→1)
  return Math.atan2(dy, dx) * (180 / Math.PI);
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
  const [viands, setViands] = useState<Viand[]>([]);
  const [loading, setLoading] = useState(true);
  const [winner, setWinner] = useState<Viand | null>(null);

  useEffect(() => {
    supabase
      .from("viands")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (error) console.error("Supabase error:", error.message);
        else setViands(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* ── Sticky Nav ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 py-4"
        style={{
          background: "rgba(255,255,211,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          className="flex items-center gap-2 font-headline font-black text-2xl"
          style={{ color: "#bb3100" }}
        >
          <span className="material-symbols-filled" style={{ fontSize: 28 }}>
            restaurant_menu
          </span>
          Anong Ulam?
        </div>
      </header>

      <main className="pt-24 pb-16">
        {/* ── Hero ── */}
        <section className="relative px-6 pt-8 pb-16 overflow-hidden text-center">
          {/* Banderitas — wavy hanging string + triangle pennants */}
          <div
            className="absolute top-0 left-0 w-full pointer-events-none"
            style={{ height: 72 }}
          >
            <WavyBanderitas />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto pt-6">
            <h1
              className="font-headline font-black leading-tight mb-4"
              style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: "#bb3100" }}
            >
              Kainan Na!
            </h1>
            <p
              className="text-lg md:text-xl"
              style={{ color: "#38392a", opacity: 0.75 }}
            >
              Feeling undecided? Let the festive spirits choose your next
              delicious Filipino feast.
            </p>
          </div>
        </section>

        {/* ── Top Ad ── */}
        <div className="max-w-3xl mx-auto px-6 mb-8">
          <AdBanner adSlot="3237453338" />
        </div>

        {/* ── Kaldero Draw ── */}
        {loading ? (
          <div
            className="flex items-center justify-center py-32 font-body text-lg"
            style={{ color: "#82816f" }}
          >
            <span
              className="material-symbols-outlined mr-3"
              style={{
                animation: "spin 1s linear infinite",
                display: "inline-block",
              }}
            >
              autorenew
            </span>
            Nag-lo-load ng mga ulam…
          </div>
        ) : (
          <KalderoDraw viands={viands} onResult={(v) => setWinner(v)} />
        )}

        {/* ── Recipe Result (appears after draw) ── */}
        {winner && <RecipeResult key={winner.id} viand={winner} />}

        {/* ── Bottom Ad ── */}
        <div className="max-w-3xl mx-auto px-6 mt-16">
          <AdBanner adSlot="4734367837" />
        </div>
      </main>
    </>
  );
}

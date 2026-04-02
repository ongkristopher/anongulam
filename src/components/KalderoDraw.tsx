"use client";

import { useState, useRef } from "react";
import type { Viand } from "@/types/viand";

// idle → spinning → shaking → opening → done
type Phase = "idle" | "spinning" | "shaking" | "opening" | "done";

// ── Single Kaldero ──────────────────────────────────────────────────────────
function Kaldero({
  phase,
  isCenter,
}: {
  phase: Phase;
  isCenter: boolean;
}) {
  const baseScale   = isCenter ? "scale-110" : "scale-95";
  const baseOpacity = isCenter ? "opacity-100" : "opacity-70";

  // All pots shake continuously while a draw is in progress
  const isActive = phase === "spinning" || phase === "shaking" || phase === "opening";
  let potAnim: React.CSSProperties = {};
  if (isActive) {
    potAnim = { animation: "pot-shake 0.7s ease-in-out infinite", transformOrigin: "center bottom" };
  }

  // Lid opens after shaking completes — only on center pot
  const lidAnim: React.CSSProperties =
    isCenter && (phase === "opening" || phase === "done")
      ? { animation: "lid-open 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards" }
      : {};

  const showSteam = isCenter && (phase === "opening" || phase === "done");
  const steamDelays = ["0s", "0.35s", "0.7s"];

  return (
    <div
      className={`flex flex-col items-center ${baseScale} ${baseOpacity} transition-opacity duration-300`}
      style={potAnim}
    >
      {/* Steam puffs */}
      <div className="relative flex justify-center mb-1 overflow-visible" style={{ height: 44 }}>
        {showSteam &&
          steamDelays.map((delay, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white/70 blur-sm"
              style={{
                width: 10,
                height: 22,
                left: `calc(50% + ${(i - 1) * 16}px)`,
                bottom: 0,
                animation: `steam 1.1s ease-out ${delay} infinite`,
              }}
            />
          ))}
      </div>

      {/* Lid (slides up on opening) */}
      <div className="relative w-full flex justify-center" style={lidAnim}>
        {/* Knob */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-300 border-2 border-stone-400 shadow-inner z-10" />
        {/* Lid body */}
        <div className="w-full h-9 bg-linear-to-b from-stone-300 to-stone-400 rounded-t-[3rem] rounded-b-lg shadow-md" />
      </div>

      {/* Pot body */}
      <div className="relative w-full">
        {/* Rim */}
        <div className="w-full h-5 bg-linear-to-b from-stone-400 to-stone-500 rounded-t-sm -mt-1 shadow" />
        {/* Bowl */}
        <div className="relative w-full h-28 bg-linear-to-b from-stone-500 to-stone-600 rounded-b-[2.5rem] shadow-xl overflow-hidden">
          <div className="absolute top-2 left-4 w-6 h-16 bg-white/10 rounded-full rotate-12 blur-sm" />
        </div>
        {/* Handles */}
        <div className="absolute top-4 -left-3 w-4 h-8 bg-stone-400 rounded-full shadow" />
        <div className="absolute top-4 -right-3 w-4 h-8 bg-stone-400 rounded-full shadow" />
        {/* Shadow base */}
        <div className="mx-auto mt-1 w-4/5 h-3 bg-stone-700 rounded-b-full opacity-30 blur-sm" />
      </div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
interface KalderoDrawProps {
  viands: Viand[];
  onResult: (viand: Viand) => void;
}

export default function KalderoDraw({ viands, onResult }: KalderoDrawProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const winnerRef = useRef<Viand | null>(null);

  const handleDraw = () => {
    if (phase !== "idle" || viands.length === 0) return;

    winnerRef.current = viands[Math.floor(Math.random() * viands.length)];

    // Phase 1 — spin all pots (2 s)
    setPhase("spinning");

    // Phase 2 — shake center pot (0.65 s anim)
    setTimeout(() => setPhase("shaking"), 2000);

    // Phase 3 — open lid (shake anim ends ~0.65 s after shaking starts)
    setTimeout(() => setPhase("opening"), 2700);

    // Phase 4 — done, reveal recipe & scroll
    setTimeout(() => {
      setPhase("done");
      if (winnerRef.current) onResult(winnerRef.current);
      setTimeout(() => {
        document
          .getElementById("recipe-section")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }, 3600);
  };

  const handleReset = () => setPhase("idle");

  const statusLabel = phase === "spinning"
    ? "Kumukulo na…"
    : phase === "shaking"
    ? "Ano kaya 'to?!"
    : "Bubukas na…";

  return (
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">
        {/* 3 Kalderos */}
        <div className="grid grid-cols-3 gap-6 md:gap-16 items-end mb-16 max-w-2xl mx-auto">
          {[1, 2, 3].map((n, i) => (
            <Kaldero
              key={n}
              phase={phase}
              isCenter={i === 1}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          {phase === "idle" && (
            <button
              onClick={handleDraw}
              disabled={viands.length === 0}
              className="inline-flex items-center gap-3 px-12 py-5 rounded-full text-white font-headline font-black text-2xl shadow-[0px_20px_40px_rgba(187,49,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #bb3100, #ff7851)" }}
            >
              <span className="material-symbols-filled">celebration</span>
              MAGDRAW NA!
            </button>
          )}

          {(phase === "spinning" || phase === "shaking" || phase === "opening") && (
            <div
              className="inline-flex items-center gap-3 px-12 py-5 rounded-full text-white font-headline font-black text-2xl opacity-75 cursor-not-allowed"
              style={{ background: "linear-gradient(135deg, #bb3100, #ff7851)" }}
            >
              <span
                className="material-symbols-outlined"
                style={{ animation: "pot-spin 1s linear infinite", display: "inline-block" }}
              >
                autorenew
              </span>
              {statusLabel}
            </div>
          )}

          {phase === "done" && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-headline font-bold text-xl transition-all hover:scale-105 active:scale-95"
              style={{ background: "#f6f5dc", color: "#bb3100" }}
            >
              <span className="material-symbols-outlined">refresh</span>
              Mag-draw ulit
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

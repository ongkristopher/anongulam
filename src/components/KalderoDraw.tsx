"use client";

import { useState, useRef, useEffect } from "react";
import type { Viand } from "@/types/viand";

type Phase = "idle" | "shuffling" | "shaking" | "opening" | "done";

// Horizontal center (%) for each of the 3 slots: left / center / right
const SLOT_X = ["16.5%", "50%", "83.5%"];

// ── Single Kaldero ──────────────────────────────────────────────────────────
function Kaldero({
  shake,
  isCenter,
  openLid,
}: {
  shake: boolean;
  isCenter: boolean;
  openLid: boolean;
}) {
  const potAnim: React.CSSProperties = shake
    ? { animation: "pot-shake 0.5s ease-in-out infinite", transformOrigin: "center bottom" }
    : {};

  const lidAnim: React.CSSProperties = openLid
    ? { animation: "lid-open 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards" }
    : {};

  const steamDelays = ["0s", "0.35s", "0.7s"];

  return (
    <div
      className={`flex flex-col items-center transition-[opacity,transform] duration-300 ${
        isCenter ? "scale-110 opacity-100" : "scale-90 opacity-55"
      }`}
      style={potAnim}
    >
      {/* Steam puffs */}
      <div className="relative flex justify-center mb-1 overflow-visible" style={{ height: 44 }}>
        {openLid &&
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

      {/* Lid */}
      <div className="relative w-full flex justify-center" style={lidAnim}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-stone-300 border-2 border-stone-400 shadow-inner z-10" />
        <div className="w-full h-9 bg-linear-to-b from-stone-300 to-stone-400 rounded-t-[3rem] rounded-b-lg shadow-md" />
      </div>

      {/* Pot body */}
      <div className="relative w-full">
        <div className="w-full h-5 bg-linear-to-b from-stone-400 to-stone-500 rounded-t-sm -mt-1 shadow" />
        <div className="relative w-full h-28 bg-linear-to-b from-stone-500 to-stone-600 rounded-b-[2.5rem] shadow-xl overflow-hidden">
          <div className="absolute top-2 left-4 w-6 h-16 bg-white/10 rounded-full rotate-12 blur-sm" />
        </div>
        <div className="absolute top-4 -left-3 w-4 h-8 bg-stone-400 rounded-full shadow" />
        <div className="absolute top-4 -right-3 w-4 h-8 bg-stone-400 rounded-full shadow" />
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
  // slotOf[potIndex] = slot index (0=left, 1=center, 2=right)
  const [slotOf, setSlotOf] = useState([0, 1, 2]);
  const [chosenPot, setChosenPot] = useState<number | null>(null);

  const winnerRef = useRef<Viand | null>(null);
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const handleDraw = () => {
    if (phase !== "idle" || viands.length === 0) return;
    winnerRef.current = viands[Math.floor(Math.random() * viands.length)];
    setSlotOf([0, 1, 2]);
    setChosenPot(null);
    setPhase("shuffling");
  };

  const handleReset = () => {
    setPhase("idle");
    setSlotOf([0, 1, 2]);
    setChosenPot(null);
  };

  // Shell-game shuffle: swap random pairs every 250ms, 16 times (~4s total)
  useEffect(() => {
    if (phase !== "shuffling") return;

    const SWAP_PAIRS = [[0, 1], [1, 2], [0, 2]] as const;
    const current = [0, 1, 2];
    let count = 0;
    const TARGET = 12;

    const id = setInterval(() => {
      const [a, b] = SWAP_PAIRS[Math.floor(Math.random() * 3)];
      [current[a], current[b]] = [current[b], current[a]];
      setSlotOf([...current]);
      count++;

      if (count >= TARGET) {
        clearInterval(id);

        // Pot currently in center slot (1) is the chosen one
        const chosen = current.indexOf(1);
        setChosenPot(chosen);
        setPhase("shaking");

        // shake → open → done
        setTimeout(() => setPhase("opening"), 1200);
        setTimeout(() => {
          setPhase("done");
          if (winnerRef.current) onResultRef.current(winnerRef.current);
          setTimeout(() => {
            document
              .getElementById("recipe-section")
              ?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }, 2300);
      }
    }, 450);

    return () => clearInterval(id);
  }, [phase]);

  const statusLabel =
    phase === "shuffling"
      ? "Humahanap ng ulam…"
      : phase === "shaking"
      ? "Ano kaya 'to?!"
      : "Bubukas na…";

  return (
    <section className="px-6 pb-16">
      <div className="max-w-4xl mx-auto">

        {/* 3 Kalderos — absolutely positioned, slide between slots */}
        <div className="relative max-w-2xl mx-auto mb-16" style={{ height: 280 }}>
          {[0, 1, 2].map((potIdx) => {
            const slot = slotOf[potIdx];
            const isCenter = slot === 1;
            const isChosen = chosenPot === potIdx;
            const shake = isChosen && phase === "shaking";
            const openLid = isChosen && (phase === "opening" || phase === "done");

            return (
              <div
                key={potIdx}
                style={{
                  position: "absolute",
                  left: SLOT_X[slot],
                  bottom: 0,
                  width: 140,
                  transform: "translateX(-50%)",
                  transition: "left 0.38s cubic-bezier(0.65,0,0.35,1)",
                  zIndex: isCenter ? 10 : 1,
                }}
              >
                <Kaldero
                  shake={shake}
                  isCenter={isCenter}
                  openLid={openLid}
                />
              </div>
            );
          })}
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

          {(phase === "shuffling" || phase === "shaking" || phase === "opening") && (
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

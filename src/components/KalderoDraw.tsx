"use client";

import { useState, useRef, useEffect } from "react";
import type { Viand } from "@/types/viand";

type Phase = "idle" | "shuffling" | "shaking" | "opening" | "done" | "error";

// Horizontal center (%) for each of the 3 slots: left / center / right
const SLOT_X = ["16.5%", "50%", "83.5%"];

// ── Single Palayok ──────────────────────────────────────────────────────────
function Palayok({
  potId,
  shake,
  isCenter,
  openLid,
}: {
  potId: number;
  shake: boolean;
  isCenter: boolean;
  openLid: boolean;
}) {
  const potAnim: React.CSSProperties = shake
    ? { animation: "pot-shake 0.5s ease-in-out infinite", transformOrigin: "center bottom" }
    : {};

  const lidAnim: React.CSSProperties = openLid
    ? {
        animation: "lid-open 0.75s cubic-bezier(0.34,1.56,0.64,1) forwards",
        transformBox: "fill-box" as React.CSSProperties["transformBox"],
        transformOrigin: "center bottom",
      }
    : {};

  const steamDelays = ["0s", "0.35s", "0.7s"];
  const gid = `p${potId}`; // unique gradient prefix per pot instance

  return (
    <div
      className={`flex flex-col items-center transition-[opacity,transform] duration-300 ${
        isCenter ? "scale-110 opacity-100" : "scale-90 opacity-55"
      }`}
      style={potAnim}
    >
      {/* Steam puffs */}
      <div className="relative flex justify-center overflow-visible" style={{ height: 44 }}>
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

      {/* SVG palayok */}
      <svg viewBox="0 0 160 165" width="160" height="165" overflow="visible">
        <defs>
          {/* Body gradient: warm terracotta with left highlight */}
          <radialGradient id={`${gid}-body`} cx="30%" cy="32%" r="72%">
            <stop offset="0%"   stopColor="#d46840" />
            <stop offset="40%"  stopColor="#b84428" />
            <stop offset="100%" stopColor="#782008" />
          </radialGradient>
          {/* Lid gradient */}
          <radialGradient id={`${gid}-lid`} cx="34%" cy="28%" r="68%">
            <stop offset="0%"   stopColor="#d46840" />
            <stop offset="50%"  stopColor="#b84428" />
            <stop offset="100%" stopColor="#782008" />
          </radialGradient>
          {/* Deep dark interior */}
          <radialGradient id={`${gid}-inside`} cx="40%" cy="38%" r="62%">
            <stop offset="0%"   stopColor="#180804" />
            <stop offset="65%"  stopColor="#341008" />
            <stop offset="100%" stopColor="#58200c" />
          </radialGradient>
          {/* Clip path for rattan mat weave lines */}
          <clipPath id={`${gid}-mat-clip`}>
            <ellipse cx="80" cy="152" rx="66" ry="13" />
          </clipPath>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="80" cy="161" rx="64" ry="5.5" fill="#200c02" opacity="0.22" />

        {/* Rattan mat — prominent woven base */}
        <ellipse cx="80" cy="152" rx="66" ry="13" fill="#c8a448" />
        {/* Weave lines going one diagonal */}
        <g clipPath={`url(#${gid}-mat-clip)`} stroke="#7a5e18" strokeWidth="4" strokeLinecap="round" opacity="0.45">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`wa${i}`} x1={14 + i * 11} y1="139" x2={14 + i * 11 + 14} y2="165" />
          ))}
        </g>
        {/* Weave lines going the other diagonal */}
        <g clipPath={`url(#${gid}-mat-clip)`} stroke="#e0c060" strokeWidth="3" strokeLinecap="round" opacity="0.35">
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`wb${i}`} x1={146 - i * 11} y1="139" x2={146 - i * 11 - 14} y2="165" />
          ))}
        </g>
        {/* Mat border rings */}
        <ellipse cx="80" cy="152" rx="66" ry="13" fill="none" stroke="#7a5e18" strokeWidth="2"   opacity="0.60" />
        <ellipse cx="80" cy="152" rx="52" ry="10" fill="none" stroke="#7a5e18" strokeWidth="1"   opacity="0.30" />
        <ellipse cx="80" cy="152" rx="36" ry="6.5" fill="none" stroke="#7a5e18" strokeWidth="0.8" opacity="0.25" />

        {/* Pot body — very wide squat belly */}
        <path
          d="M 28,66 C 4,70 2,143 80,146 C 158,143 156,70 132,66 Z"
          fill={`url(#${gid}-body)`}
        />

        {/* Body left highlight sheen */}
        <ellipse cx="50" cy="102" rx="11" ry="28" fill="white" opacity="0.07" transform="rotate(-10,50,102)" />

        {/* Clay texture marks */}
        <circle cx="34"  cy="108" r="2.2" fill="#5a1c06" opacity="0.30" />
        <circle cx="50"  cy="132" r="1.6" fill="#5a1c06" opacity="0.24" />
        <circle cx="118" cy="110" r="2"   fill="#5a1c06" opacity="0.26" />
        <circle cx="100" cy="98"  r="1.5" fill="#5a1c06" opacity="0.20" />
        <circle cx="42"  cy="124" r="1.4" fill="#5a1c06" opacity="0.18" />

        {/* Base foot ring */}
        <ellipse cx="80" cy="146" rx="44" ry="7" fill="#7a2a08" opacity="0.45" />

        {/* Collar — neck transition from body top to rim underside */}
        <path d="M 18,50 C 18,58 24,66 28,66 L 132,66 C 136,66 142,58 142,50 Z" fill="#ac3e18" />

        {/* Rim top face — wide flat protruding lip */}
        <ellipse cx="80" cy="50" rx="62" ry="15" fill="#c44e20" />
        {/* Rim top highlight */}
        <ellipse cx="62" cy="46" rx="24" ry="7" fill="white" opacity="0.11" />

        {/* Dark interior — deep hollow bowl */}
        <ellipse cx="80" cy="54" rx="54" ry="13" fill={`url(#${gid}-inside)`} />

        {/* Lid group (animated) */}
        <g style={lidAnim}>
          {/* Lid flange — base aligned to rim (cy=50, rx matches rim rx=62) */}
          <ellipse cx="80" cy="50" rx="65" ry="14" fill="#9c3810" />
          {/* Lid dome — base closes along the top ellipse arc to match perspective */}
          <path d="M 15,50 C 15,4 145,4 145,50 A 65,14 0 0 0 15,50 Z" fill={`url(#${gid}-lid)`} />
          {/* Lid dome highlight */}
          <ellipse cx="54" cy="28" rx="22" ry="14" fill="white" opacity="0.09" transform="rotate(-16,54,28)" />
          {/* Cylindrical knob */}
          <ellipse cx="80" cy="8"  rx="12" ry="5.5" fill="#c04820" />
          <path   d="M 68,8 L 68,18 Q 80,22 92,18 L 92,8 Z" fill="#b03e18" />
          <ellipse cx="80" cy="18" rx="12" ry="5"   fill="#8e3012" />
          <ellipse cx="76" cy="6"  rx="6"  ry="3"   fill="white" opacity="0.18" />
        </g>
      </svg>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
interface KalderoDrawProps {
  onResult: (viand: Viand) => void;
}

export default function KalderoDraw({ onResult }: KalderoDrawProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  // slotOf[potIndex] = slot index (0=left, 1=center, 2=right)
  const [slotOf, setSlotOf] = useState([0, 1, 2]);
  const [chosenPot, setChosenPot] = useState<number | null>(null);

  // Holds the in-flight fetch promise so the animation and fetch run in parallel
  const fetchRef = useRef<Promise<Viand | null>>(Promise.resolve(null));
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  const handleDraw = () => {
    if (phase !== "idle" && phase !== "error") return;

    // Kick off the fetch immediately — runs in parallel with the animation
    fetchRef.current = fetch("/api/random-viand")
      .then((r) => r.json())
      .then(({ viand }) => viand ?? null)
      .catch(() => null);

    setSlotOf([0, 1, 2]);
    setChosenPot(null);
    setPhase("shuffling");
  };

  const handleReset = () => {
    setPhase("idle");
    setSlotOf([0, 1, 2]);
    setChosenPot(null);
  };

  // Shell-game shuffle: swap random pairs every 450ms, 12 times (~5.4s total)
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

        // shake → open → reveal
        setTimeout(() => setPhase("opening"), 1200);
        setTimeout(() => {
          // By now (5.4s + 2.3s = 7.7s elapsed) the fetch is certainly done
          fetchRef.current.then((viand) => {
            if (viand) {
              setPhase("done");
              onResultRef.current(viand);
              setTimeout(() => {
                document
                  .getElementById("recipe-section")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 150);
            } else {
              setPhase("error");
            }
          });
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
        {/* 3 Palayok — absolutely positioned, slide between slots */}
        <div
          className="relative max-w-2xl mx-auto mb-16"
          style={{ height: 280 }}
        >
          {[0, 1, 2].map((potIdx) => {
            const slot = slotOf[potIdx];
            const isCenter = slot === 1;
            const isChosen = chosenPot === potIdx;
            const shake = isChosen && phase === "shaking";
            const openLid =
              isChosen && (phase === "opening" || phase === "done");

            return (
              <div
                key={potIdx}
                style={{
                  position: "absolute",
                  left: SLOT_X[slot],
                  bottom: 0,
                  width: 160,
                  transform: "translateX(-50%)",
                  transition: "left 0.38s cubic-bezier(0.65,0,0.35,1)",
                  zIndex: isCenter ? 10 : 1,
                }}
              >
                <Palayok
                  potId={potIdx}
                  shake={shake}
                  isCenter={isCenter}
                  openLid={openLid}
                />
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center font-bbt">
          {(phase === "idle" || phase === "error") && (
            <>
              {phase === "error" && (
                <p className="text-sm mb-4" style={{ color: "var(--color-tertiary)" }}>
                  May problema sa pagkuha ng ulam. Subukan muli.
                </p>
              )}
              <button
                onClick={handleDraw}
                className="inline-flex items-center gap-3 px-12 py-5 rounded-full text-white font-headline font-black text-2xl shadow-[0px_20px_40px_rgba(187,49,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #bb3100, #ff7851)",
                }}
              >
                <span className="material-symbols-filled">celebration</span>
                MAGDRAW NA!
              </button>
            </>
          )}

          {(phase === "shuffling" ||
            phase === "shaking" ||
            phase === "opening") && (
            <div
              className="inline-flex items-center gap-3 px-12 py-5 rounded-full text-white font-headline font-black text-2xl opacity-75 cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg, #bb3100, #ff7851)",
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  animation: "pot-spin 1s linear infinite",
                  display: "inline-block",
                }}
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

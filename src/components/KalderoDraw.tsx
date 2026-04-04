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
      <svg viewBox="0 0 160 175" width="160" height="175" overflow="visible">
        <defs>
          {/* Body gradient: warm earthy brown */}
          <radialGradient id={`${gid}-body`} cx="26%" cy="24%" r="80%">
            <stop offset="0%"   stopColor="#e2aa74" />
            <stop offset="28%"  stopColor="#b86840" />
            <stop offset="68%"  stopColor="#8a4020" />
            <stop offset="100%" stopColor="#5a2210" />
          </radialGradient>
          {/* Lid gradient — slightly lighter/warmer */}
          <radialGradient id={`${gid}-lid`} cx="30%" cy="22%" r="74%">
            <stop offset="0%"   stopColor="#eab882" />
            <stop offset="36%"  stopColor="#c07848" />
            <stop offset="76%"  stopColor="#8e4820" />
            <stop offset="100%" stopColor="#5c2a10" />
          </radialGradient>
          {/* Deep dark interior */}
          <radialGradient id={`${gid}-inside`} cx="38%" cy="35%" r="64%">
            <stop offset="0%"   stopColor="#1e0c04" />
            <stop offset="55%"  stopColor="#3a1408" />
            <stop offset="100%" stopColor="#5e280e" />
          </radialGradient>
          {/* Mat fill */}
          <radialGradient id={`${gid}-mat`} cx="38%" cy="32%" r="72%">
            <stop offset="0%"   stopColor="#debb52" />
            <stop offset="100%" stopColor="#9e7a28" />
          </radialGradient>
          {/* Clip for mat weave */}
          <clipPath id={`${gid}-mat-clip`}>
            <ellipse cx="80" cy="151" rx="64" ry="14" />
          </clipPath>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="80" cy="166" rx="60" ry="5.5" fill="#1a0a02" opacity="0.28" />

        {/* ── RATTAN MAT — centered at the pot's base level ── */}
        {/* The mat cradles the pot foot: mat cx matches pot base level so
            the pot body sits down INTO the mat's inner area */}
        <ellipse cx="80" cy="151" rx="64" ry="14" fill={`url(#${gid}-mat)`} />
        {/* Concentric ring weave */}
        <g clipPath={`url(#${gid}-mat-clip)`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <ellipse
              key={`mr${i}`}
              cx="80" cy="151"
              rx={64 - i * 11} ry={14 - i * 2.4}
              fill="none" stroke="#6a4810" strokeWidth="2.5" opacity="0.55"
            />
          ))}
        </g>
        {/* Diagonal weave A */}
        <g clipPath={`url(#${gid}-mat-clip)`} stroke="#5a3e0c" strokeWidth="2.5" strokeLinecap="round" opacity="0.42">
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`wa${i}`} x1={6 + i * 9} y1="137" x2={6 + i * 9 + 10} y2="165" />
          ))}
        </g>
        {/* Diagonal weave B */}
        <g clipPath={`url(#${gid}-mat-clip)`} stroke="#dfc060" strokeWidth="1.8" strokeLinecap="round" opacity="0.28">
          {Array.from({ length: 19 }, (_, i) => (
            <line key={`wb${i}`} x1={154 - i * 9} y1="137" x2={154 - i * 9 - 10} y2="165" />
          ))}
        </g>
        {/* Mat border rings */}
        <ellipse cx="80" cy="151" rx="64" ry="14" fill="none" stroke="#5a3c0c" strokeWidth="3"   opacity="0.68" />
        <ellipse cx="80" cy="151" rx="50" ry="11" fill="none" stroke="#5a3c0c" strokeWidth="1.5" opacity="0.38" />
        <ellipse cx="80" cy="151" rx="34" ry="7"  fill="none" stroke="#5a3c0c" strokeWidth="1"   opacity="0.25" />

        {/* ── POT BODY ──
            Path anatomy:
              • Collar join at y=66, x=32–128 (96 px wide)
              • Belly bulges out to near x=0/160 — very spherical
              • Lower body narrows into a rounded foot x=52–108 at y=148
              • Foot bottom curve dips to y=152, matching mat center
            This gives a distinct rounded foot that nestles into the mat. */}
        <path
          d="M 32,66 C 0,70 0,138 52,149 C 62,154 98,154 108,149 C 160,138 160,70 128,66 Z"
          fill={`url(#${gid}-body)`}
        />

        {/* Body highlight sheen — upper-left bright spot */}
        <ellipse cx="44" cy="100" rx="14" ry="34" fill="white" opacity="0.10" transform="rotate(-13,44,100)" />
        <ellipse cx="40" cy="86"  rx="7"  ry="15" fill="white" opacity="0.08" transform="rotate(-13,40,86)" />

        {/* Clay texture marks */}
        <circle cx="34"  cy="112" r="2"   fill="#3a1408" opacity="0.25" />
        <circle cx="52"  cy="136" r="1.5" fill="#3a1408" opacity="0.20" />
        <circle cx="120" cy="114" r="1.8" fill="#3a1408" opacity="0.22" />
        <circle cx="102" cy="100" r="1.4" fill="#3a1408" opacity="0.17" />
        <circle cx="44"  cy="128" r="1.3" fill="#3a1408" opacity="0.15" />

        {/* Shadow where pot foot seats into the mat */}
        <ellipse cx="80" cy="151" rx="44" ry="6" fill="#2c1004" opacity="0.40" />

        {/* Collar */}
        <path d="M 22,52 C 22,59 28,66 32,66 L 128,66 C 132,66 138,59 138,52 Z" fill="#9a5228" />

        {/* Rim */}
        <ellipse cx="80" cy="52" rx="58" ry="14" fill="#c06830" />
        <ellipse cx="62" cy="48" rx="22" ry="6"  fill="white" opacity="0.13" />
        <ellipse cx="80" cy="59" rx="52" ry="8"  fill="#6a3010" opacity="0.28" />

        {/* Interior */}
        <ellipse cx="80" cy="55" rx="50" ry="12" fill={`url(#${gid}-inside)`} />
        <ellipse cx="80" cy="55" rx="50" ry="12" fill="none" stroke="#8a4818" strokeWidth="1.5" opacity="0.35" />

        {/* ── LID ── */}
        <g style={lidAnim}>
          <ellipse cx="80" cy="52" rx="61" ry="13" fill="#7a3818" />
          <path d="M 19,52 C 19,10 141,10 141,52 A 61,13 0 0 0 19,52 Z" fill={`url(#${gid}-lid)`} />
          <ellipse cx="52" cy="29" rx="20" ry="13" fill="white" opacity="0.11" transform="rotate(-18,52,29)" />
          <ellipse cx="46" cy="22" rx="9"  ry="7"  fill="white" opacity="0.07" transform="rotate(-18,46,22)" />
          {/* Knob stem */}
          <path d="M 70,12 Q 70,8 80,7 Q 90,8 90,12 L 90,22 Q 80,25 70,22 Z" fill="#a85a28" />
          {/* Knob cap */}
          <ellipse cx="80" cy="10" rx="13" ry="6"  fill="#c87840" />
          <ellipse cx="80" cy="20" rx="11" ry="5"  fill="#8a4018" />
          <ellipse cx="75" cy="7"  rx="6"  ry="3.5" fill="white" opacity="0.20" />
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

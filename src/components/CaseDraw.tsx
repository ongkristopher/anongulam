"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import type { Viand } from "@/types/viand";

// How many card slots are visible in the strip
const CARD_WIDTH = 160;   // px — width of each card including gap
const CARD_GAP = 12;      // px — gap between cards
const CARD_TOTAL = CARD_WIDTH + CARD_GAP;
const VISIBLE_CARDS = 7;  // must be odd so there's a clear center slot
const STRIP_WIDTH = VISIBLE_CARDS * CARD_TOTAL - CARD_GAP;
const CENTER_OFFSET = Math.floor(VISIBLE_CARDS / 2) * CARD_TOTAL; // px from left edge to center card

// Build a long shuffled repeated list so the strip feels infinite
function buildStrip(viands: Viand[], targetIndex: number): Viand[] {
  // 60 cards total — winner lands roughly at card 50 so there's plenty of scroll room
  const TOTAL = 60;
  const strip: Viand[] = [];
  // Fill with random viands
  for (let i = 0; i < TOTAL; i++) {
    strip.push(viands[Math.floor(Math.random() * viands.length)]);
  }
  // Force winner at position TOTAL - 6 (near end, within visible decel range)
  strip[TOTAL - 6] = viands[targetIndex];
  return strip;
}

interface CaseDrawProps {
  viands: Viand[];
  onResult: (viand: Viand) => void;
}

const SEGMENT_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF922B",
  "#CC5DE8", "#20C997", "#F06595", "#74C0FC", "#A9E34B",
];

export default function CaseDraw({ viands, onResult }: CaseDrawProps) {
  const [rolling, setRolling] = useState(false);
  const [strip, setStrip] = useState<Viand[]>([]);
  const [offset, setOffset] = useState(0);      // translateX of the strip
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const animRef = useRef<number>(0);
  const stripRef = useRef<HTMLDivElement>(null);

  const roll = useCallback(() => {
    if (rolling || viands.length === 0) return;

    // Pick random winner
    const winnerIndex = Math.floor(Math.random() * viands.length);
    const newStrip = buildStrip(viands, winnerIndex);
    const winnerStripPos = newStrip.length - 6; // index in strip where winner sits

    // We want that card to be centred in the viewport.
    // translateX needed = CENTER_OFFSET - winnerStripPos * CARD_TOTAL
    // (negative because we scroll left)
    const finalOffset = CENTER_OFFSET - winnerStripPos * CARD_TOTAL;

    // Start from right side (offset = CENTER_OFFSET so first card is centred)
    const startOffset = CENTER_OFFSET;

    setStrip(newStrip);
    setOffset(startOffset);
    setHighlighted(null);
    setRolling(true);

    // Kick off on next frame after strip renders
    requestAnimationFrame(() => {
      const duration = 5000 + Math.random() * 1000; // 5–6 s
      const start = performance.now();

      const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

      const animate = (now: number) => {
        const elapsed = now - start;
        const t = Math.min(elapsed / duration, 1);
        const current = startOffset + (finalOffset - startOffset) * easeOut(t);
        setOffset(current);

        if (t < 1) {
          animRef.current = requestAnimationFrame(animate);
        } else {
          setOffset(finalOffset);
          setHighlighted(winnerStripPos);
          setRolling(false);
          onResult(newStrip[winnerStripPos]);
        }
      };

      animRef.current = requestAnimationFrame(animate);
    });
  }, [rolling, viands, onResult]);

  if (viands.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-gray-400">
        Walang ulam na nahanap. Mag-add ka muna!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Strip container */}
      <div
        className="relative overflow-hidden rounded-2xl border-2 border-yellow-400 bg-gray-900 shadow-2xl"
        style={{ width: STRIP_WIDTH, height: 200 }}
      >
        {/* Center selector line */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{
            left: CENTER_OFFSET + CARD_GAP / 2,
            width: CARD_WIDTH,
            boxShadow: "0 0 0 2px #facc15",
            borderRadius: 12,
          }}
        />

        {/* Gradient fade edges */}
        <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-gray-900/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-gray-900/80 to-transparent" />

        {/* Scrolling strip */}
        <div
          ref={stripRef}
          className="absolute top-0 bottom-0 flex items-center"
          style={{
            transform: `translateX(${offset}px)`,
            gap: CARD_GAP,
            willChange: "transform",
          }}
        >
          {strip.map((viand, i) => {
            const color = SEGMENT_COLORS[viand.id % SEGMENT_COLORS.length];
            const isWinner = highlighted === i;
            return (
              <div
                key={i}
                className="shrink-0 rounded-xl overflow-hidden flex flex-col items-center justify-end transition-transform"
                style={{
                  width: CARD_WIDTH,
                  height: 168,
                  background: color,
                  outline: isWinner ? "3px solid #facc15" : "none",
                  boxShadow: isWinner ? "0 0 24px #facc1588" : "none",
                }}
              >
                {viand.image_url ? (
                  <div className="relative w-full flex-1">
                    <Image
                      src={viand.image_url}
                      alt={viand.name}
                      fill
                      className="object-cover"
                      sizes="160px"
                    />
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-4xl">
                    🍽️
                  </div>
                )}
                <div className="w-full bg-black/40 px-2 py-1.5 text-center">
                  <p className="text-white text-xs font-bold leading-tight truncate">
                    {viand.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ticker arrow at top */}
        <div
          className="absolute top-0 z-30 pointer-events-none"
          style={{ left: CENTER_OFFSET + CARD_TOTAL / 2 - 10 }}
        >
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-yellow-400" />
        </div>
        {/* Ticker arrow at bottom */}
        <div
          className="absolute bottom-0 z-30 pointer-events-none"
          style={{ left: CENTER_OFFSET + CARD_TOTAL / 2 - 10 }}
        >
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-b-[16px] border-l-transparent border-r-transparent border-b-yellow-400" />
        </div>
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={rolling}
        className="px-12 py-4 bg-yellow-400 hover:bg-yellow-300 disabled:bg-gray-400 text-gray-900 text-xl font-extrabold rounded-full shadow-lg uppercase tracking-widest transition-all active:scale-95"
      >
        {rolling ? "Bubukas na…" : "🎰 Bukas!"}
      </button>
    </div>
  );
}

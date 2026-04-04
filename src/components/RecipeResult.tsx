"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import type { Viand } from "@/types/viand";

interface RecipeResultProps {
  viand: Viand;
  onPickNew?: () => void;
}

export default function RecipeResult({ viand, onPickNew }: RecipeResultProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Trigger confetti on reveal
  useEffect(() => {
    import("canvas-confetti").then((mod) => {
      mod.default({ particleCount: 120, spread: 80, origin: { y: 0.55 }, colors: ["#bb3100", "#ff7851", "#ffc96f", "#ffffd3"] });
    });
  }, [viand.id]);

  return (
    <section
      id="recipe-section"
      ref={sectionRef}
      className="relative px-6 py-20 overflow-hidden"
      style={{ background: "#fcfae3" }}
    >
      {/* Banig pattern overlay */}
      <div className="banig-pattern absolute inset-0 pointer-events-none" />

      <div
        className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10"
        style={{ animation: "fade-up 0.6s ease-out forwards" }}
      >
        {/* ── Left: Text content ── */}
        <div className="order-2 md:order-1">
          <span
            className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-5"
            style={{ background: "#ffc96f", color: "#614100" }}
          >
            TODAY&apos;S FIESTA SPECIAL
          </span>

          <h2
            className="font-bbt text-5xl md:text-6xl font-black mb-2 leading-tight"
            style={{ color: "#bb3100" }}
          >
            {viand.name}
          </h2>

          {/* Meta row */}
          <div className="flex items-center gap-4 mb-6">
            {viand.category && (
              <span
                className="text-sm font-semibold px-3 py-0.5 rounded-full"
                style={{ background: "#f6f5dc", color: "#865c00" }}
              >
                {viand.category}
              </span>
            )}
            {viand.cook_time && (
              <span
                className="flex items-center gap-1 text-sm"
                style={{ color: "#656554" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 16 }}
                >
                  timer
                </span>
                {viand.cook_time}
              </span>
            )}
          </div>

          {viand.description && (
            <p
              className="text-lg leading-relaxed mb-8"
              style={{ color: "#38392a" }}
            >
              {viand.description}
            </p>
          )}

          {/* Ingredients + Quick Recipe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {viand.ingredients.length > 0 && (
              <div
                className="p-5 rounded-2xl"
                style={{ background: "#ffffd3" }}
              >
                <h4
                  className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"
                  style={{ color: "#865c00" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    inventory_2
                  </span>
                  Ingredients
                </h4>
                <ul className="space-y-1">
                  {viand.ingredients.map((ing, i) => (
                    <li
                      key={i}
                      className="text-sm"
                      style={{ color: "#38392a" }}
                    >
                      • {ing}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {viand.quick_recipe && (
              <div
                className="p-5 rounded-2xl"
                style={{ background: "#ffffd3" }}
              >
                <h4
                  className="font-bold mb-3 flex items-center gap-2 text-sm uppercase tracking-wide"
                  style={{ color: "#865c00" }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: 16 }}
                  >
                    menu_book
                  </span>
                  Quick Recipe
                </h4>
                <ol className="space-y-2">
                  {viand.quick_recipe
                    .split(/\r?\n/)
                    .filter((s) => s.trim())
                    .map((step, i) => (
                      <li
                        key={i}
                        className="text-sm flex gap-2 leading-relaxed"
                        style={{ color: "#38392a" }}
                      >
                        <span
                          className="font-bold shrink-0"
                          style={{ color: "#bb3100" }}
                        >
                          {i + 1}.
                        </span>
                        <span style={{ opacity: 0.85 }}>{step.trim()}</span>
                      </li>
                    ))}
                </ol>
              </div>
            )}
          </div>

          {/* Pick New Dish */}
          {onPickNew && (
            <div className="mb-6">
              <button
                onClick={onPickNew}
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-headline font-bold text-xl transition-all hover:scale-105 active:scale-95 text-white shadow-[0px_12px_32px_rgba(187,49,0,0.3)]"
                style={{ background: "linear-gradient(135deg, #bb3100, #ff7851)" }}
              >
                <span className="material-symbols-filled">celebration</span>
                Pumili ng Bagong Ulam
              </button>
            </div>
          )}

          {/* Disclaimer + Source */}
          <div className="mt-4 flex flex-wrap items-start gap-2">
            <p className="text-xs leading-relaxed" style={{ color: "#656554" }}>
              <span
                className="material-symbols-outlined align-middle"
                style={{ fontSize: 13 }}
              >
                info
              </span>{" "}
              Ang recipe na ito ay maaaring nanggaling sa iba&apos;t ibang
              pinagkukunan tulad ng Facebook, Google, o iba pang website. Hindi
              ito eksklusibong gawa ng &apos;<span className="font-bbt">Anong Ulam</span>&apos;
            </p>
            {viand.source_url && (
              <a
                href={viand.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shrink-0 transition-opacity hover:opacity-70"
                style={{ background: "#ffc96f", color: "#614100" }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: 12 }}
                >
                  open_in_new
                </span>
                Tingnan ang Pinagkunan
              </a>
            )}
          </div>
        </div>

        {/* ── Right: Image ── */}
        <div className="order-1 md:order-2 relative">
          <div
            className="aspect-square rounded-2xl overflow-hidden asymmetric-clip shadow-2xl"
            style={{ background: "#ebeace" }}
          >
            {viand.image_url ? (
              <Image
                src={viand.image_url}
                alt={viand.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🍽️
              </div>
            )}
          </div>

          {/* "YUMMY! CHOICE" badge */}
          <div
            className="absolute -bottom-4 -right-4 w-28 h-28 rounded-full flex items-center justify-center -rotate-12 shadow-lg"
            style={{ background: "linear-gradient(135deg, #bb3100, #ff7851)" }}
          >
            <span className="text-white font-headline font-bold text-center leading-tight text-sm">
              YUMMY!
              <br />
              CHOICE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

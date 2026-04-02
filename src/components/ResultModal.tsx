"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Viand } from "@/types/viand";

interface ResultModalProps {
  viand: Viand;
  onClose: () => void;
}

export default function ResultModal({ viand, onClose }: ResultModalProps) {
  // Confetti on mount
  useEffect(() => {
    import("canvas-confetti").then((mod) => {
      mod.default({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    });
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-500 text-sm mb-1">Ang ulam ngayon ay…</p>
        <h2 className="text-3xl font-extrabold text-red-500 mb-4">{viand.name}</h2>

        {viand.image_url && (
          <div className="relative w-full h-52 rounded-xl overflow-hidden mb-4">
            <Image
              src={viand.image_url}
              alt={viand.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {viand.description && (
          <p className="text-gray-600 text-sm mb-4">{viand.description}</p>
        )}

        <button
          onClick={onClose}
          className="mt-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all active:scale-95"
        >
          Salamat! 🙏
        </button>
      </div>
    </div>
  );
}

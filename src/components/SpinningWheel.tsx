"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import type { Viand } from "@/types/viand";

// Vibrant colors for wheel segments
const SEGMENT_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF922B",
  "#CC5DE8",
  "#20C997",
  "#F06595",
  "#74C0FC",
  "#A9E34B",
  "#FFA94D",
  "#DA77F2",
];

interface SpinningWheelProps {
  viands: Viand[];
  onResult: (viand: Viand) => void;
}

export default function SpinningWheel({ viands, onResult }: SpinningWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinning, setSpinning] = useState(false);
  const currentAngleRef = useRef(0); // current rotation in radians
  const animFrameRef = useRef<number>(0);

  const segmentCount = viands.length;
  const segmentAngle = segmentCount > 0 ? (2 * Math.PI) / segmentCount : 0;

  // ---------- Drawing ----------
  const drawWheel = useCallback(
    (angle: number) => {
      const canvas = canvasRef.current;
      if (!canvas || segmentCount === 0) return;
      const ctx = canvas.getContext("2d")!;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 10;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Drop shadow for the wheel
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 20;

      viands.forEach((viand, i) => {
        const startAngle = angle + i * segmentAngle;
        const endAngle = startAngle + segmentAngle;

        // Segment fill
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${Math.max(10, Math.min(14, radius / segmentCount + 4))}px sans-serif`;
        ctx.shadowBlur = 0;
        ctx.fillText(viand.name, radius - 12, 4);
        ctx.restore();
      });

      ctx.restore();

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Pointer (triangle at top-right)
      const pointerX = cx + radius + 10;
      ctx.beginPath();
      ctx.moveTo(pointerX + 18, cy);
      ctx.lineTo(pointerX - 4, cy - 12);
      ctx.lineTo(pointerX - 4, cy + 12);
      ctx.closePath();
      ctx.fillStyle = "#ef4444";
      ctx.fill();
    },
    [viands, segmentAngle, segmentCount]
  );

  useEffect(() => {
    drawWheel(currentAngleRef.current);
  }, [drawWheel]);

  // ---------- Spin logic ----------
  const spin = () => {
    if (spinning || segmentCount === 0) return;
    setSpinning(true);

    const extraSpins = 5 + Math.random() * 5; // 5–10 full rotations
    const targetAngle =
      currentAngleRef.current + extraSpins * 2 * Math.PI + Math.random() * 2 * Math.PI;
    const duration = 4000 + Math.random() * 1000; // 4–5 s
    const startAngle = currentAngleRef.current;
    const startTime = performance.now();

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      currentAngleRef.current = startAngle + (targetAngle - startAngle) * easeOut(progress);
      drawWheel(currentAngleRef.current);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        resolveResult(currentAngleRef.current);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  const resolveResult = (angle: number) => {
    // Pointer is at 3 o'clock (angle = 0 from canvas right side).
    // We rotate segments from the top, so we normalise accordingly.
    const normalised = ((-angle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const index = Math.floor(normalised / segmentAngle) % segmentCount;
    onResult(viands[index]);
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  if (segmentCount === 0) {
    return (
      <div className="flex items-center justify-center h-72 text-gray-400">
        Walang ulam na nahanap. Mag-add ka muna ng ulam!
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={420}
          height={420}
          className="max-w-full"
        />
      </div>
      <button
        onClick={spin}
        disabled={spinning}
        className="px-10 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white text-xl font-bold rounded-full shadow-lg transition-all active:scale-95"
      >
        {spinning ? "Ikot na…" : "🍽️ I-spin!"}
      </button>
    </div>
  );
}

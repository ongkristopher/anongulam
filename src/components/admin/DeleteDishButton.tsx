"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteDishButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/dishes/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.refresh();
    } else {
      const { error } = await res.json();
      alert(`Error: ${error}`);
      setDeleting(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold" style={{ color: "var(--color-on-surface-variant)" }}>
          Tanggalin si <strong>{name}</strong>?
        </span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition-opacity hover:opacity-80 disabled:opacity-50"
          style={{ background: "var(--color-tertiary)", color: "#fff" }}
        >
          {deleting ? "..." : "Oo"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ background: "var(--color-surface-container-high)", color: "var(--color-on-surface-variant)" }}
        >
          Hindi
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-opacity hover:opacity-70"
      style={{ background: "#fde8e8", color: "var(--color-tertiary)" }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
      Burahin
    </button>
  );
}

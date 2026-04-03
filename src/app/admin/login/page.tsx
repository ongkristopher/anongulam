"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError("Mali ang password. Subukan muli.");
    }
    setLoading(false);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--color-surface)" }}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-8 shadow-lg"
        style={{ background: "var(--color-surface-container-low)", border: "2px solid var(--color-outline-variant)" }}
      >
        <h1
          className="font-bbt text-3xl text-center mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          ADMIN
        </h1>
        <p className="text-center text-sm mb-8" style={{ color: "var(--color-on-surface-variant)" }}>
          Ikaw lang ang pwedeng pumasok dito.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:ring-2"
            style={{
              background: "var(--color-surface-container)",
              color: "var(--color-on-surface)",
              border: "2px solid var(--color-outline-variant)",
              // @ts-expect-error custom property
              "--tw-ring-color": "var(--color-primary)",
            }}
          />

          {error && (
            <p className="text-sm text-center" style={{ color: "var(--color-tertiary)" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm transition-opacity disabled:opacity-50"
            style={{ background: "var(--color-primary)", color: "var(--color-on-primary)" }}
          >
            {loading ? "Checking..." : "PUMASOK"}
          </button>
        </form>
      </div>
    </div>
  );
}

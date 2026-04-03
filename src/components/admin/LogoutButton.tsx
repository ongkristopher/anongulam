"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm px-3 py-1.5 rounded-lg font-semibold transition-opacity hover:opacity-80"
      style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
    >
      Logout
    </button>
  );
}

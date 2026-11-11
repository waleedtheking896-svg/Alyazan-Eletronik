"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }: { className?: string }) {
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    window.location.href = "/admin/login";
  };

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className={
        className ??
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-60"
      }
    >
      <LogOut className="h-3.5 w-3.5" />
      {busy ? "Logging out…" : "Log out"}
    </button>
  );
}

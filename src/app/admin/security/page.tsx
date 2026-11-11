"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth-constants";

export default function SecurityPage() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (next.length < MIN_PASSWORD_LENGTH) {
      setMsg({ ok: false, text: `Das neue Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.` });
      return;
    }
    if (next !== confirm) {
      setMsg({ ok: false, text: "Die beiden neuen Passwörter stimmen nicht überein." });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/auth/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ ok: false, text: data.error || "Passwort konnte nicht geändert werden." });
        return;
      }
      setCurrent("");
      setNext("");
      setConfirm("");
      setMsg({ ok: true, text: "Passwort wurde geändert. Ab jetzt gilt das neue Passwort." });
    } catch {
      setMsg({ ok: false, text: "Keine Verbindung zum Server." });
    } finally {
      setBusy(false);
    }
  };

  const input =
    "w-full rounded-xl border border-[#3a3a3a] bg-[#111] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]";

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-4 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-[#C9A227]/40 bg-[#141414] p-8">
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-[#F2D16B]">
          <ArrowLeft className="h-3.5 w-3.5" /> Zurück zur Verwaltung
        </Link>
        <div className="mt-5 flex items-center gap-2 text-[#F2D16B]">
          <KeyRound className="h-5 w-5" />
          <h1 className="text-xl font-extrabold">Passwort ändern</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Mindestens {MIN_PASSWORD_LENGTH} Zeichen. Nach der Änderung bleiben nur noch dieses Gerät und dieser Browser angemeldet.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Aktuelles Passwort</label>
            <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Neues Passwort</label>
            <input type="password" required autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={input} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs text-slate-400">Neues Passwort wiederholen</label>
            <input type="password" required autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={input} />
          </div>

          {msg && (
            <p role="alert" className={`rounded-lg px-3 py-2 text-xs ${msg.ok ? "bg-emerald-950 text-emerald-300" : "bg-red-950 text-red-300"}`}>
              {msg.text}
            </p>
          )}

          <button type="submit" disabled={busy} className="w-full cursor-pointer rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-black transition hover:bg-[#E0B83A] disabled:opacity-50">
            {busy ? "Wird gespeichert…" : "Passwort speichern"}
          </button>
        </form>
      </div>
    </main>
  );
}

import { LockKeyhole } from "lucide-react";
import AlyazenLogo from "@/components/AlyazenLogo";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin-Anmeldung — ALYAZEN" };

const MESSAGES: Record<string, string> = {
  wrong: "Falsches Passwort. Bitte nochmal versuchen.",
  locked: "Zu viele Fehlversuche. Bitte in 15 Minuten erneut versuchen.",
  cookie:
    "Die Anmeldung war richtig, aber dein Browser speichert den Login nicht. Öffne die Seite in Chrome oder Safari (nicht im WhatsApp- oder Facebook-Browser) und erlaube Cookies.",
};

// Plain HTML form (no JavaScript needed). It posts to /api/auth/form-login.
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;
  const message = error ? MESSAGES[error] ?? "Anmeldung fehlgeschlagen." : null;
  const safeNext = next && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0A0A0A] px-4 text-slate-100">
      <div className="w-full max-w-sm rounded-3xl border border-[#C9A227]/40 bg-[#141414] p-8">
        <div className="flex flex-col items-center text-center">
          <AlyazenLogo className="h-14 w-14" />
          <div className="mt-4 flex items-center gap-2 text-[#F2D16B]">
            <LockKeyhole className="h-4 w-4" />
            <h1 className="text-xl font-extrabold">Admin-Anmeldung</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">ALYAZEN — Verwaltung & Shop</p>
        </div>

        <form method="post" action="/api/auth/form-login" className="mt-7 space-y-4">
          <input type="hidden" name="next" value={safeNext} />
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs text-slate-400">
              Passwort
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-[#3a3a3a] bg-[#111] px-3.5 py-2.5 text-sm text-slate-100 outline-none focus:border-[#C9A227]"
            />
          </div>

          {message && (
            <p role="alert" className="rounded-lg bg-red-950 px-3 py-2 text-xs text-red-300">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="w-full cursor-pointer rounded-xl bg-[#C9A227] py-3 text-sm font-bold text-black transition hover:bg-[#E0B83A]"
          >
            Anmelden
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-slate-500">
          Tipp: Öffne diese Seite in Chrome oder Safari. Der Browser in WhatsApp oder Facebook speichert den Login oft nicht.
        </p>

        <a href="/" className="mt-6 block text-center text-xs text-slate-500 hover:text-[#F2D16B]">
          ← Zurück zur Webseite
        </a>
      </div>
    </main>
  );
}

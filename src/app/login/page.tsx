"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Coffee } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import LangToggle from "@/components/LangToggle";
import { ThemeToggle } from "@/components/ThemeProvider";

export default function LoginPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(false);
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) {
      router.replace("/");
      router.refresh();
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="absolute right-4 top-4 flex items-center gap-1.5">
        <LangToggle />
        <ThemeToggle />
      </div>
      <div className="w-full max-w-[22rem] animate-rise">
        <div className="mb-10 flex flex-col items-center text-center">
          <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-espresso text-cream shadow-btn">
            <Coffee size={24} strokeWidth={2.2} />
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-espresso">
            Brew
          </h1>
          <p className="mt-2 text-sm text-muted">{t("tagline")}</p>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">{t("login_password")}</label>
            <input
              type="password"
              autoFocus
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? (
            <p className="text-sm font-medium text-danger">{t("login_error")}</p>
          ) : null}
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? "…" : t("login_button")}
          </button>
        </form>
      </div>
    </div>
  );
}

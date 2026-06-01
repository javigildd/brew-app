"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, Plus, BarChart3, LogOut } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiSend } from "@/lib/client";
import LangToggle from "./LangToggle";
import { ThemeToggle } from "./ThemeProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await apiSend("/api/logout", "POST");
    router.replace("/login");
    router.refresh();
  };

  const nav: { href: string; label: string; Icon: LucideIcon }[] = [
    { href: "/", label: t("nav_home"), Icon: Coffee },
    { href: "/add", label: t("nav_add"), Icon: Plus },
    { href: "/stats", label: t("nav_stats"), Icon: BarChart3 },
  ];
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <div className="min-h-dvh lg:flex">
      {/* ── Desktop sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-crema bg-surface px-4 py-6 lg:flex">
        <Link href="/" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-accentfg">
            <Coffee size={20} />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight text-espresso">
            Brew
          </span>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-sand hover:text-espresso"
                }`}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-crema pt-4">
          <div className="flex items-center gap-1.5">
            <LangToggle />
            <ThemeToggle />
          </div>
          <button onClick={logout} className="icon-btn" aria-label={t("logout")} title={t("logout")}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex min-h-dvh flex-1 flex-col lg:pl-64">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-crema/70 bg-cream/80 px-4 py-3 backdrop-blur-md lg:hidden">
          <Link href="/" className="flex items-baseline gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-espresso">
              Brew
            </span>
            <span className="hidden text-xs text-muted sm:inline">{t("tagline")}</span>
          </Link>
          <div className="flex items-center gap-1.5">
            <LangToggle />
            <ThemeToggle />
            <button onClick={logout} className="icon-btn" aria-label={t("logout")} title={t("logout")}>
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 pb-28 lg:max-w-5xl lg:px-10 lg:py-9 lg:pb-12">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex items-stretch justify-around border-t border-crema/70 bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          {nav.map(({ href, label, Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-semibold transition-colors ${
                  active ? "text-accent" : "text-muted hover:text-espresso"
                }`}
              >
                {active ? (
                  <span className="absolute top-0 h-0.5 w-8 rounded-full bg-accent" />
                ) : null}
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

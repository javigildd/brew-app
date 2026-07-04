"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, Plus, BarChart3, LogOut, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { apiSend } from "@/lib/client";
import LangToggle from "./LangToggle";
import { ThemeToggle } from "./ThemeProvider";

function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-espresso text-cream">
        <Coffee size={15} strokeWidth={2.4} />
      </span>
      <span className="font-serif text-lg font-bold tracking-tight text-espresso">
        Brew
      </span>
    </span>
  );
}

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
    <div className="flex min-h-dvh flex-col">
      {/* ── Top bar ── */}
      <header className="glass sticky top-0 z-30 border-b">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 lg:px-8">
          <div className="flex items-center gap-7">
            <Link href="/" aria-label="Brew">
              <Wordmark />
            </Link>
            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map(({ href, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "bg-sand text-espresso"
                        : "text-muted hover:text-espresso"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-1">
            <LangToggle />
            <ThemeToggle />
            <Link
              href="/settings"
              className={`icon-btn ${pathname.startsWith("/settings") ? "bg-sand text-espresso" : ""}`}
              aria-label={t("nav_settings")}
              title={t("nav_settings")}
            >
              <Settings size={17} />
            </Link>
            <button
              onClick={logout}
              className="icon-btn"
              aria-label={t("logout")}
              title={t("logout")}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 animate-fade-in px-4 py-6 pb-28 md:pb-12 lg:px-8 lg:py-10">
        {children}
      </main>

      {/* ── Mobile tab bar ── */}
      <nav
        className="glass fixed inset-x-0 bottom-0 z-30 flex items-stretch justify-around border-t shadow-dock md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {nav.map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors duration-150 ${
                active ? "text-espresso" : "text-muted"
              }`}
            >
              <Icon size={21} strokeWidth={active ? 2.4 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

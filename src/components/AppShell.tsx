"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Coffee, Plus, BarChart3, LogOut } from "lucide-react";
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

  const navItems = [
    { href: "/", label: t("nav_home"), Icon: Coffee },
    { href: "/add", label: t("nav_add"), Icon: Plus },
    { href: "/stats", label: t("nav_stats"), Icon: BarChart3 },
  ];

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-crema/70 bg-cream/80 px-4 py-3 backdrop-blur-md">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-espresso">
            Brew
          </span>
          <span className="hidden text-xs text-muted sm:inline">
            {t("tagline")}
          </span>
        </Link>
        <div className="flex items-center gap-1.5">
          <LangToggle />
          <ThemeToggle />
          <button onClick={logout} className="icon-btn" aria-label={t("logout")} title={t("logout")}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-28">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex w-full max-w-2xl items-stretch justify-around border-t border-crema/70 bg-cream/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
        {navItems.map(({ href, label, Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
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
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { apiSend } from "@/lib/client";
import LangToggle from "./LangToggle";

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
    { href: "/", label: t("nav_home"), icon: "☕" },
    { href: "/add", label: t("nav_add"), icon: "＋" },
    { href: "/stats", label: t("nav_stats"), icon: "📊" },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-crema/70 bg-cream/90 px-4 py-3 backdrop-blur">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-espresso">
            Brew
          </span>
          <span className="hidden text-xs text-coffee/60 sm:inline">
            {t("tagline")}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <LangToggle />
          <button onClick={logout} className="btn-ghost px-3 py-1 text-xs">
            {t("logout")}
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-2xl items-stretch justify-around border-t border-crema/70 bg-cream/95 backdrop-blur">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-semibold ${
                active ? "text-terracotta" : "text-coffee/60"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

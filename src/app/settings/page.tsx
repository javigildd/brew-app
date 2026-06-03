"use client";

import { useEffect, useState } from "react";
import { KeyRound, Check, Trash2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import LangToggle from "@/components/LangToggle";
import { ThemeToggle } from "@/components/ThemeProvider";
import { useI18n } from "@/lib/i18n";
import { getApiKey, setApiKey, clearApiKey } from "@/lib/settings";

type Status = "idle" | "verifying" | "valid" | "invalid" | "error" | "empty";

export default function SettingsPage() {
  const { t } = useI18n();
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setSaved(!!getApiKey());
  }, []);

  const saveAndVerify = async () => {
    const key = input.trim();
    if (!key) {
      setStatus("empty");
      return;
    }
    setApiKey(key);
    setSaved(true);
    setStatus("verifying");
    try {
      const res = await fetch("/api/verify-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("valid");
        setInput("");
      } else {
        setStatus(data.error === "invalid" ? "invalid" : "error");
      }
    } catch {
      setStatus("error");
    }
  };

  const remove = () => {
    clearApiKey();
    setSaved(false);
    setInput("");
    setStatus("idle");
  };

  const statusEl = () => {
    switch (status) {
      case "verifying":
        return <p className="text-sm text-muted">{t("set_api_verifying")}</p>;
      case "valid":
        return <p className="text-sm font-medium text-positive">{t("set_api_valid")}</p>;
      case "invalid":
        return <p className="text-sm font-medium text-danger">{t("set_api_invalid")}</p>;
      case "empty":
        return <p className="text-sm font-medium text-danger">{t("set_api_empty")}</p>;
      case "error":
        return <p className="text-sm font-medium text-danger">{t("set_api_error")}</p>;
      default:
        return null;
    }
  };

  return (
    <AppShell>
      <h1 className="mb-5 font-serif text-2xl font-bold text-espresso lg:text-3xl">
        {t("settings_title")}
      </h1>

      <div className="space-y-4">
        {/* Anthropic API key */}
        <section className="card p-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <KeyRound size={16} />
            </span>
            <h2 className="font-serif text-lg font-bold text-espresso">
              {t("set_api_title")}
            </h2>
          </div>
          <p className="mb-1 text-sm text-muted">{t("set_api_desc")}</p>
          <p className="mb-4 text-xs text-muted">
            {t("set_api_get")}{" "}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-accent hover:underline"
            >
              console.anthropic.com
            </a>
          </p>

          <div
            className={`mb-3 flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
              saved ? "bg-positive/10 text-positive" : "bg-sand text-muted"
            }`}
          >
            {saved ? <Check size={15} /> : null}
            {saved ? t("set_api_saved") : t("set_api_none")}
          </div>

          <label className="label">{t("set_api_label")}</label>
          <input
            type="password"
            className="input font-mono"
            placeholder="sk-ant-..."
            autoComplete="off"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="btn-primary"
              onClick={saveAndVerify}
              disabled={status === "verifying"}
            >
              {status === "verifying" ? t("set_api_verifying") : t("set_api_save")}
            </button>
            {saved ? (
              <button type="button" className="btn-ghost text-danger hover:bg-danger/10" onClick={remove}>
                <Trash2 size={15} /> {t("set_api_remove")}
              </button>
            ) : null}
          </div>
          <div className="mt-2">{statusEl()}</div>
        </section>

        {/* Appearance */}
        <section className="card p-5">
          <h2 className="mb-4 font-serif text-lg font-bold text-espresso">
            {t("set_appearance")}
          </h2>
          <div className="flex items-center justify-between border-b border-crema/60 py-2.5">
            <span className="text-sm font-medium text-espresso">{t("set_language")}</span>
            <LangToggle />
          </div>
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm font-medium text-espresso">{t("set_theme")}</span>
            <ThemeToggle />
          </div>
        </section>
      </div>
    </AppShell>
  );
}

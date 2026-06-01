"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera } from "lucide-react";
import AppShell from "@/components/AppShell";
import CoffeeForm, { type CoffeeFormValues } from "@/components/CoffeeForm";
import { useI18n } from "@/lib/i18n";
import {
  apiSend,
  base64ToBlob,
  fileToResizedBase64,
} from "@/lib/client";
import type { ExtractedCoffee } from "@/lib/anthropic";
import type { Coffee } from "@/lib/types";

export default function AddPage() {
  const { t } = useI18n();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [imageB64, setImageB64] = useState<string | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState(false);
  const [seed, setSeed] = useState<Partial<CoffeeFormValues>>({});
  const [seedKey, setSeedKey] = useState(0);

  const onPick = async (file: File) => {
    setExtractError(false);
    setExtracting(true);
    try {
      const { base64, mediaType } = await fileToResizedBase64(file);
      setImageB64(base64);
      setPreview(`data:${mediaType};base64,${base64}`);

      const blob = base64ToBlob(base64, mediaType);
      const form = new FormData();
      form.append("image", blob, "bag.jpg");
      const res = await fetch("/api/extract", { method: "POST", body: form });
      if (!res.ok) throw new Error("extract failed");
      const data: ExtractedCoffee = await res.json();
      setSeed({
        roaster: data.roaster,
        name: data.name,
        origin: data.origin,
        producer: data.producer,
        variety: data.variety,
        process: data.process,
        altitude: data.altitude,
        tasting_notes: data.tasting_notes,
        roast_level: data.roast_level,
        roast_purpose: data.roast_purpose,
        decaf: data.decaf,
        weight_grams: data.weight_grams,
      });
      setSeedKey((k) => k + 1);
    } catch {
      setExtractError(true);
    } finally {
      setExtracting(false);
    }
  };

  const save = async (values: CoffeeFormValues) => {
    const form = new FormData();
    form.append("data", JSON.stringify(values));
    if (imageB64) {
      form.append("image", base64ToBlob(imageB64, "image/jpeg"), "bag.jpg");
    }
    const created = await apiSend<Coffee>("/api/coffees", "POST", form);
    router.push(`/coffee/${created.id}`);
  };

  return (
    <AppShell>
      <h1 className="mb-4 font-serif text-2xl font-bold text-espresso">
        {t("add_title")}
      </h1>

      <div className="card mb-5 p-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
          }}
        />
        {preview ? (
          <div className="space-y-3">
            <div className="overflow-hidden rounded-lg bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="bag" className="mx-auto max-h-64 object-contain" />
            </div>
            {extracting ? (
              <p className="flex items-center justify-center gap-2 text-sm font-medium text-coffee">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-coffee/30 border-t-coffee" />
                {t("add_extracting")}
              </p>
            ) : (
              <button
                type="button"
                className="btn-outline w-full"
                onClick={() => fileRef.current?.click()}
              >
                {t("add_retake")}
              </button>
            )}
            {extractError ? (
              <p className="text-center text-sm text-danger">
                {t("add_extract_error")}
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand text-coffee">
              <Camera size={28} />
            </div>
            <p className="text-sm text-muted">{t("add_take_photo")}</p>
            <button
              type="button"
              className="btn-accent"
              onClick={() => fileRef.current?.click()}
            >
              {t("add_choose_photo")}
            </button>
            <p className="text-xs text-muted/70">{t("add_no_photo_note")}</p>
          </div>
        )}
      </div>

      <CoffeeForm
        key={seedKey}
        defaultValue={seed}
        submitLabel={t("save")}
        onSubmit={save}
      />
    </AppShell>
  );
}

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MIN_TEXT_LENGTH, type DetectResponse } from "@/lib/detect-schema";
import type { Locale } from "@/i18n/routing";
import { DetectorResult } from "./detector-result";

export function DetectorForm({ locale }: { locale: Locale }) {
  const t = useTranslations("detector");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectResponse | null>(null);

  const tooShort = text.length < MIN_TEXT_LENGTH;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (tooShort || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/detect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, language: locale }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with ${res.status}`);
      }
      const data = (await res.json()) as DetectResponse;
      setResult(data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={onSubmit} className="space-y-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("placeholder")}
          rows={12}
          className="resize-y text-base leading-relaxed"
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <span
            className={
              tooShort
                ? "text-xs text-muted-foreground"
                : "text-xs text-foreground/70"
            }
          >
            {t("charCount", { count: text.length })}
          </span>
          <Button type="submit" disabled={tooShort || loading} className="gap-2">
            {loading && <Loader2 className="size-4 animate-spin" />}
            {loading ? t("submitting") : t("submit")}
          </Button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {result && <DetectorResult result={result} />}
    </div>
  );
}

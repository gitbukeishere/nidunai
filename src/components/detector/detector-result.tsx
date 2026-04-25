"use client";

import { useTranslations } from "next-intl";
import type { DetectResponse } from "@/lib/detect-schema";

function highlightStyle(probability: number): React.CSSProperties {
  // Red wash whose alpha tracks AI probability.
  const alpha = Math.max(0.05, Math.min(0.55, probability * 0.55));
  return { backgroundColor: `rgba(239, 68, 68, ${alpha.toFixed(2)})` };
}

export function DetectorResult({ result }: { result: DetectResponse }) {
  const t = useTranslations("detector.result");
  const { aiScore, humanScore, sentences } = result;

  return (
    <section className="space-y-8 rounded-lg border border-border bg-card p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ScoreBlock label={t("aiScore")} value={aiScore} tone="ai" />
        <ScoreBlock label={t("humanScore")} value={humanScore} tone="human" />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("perSentence")}
        </h2>
        <p className="text-base leading-relaxed text-foreground">
          {sentences.map((s, i) => (
            <span
              key={i}
              style={highlightStyle(s.aiProbability)}
              className="rounded px-0.5 py-0.5"
              title={`${Math.round(s.aiProbability * 100)}%`}
            >
              {s.text}
              {i < sentences.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

function ScoreBlock({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "ai" | "human";
}) {
  const barColor =
    tone === "ai"
      ? "bg-red-500"
      : "bg-emerald-500";
  return (
    <div className="rounded-md border border-border/60 bg-background p-4">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums text-foreground">
          {value}
        </span>
        <span className="text-sm text-muted-foreground">%</span>
      </div>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full ${barColor} transition-[width]`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

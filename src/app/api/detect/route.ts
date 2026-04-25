import { NextResponse } from "next/server";
import {
  detectRequestSchema,
  type DetectResponse,
  type DetectSentence,
} from "@/lib/detect-schema";

export const runtime = "nodejs";

const SENTENCE_SPLIT = /(?<=[.!?。！？])\s+/u;

function splitSentences(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  return trimmed
    .split(SENTENCE_SPLIT)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const parsed = detectRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Mock work — simulate model latency so the loading state is visible.
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const { text } = parsed.data;
  const rawSentences = splitSentences(text);
  const sentences: DetectSentence[] =
    rawSentences.length > 0
      ? rawSentences.map((s) => ({ text: s, aiProbability: Math.random() }))
      : [{ text, aiProbability: Math.random() }];

  const aiScore = Math.round(Math.random() * 100);
  const response: DetectResponse = {
    aiScore,
    humanScore: 100 - aiScore,
    sentences,
  };

  return NextResponse.json(response);
}

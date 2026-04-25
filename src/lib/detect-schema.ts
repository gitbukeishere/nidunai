import { z } from "zod";

export const MIN_TEXT_LENGTH = 100;

export const detectRequestSchema = z.object({
  text: z
    .string()
    .min(MIN_TEXT_LENGTH, `Text must be at least ${MIN_TEXT_LENGTH} characters.`),
  language: z.enum(["en", "ru", "mn"]),
});

export type DetectRequest = z.infer<typeof detectRequestSchema>;

export type DetectSentence = {
  text: string;
  aiProbability: number;
};

export type DetectResponse = {
  aiScore: number;
  humanScore: number;
  sentences: DetectSentence[];
};

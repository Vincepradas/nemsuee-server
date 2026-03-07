import { z } from "zod";

export const quizSchema = z.object({
  lessonId: z.number(),
  questions: z
    .array(
      z.object({
        prompt: z.string().min(2),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
        correctOption: z.enum(["A", "B", "C", "D"]),
      }),
    )
    .min(1),
});

export const quizUpdateSchema = z.object({
  questions: z
    .array(
      z.object({
        prompt: z.string().min(2),
        optionA: z.string().min(1),
        optionB: z.string().min(1),
        optionC: z.string().min(1),
        optionD: z.string().min(1),
        correctOption: z.enum(["A", "B", "C", "D"]),
      }),
    )
    .min(1),
});

export const submitSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.number(),
      selectedOption: z.enum(["A", "B", "C", "D"]),
    }),
  ),
});

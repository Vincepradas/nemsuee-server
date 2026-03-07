import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["STUDENT", "INSTRUCTOR"]),
  studentId: z
    .string()
    .trim()
    .min(5)
    .max(30)
    .regex(/^[A-Za-z0-9-]+$/, "Student ID must be alphanumeric (dash allowed)")
    .optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const promoteSchema = z.object({
  email: z.string().email(),
  bootstrapKey: z.string().min(1),
});

export const decisionSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().trim().max(300).optional(),
});

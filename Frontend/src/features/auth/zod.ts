import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});

export const userDetailsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

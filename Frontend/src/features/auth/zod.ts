import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const emailSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email address"),
});

export const otpSchema = z.object({
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

const passwordValidation = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const userDetailsSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50, "Name cannot exceed 50 characters"),
  password: passwordValidation,
});

export type LoginInput = z.infer<typeof loginSchema>;

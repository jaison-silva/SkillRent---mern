import { z } from "zod";

const strictEmail = z.string()
  .trim()
  .min(1, "Email is required")
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please enter a valid email address")
  .toLowerCase();

export const passwordValidation = z
  .string()
  .trim()
  .min(6, "Password must be at least 6 characters")
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/^\S+$/, "Password cannot contain spaces");

export const nameValidation = z.string().trim()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name cannot exceed 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces")
  .regex(/^(?!\s*$).+/, "Name cannot be entirely spaces");

export const phoneValidation = z.string().trim()
  .regex(/^(?!0{10})\d{10}$/, "Phone must be exactly 10 digits and no alphabets");

export const loginSchema = z.object({
  email: strictEmail,
  password: passwordValidation,
});

export const emailSchema = z.object({
  email: strictEmail,
});

export const otpSchema = z.object({
  otp: z.string().trim().length(6, "OTP must be exactly 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
});

export const userDetailsSchema = z.object({
  name: nameValidation,
  password: passwordValidation,
  confirmPassword: z.string(),
  workNature: z.enum(['offline', 'online', 'both']).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type LoginInput = z.infer<typeof loginSchema>;

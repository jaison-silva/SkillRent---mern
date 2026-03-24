import { z } from "zod";

const strictEmail = z.string()
  .trim()
  .min(1, { message: "Email is required" })
  .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Invalid email address" })
  .toLowerCase();
const strictPassword = z.string().trim()
  .min(6, { message: "Password must be at least 6 characters" })
  .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/^\S+$/, { message: "Password cannot contain spaces" });
const strictName = z.string().trim()
  .min(2, { message: "Name must be at least 2 characters" })
  .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
  .regex(/^(?!\s*$).+/, { message: "Name cannot be entirely spaces" });

export const userRegisterSchema = z.object({
  email: strictEmail,
  password: strictPassword,
  name: strictName,
  otp: z.number().int().min(100000).max(999999),
  role: z.string().optional()
})

export const providerRegisterSchema = z.object({
  email: strictEmail,
  password: strictPassword,
  name: strictName,
  otp: z.number().int().min(100000).max(999999),
  role: z.string().optional(),
  bio: z.string().trim().min(5, "Bio must be at least 5 characters").optional(),
  skills: z.array(z.string().trim().min(2, "Skill must be at least 2 characters")).optional(),
  language: z.array(z.string().trim().min(2, "Language must be at least 2 characters")).optional(),
  hasTransport: z.boolean().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().trim().min(5, "Address requires at least 5 chars")
  }).optional()
});

export const loginSchema = z.object({
  email: strictEmail,
  password: strictPassword
})


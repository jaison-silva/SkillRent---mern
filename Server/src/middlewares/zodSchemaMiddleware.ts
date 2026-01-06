import { z,} from "zod";

export const userRegisterSchema = z.object({
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,{message: "Password must be at least 8 characters"}),
    name: z.string().min(2, {message:"Name is required"}),
  })

export const providerRegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8),
  name: z.string().min(2, "Name is required"),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
  language: z.array(z.string()).optional(),
  hasTransport: z.boolean().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string()
  }).optional()
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })


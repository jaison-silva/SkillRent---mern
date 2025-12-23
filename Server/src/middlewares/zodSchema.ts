import { z,} from "zod";

export const userRegisterSchema = z.object({
  body: z.object({
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8,{message: "Password must be at least 8 characters"}),
    name: z.string().min(2, {message:"Name is required"}),
  }),
});

export const providerRegisterSchema = z.object({
  body: z.object({
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(8),
    name: z.string().min(2, "Name is required"),
    // businessName: z.string().min(2),
    // licenseNumber: z.string(), 
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  }),
});


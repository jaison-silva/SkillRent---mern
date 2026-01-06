import {rateLimit} from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Limit each IP to 5 requests per windowMs
  message: "Too many attempts, please try again after 15 minutes",
});
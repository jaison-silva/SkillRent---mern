// POST /auth/otp/sendOtp
// POST /auth/otp/verifyOtp

import api from "./axios";


export const sendOtpApi = (data: {
  email: string;
  purpose: "verification" | "forgot_password";
}) => {
  return api.post("/auth/otp/sendOtp", data);
};
 
export const verifyOtpApi = (data: {
  email: string;
  otp: string;
  purpose: "verification" | "forgot_password";
}) => {
  return api.post("/auth/otp/verifyOtp", data);
};
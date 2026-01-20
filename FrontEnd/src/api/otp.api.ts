import api from "./axios";

export const sendOtpApi = (data: {
  email: string;
  purpose: "verification" | "forgot_password";
}) => {
  return api.post("/auth/otp/send", data);
};

export const verifyOtpApi = (data: {
  email: string;
  otp: string;
  purpose: "verification" | "forgot_password";
}) => {
  return api.post("/auth/otp/verify", data);
};
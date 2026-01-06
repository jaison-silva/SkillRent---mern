// POST /auth/login
// POST /auth/register/user
// POST /auth/register/provider
// POST /auth/otp/sendOtp
// POST /auth/otp/verifyOtp
// POST /auth/refresh

import api from "./axios";

export const loginApi = async (data: {
  email: string;
  password: string;
}) => {
  const reault = await api.post("/auth/login", data);
  console.log(reault)
  return reault
};
 
export const registerUserApi = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  return api.post("/auth/register/user", data);
};
 
export const registerProviderApi = (data: {
  name: string;
  email: string;
  password: string;
  bio?: string;
  skills?: string[];
  language?: string[];
  hasTransport?: boolean;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}) => {
  return api.post("/auth/register/provider", data);
};
 
export const refreshTokenApi = () => {
  return api.post("/auth/refresh");
};

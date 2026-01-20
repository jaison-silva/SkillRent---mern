import api from "./axios";

export const loginApi = async (data: { email: string; password: string }) => {
  return await api.post("/auth/login", data);
};

export const registerUserApi = (data: {
  name: string;
  email: string;
  password: string;
  otp: number;
  role?: string;
}) => {
  return api.post("/auth/register/user", data);
};

export const registerProviderApi = (data: {
  name: string;
  email: string;
  password: string;
  otp: number;
  skills?: string[];
  role?: string;
}) => {
  return api.post("/auth/register/provider", data);
};

export const forgotPasswordApi = (data: { email: string }) => {
  return api.post("/auth/password/forgot", data);
};

export const resetPasswordApi = (data: {
  email: string;
  otp: number;
  newPassword: string;
}) => {
  return api.post("/auth/password/reset", data);
};

export const refreshTokenApi = () => {
  return api.post("/auth/refresh");
};

export const logoutApi = () => {
  return api.post("/auth/logout");
};

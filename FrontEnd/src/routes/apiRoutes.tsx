export const API_ROUTES = {
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
  },
  register: {
    user: "auth/register/user",
    provider: "auth/register/provider"
  },
  otp: {
    send: "/auth/otp/send",
    verify : "/auth/otp/verify"
  },
  user: {
    profile: "/users/profile",
  },
  providers: {
    list: "/providers",
    profile: "/providers/profile",
  },
  users: {
    list: "/users",
  },
  admin: {
    dashboard: "/admin",
    blockUser: "/admin/users",
    blockProvider: "/admin/providers",
    verifyProvider: "/admin/providers/verify",
  }
} as const;


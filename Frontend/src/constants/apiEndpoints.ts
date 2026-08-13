export const API_ENDPOINTS = {
    ADMIN: {
        DASHBOARD: "/admin/dashboard",
        USERS_STATUS: (id: string) => `/admin/users/${id}/status`,
        PROVIDERS_STATUS: (id: string) => `/admin/providers/${id}/status`,
        PROVIDERS_VERIFICATION: (id: string) => `/admin/providers/${id}/verification`,
        MEMBERSHIPS: "/admin/memberships",
        COUPONS: "/admin/coupons",
        OFFERS: "/admin/offers",
        CATEGORIES: "/admin/categories",
    },
    AUTH: {
        LOGIN: "/auth/login",
        GOOGLE_LOGIN: "/auth/google",
        REGISTER_USER: "/auth/register/user",
        REGISTER_PROVIDER: "/auth/register/provider",
        LOGOUT: "/auth/logout",
        REFRESH: "/auth/refresh",
        OTP_SEND: "/auth/otp/send",
        OTP_VERIFY: "/auth/otp/verify",
        PASSWORD_FORGOT: "/auth/password/forgot",
        PASSWORD_RESET: "/auth/password/reset",
    },
    JOBS: {
        CREATE: "/users/jobs",
        MY_JOBS: "/users/jobs/my-jobs",
        AVAILABLE_JOBS: "/providers/jobs/all",
        DIRECT_JOBS: "/providers/jobs/direct",
    },
    PROVIDERS: {
        BASE: "/providers",
        BY_ID: (id: string) => `/providers/${id}`,
        PROFILE: "/providers/profile",
        REVIEWS: (providerId: string) => `/providers/${providerId}/reviews`,
        CAN_REVIEW: (providerId: string) => `/providers/${providerId}/can-review`,
    },
    USERS: {
        PROFILE: "/users/profile",
        PROVIDER_PROFILE: "/users/profile/provider",
    },
    PUBLIC: {
        MEMBERSHIPS: "/public/memberships",
        COUPONS: "/public/coupons",
        OFFERS: "/public/offers",
        CATEGORIES: "/public/categories",
    }
} as const;

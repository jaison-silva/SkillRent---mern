import { apiSlice } from "../../api/apiSlice";
import type { User } from "../../types";

interface LoginResponse {
    accessToken: string
    user: User
}

interface LoginRequest {
    email: string
    password: string
}

interface AuthResponse {
    user: User
    token: string
}


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        sendOtp: builder.mutation<{ message: string }, { email: string, purpose: string }>({
            query: (body) => ({ url: '/auth/otp/send', method: 'POST', body }),
        }),
        verifyOtp: builder.mutation<{ success: boolean }, { email: string; otp: string, purpose: string }>({
            query: (body) => ({ url: '/auth/otp/verify', method: 'POST', body }),
        }),
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
            }),
        }),
        googleLogin: builder.mutation<LoginResponse, { credential: string; role?: string }>({
            query: (body) => ({
                url: '/auth/google',
                method: 'POST',
                body,
            }),
        }),
        refresh: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: "/auth/refresh",
                method: 'POST',
                credentials: 'include'
            }),
        }),
        signupUser: builder.mutation({
            query: (userData) => ({
                url: '/auth/register/user',
                method: 'POST',
                body: { ...userData },
            }),
        }),
        signupProvider: builder.mutation({
            query: (providerData) => ({
                url: '/auth/register/provider',
                method: 'POST',
                body: { ...providerData },
            }),
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({ url: '/auth/password/forgot', method: 'POST', body }),
        }),
        resetPassword: builder.mutation<{ message: string }, { email: string; otp: number; newPassword: string }>({
            query: (body) => ({ url: '/auth/password/reset', method: 'POST', body }),
        }),
        logout: builder.mutation<void, void>({
            query: () => ({ url: '/auth/logout', method: 'POST', credentials: 'include' as const }),
        }),
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useRefreshMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLoginMutation,
    useGoogleLoginMutation,
    useSignupUserMutation,
    useSignupProviderMutation,
    useLogoutMutation,
} = authApiSlice;

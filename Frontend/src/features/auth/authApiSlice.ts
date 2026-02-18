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
        })
    }),
});

export const {
    useSendOtpMutation,
    useVerifyOtpMutation,
    useRefreshMutation,
    useLoginMutation,
    useSignupUserMutation,
    useSignupProviderMutation,
} = authApiSlice;

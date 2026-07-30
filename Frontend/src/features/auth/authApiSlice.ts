import { apiSlice } from "../../api/apiSlice";
import type { User } from "../../types";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

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
            query: (body) => ({ url: API_ENDPOINTS.AUTH.OTP_SEND, method: 'POST', body }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        verifyOtp: builder.mutation<{ success: boolean }, { email: string; otp: string, purpose: string }>({
            query: (body) => ({ url: API_ENDPOINTS.AUTH.OTP_VERIFY, method: 'POST', body }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: API_ENDPOINTS.AUTH.LOGIN,
                method: 'POST',
                body: { ...credentials },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        googleLogin: builder.mutation<LoginResponse, { credential: string; role?: string }>({
            query: (body) => ({
                url: API_ENDPOINTS.AUTH.GOOGLE_LOGIN,
                method: 'POST',
                body,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        refresh: builder.mutation<AuthResponse, void>({
            query: () => ({
                url: API_ENDPOINTS.AUTH.REFRESH,
                method: 'POST',
                credentials: 'include'
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        signupUser: builder.mutation({
            query: (userData) => ({
                url: API_ENDPOINTS.AUTH.REGISTER_USER,
                method: 'POST',
                body: { ...userData },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        signupProvider: builder.mutation({
            query: (providerData) => ({
                url: API_ENDPOINTS.AUTH.REGISTER_PROVIDER,
                method: 'POST',
                body: { ...providerData },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        forgotPassword: builder.mutation<{ message: string }, { email: string }>({
            query: (body) => ({ url: API_ENDPOINTS.AUTH.PASSWORD_FORGOT, method: 'POST', body }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        resetPassword: builder.mutation<{ message: string }, { email: string; otp: number; newPassword: string }>({
            query: (body) => ({ url: API_ENDPOINTS.AUTH.PASSWORD_RESET, method: 'POST', body }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
        }),
        logout: builder.mutation<void, void>({
            query: () => ({ url: API_ENDPOINTS.AUTH.LOGOUT, method: 'POST', credentials: 'include' as const }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
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


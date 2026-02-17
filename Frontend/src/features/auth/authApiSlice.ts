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


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse,LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: { ...credentials },
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

export const { useLoginMutation, useSignupUserMutation, useSignupProviderMutation } = authApiSlice;
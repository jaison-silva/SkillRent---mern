import { apiSlice } from "../../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<any, void>({
            query: () => '/users/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: '/users/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User']
        }),
        updateProviderProfile: builder.mutation<any, any>({
            query: (payload) => ({
                url: '/users/profile/provider',
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdateProviderProfileMutation } = userApiSlice

// end opints shouold be constant. like here "/users/profile/"
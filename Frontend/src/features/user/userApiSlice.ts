import { apiSlice } from "../../api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<any, void>({
            query: () => '/user/profile',
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: '/user/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['User']
        }),
        updateProviderProfile: builder.mutation<any, any>({
            query: (payload) => ({
                url: '/user/profile/provider',
                method: 'PATCH',
                body: payload,
            }),
            invalidatesTags: ['User'],
        }),
    })
})

export const { useGetProfileQuery, useUpdateProfileMutation } = userApiSlice
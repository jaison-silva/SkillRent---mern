import { apiSlice } from "../../api/apiSlice";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<any, void>({
            query: () => API_ENDPOINTS.USERS.PROFILE,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['User'],
        }),
        updateProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.USERS.PROFILE,
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['User']
        }),
        updateProviderProfile: builder.mutation<any, any>({
            query: (payload) => ({
                url: API_ENDPOINTS.USERS.PROVIDER_PROFILE,
                method: 'PATCH',
                body: payload,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['User'],
        }),
    })
})

export const { useGetProfileQuery, useUpdateProfileMutation, useUpdateProviderProfileMutation } = userApiSlice

// end opints should be constant. like here API_ENDPOINTS.USERS.PROFILE
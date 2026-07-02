import { apiSlice } from "../../api/apiSlice";

export const providerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProviders: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string; lat?: number; lng?: number; maxDistance?: number } | void>({
            query: (params) => {
                if (!params) return '/providers';
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `/providers${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: ['Provider'],
        }),
        getProviderById: builder.query<any, string>({
            query: (id) => `/providers/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Provider', id }],
        }),
        getProviderProfile: builder.query<any, void>({
            query: () => '/providers/profile',
            providesTags: ['ProviderProfile'],
        }),
        updateProviderProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: '/providers/profile',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['ProviderProfile', 'Provider']
        }),
        getProviderReviews: builder.query<any, { providerId: string; page?: number; limit?: number; sort?: string }>({
            query: ({ providerId, ...params }) => {
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `/providers/${providerId}/reviews${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: (_result, _error, { providerId }) => [{ type: 'Review', id: providerId }],
        }),
        addProviderReview: builder.mutation<any, { providerId: string, rating: number, comment: string }>({
            query: ({ providerId, ...data }) => ({
                url: `/providers/${providerId}/reviews`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { providerId }) => [
                { type: 'Review', id: providerId },
                { type: 'Provider', id: providerId }
            ],
        }),
    })
})

export const {
    useGetProvidersQuery,
    useGetProviderByIdQuery,
    useGetProviderProfileQuery,
    useUpdateProviderProfileMutation,
    useGetProviderReviewsQuery,
    useAddProviderReviewMutation
} = providerApiSlice;

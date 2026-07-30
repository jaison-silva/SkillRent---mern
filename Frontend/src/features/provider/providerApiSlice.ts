import { apiSlice } from "../../api/apiSlice";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const providerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProviders: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string; lat?: number; lng?: number; maxDistance?: number } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.PROVIDERS.BASE;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.PROVIDERS.BASE}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Provider'],
        }),
        getProviderById: builder.query<any, string>({
            query: (id) => API_ENDPOINTS.PROVIDERS.BY_ID(id),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: (_result, _error, id) => [{ type: 'Provider', id }],
        }),
        getProviderProfile: builder.query<any, void>({
            query: () => API_ENDPOINTS.PROVIDERS.PROFILE,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['ProviderProfile'],
        }),
        updateProviderProfile: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.PROVIDERS.PROFILE,
                method: 'PATCH',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['ProviderProfile', 'Provider']
        }),
        getProviderReviews: builder.query<any, { providerId: string; page?: number; limit?: number; sort?: string }>({
            query: ({ providerId, ...params }) => {
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.PROVIDERS.REVIEWS(providerId)}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: (_result, _error, { providerId }) => [{ type: 'Review', id: providerId }],
        }),
        addProviderReview: builder.mutation<any, { providerId: string, rating: number, comment: string }>({
            query: ({ providerId, ...data }) => ({
                url: API_ENDPOINTS.PROVIDERS.REVIEWS(providerId),
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: (_result, _error, { providerId }) => [
                { type: 'Review', id: providerId },
                { type: 'Provider', id: providerId }
            ],
        }),
        checkCanReview: builder.query<{ canReview: boolean }, string>({
            query: (providerId) => API_ENDPOINTS.PROVIDERS.CAN_REVIEW(providerId),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: (_result, _error, id) => [{ type: 'Review', id }],
        }),
    })
})

export const {
    useGetProvidersQuery,
    useGetProviderByIdQuery,
    useGetProviderProfileQuery,
    useUpdateProviderProfileMutation,
    useGetProviderReviewsQuery,
    useAddProviderReviewMutation,
    useCheckCanReviewQuery
} = providerApiSlice;

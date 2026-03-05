import { apiSlice } from "../../api/apiSlice";

export const providerApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProviders: builder.query<any, void>({
            query: () => '/providers',
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
    })
})

export const {
    useGetProvidersQuery,
    useGetProviderByIdQuery,
    useGetProviderProfileQuery,
    useUpdateProviderProfileMutation
} = providerApiSlice;

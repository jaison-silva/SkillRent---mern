import { apiSlice } from "../../api/apiSlice";

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query<any, { page?: number, limit?: number, search?: string } | void>({
            query: (params) => {
                if (!params) return '/admin/dashboard';
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `/admin/dashboard${queryString ? `?${queryString}` : ''}`;
            },
            providesTags: (result) =>
                result
                    ? [
                        { type: 'AdminDashboard' as const, id: 'LIST' },
                        ...result.users.map(({ _id }: any) => ({ type: 'AdminDashboard' as const, id: _id })),
                        ...result.providers.map(({ _id }: any) => ({ type: 'AdminDashboard' as const, id: _id })),
                    ]
                    : [{ type: 'AdminDashboard' as const, id: 'LIST' }],
        }),
        changeUserStatus: builder.mutation<any, { id: string; isBanned: boolean }>({
            query: ({ id, isBanned }) => ({
                url: `/admin/users/${id}/status`,
                method: 'PATCH',
                body: { isBanned },
            }),
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }],
        }),
        changeProviderStatus: builder.mutation<any, { id: string; isBanned: boolean }>({
            query: ({ id, isBanned }) => ({
                url: `/admin/providers/${id}/status`,
                method: 'PATCH',
                body: { isBanned },
            }),
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }],
        }),
        verifyProvider: builder.mutation<any, { id: string; status: 'approved' | 'denied' }>({
            query: ({ id, status }) => ({
                url: `/admin/providers/${id}/verification`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }, 'Provider'],
        }),
    }),
});

export const {
    useGetAdminDashboardQuery,
    useChangeUserStatusMutation,
    useChangeProviderStatusMutation,
    useVerifyProviderMutation,
} = adminApiSlice;

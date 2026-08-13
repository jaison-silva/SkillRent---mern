import { apiSlice } from "../../api/apiSlice";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminDashboard: builder.query<any, { page?: number, limit?: number, search?: string } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.ADMIN.DASHBOARD;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.ADMIN.DASHBOARD}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
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
                url: API_ENDPOINTS.ADMIN.USERS_STATUS(id),
                method: 'PATCH',
                body: { isBanned },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }],
        }),
        changeProviderStatus: builder.mutation<any, { id: string; isBanned: boolean }>({
            query: ({ id, isBanned }) => ({
                url: API_ENDPOINTS.ADMIN.PROVIDERS_STATUS(id),
                method: 'PATCH',
                body: { isBanned },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }],
        }),
        verifyProvider: builder.mutation<any, { id: string; status: 'approved' | 'denied'; reason?: string }>({
            query: ({ id, status, reason }) => ({
                url: API_ENDPOINTS.ADMIN.PROVIDERS_VERIFICATION(id),
                method: 'PATCH',
                body: { status, reason },
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: [{ type: 'AdminDashboard', id: 'LIST' }, 'Provider'],
        }),
        
        // --- Memberships ---
        getMemberships: builder.query<any, { page?: number, limit?: number, search?: string, targetRole?: string } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.ADMIN.MEMBERSHIPS;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.ADMIN.MEMBERSHIPS}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Membership'],
        }),
        createMembership: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.ADMIN.MEMBERSHIPS,
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Membership'],
        }),
        updateMembership: builder.mutation<any, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.ADMIN.MEMBERSHIPS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Membership'],
        }),
        deleteMembership: builder.mutation<any, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.ADMIN.MEMBERSHIPS}/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Membership'],
        }),

        // --- Coupons ---
        getCoupons: builder.query<any, { page?: number, limit?: number, search?: string } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.ADMIN.COUPONS;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.ADMIN.COUPONS}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.ADMIN.COUPONS,
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation<any, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.ADMIN.COUPONS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation<any, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.ADMIN.COUPONS}/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Coupon'],
        }),

        // --- Offers ---
        getOffers: builder.query<any, { page?: number, limit?: number, search?: string } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.ADMIN.OFFERS;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.ADMIN.OFFERS}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Offer'],
        }),
        createOffer: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.ADMIN.OFFERS,
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Offer'],
        }),
        updateOffer: builder.mutation<any, { id: string, data: any }>({
            query: ({ id, data }) => ({
                url: `${API_ENDPOINTS.ADMIN.OFFERS}/${id}`,
                method: 'PUT',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Offer'],
        }),
        deleteOffer: builder.mutation<any, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.ADMIN.OFFERS}/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Offer'],
        }),

        // --- Categories ---
        getCategories: builder.query<any, { page?: number, limit?: number, search?: string } | void>({
            query: (params) => {
                if (!params) return API_ENDPOINTS.ADMIN.CATEGORIES;
                const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
                const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
                return `${API_ENDPOINTS.ADMIN.CATEGORIES}${queryString ? `?${queryString}` : ''}`;
            },
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Category'] as any,
        }),
        createCategory: builder.mutation<any, any>({
            query: (data) => ({
                url: API_ENDPOINTS.ADMIN.CATEGORIES,
                method: 'POST',
                body: data,
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Category'] as any,
        }),
        deleteCategory: builder.mutation<any, string>({
            query: (id) => ({
                url: `${API_ENDPOINTS.ADMIN.CATEGORIES}/${id}`,
                method: 'DELETE',
            }),
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            invalidatesTags: ['Category'] as any,
        }),
    }),
});

export const {
    useGetAdminDashboardQuery,
    useChangeUserStatusMutation,
    useChangeProviderStatusMutation,
    useVerifyProviderMutation,
    useGetMembershipsQuery,
    useCreateMembershipMutation,
    useUpdateMembershipMutation,
    useDeleteMembershipMutation,
    useGetCouponsQuery,
    useCreateCouponMutation,
    useUpdateCouponMutation,
    useDeleteCouponMutation,
    useGetOffersQuery,
    useCreateOfferMutation,
    useUpdateOfferMutation,
    useDeleteOfferMutation,
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
} = adminApiSlice;

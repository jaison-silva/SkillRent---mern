import { apiSlice } from "../../api/apiSlice";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const publicApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPublicMemberships: builder.query<any, void>({
            query: () => API_ENDPOINTS.PUBLIC.MEMBERSHIPS,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Membership'],
        }),
        getPublicOffers: builder.query<any, void>({
            query: () => API_ENDPOINTS.PUBLIC.OFFERS,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Offer'],
        }),
        getPublicCoupons: builder.query<any, void>({
            query: () => API_ENDPOINTS.PUBLIC.COUPONS,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Coupon'] as any,
        }),
        getPublicCategories: builder.query<any, void>({
            query: () => API_ENDPOINTS.PUBLIC.CATEGORIES,
            transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
            providesTags: ['Category'] as any,
        }),
    }),
});

export const {
    useGetPublicMembershipsQuery,
    useGetPublicOffersQuery,
    useGetPublicCouponsQuery,
    useGetPublicCategoriesQuery,
} = publicApiSlice;

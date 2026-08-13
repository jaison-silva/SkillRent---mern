import { apiSlice } from "../../api/apiSlice";

export const agreementApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAgreements: builder.query({
      query: () => '/agreements',
      transformResponse: (response: any) => response.data?.agreements || [],
      providesTags: ['Agreement'],
    }),
  }),
});

export const {
  useGetAgreementsQuery,
} = agreementApiSlice;

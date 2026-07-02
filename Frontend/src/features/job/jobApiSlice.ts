import { apiSlice } from "../../api/apiSlice";

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/users/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    getMyJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string; status?: string } | void>({
      query: (params) => {
        if (!params) return '/users/jobs/my-jobs';
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `/users/jobs/my-jobs${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Job'],
    }),
    getAvailableJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string } | void>({
      query: (params) => {
        if (!params) return '/providers/jobs/all';
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `/providers/jobs/all${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Job'],
    }),
    getDirectJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string } | void>({
      query: (params) => {
        if (!params) return '/providers/jobs/direct';
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `/providers/jobs/direct${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Job'],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useGetMyJobsQuery,
  useGetAvailableJobsQuery,
  useGetDirectJobsQuery,
} = jobApiSlice;

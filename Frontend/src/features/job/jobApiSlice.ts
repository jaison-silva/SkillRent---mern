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
    getAvailableJobs: builder.query({
      query: () => '/providers/jobs/all',
      providesTags: ['Job'],
    }),
    getDirectJobs: builder.query({
      query: () => '/providers/jobs/direct',
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

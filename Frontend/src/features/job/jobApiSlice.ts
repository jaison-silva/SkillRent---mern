import { apiSlice } from "../../api/apiSlice";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const jobApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (jobData) => ({
        url: API_ENDPOINTS.JOBS.CREATE,
        method: 'POST',
        body: jobData,
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: ['Job'],
    }),
    updateJob: builder.mutation({
      query: ({ id, data }) => ({
        url: `${API_ENDPOINTS.JOBS.CREATE}/${id}`, // CREATE resolves to /users/jobs
        method: 'PUT',
        body: data,
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: ['Job'],
    }),
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `${API_ENDPOINTS.JOBS.CREATE}/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      invalidatesTags: ['Job'],
    }),
    getMyJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string; status?: string } | void>({
      query: (params) => {
        if (!params) return API_ENDPOINTS.JOBS.MY_JOBS;
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `${API_ENDPOINTS.JOBS.MY_JOBS}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      providesTags: ['Job'],
    }),
    getAvailableJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string } | void>({
      query: (params) => {
        if (!params) return API_ENDPOINTS.JOBS.AVAILABLE_JOBS;
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `${API_ENDPOINTS.JOBS.AVAILABLE_JOBS}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      providesTags: ['Job'],
    }),
    getDirectJobs: builder.query<any, { page?: number; limit?: number; search?: string; sort?: string } | void>({
      query: (params) => {
        if (!params) return API_ENDPOINTS.JOBS.DIRECT_JOBS;
        const activeParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));
        const queryString = new URLSearchParams(activeParams as Record<string, string>).toString();
        return `${API_ENDPOINTS.JOBS.DIRECT_JOBS}${queryString ? `?${queryString}` : ''}`;
      },
      transformResponse: (response: any) => response.meta ? { ...response.data, ...response.meta } : response.data,
      providesTags: ['Job'],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetMyJobsQuery,
  useGetAvailableJobsQuery,
  useGetDirectJobsQuery,
} = jobApiSlice;

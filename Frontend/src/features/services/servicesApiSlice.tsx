import { apiSlice } from "../../api/apiSlice";
import { IService } from "../../types/service";

export const servicesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all services for the landing page
    getServices: builder.query<IService[], void>({
      query: () => '/services',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'Service' as const, id: _id })),
              { type: 'Service', id: 'LIST' },
            ]
          : [{ type: 'Service', id: 'LIST' }],
    }),
    
    // GET a single service detail
    getServiceById: builder.query<IService, string>({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: 'Service', id }],
    }),
  }),
});

export const { useGetServicesQuery, useGetServiceByIdQuery } = servicesApiSlice;
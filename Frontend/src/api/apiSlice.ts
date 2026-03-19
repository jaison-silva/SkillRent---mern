import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../features/auth/authSlice';
import type { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({ // ithu axios interceptor polle, header kettum
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    const url = typeof args === 'string' ? args : args.url;
    const isAuthEndpoint = url?.startsWith('/auth/');

    if (result?.error?.status === 401 && !isAuthEndpoint) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult?.data) {
            const refreshData = refreshResult.data as { user: any; token: string };
            const user = refreshData.user ?? (api.getState() as RootState).auth.user;
            api.dispatch(setCredentials({ user: user!, token: refreshData.token }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Service', 'Provider', 'ProviderProfile', 'AdminDashboard'], // ithu catching related ah, to refetch
    endpoints: () => ({}),
});


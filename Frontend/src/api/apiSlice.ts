import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from '../features/auth/authSlice';
import type { RootState } from '../store/store';

const baseQuery = fetchBaseQuery({ // ithu axios interceptor polle, header kettum
    baseUrl: 'http://localhost:5000',
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

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);

        if (refreshResult?.data) {
            const user = (api.getState() as RootState).auth.user;
            api.dispatch(setCredentials({ user: user!, token: refreshResult.data as string }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
    }
    return result;
};

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['User', 'Service'], // ithu catching related ah, to refetch
    endpoints: () => ({}),
});


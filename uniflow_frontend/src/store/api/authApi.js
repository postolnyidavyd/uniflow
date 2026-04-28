import { apiSlice } from './apiSlice';
import {setCredentials, logout, setUser} from '../authSlice';

export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        register: builder.mutation({
            query: (body) => ({ url: '/auth/register', method: 'POST', body }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch {}
            },
        }),

        login: builder.mutation({
            query: (body) => ({ url: '/auth/login', method: 'POST', body }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch {}
            },
        }),

        getMe: builder.query({
            query: () => '/auth/me',
            providesTags: ['Me'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data));
                } catch {}
            },
        }),
        logout: builder.mutation({
            query: () => ({ url: '/auth/logout', method: 'POST' }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                } finally {
                    dispatch(logout());
                }
            },
        }),
    }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApi;
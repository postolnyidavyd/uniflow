import {apiSlice } from './apiSlice.js';

export const walletApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBalance: builder.query({
      query: ()=> "wallet/balance",
      providesTags: [{ type: 'Balance' }],
    }),
  }),
});

export const{
  useGetBalanceQuery
} = walletApi;
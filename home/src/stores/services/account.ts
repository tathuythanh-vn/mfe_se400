// src/stores/services/account.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { GetAccountsResponse } from '../interfaces/account';

// RTK Query service cho Admin Accounts
export const accountApi = createApi({
  reducerPath: 'accountApi',
  tagTypes: ['Account'],

  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL + '/accounts',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // ✅ GET: /accounts?page=1&limit=6&search=&role=&status=
    getAccounts: builder.query<
      GetAccountsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      }
    >({
      query: ({ page = 1, limit = 6, search = '', role = '', status = '' }) => ({
        url: `?page=${page}&limit=${limit}&search=${search}&role=${role}&status=${status}`,
      }),
      providesTags: ['Account'],
    }),

    // ✅ GET: /accounts/:id
    getAccountById: builder.query<GetAccountsResponse, string>({
      query: (id) => `/${id}`,
      providesTags: ['Account'],
    }),

    // ✅ PUT: /accounts/:id
    updateAccountStatus: builder.mutation<
      any,
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Account'],
    }),
  }),
});

// ✅ Tự động tạo hooks
export const {
  useGetAccountsQuery,
  useGetAccountByIdQuery,
  useUpdateAccountStatusMutation,
} = accountApi;

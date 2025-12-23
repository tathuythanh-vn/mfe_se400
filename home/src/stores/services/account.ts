// src/stores/services/account.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetAccountsResponse,
  UpdateAccountResponse,
} from '../interfaces/account';

// Account statistics response
export interface AccountStatisticResponse {
  success: boolean;
  data: {
    status: {
      active: number;
      locked: number;
      pending: number;
    };
    role: {
      admin: number;
      manager: number;
      member: number;
    };
    total: number;
  };
}

// Single account response
export interface GetAccountByIdResponse {
  success: boolean;
  message: string;
  data: any; // Combined account + member data
}

// RTK Query service for Accounts
export const accountApi = createApi({
  reducerPath: 'accountApi',
  tagTypes: ['Account', 'AccountStatistic'],

  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.BACKEND_URL || 'http://localhost:5000/api') + '/accounts',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // GET /accounts - Get accounts in page with filters
    getAccountsInPage: builder.query<
      GetAccountsResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        role?: string;
        status?: string;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.role) queryParams.append('role', params.role);
        if (params?.status) queryParams.append('status', params.status);

        const queryString = queryParams.toString();
        return queryString ? `/?${queryString}` : '/';
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.accounts.map(({ _id }) => ({
                type: 'Account' as const,
                id: _id,
              })),
              { type: 'Account', id: 'LIST' },
            ]
          : [{ type: 'Account', id: 'LIST' }],
    }),

    // GET /accounts/statistic - Get account statistics
    getAccountStatistic: builder.query<AccountStatisticResponse, void>({
      query: () => '/statistic',
      providesTags: [{ type: 'AccountStatistic' }],
    }),

    // GET /accounts/:id - Get account by ID (returns merged account + member data)
    getAccountById: builder.query<GetAccountByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Account', id }],
    }),

    // PUT /accounts/:id - Update account by ID (with avatar upload)
    updateAccountById: builder.mutation<
      UpdateAccountResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Account', id },
        { type: 'Account', id: 'LIST' },
        { type: 'AccountStatistic' },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetAccountsInPageQuery,
  useGetAccountStatisticQuery,
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
} = accountApi;

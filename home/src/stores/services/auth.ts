// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetProfileResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from '../interfaces/auth';
import { SocketEvents } from '../interfaces/message';
import { getSocket } from '../../utils/socket';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_URL + '/auth',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<GetProfileResponse, void>({
      query: () => ({ url: '' }),
      async onCacheEntryAdded(
        partnerId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        // You can implement WebSocket or SSE here for real-time updates
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;

          // CONNECT SOCKET ON LOGIN
          getSocket();

          await cacheEntryRemoved;
        } catch (e) {
          // Handle error
          console.error('Error in getHistoryMessage:', e);
        }
      },
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (credentials) => ({
        url: 'register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetProfileQuery, useLoginMutation, useRegisterMutation } =
  authApi;

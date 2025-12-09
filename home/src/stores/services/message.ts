import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetHistoryMessageResponse,
  CreateMessageResponse,
  GetContactsResponse,
} from '../interfaces/message';
import { io } from 'socket.io-client';

// RTK Query service for Messages
export const messageApi = createApi({
  reducerPath: 'messageApi',
  tagTypes: ['Message', 'Contacts'],

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_URL + '/messages',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // GET /messages/:partnerId - Get message history with partner
    getHistoryMessage: builder.query<
      GetHistoryMessageResponse,
      { partnerId: string }
    >({
      query: ({ partnerId }) => `/${partnerId}`,
      providesTags: (result, error, { partnerId }) => [
        { type: 'Message', id: partnerId },
      ],
    }),

    // POST /messages/:partnerId - Create a new message
    createMessage: builder.mutation<
      CreateMessageResponse,
      { partnerId: string; text: string }
    >({
      query: ({ partnerId, text }) => ({
        url: `/${partnerId}`,
        method: 'POST',
        body: { text },
      }),
      invalidatesTags: (result, error, { partnerId }) => [
        { type: 'Message', id: partnerId },
      ],
    }),

    // GET /messages/contacts - Get contacts based on user role
    getContacts: builder.query<GetContactsResponse, void>({
      query: () => '/contacts',
      providesTags: ['Contacts'],
    }),
  }),
});

// Export hooks
export const {
  useGetHistoryMessageQuery,
  useCreateMessageMutation,
  useGetContactsQuery,
} = messageApi;

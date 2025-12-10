import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  type GetHistoryMessageResponse,
  type CreateMessageResponse,
  type GetContactsResponse,
  SocketEvents,
} from '../interfaces/message';
import { getSocket } from '../../utils/socket';

// RTK Query service for Messages
export const messageApi = createApi({
  reducerPath: 'messageApi',
  tagTypes: ['Message', 'Contacts'],

  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/messages`,
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
      async onCacheEntryAdded(
        partnerId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        // You can implement WebSocket or SSE here for real-time updates
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;

          const socket = getSocket();
          socket.on(SocketEvents.CHAT, (newMessage) => {
            // Update the cache with the new message
            updateCachedData((draft) => {
              draft.data.push(newMessage);
            });
          });

          await cacheEntryRemoved;
        } catch (e) {
          // Handle error
          console.error('Error in getHistoryMessage:', e);
        }
      },
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
      async onCacheEntryAdded(
        { text, partnerId: to },
        { cacheDataLoaded, cacheEntryRemoved },
      ) {
        try {
          await cacheDataLoaded;

          const socket = getSocket();

          socket.emit(SocketEvents.CHAT, {
            text,
            to,
          });

          await cacheEntryRemoved;
        } catch (e) {
          // Handle error
          console.error('Error in createMessage:', e);
        }
      },
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

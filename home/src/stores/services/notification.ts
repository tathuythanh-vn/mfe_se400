import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetNotificationsResponse,
  UpdateStatusNotificationsResponse,
  Notification,
} from '../interfaces/notification';
import { getSocket } from '../../utils/socket';

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  tagTypes: ['Notification'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/notifications`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // GET /notifications - Get user's notifications (limit 10)
    getNotifications: builder.query<GetNotificationsResponse, void>({
      query: () => '/',
      async onCacheEntryAdded(
        partnerId,
        { cacheDataLoaded, cacheEntryRemoved, updateCachedData },
      ) {
        // You can implement WebSocket or SSE here for real-time updates
        try {
          // Wait for the initial query to resolve
          await cacheDataLoaded;

          // const socket = getSocket();
          // socket.on(SocketEvents.CHAT, (newMessage) => {
          //   // Update the cache with the new message
          //   updateCachedData((draft) => {
          //     draft.data.push(newMessage);
          //   });
          // });

          await cacheEntryRemoved;
        } catch (e) {
          // Handle error
          console.error('Error in getHistoryMessage:', e);
        }
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ _id }) => ({
                type: 'Notification' as const,
                id: _id,
              })),
              { type: 'Notification', id: 'LIST' },
            ]
          : [{ type: 'Notification', id: 'LIST' }],
    }),

    // PATCH /notifications - Mark notifications as read
    updateNotificationsStatus: builder.mutation<
      UpdateStatusNotificationsResponse,
      Notification[]
    >({
      query: (notifications) => ({
        url: '/',
        method: 'PATCH',
        body: notifications,
      }),
      invalidatesTags: [{ type: 'Notification', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useUpdateNotificationsStatusMutation,
} = notificationApi;

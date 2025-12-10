import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetNotificationsResponse,
  UpdateStatusNotificationsResponse,
  Notification,
} from '../interfaces/notification';

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

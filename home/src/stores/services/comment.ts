import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetCommentsParams,
  GetCommentsResponse,
  CreateCommentRequest,
  CreateCommentResponse,
  HideCommentResponse,
} from '../interfaces/comment';

export const commentApi = createApi({
  reducerPath: 'commentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/comments`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Comment'],
  endpoints: (builder) => ({
    getComments: builder.query<GetCommentsResponse, GetCommentsParams>({
      query: ({ eventId, status }) => {
        const params = new URLSearchParams();
        params.append('eventId', eventId);
        if (status) params.append('status', status);

        return `/?${params.toString()}`;
      },
      providesTags: (_result, _error, { eventId }) => [
        { type: 'Comment', id: eventId },
      ],
    }),

    createComment: builder.mutation<
      CreateCommentResponse,
      CreateCommentRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: 'Comment', id: eventId },
      ],
    }),

    hideComment: builder.mutation<HideCommentResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Comment'],
    }),
  }),
});

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useHideCommentMutation,
} = commentApi;

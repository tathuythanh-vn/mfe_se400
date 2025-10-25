import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  CheckFavoriteStatusParams,
  CheckFavoriteStatusResponse,
  ToggleFavoriteRequest,
  ToggleFavoriteResponse,
} from '../interfaces/favorite';

export const favoriteApi = createApi({
  reducerPath: 'favoriteApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/favorites`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Favorite'],
  endpoints: (builder) => ({
    checkFavoriteStatus: builder.query<
      CheckFavoriteStatusResponse,
      CheckFavoriteStatusParams
    >({
      query: ({ eventId }) => {
        const params = new URLSearchParams();
        params.append('eventId', eventId);
        return `/?${params.toString()}`;
      },
      providesTags: (_result, _error, { eventId }) => [
        { type: 'Favorite', id: eventId },
      ],
    }),

    toggleFavorite: builder.mutation<
      ToggleFavoriteResponse,
      ToggleFavoriteRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { eventId }) => [
        { type: 'Favorite', id: eventId },
      ],
    }),
  }),
});

export const { useCheckFavoriteStatusQuery, useToggleFavoriteMutation } =
  favoriteApi;

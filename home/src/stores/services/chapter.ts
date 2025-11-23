import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetChaptersParams,
  GetChaptersResponse,
  GetChapterByIdResponse,
  CreateChapterRequest,
  CreateChapterResponse,
  UpdateChapterRequest,
  UpdateChapterResponse,
  GetChapterStatisticResponse,
} from '../interfaces/chapter';

export const chapterApi = createApi({
  reducerPath: 'chapterApi',
  tagTypes: ['Chapter'],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/chapters`,
    //baseUrl: `${import.meta.env.VITE_BACKEND_URL}/chapters`,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getChaptersInPage: builder.query<
      GetChaptersResponse,
      GetChaptersParams | void
    >({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.hadManager)
          searchParams.append('hadManager', params.hadManager);

        return searchParams.toString() ? `/?${searchParams.toString()}` : '/';
      },
      providesTags: ['Chapter'],
    }),
    getStatistic: builder.query<GetChapterStatisticResponse, void>({
      query: () => '/statistic',
      providesTags: ['Chapter'],
    }),
    getChapterById: builder.query<GetChapterByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Chapter', id }],
    }),
    createChapter: builder.mutation<
      CreateChapterResponse,
      CreateChapterRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Chapter'],
    }),
    updateChapterById: builder.mutation<
      UpdateChapterResponse,
      { id: string; data: UpdateChapterRequest }
    >({
      query: ({ id, data }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Chapter', id },
        'Chapter',
      ],
    }),
  }),
});

export const {
  useGetChaptersInPageQuery,
  useGetStatisticQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterByIdMutation,
} = chapterApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetChaptersParams,
  GetChaptersResponse,
} from '../interfaces/chapter';

export const chapterApi = createApi({
  reducerPath: 'chapterApi',
  tagTypes: ['Chapter'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_URL + '/chapters',
  }),
  endpoints: (builder) => ({
    getChapters: builder.query<GetChaptersResponse, GetChaptersParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);

        return {
          url: searchParams.toString() ? `?${searchParams.toString()}` : '',
        };
      },
      providesTags: ['Chapter'],
    }),
  }),
});

export const { useGetChaptersQuery } = chapterApi;

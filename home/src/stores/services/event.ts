import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetEventsParams,
  GetEventsResponse,
  GetEventByIdResponse,
  CreateEventRequest,
  CreateEventResponse,
  UpdateEventRequest,
  UpdateEventResponse,
  GetStatisticResponse,
} from '../interfaces/event';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  tagTypes: ['Event'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.BACKEND_URL + '/events',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    getEventsInPage: builder.query<GetEventsResponse, GetEventsParams | void>({
      query: (params) => {
        const searchParams = new URLSearchParams();

        if (params?.page) searchParams.append('page', params.page.toString());
        if (params?.limit)
          searchParams.append('limit', params.limit.toString());
        if (params?.search) searchParams.append('search', params.search);
        if (params?.status) searchParams.append('status', params.status);
        if (params?.scope) searchParams.append('scope', params.scope);

        return {
          url: searchParams.toString() ? `/?${searchParams.toString()}` : '/',
        };
      },
      providesTags: ['Event'],
    }),

    getStatistic: builder.query<GetStatisticResponse, void>({
      query: () => '/statistic',
      providesTags: ['Event'],
    }),

    getEventById: builder.query<GetEventByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Event', id }],
    }),

    createEvent: builder.mutation<CreateEventResponse, CreateEventRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append('name', body.name);
        formData.append('startedAt', body.startedAt);
        formData.append('location', body.location);
        formData.append('description', body.description);
        formData.append('scope', body.scope);

        if (body.tags) {
          body.tags.forEach((tag) => formData.append('tags[]', tag));
        }

        if (body.images) {
          body.images.forEach((image) => formData.append('images', image));
        }

        return {
          url: '/',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Event'],
    }),

    updateEventById: builder.mutation<
      UpdateEventResponse,
      { id: string; data: UpdateEventRequest }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();

        if (data.name) formData.append('name', data.name);
        if (data.startedAt) formData.append('startedAt', data.startedAt);
        if (data.location) formData.append('location', data.location);
        if (data.description) formData.append('description', data.description);
        if (data.scope) formData.append('scope', data.scope);
        if (data.status) formData.append('status', data.status);

        if (data.tags) {
          data.tags.forEach((tag) => formData.append('tags[]', tag));
        }

        if (data.cloudImgs) {
          formData.append('cloudImgs', JSON.stringify(data.cloudImgs));
        }

        if (data.images) {
          data.images.forEach((image) => formData.append('images', image));
        }

        return {
          url: `/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Event', id },
        'Event',
      ],
    }),
  }),
});

export const {
  useGetEventsInPageQuery,
  useGetStatisticQuery: useGetEventStatisticQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventByIdMutation,
} = eventApi;

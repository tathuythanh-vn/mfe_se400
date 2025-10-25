import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  RegisterForEventRequest,
  RegisterForEventResponse,
  CancelEventRegistrationResponse,
  ListEventRegistrationsParams,
  ListEventRegistrationsResponse,
  CheckInToEventResponse,
  GetMyEventsResponse,
} from '../interfaces/eventRegistration';

export const eventRegistrationApi = createApi({
  reducerPath: 'eventRegistrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/event-registrations`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['EventRegistration'],
  endpoints: (builder) => ({
    listEventRegistrations: builder.query<
      ListEventRegistrationsResponse,
      ListEventRegistrationsParams
    >({
      query: ({ eventId }) => {
        const params = new URLSearchParams();
        params.append('eventId', eventId);
        return `/?${params.toString()}`;
      },
      providesTags: (_result, _error, { eventId }) => [
        { type: 'EventRegistration', id: eventId },
      ],
    }),

    registerForEvent: builder.mutation<
      RegisterForEventResponse,
      RegisterForEventRequest
    >({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EventRegistration'],
    }),

    getMyEvents: builder.query<GetMyEventsResponse, void>({
      query: () => '/my-events',
      providesTags: ['EventRegistration'],
    }),

    checkInToEvent: builder.mutation<CheckInToEventResponse, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['EventRegistration'],
    }),

    cancelEventRegistration: builder.mutation<
      CancelEventRegistrationResponse,
      string
    >({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EventRegistration'],
    }),
  }),
});

export const {
  useListEventRegistrationsQuery,
  useRegisterForEventMutation,
  useGetMyEventsQuery,
  useCheckInToEventMutation,
  useCancelEventRegistrationMutation,
} = eventRegistrationApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  sendMessageRequest,
  sendMessageResponse,
  getMessagesResponse,
} from '../interfaces/chatAI';

const BASE_URL = import.meta.env.VITE_BACKEND_URL ?? 'http://localhost:5001';

export const chatAIApi = createApi({
  reducerPath: 'chatAIApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    // GET /api/chatbot/:userId
    getMessages: builder.query<getMessagesResponse, getMessagesRequest>({
      query: ({ userId }) => `/api/chatbot/${encodeURIComponent(userId)}`,
    }),
    // POST /api/chatbot/:userId
    sendMessage: builder.mutation<sendMessageResponse, sendMessageRequest>({
      query: ({ userId, content }) => ({
        url: `/api/chatbot/${encodeURIComponent(userId)}`,
        method: 'POST',
        body: { content },
      }),
    }),
  }),
});

export const { useGetMessagesQuery, useSendMessageMutation } = chatAIApi;

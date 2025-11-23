import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetDocumentsInPageParams,
  GetDocumentsInPageResponse,
  GetDocumentByIdResponse,
  CreateDocumentResponse,
  UpdateDocumentByIdResponse,
  GetStatisticResponse,
} from '../interfaces/document';

export const documentApi = createApi({
  reducerPath: 'documentApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/documents`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Document', 'DocumentStatistic'],
  endpoints: (builder) => ({
    // GET / - Get documents in page with filters
    getDocumentsInPage: builder.query<
      GetDocumentsInPageResponse,
      GetDocumentsInPageParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.type) queryParams.append('type', params.type);
        if (params?.scope) queryParams.append('scope', params.scope);
        const queryString = queryParams.toString();
        return queryString ? `/?${queryString}` : '/';
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.documents.map(({ _id }) => ({
                type: 'Document' as const,
                id: _id,
              })),
              { type: 'Document', id: 'LIST' },
            ]
          : [{ type: 'Document', id: 'LIST' }],
    }),

    // GET /:id - Get document by ID
    getDocumentById: builder.query<GetDocumentByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Document', id }],
    }),

    // POST / - Create new document
    createDocument: builder.mutation<CreateDocumentResponse, FormData>({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Document', id: 'LIST' },
        { type: 'DocumentStatistic' },
      ],
    }),

    // PUT /:id - Update document by ID
    updateDocumentById: builder.mutation<
      UpdateDocumentByIdResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Document', id },
        { type: 'Document', id: 'LIST' },
        { type: 'DocumentStatistic' },
      ],
    }),

    // GET /statistic - Get document statistics
    getDocumentStatistic: builder.query<GetStatisticResponse, void>({
      query: () => '/statistic',
      providesTags: [{ type: 'DocumentStatistic' }],
    }),
  }),
});

export const {
  useGetDocumentsInPageQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentByIdMutation,
  useGetDocumentStatisticQuery,
} = documentApi;

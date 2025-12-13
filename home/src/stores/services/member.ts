// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import type {
//   GetMembersInPageParams,
//   GetMembersInPageResponse,
//   GetMemberByIdResponse,
//   CreateMemberResponse,
//   UpdateMemberByIdResponse,
//   GetMemberStatisticResponse,
// } from '../interfaces/member';

// export const memberApi = createApi({
//   reducerPath: 'memberApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${process.env.BACKEND_URL}/members`,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) headers.set('Authorization', `Bearer ${token}`);
//       return headers;
//     },
//   }),
//   tagTypes: ['Member', 'MemberStatistic'],
//   endpoints: (builder) => ({
//     // GET / - paginated members
//     getMembersInPage: builder.query<GetMembersInPageResponse, GetMembersInPageParams | void>({
//       query: (params) => {
//         const queryParams = new URLSearchParams();
//         if (params?.page) queryParams.append('page', params.page.toString());
//         if (params?.limit) queryParams.append('limit', params.limit.toString());
//         if (params?.search) queryParams.append('search', params.search);
//         if (params?.role) queryParams.append('role', params.role);
//         if (params?.chapterId) queryParams.append('chapterId', params.chapterId);
//         const queryString = queryParams.toString();
//         return queryString ? `/?${queryString}` : '/';
//       },
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.data.members.map(({ _id }) => ({ type: 'Member' as const, id: _id })),
//               { type: 'Member', id: 'LIST' },
//             ]
//           : [{ type: 'Member', id: 'LIST' }],
//     }),

//     // GET /:id
//     getMemberById: builder.query<GetMemberByIdResponse, string>({
//       query: (id) => `/${id}`,
//       providesTags: (_result, _error, id) => [{ type: 'Member', id }],
//     }),

//     // POST /
//     createMember: builder.mutation<CreateMemberResponse, FormData>({
//       query: (formData) => ({ url: '/', method: 'POST', body: formData }),
//       invalidatesTags: [
//         { type: 'Member', id: 'LIST' },
//         { type: 'MemberStatistic' },
//       ],
//     }),

//     // PUT /:id
//     updateMemberById: builder.mutation<UpdateMemberByIdResponse, { id: string; formData: FormData }>({
//       query: ({ id, formData }) => ({ url: `/${id}`, method: 'PUT', body: formData }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Member', id },
//         { type: 'Member', id: 'LIST' },
//         { type: 'MemberStatistic' },
//       ],
//     }),

//     // GET /statistic
//     getMemberStatistic: builder.query<GetMemberStatisticResponse, void>({
//       query: () => '/statistic',
//       providesTags: [{ type: 'MemberStatistic' }],
//     }),
//   }),
// });

// export const {
//   useGetMembersInPageQuery,
//   useGetMemberByIdQuery,
//   useCreateMemberMutation,
//   useUpdateMemberByIdMutation,
//   useGetMemberStatisticQuery,
// } = memberApi;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  GetMembersInPageParams,
  GetMembersInPageResponse,
  GetMemberByIdResponse,
  CreateMemberResponse,
  UpdateMemberByIdResponse,
  GetMemberStatisticResponse,
  MemberInPage,
} from '../interfaces/member';

export const memberApi = createApi({
  reducerPath: 'memberApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/members`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Member', 'MemberStatistic'],

  endpoints: (builder) => ({
    /* =========================
       GET /members (pagination)
    ========================= */
    getMembersInPage: builder.query<
      GetMembersInPageResponse,
      GetMembersInPageParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.search) queryParams.append('search', params.search);
        if (params?.position) queryParams.append('position', params.position);

        const queryString = queryParams.toString();
        return queryString ? `/?${queryString}` : '/';
      },

      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map((member: MemberInPage) => ({
                type: 'Member' as const,
                id: member._id,
              })),
              { type: 'Member', id: 'LIST' },
            ]
          : [{ type: 'Member', id: 'LIST' }],
    }),

    /* =========================
       GET /members/:id
    ========================= */
    getMemberById: builder.query<GetMemberByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [
        { type: 'Member', id },
      ],
    }),

    /* =========================
       POST /members
    ========================= */
    createMember: builder.mutation<CreateMemberResponse, FormData>({
      query: (formData) => ({
        url: '/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [
        { type: 'Member', id: 'LIST' },
        { type: 'MemberStatistic' },
      ],
    }),

    /* =========================
       PUT /members/:id
    ========================= */
    updateMemberById: builder.mutation<
      UpdateMemberByIdResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Member', id },
        { type: 'Member', id: 'LIST' },
        { type: 'MemberStatistic' },
      ],
    }),

    /* =========================
       GET /members/statistic
    ========================= */
    getMemberStatistic: builder.query<GetMemberStatisticResponse, void>({
      query: () => '/statistic',
      providesTags: [{ type: 'MemberStatistic' }],
    }),
  }),
});

export const {
  useGetMembersInPageQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberByIdMutation,
  useGetMemberStatisticQuery,
} = memberApi;

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetMembersInPageParams,
  GetMembersInPageResponse,
  GetMemberByIdResponse,
  CreateMemberResponse,
  UpdateMemberByIdResponse,
  GetMemberStatisticResponse,
} from "../interfaces/member";

export const memberApi = createApi({
  reducerPath: "memberApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.BACKEND_URL}/members`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Member", "MemberStatistic"],
  endpoints: (builder) => ({
    /* ===================== GET MEMBERS ===================== */
    getMembersInPage: builder.query<
      GetMembersInPageResponse,
      GetMembersInPageParams | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.search) queryParams.append("search", params.search);
        if (params?.position) queryParams.append("position", params.position);

        const qs = queryParams.toString();
        return qs ? `/?${qs}` : "/";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.result.map((m) => ({
                type: "Member" as const,
                id: m._id,
              })),
              { type: "Member", id: "LIST" },
            ]
          : [{ type: "Member", id: "LIST" }],
    }),

    /* ===================== GET MEMBER BY ID ===================== */
    getMemberById: builder.query<GetMemberByIdResponse, string>({
      query: (id) => `/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Member", id }],
    }),

    /* ===================== CREATE ===================== */
    createMember: builder.mutation<CreateMemberResponse, FormData>({
      query: (formData) => ({
        url: "/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: [
        { type: "Member", id: "LIST" },
        { type: "MemberStatistic" },
      ],
    }),

    /* ===================== UPDATE ===================== */
    updateMemberById: builder.mutation<
      UpdateMemberByIdResponse,
      { id: string; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (_res, _err, { id }) => [
        { type: "Member", id },
        { type: "Member", id: "LIST" },
        { type: "MemberStatistic" },
      ],
    }),

    /* ===================== STATISTIC ===================== */
    getMemberStatistic: builder.query<GetMemberStatisticResponse, void>({
      query: () => "/statistic",
      providesTags: [{ type: "MemberStatistic" }],
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

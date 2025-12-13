// // Backend response structure
// export interface ApiResponse<T> {
//   success: boolean;
//   message: string;
//   data: T;
// }

// // Member model
// export interface Member {
//   _id: string;
//   name: string | null;
//   email: string | null;
//   phone: string | null;
//   role: 'admin' | 'member' | null;
//   chapterId: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// // Query parameters for getMembersInPage
// export interface GetMembersInPageParams {
//   page?: number;
//   limit?: number;
//   search?: string;
//   role?: 'admin' | 'member';
//   chapterId?: string;
// }

// // Paginated members response
// export interface MembersPageData {
//   members: Member[];
//   totalMembers: number;
//   totalPages: number;
//   currentPage: number;
//   limit: number;
// }

// export interface GetMembersInPageResponse {
//   message: string;
//   data: MembersPageData;
// }

// // Response for getMemberById
// export type GetMemberByIdResponse = ApiResponse<Member>;

// // Response for createMember (returns success/message)
// export type CreateMemberResponse = ApiResponse<null>;

// // Response for updateMemberById
// export type UpdateMemberByIdResponse = ApiResponse<Member>;

// // Member statistics (optional)
// export interface MemberStatistic {
//   role: string;
//   value: number;
// }

// export interface MemberStatisticData {
//   membersByRole: MemberStatistic[];
//   membersByChapter: MemberStatistic[];
// }

// export type GetMemberStatisticResponse = ApiResponse<MemberStatisticData>;

/* =========================
   Base API response
========================= */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* =========================
   DB MEMBER MODEL 
========================= */
export interface MemberModel {
  _id: string;               
  cardCode: string;
  position: 'secretary' | 'deputy_secretary' | 'committee_member' | 'member';
  memberOf: string;
  createdAt: string;
  updatedAt: string;
}

/* =========================
   DB ACCOUNT MODEL 
========================= */
export interface AccountModel {
  _id: string;                 // accountId
  fullname: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female';
  status: 'active' | 'locked' | 'pending';
  avatar?: {
    path: string;
  } | null;
  infoMember: string;
}

/* =========================
   API RESPONSE ITEM
   (Member + Account JOIN)
========================= */
export interface MemberInPage {
  _id: string; // accountId
  fullname: string;
  cardCode: string;
  position: 'secretary' | 'deputy_secretary' | 'committee_member' | 'member';
  status: 'active' | 'locked' | 'pending';
  gender?: 'male' | 'female';
  avatar?: {
    path: string;
  } | null;
  email?: string;
  phone?: string;
  memberOf: string;
  createdAt: string;
}

/* =========================
   QUERY PARAMS
========================= */
export interface GetMembersInPageParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: MemberInPage['position'];
}

/* =========================
   PAGINATION RESPONSE
========================= */
export interface MembersPageData {
  result: MemberInPage[];
  total: number;
  currentPage: number;
  totalPages: number;
}

/* =========================
   API RESPONSES
========================= */
export type GetMembersInPageResponse =
  ApiResponse<MembersPageData>;

export type GetMemberByIdResponse =
  ApiResponse<MemberInPage>;

export type CreateMemberResponse =
  ApiResponse<null>;

export type UpdateMemberByIdResponse =
  ApiResponse<MemberInPage>;

/* =========================
   STATISTIC TYPES
========================= */
export interface StatisticItem {
  name: string;
  value: number;
}

export interface ParticipationItem {
  name: string;
  participation: number;
}

export interface MemberStatisticData {
  memberByGender: StatisticItem[];
  memberByStatus: StatisticItem[];
  memberByRole: StatisticItem[];
  participationData: ParticipationItem[];
}

export type GetMemberStatisticResponse =
  ApiResponse<MemberStatisticData>;

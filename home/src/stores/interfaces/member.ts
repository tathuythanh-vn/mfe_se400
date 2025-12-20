// ====== COMMON ======
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// ====== MEMBER ======
export interface Member {
  _id: string;
  memberOf: string | null;
  position: "secretary" | "deputy_secretary" | "committee_member" | "member" | null;
  cardCode: string | null;
  joinedAt: string | null;
  address: string | null;
  hometown: string | null;
  ethnicity: string | null;
  religion: string | null;
  eduLevel: string | null;
  createdAt: string;
  updatedAt: string;
}

// ====== MEMBER + ACCOUNT (backend gộp) ======
export interface MemberWithAccount extends Member {
  fullname?: string;
  gender?: "male" | "female";
  status?: "active" | "locked";
  avatar?: {
    path?: string;
  };
  email?: string;
}

// ====== GET MEMBERS ======
export interface GetMembersInPageParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: "secretary" | "deputy_secretary" | "committee_member" | "member";
}

export interface MembersPageData {
  result: MemberWithAccount[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export type GetMembersInPageResponse = ApiResponse<MembersPageData>;

// ====== MEMBER DETAIL ======
export type GetMemberByIdResponse = ApiResponse<MemberWithAccount>;

// ====== CREATE / UPDATE ======
export type CreateMemberResponse = ApiResponse<null>;
export type UpdateMemberByIdResponse = ApiResponse<MemberWithAccount>;

// ====== STATISTIC ======
export interface MemberStatistic {
  name: string;
  value: number;
}

export interface ParticipationItem {
  name: string;
  participation: number;
}

export interface MemberStatisticData {
  memberByGender: MemberStatistic[];
  memberByStatus: MemberStatistic[];
  memberByRole: MemberStatistic[];
  participationData: MemberStatistic[];
}

export type GetMemberStatisticResponse =
  ApiResponse<MemberStatisticData>;

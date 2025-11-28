// Backend response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Member model
export interface Member {
  _id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: 'admin' | 'member' | null;
  chapterId: string | null;
  createdAt: string;
  updatedAt: string;
}

// Query parameters for getMembersInPage
export interface GetMembersInPageParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'member';
  chapterId?: string;
}

// Paginated members response
export interface MembersPageData {
  members: Member[];
  totalMembers: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface GetMembersInPageResponse {
  message: string;
  data: MembersPageData;
}

// Response for getMemberById
export type GetMemberByIdResponse = ApiResponse<Member>;

// Response for createMember (returns success/message)
export type CreateMemberResponse = ApiResponse<null>;

// Response for updateMemberById
export type UpdateMemberByIdResponse = ApiResponse<Member>;

// Member statistics (optional)
export interface MemberStatistic {
  role: string;
  value: number;
}

export interface MemberStatisticData {
  membersByRole: MemberStatistic[];
  membersByChapter: MemberStatistic[];
}

export type GetMemberStatisticResponse = ApiResponse<MemberStatisticData>;

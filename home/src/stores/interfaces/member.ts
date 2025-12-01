// Backend response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Member model
export interface Member {
  _id: string;
  memberOf: string | null
  position: "secretary" | "deputy_secretary" | "committee_member" | "member" | null
  cardCode: string | null
  joinedAt: string | null
  address: string | null
  hometown: string | null
  ethnicity: string | null
  religion: string | null
  eduLevel: string | null
  createdAt: string
  updatedAt: string

}

// Query parameters for getMembersInPage
export interface GetMembersInPageParams {
  page?: number;
  limit?: number;
  search?: string;
  position?: 'secretary' | 'deputy_secretary' | 'committee_member' | 'member';
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

// Member statistics
export interface MemberStatistic {
  name: string;
  value: number;
}

export interface MemberStatisticData {
  memberByGender: MemberStatistic[];
  membersByRole: MemberStatistic[];
  memberByStatus: MemberStatistic[];
  participationData: MemberStatistic[];
}

export type GetMemberStatisticResponse = ApiResponse<MemberStatisticData>;

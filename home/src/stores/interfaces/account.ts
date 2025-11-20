// export type Gender = 'male' | 'female' | 'other';

// export type AccountStatus = 'active' | 'locked' | 'pending';

// export type Role = 'admin' | 'manager' | 'member';

// export interface Account {
//   _id: string;
//   email: string;
//   phone: string;
//   avatar: {
//     path: string;
//   } | null;
//   fullname: string;
//   birthday: string;
//   gender: Gender;
//   password: string;
//   role: Role;
//   infoMember?: any;
//   managerOf?: string | null;
//   status: AccountStatus;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// export interface GetAccountsResponse {
//   success: boolean;
//   message?: string;
//   data: {
//     accounts: Account[];
//     total: number;
//     currentPage: number;
//     totalPages: number;
//   } | null;
// }

export type Gender = "male" | "female" | "other";
export type AccountStatus = "active" | "locked" | "pending";
export type Role = "admin" | "manager" | "member";

/* ---- Tách infoMember ra thành 1 interface rõ ràng ---- */
export interface InfoMember {
  memberOf: string | null;
  cardCode: string | null;
  joinedAt: string | null;
  position: "secretary" | "deputy_secretary" | "committee_member" | "member" | null;
  address: string | null;
  hometown: string | null;
  ethnicity: string | null;
  religion: string | null;
  eduLevel: string | null;
}

export interface Account {
  _id: string;
  email: string;
  phone: string;

  avatar: {
    path: string;
  } | null;

  fullname: string;
  birthday: string;
  gender: Gender;
  password: string;
  role: Role;

  /* ---- Thêm infoMember chuẩn kiểu ---- */
  infoMember?: InfoMember | null;

  managerOf?: string | null;
  status: AccountStatus;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetAccountsResponse {
  success: boolean;
  message?: string;
  data: {
    accounts: Account[];
    total: number;
    currentPage: number;
    totalPages: number;
  } | null;
}

export interface UpdateAccountRequest {
  email?: string;
  phone?: string;
  fullname?: string;
  birthday?: string;
  gender?: Gender;
  role?: Role;
  status?: AccountStatus;

  avatar?: {
    path: string;
  } | null;

  infoMember?: {
    memberOf?: string | null;
    cardCode?: string | null;
    joinedAt?: string | null;
    position?: "secretary" | "deputy_secretary" | "committee_member" | "member" | null;
    address?: string | null;
    hometown?: string | null;
    ethnicity?: string | null;
    religion?: string | null;
    eduLevel?: string | null;
  } | null;

  managerOf?: string | null;
}

export interface UpdateAccountResponse {
  success: boolean;
  message: string; // "Cập nhật tài khoản thành công"
  data?: undefined;
}

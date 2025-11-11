export type Gender = 'male' | 'female' | 'other';

export type AccountStatus = 'active' | 'locked' | 'pending';

export type Role = 'admin' | 'manager' | 'member';

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
  infoMember?: any;
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

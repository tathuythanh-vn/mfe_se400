import type { ROLE } from '../../constants/nav-items';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessData {
  token: string;
  role: string;
}

export type LoginResponse =
  | { success: true; data: LoginSuccessData; message?: string }
  | { success: false; data: null; message: string };

export interface GetProfileData {
  _id: string;
  email: string;
  phone: string;
  avatar: string | null;
  fullname: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  password: string;
  role: ROLE;
  infoMember: any;
  managerOf?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetProfileResponse {
  success: boolean;
  message?: string;
  data: GetProfileData | null;
}

export interface RegisterRequest {
  account: {
    email: string;
    phone: string;
    fullname: string;
    birthday: string;
    gender: 'male' | 'female' | 'other';
    password: string;
    role: Exclude<ROLE, ROLE.ADMIN>;
  };
  roleInfo: {
    managerOf?: string;
    memberOf?: string;
    cardCode?: string;
    position?: string;
    address?: string;
    hometown?: string;
    ethnicity?: string;
    religion?: string;
    eduLevel?: string;
    joinedAt?: string;
  };
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  data?: any;
}

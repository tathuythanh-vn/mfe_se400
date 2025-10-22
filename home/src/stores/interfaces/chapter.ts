export interface Chapter {
  _id: string;
  status: 'active' | 'locked';
  name: string;
  affiliated: string;
  address: string;
  establishedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullname: string | null;
  avatar: string | null;
}

export interface GetChaptersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'locked';
}

export interface GetChaptersData {
  result: Chapter[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface GetChaptersResponse {
  success: boolean;
  message?: string;
  data: GetChaptersData;
}

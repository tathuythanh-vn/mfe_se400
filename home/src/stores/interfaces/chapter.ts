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
}

export interface ChapterWithManager extends Chapter {
  fullname: string | null;
  avatar: string | null;
}

export interface GetChaptersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'active' | 'locked';
  hadManager?: 'true' | 'false';
}

export interface GetChaptersData {
  result: ChapterWithManager[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface GetChaptersResponse {
  success: boolean;
  message: string;
  data: GetChaptersData;
}

export interface GetChapterByIdResponse {
  success: boolean;
  message: string;
  data: ChapterWithManager;
}

export interface CreateChapterRequest {
  name: string;
  affiliated: string;
  address: string;
  establishedAt: string;
}

export interface CreateChapterResponse {
  success: boolean;
  message: string; // "Tạo chi đoàn thành công" or error message
  data?: undefined;
}

export interface UpdateChapterRequest {
  name?: string;
  affiliated?: string;
  address?: string;
  establishedAt?: string;
  status?: 'active' | 'locked';
}

export interface UpdateChapterResponse {
  success: boolean;
  message: string; // "Cập nhật thông tin chi đoàn thành công"
  data?: undefined;
}

export interface ChapterStatistic {
  status: {
    active: number;
    locked: number;
  };
  manager: {
    hadManager: number;
    noManager: number;
  };
}

export interface GetChapterStatisticResponse {
  success: boolean;
  message: string; // "Lấy thống kê thành công"
  data: ChapterStatistic;
}

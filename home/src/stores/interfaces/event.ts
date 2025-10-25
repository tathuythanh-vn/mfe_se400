import type { Chapter } from './chapter';

export interface EventImage {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  path: string;
  size: number;
  filename: string;
}

export interface Event {
  _id: string;
  chapterId: Chapter;
  name: string;
  startedAt: string;
  location: string;
  description: string;
  tags: string[];
  scope: 'public' | 'chapter';
  images: EventImage[];
  likes: number;
  status: 'completed' | 'happening' | 'pending' | 'canceled';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetEventsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'completed' | 'happening' | 'pending' | 'canceled';
  scope?: 'public' | 'chapter';
}

export interface GetEventsData {
  data: Event[];
  total: number;
  page: number;
  totalPages: number;
}

export interface GetEventsResponse {
  success: boolean;
  message?: string;
  data: GetEventsData;
}

export interface GetEventByIdResponse {
  success: boolean;
  message?: string;
  data: Event;
}

export interface CreateEventRequest {
  name: string;
  startedAt: string;
  location: string;
  description: string;
  tags?: string[];
  scope: 'public' | 'chapter';
  images?: File[];
}

export interface CreateEventResponse {
  success: boolean;
  message?: string;
  data?: undefined;
}

export interface UpdateEventRequest {
  name?: string;
  startedAt?: string;
  location?: string;
  description?: string;
  tags?: string[];
  scope?: 'public' | 'chapter';
  status?: 'completed' | 'happening' | 'pending' | 'canceled';
  images?: File[];
  cloudImgs?: string[];
}

export interface UpdateEventResponse {
  success: boolean;
  message?: string;
  data?: undefined;
}

export interface EventStatistic {
  eventByStatus: Array<{
    name: string;
    value: number;
  }>;
  eventByType: Array<{
    name: string;
    value: number;
  }>;
  interactionData: Array<{
    name: string;
    likes: number;
    comments: number;
  }>;
}

export interface GetStatisticResponse {
  success: boolean;
  message?: string;
  data: EventStatistic;
}

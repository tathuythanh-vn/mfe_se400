export interface Comment {
  _id: string;
  eventId: string;
  accountId: {
    _id: string;
    fullname: string;
    avatar?: {
      path: string;
    };
  };
  text: string;
  reports: number;
  status: 'active' | 'locked';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetCommentsParams {
  eventId: string;
  status?: 'active' | 'locked';
}

export interface CreateCommentRequest {
  eventId: string;
  text: string;
}

export interface GetCommentsResponse {
  success: boolean;
  message?: string;
  data: Comment[];
}

export interface CreateCommentResponse {
  success: boolean;
  message?: string;
  data: Comment;
}

export interface HideCommentResponse {
  success: boolean;
  message?: string;
  data?: undefined;
}

// Notification model
export interface Notification {
  _id: string;
  status: 'unread' | 'read';
  accountId: string | null;
  text: string;
  createdAt: string;
  updatedAt: string;
}

// API Response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Response for getNotifications
export type GetNotificationsResponse = ApiResponse<Notification[]>;

// Response for updateStatusNotifications
export type UpdateStatusNotificationsResponse = ApiResponse<Notification[]>;

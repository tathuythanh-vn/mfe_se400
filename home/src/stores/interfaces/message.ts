import type { Account } from './account';

export interface Message {
  _id: string;
  status: 'unread' | 'read';
  participants: string[]; // Array of Account IDs
  senderId: string | null; // Account ID
  text: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

// Message history item (simplified format from backend)
export interface MessageHistoryItem {
  senderId: string;
  message: string;
  status: 'unread' | 'read';
}

// Get history message response
export interface GetHistoryMessageResponse {
  success: boolean;
  message: string;
  data: MessageHistoryItem[];
}

// Create message request
export interface CreateMessageRequest {
  text: string;
}

// Create message response
export interface CreateMessageResponse {
  success: boolean;
  message: string;
  data: null;
}

// Get contacts response (for admin)
export interface GetContactsAdminResponse {
  success: boolean;
  message: string;
  data: {
    managers: Account[];
  };
}

// Get contacts response (for manager)
export interface GetContactsManagerResponse {
  success: boolean;
  message: string;
  data: {
    admin: Account;
    managers: Account[];
    members: Account[];
  };
}

// Get contacts response (for member)
export interface GetContactsMemberResponse {
  success: boolean;
  message: string;
  data: {
    manager: Account;
    members: Account[];
  };
}

// Union type for all contact responses
export type GetContactsResponse =
  | GetContactsAdminResponse
  | GetContactsManagerResponse
  | GetContactsMemberResponse;

export enum SocketEvents {
  ACCESS = 'access',
  CHAT = 'chat',
  DISCONNECT = 'disconnect',
}

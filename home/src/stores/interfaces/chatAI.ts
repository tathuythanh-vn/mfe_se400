export interface sendMessageRequest {
  userId: string;
  content: string;
}

export interface sendMessageResponse {
  answer: string;
}

export interface getMessagesRequest {
  userId: string;
}

export interface ChatMessage {
  _id: string;
  userId: string;
  isBot: boolean;
  content: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
}

export interface getMessagesResponse {
  data: ChatMessage[];
}

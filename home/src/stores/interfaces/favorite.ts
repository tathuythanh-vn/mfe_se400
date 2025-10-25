export interface Favorite {
  _id: string;
  accountId: string;
  eventId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CheckFavoriteStatusParams {
  eventId: string;
}

export interface CheckFavoriteStatusResponse {
  success: boolean;
  message: string;
  data: {
    liked: boolean;
  };
}

export interface ToggleFavoriteRequest {
  eventId: string;
}

export interface ToggleFavoriteResponse {
  success: boolean;
  message: string;
  data?: undefined;
}

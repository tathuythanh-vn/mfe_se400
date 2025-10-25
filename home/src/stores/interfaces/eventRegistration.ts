export interface EventRegistration {
  _id: string;
  accountId: string;
  eventId: string;
  status: 'registered' | 'attended';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface RegisterForEventRequest {
  eventId: string;
}

export interface RegisterForEventResponse {
  success: boolean;
  message: string;
  data?: undefined;
}

export interface CancelEventRegistrationResponse {
  success: boolean;
  message: string;
  data?: undefined;
}

export interface ListEventRegistrationsParams {
  eventId: string;
}

export interface EventRegistrationWithAccount extends EventRegistration {
  fullname?: string;
  avatar?: {
    path: string;
  };
  email?: string;
  phone?: string;
  memberOf?: {
    _id: string;
    name: string;
  };
}

export interface ListEventRegistrationsResponse {
  success: boolean;
  message: string;
  data: EventRegistrationWithAccount[];
}

export interface CheckInToEventResponse {
  success: boolean;
  message: string;
  data?: undefined;
}

export interface MyEvent {
  _id: string;
  name: string;
  startTime: string;
  location: string;
  status: 'completed' | 'happening' | 'pending' | 'canceled';
}

export interface GetMyEventsResponse {
  success: boolean;
  message: string;
  data: MyEvent[];
}

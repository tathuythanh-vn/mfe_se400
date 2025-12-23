// Re-export the chatAI API hooks
export { useGetMessagesQuery, useSendMessageMutation } from './services/chatAI';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth';
import { chatAIApi } from './services/chatAI';
import { accountApi } from './services/account';
import { chapterApi } from './services/chapter';
import { eventApi } from './services/event';
import { commentApi } from './services/comment';
import { favoriteApi } from './services/favorite';
import { eventRegistrationApi } from './services/eventRegistration';
import { documentApi } from './services/document';
import { notificationApi } from './services/notification';
import { memberApi } from './services/member';
import { messageApi } from './services/message';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [chapterApi.reducerPath]: chapterApi.reducer,
    [eventApi.reducerPath]: eventApi.reducer,
    [commentApi.reducerPath]: commentApi.reducer,
    [favoriteApi.reducerPath]: favoriteApi.reducer,
    [eventRegistrationApi.reducerPath]: eventRegistrationApi.reducer,
    [documentApi.reducerPath]: documentApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer,
    [messageApi.reducerPath]: messageApi.reducer,
    [chatAIApi.reducerPath]: chatAIApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      accountApi.middleware,
      chapterApi.middleware,
      eventApi.middleware,
      commentApi.middleware,
      favoriteApi.middleware,
      eventRegistrationApi.middleware,
      documentApi.middleware,
      notificationApi.middleware,
      memberApi.middleware,
      messageApi.middleware,
      chatAIApi.middleware,
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Setup listeners for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Re-export the auth API hooks
export {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} from './services/auth';

// Re-export the account API hooks
export {
  useGetAccountsInPageQuery,
  useGetAccountStatisticQuery,
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
} from './services/account';

// Re-export the chapter API hooks
export {
  useGetChaptersInPageQuery,
  useGetStatisticQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterByIdMutation,
} from './services/chapter';

// Re-export the event API hooks
export {
  useGetEventsInPageQuery,
  useGetEventStatisticQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventByIdMutation,
} from './services/event';

// Re-export the comment API hooks
export {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useHideCommentMutation,
} from './services/comment';

// Re-export the favorite API hooks
export {
  useCheckFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from './services/favorite';

// Re-export the event registration API hooks
export {
  useListEventRegistrationsQuery,
  useRegisterForEventMutation,
  useGetMyEventsQuery,
  useCheckInToEventMutation,
  useCancelEventRegistrationMutation,
} from './services/eventRegistration';

// Re-export the document API hooks
export {
  useGetDocumentsInPageQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentByIdMutation,
  useGetDocumentStatisticQuery,
} from './services/document';

// Re-export the notification API hooks
export {
  useGetNotificationsQuery,
  useUpdateNotificationsStatusMutation,
} from './services/notification';

// Re-export the member API hooks
export {
  useGetMembersInPageQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberByIdMutation,
  useGetMemberStatisticQuery,
} from './services/member';

// Re-export the message API hooks
export {
  useGetHistoryMessageQuery,
  useCreateMessageMutation,
  useGetContactsQuery,
} from './services/message';

// Re-export TypeScript interfaces
export type { Event, EventImage } from './interfaces/event';
export type {
  Account,
  InfoMember,
  Gender,
  AccountStatus,
  Role,
} from './interfaces/account';
export type { Chapter } from './interfaces/chapter';
export type { Comment } from './interfaces/comment';
export type { Favorite } from './interfaces/favorite';
export type {
  EventRegistration,
  MyEvent,
} from './interfaces/eventRegistration';
export type { Document } from './interfaces/document';
export type { Notification } from './interfaces/notification';
export type { Member } from './interfaces/member';

export default store;

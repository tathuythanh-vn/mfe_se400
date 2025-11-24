import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth';
import { accountApi } from './services/account';
import { chapterApi } from './services/chapter';
import { eventApi } from './services/event';
import { commentApi } from './services/comment';
import { favoriteApi } from './services/favorite';
import { eventRegistrationApi } from './services/eventRegistration';
import { documentApi } from './services/document';
import { notificationApi } from './services/notification';

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
    ),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

// Re-export the auth API hooks for use in other microfrontends
export {
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
} from './services/auth';

// Re-export the account API hooks for use in other microfrontends
// export {
//   useGetAccountsInPageQuery,
//   useGetAccountStatisticQuery,
//   useGetAccountByIdQuery,
//   useUpdateAccountByIdMutation,
// } from './services/account';

export {
  useGetAccountByIdQuery,
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useUpdateAccountStatusMutation
} from './services/account';


// Re-export the chapter API hooks for use in other microfrontends
export {
  useGetChaptersInPageQuery,
  useGetStatisticQuery,
  useGetChapterByIdQuery,
  useCreateChapterMutation,
  useUpdateChapterByIdMutation,
} from './services/chapter';

// Re-export the event API hooks for use in other microfrontends
export {
  useGetEventsInPageQuery,
  useGetEventStatisticQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventByIdMutation,
} from './services/event';

// Re-export the comment API hooks for use in other microfrontends
export {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useHideCommentMutation,
} from './services/comment';

// Re-export the favorite API hooks for use in other microfrontends
export {
  useCheckFavoriteStatusQuery,
  useToggleFavoriteMutation,
} from './services/favorite';

// Re-export the event registration API hooks for use in other microfrontends
export {
  useListEventRegistrationsQuery,
  useRegisterForEventMutation,
  useGetMyEventsQuery,
  useCheckInToEventMutation,
  useCancelEventRegistrationMutation,
} from './services/eventRegistration';

// Re-export the document API hooks for use in other microfrontends
export {
  useGetDocumentsInPageQuery,
  useGetDocumentByIdQuery,
  useCreateDocumentMutation,
  useUpdateDocumentByIdMutation,
  useGetDocumentStatisticQuery,
} from './services/document';

// Re-export the notification API hooks for use in other microfrontends
export {
  useGetNotificationsQuery,
  useUpdateNotificationsStatusMutation,
} from './services/notification';

// Re-export TypeScript interfaces for use in other microfrontends
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

export default store;

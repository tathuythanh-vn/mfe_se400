import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth';
import { chapterApi } from './services/chapter';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [chapterApi.reducerPath]: chapterApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, chapterApi.middleware),
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

// Re-export the chapter API hooks for use in other microfrontends
export { useGetChaptersQuery } from './services/chapter';

export default store;

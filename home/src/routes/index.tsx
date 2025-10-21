import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import { Suspense, lazy } from 'react';

// Lazy load remote apps to handle loading errors gracefully
const AuthContent = lazy(() =>
  import('auth/AuthContent').catch(() => ({
    default: () => <div>Auth service is not available</div>,
  })),
);

const MemberContent = lazy(() =>
  import('member/MemberContent').catch(() => ({
    default: () => <div>Member service is not available</div>,
  })),
);

export const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
  },
  {
    path: '/auth/*',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContent />
        </Suspense>
    ),
  },
  {
    path: '/admin/*',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContent />
        </Suspense>
    ),
  },
  {
    path: '/manager/*',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContent />
        </Suspense>
    ),
  },
  {
    path: '/member/*',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MemberContent />
        </Suspense>
    ),
  },
  {
    path: '/chat/*',
    element: (
        <Suspense fallback={<div>Loading...</div>}>
          <AuthContent />
        </Suspense>
    ),
  },
]);

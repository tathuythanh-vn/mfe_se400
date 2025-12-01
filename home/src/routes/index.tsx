import { createBrowserRouter, useNavigate } from 'react-router-dom';
import App from '../App';
import { Suspense, lazy } from 'react';
import RoleGuard from '../components/auth/RoleGuard';
import { ROLE } from '../constants/nav-items';
import { Loading, ErrorPage } from '../pages';

// Lazy load remote apps to handle loading errors gracefully
const AuthContent = lazy(() =>
  import('auth/AuthContent').catch(() => ({
    default: () => <ErrorPage message="Auth service is not available" />,
  })),
);

const MemberContent = lazy(() =>
  import('member/MemberContent').catch(() => ({
    default: () => <ErrorPage message="Member service is not available" />,
  })),
);

const ManagerContent = lazy(() =>
  import('manager/ManagerContent').catch(() => ({
    default: () => <ErrorPage message="Manager service is not available" />,
  })),
);

const AdminContent = lazy(() =>
  import('admin/AdminContent').catch(() => ({
    default: () => <div>Admin service is not available</div>,
  })),
);

const ChatContent = lazy(() =>
  import('chat/ChatContent').catch(() => ({
    default: () => <div>Chat service is not available</div>,
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
      <Suspense fallback={<Loading message="Loading authentication..." />}>
        <AuthContent />
      </Suspense>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <Suspense fallback={<Loading message="Loading admin panel..." />}>
        <RoleGuard roles={[ROLE.ADMIN]}>
          <AdminContent />
        </RoleGuard>
      </Suspense>
    ),
  },
  {
    path: '/manager/*',
    element: (
      <Suspense fallback={<Loading message="Loading manager panel..." />}>
        <RoleGuard roles={[ROLE.MANAGER]}>
          <ManagerContent />
        </RoleGuard>
      </Suspense>
    ),
  },
  {
    path: '/member/*',
    element: (
      <Suspense fallback={<Loading message="Loading member area..." />}>
        <RoleGuard roles={[ROLE.MEMBER]}>
          <MemberContent />
        </RoleGuard>
      </Suspense>
    ),
  },
  {
    path: '/chat/*',
    element: (
      <Suspense fallback={<Loading message="Loading chat..." />}>
        <ChatContent />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: (
      <ErrorPage
        message="Page not found"
        onGoHome={() => window.location.replace('/')}
      />
    ),
  },
]);

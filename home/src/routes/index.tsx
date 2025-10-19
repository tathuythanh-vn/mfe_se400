import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AuthContent from 'auth/AuthContent';
import { Suspense } from 'react';
import RoleGuard from '../components/auth/RoleGuard';
import { ROLE } from '../constants/nav-items';

export const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
  },
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        {/* Add role guard where need auth */}
        {/* <RoleGuard roles={[ROLE.MANAGER]}> */}
        <AuthContent />
        {/* </RoleGuard> */}
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
    path: '/memeber/*',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AuthContent />
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

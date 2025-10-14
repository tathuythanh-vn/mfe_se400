import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import AuthContent from 'auth/AuthContent';
import { Suspense } from 'react';

export const router = createBrowserRouter([
  {
    path: '',
    element: <App />,
  },
  {
    path: '/auth/*',
    element: (
      <Suspense fallback={<div>Loading Auth...</div>}>
        <AuthContent />
      </Suspense>
    ),
  },
]);

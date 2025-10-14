import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from '../App';
import Login from '../page/Login';
import Signup from '../page/Signup';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'signup',
      element: <Signup />,
    },
  ],
  {
    basename: '/auth',
  },
);

export default function AuthApp() {
  return <RouterProvider router={router} />;
}

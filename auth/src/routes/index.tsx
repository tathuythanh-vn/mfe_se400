import {
  createBrowserRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import '../App.css';

const authRoutes = [
  {
    path: '/',
    element: <Navigate to="login" replace />,
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: 'signup',
    element: <Signup />,
  },
];

const router = createBrowserRouter(authRoutes, {
  basename: '/auth',
});

type AuthAppProps = {
  standalone?: boolean;
};

export default function AuthApp({ standalone = false }: AuthAppProps) {
  if (standalone) {
    return <RouterProvider router={router} />;
  }

  return (
    <Routes>
      {authRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

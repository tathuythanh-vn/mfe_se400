import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import App from '../App';
import Login from '../page/Login';
import Signup from '../page/Signup';

const authRoutes = [
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

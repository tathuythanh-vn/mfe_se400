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

import { Provider } from 'react-redux';
import MainLayout from 'home/MainLayout';
import { store } from 'home/store';

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

// Router standalone
const standaloneRouter = createBrowserRouter([
  {
    path: '/auth/*',
    element: (
      <Provider store={store}>
        <Routes>
          {authRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Provider>
    ),
  },
]);

type AuthAppProps = {
  standalone?: boolean;
};

export default function AuthApp({ standalone = false }: AuthAppProps) {
  if (standalone) {
    return <RouterProvider router={standaloneRouter} />;
  }

  return (
    <div>
      <Provider store={store}>
        <Routes>
          {authRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Routes>
      </Provider>
    </div>
  );
}

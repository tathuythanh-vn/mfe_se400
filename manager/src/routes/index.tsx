import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  Navigate,
} from 'react-router-dom';
// @ts-ignore - Module Federation remote
import MainLayout from 'home/MainLayout';
import Events from '../pages/Events';
import Documents from '../pages/Documents';
import Statistic from '../pages/Statistic';
import Members from '../pages/Members';
import '../App.css';

const managerRoutes = [
  {
    path: '/',
    element: <Navigate to="members" replace />,
  },
  {
    path: 'events',
    element: <Events />,
  },
  {
    path: 'documents',
    element: <Documents />,
  },
  {
    path: 'statistic',
    element: <Statistic />,
  },
    {
    path: 'members',
    element: <Members />,
  },


];

const router = createBrowserRouter(managerRoutes, {
  basename: '/manager',
});

type ManagerAppProps = {
  standalone?: boolean;
};

export default function ManagerApp({ standalone = false }: ManagerAppProps) {
  if (standalone) {
    return (
      <MainLayout>
        <RouterProvider router={router} />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Routes>
        {managerRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </MainLayout>
  );
}

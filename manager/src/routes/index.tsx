import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  Navigate,
} from 'react-router-dom';
import MainLayout from 'home/MainLayout';
import Events from '../pages/Events';
import '../App.css';

const managerRoutes = [
  {
    path: '/',
    element: <Navigate to="events" replace />,
  },
  {
    path: 'events',
    element: <Events />,
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

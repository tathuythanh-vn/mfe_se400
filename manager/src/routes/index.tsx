import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  Navigate,
} from 'react-router-dom';

import Events from '../pages/Events';
import Documents from '../pages/Documents';
import Statistic from '../pages/Statistic';
import Members from '../pages/Members';
import '../App.css';

import { Provider } from 'react-redux';
import MainLayout from 'home/MainLayout';
import { store } from 'home/store';

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

// Router standalone
const standaloneRouter = createBrowserRouter([
  {
    path: '/manager/*',
    element: (
      <Provider store={store}>
        <Routes>
          {managerRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Provider>
    ),
  },
]);

type ManagerAppProps = {
  standalone?: boolean;
};

export default function ManagerApp({ standalone = false }: ManagerAppProps) {
  if (standalone) {
    return <RouterProvider router={standaloneRouter} />;
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

import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  Navigate,
} from 'react-router-dom';
import News from '../pages/News';
import MemberDocument from '../pages/MemberDocument';
import MyEvents from '../pages/MyEvents';
import '../App.css';

import { Provider } from 'react-redux';
import MainLayout from 'home/MainLayout';
import { store } from 'home/store';

const memberRoutes = [
  {
    path: '/',
    element: <Navigate to="news" replace />,
  },
  {
    path: 'news',
    element: <News />,
  },
  {
    path: 'documents',
    element: <MemberDocument />,
  },
  {
    path: 'my-events',
    element: <MyEvents />,
  },
];

// Router standalone
const standaloneRouter = createBrowserRouter([
  {
    path: '/member/*',
    element: (
      <Provider store={store}>
        <Routes>
          {memberRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Provider>
    ),
  },
]);

type MemberAppProps = {
  standalone?: boolean;
};

export default function MemberApp({ standalone = false }: MemberAppProps) {
  if (standalone) {
    localStorage.setItem(
      'token',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI2OTI5Y2EwNGNiMGI1MzMyODcxZjcwYzMiLCJpYXQiOjE3NjY0OTYwNjIsImV4cCI6MTc2NjU2MDg2Mn0.bYrbKitZZnAefmmp1LzaXhXHLasfkJeh-lHDHYMiXcc',
    );

    return <RouterProvider router={standaloneRouter} />;
  }

  return (
    <MainLayout>
      <Routes>
        {memberRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </MainLayout>
  );
}

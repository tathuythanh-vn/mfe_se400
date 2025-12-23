import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import AdminAccounts from '../pages/AdminAccounts';
import AdminChapters from '../pages/AdminChapters';
import RequestAccount from '../pages/RequestAccount';
import AdminStatistic from '../pages/AdminStatistic';

// Thêm Provider + store
import { Provider } from 'react-redux';
import MainLayout from 'home/MainLayout';
import { store } from 'home/store';

import '../App.css';

// Các route Admin
const adminRoutes = [
  { path: '/', element: <Navigate to="accounts" replace /> },
  { path: 'accounts', element: <AdminAccounts /> },
  { path: 'chapters', element: <AdminChapters /> },
  { path: 'request-accounts', element: <RequestAccount /> },
  { path: 'stastitic', element: <AdminStatistic /> },
];

// Router standalone
const standaloneRouter = createBrowserRouter([
  {
    path: '/admin/*',
    element: (
      <Provider store={store}>
        <div className="admin-override">
          <Routes>
            {adminRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </div>
      </Provider>
    ),
  },
]);

type AdminAppProps = { standalone?: boolean };

export default function AdminApp({ standalone = false }: AdminAppProps) {
  if (standalone) {
    // Standalone admin, dùng router riêng
    return <RouterProvider router={standaloneRouter} />;
  }

  // Embedded admin trong Home → không thêm Router nữa
  return (
    <div className="admin-scope">
      <Provider store={store}>
        <MainLayout>
          <Routes>
            {adminRoutes.map((r) => (
              <Route key={r.path} path={r.path} element={r.element} />
            ))}
          </Routes>
        </MainLayout>
      </Provider>
    </div>
  );
}

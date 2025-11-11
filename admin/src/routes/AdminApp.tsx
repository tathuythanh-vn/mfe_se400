import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import App from '../App';
import AdminAccounts from '../pages/AdminAccounts';
// import Chapter from '../pages/Chapter';
// import AdminStatistic from '../pages/AdminStatistic';

// Danh sách route cho module admin
const adminRoutes = [
  {
    path: '/',
    element: <App />, // Trang layout tổng (nếu có)
  },
  {
    path: 'accounts',
    element: <AdminAccounts />,
  },
  // {
  //   path: 'chapter',
  //   element: <Chapter />,
  // },
  // {
  //   path: 'statistic',
  //   element: <AdminStatistic />,
  // },
];

// Cấu hình router với basename /admin
const router = createBrowserRouter(adminRoutes, {
  basename: '/admin',
});

type AdminAppProps = {
  standalone?: boolean;
};

// Component chính của module Admin
export default function AdminApp({ standalone = false }: AdminAppProps) {
  if (standalone) {
    // ✅ Khi chạy riêng module admin (vd: pnpm run dev trong /admin)
    return <RouterProvider router={router} />;
  }

  // Khi được mount bởi app host (home)
  return (
    <Routes>
      {adminRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

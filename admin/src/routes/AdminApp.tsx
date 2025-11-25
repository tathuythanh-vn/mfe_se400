import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import MainLayout from 'home/MainLayout';

import AdminAccounts from '../pages/AdminAccounts';
import AdminChapters from '../pages/AdminChapters';
import RequestAccount from '../pages/RequestAccount';

// Thêm Provider + store
import { Provider } from 'react-redux';
import { store } from '../../../home/src/stores';

import '../App.css';

// Các route Admin
const adminRoutes = [
  { path: '/', element: <Navigate to="accounts" replace /> },
  { path: 'accounts', element: <AdminAccounts /> },
  { path: 'chapters', element: <AdminChapters /> },
  { path: 'request-accounts', element: <RequestAccount /> },
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
    return <RouterProvider router={standaloneRouter} />;
  }

  // Nhúng trong Home -> KHÔNG wrap Provider (Home đã wrap rồi)
  return (
    <div className="admin-scope">
      <MainLayout>
        <Routes>
          {adminRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </MainLayout>
    </div>
  );
}

// import {
//   createBrowserRouter,
//   RouterProvider,
//   Route,
//   Routes,
//   Navigate,
// } from "react-router-dom";

// // layout khi nhúng vào Home
// import MainLayout from "home/MainLayout";

// import AdminAccounts from "../pages/AdminAccounts";
// import AdminChapters from "../pages/AdminChapters";
// import RequestAccount from "../pages/RequestAccount";

// const adminRoutes = [
//   { path: "/", element: <Navigate to="accounts" replace /> },
//   { path: "accounts", element: <AdminAccounts /> },
//   { path: "chapters", element: <AdminChapters /> },
//   { path: "request-accounts", element: <RequestAccount /> },
// ];

// // Layout riêng dành cho standalone (port 3002)
// function StandaloneLayout() {
//   return (
//     <div className="p-6">
//       <Routes>
//         {adminRoutes.map((r) => (
//           <Route key={r.path} path={r.path} element={r.element} />
//         ))}
//       </Routes>
//     </div>
//   );
// }

// const standaloneRouter = createBrowserRouter(
//   [
//     {
//       path: "/admin/*",
//       element: <StandaloneLayout />,
//     },
//   ],
//   { basename: "/" }
// );

// type AdminAppProps = { standalone?: boolean };

// export default function AdminApp({ standalone = false }: AdminAppProps) {
//   if (standalone) {
//     return <RouterProvider router={standaloneRouter} />;
//   }

//   // khi nhúng vào Home
//   return (
//     <MainLayout>
//       <Routes>
//         {adminRoutes.map((r) => (
//           <Route key={r.path} path={r.path} element={r.element} />
//         ))}
//       </Routes>
//     </MainLayout>
//   );
// }

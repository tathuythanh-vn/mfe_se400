// import {
//   createBrowserRouter,
//   Route,
//   RouterProvider,
//   Routes,
// } from 'react-router-dom';
// import App from '../App';
// import AdminAccounts from '../pages/AdminAccounts';
// // import Chapter from '../pages/Chapter';
// // import AdminStatistic from '../pages/AdminStatistic';

// // Danh sách route cho module admin
// const adminRoutes = [
//   {
//     path: '/',
//     element: <App />, // Trang layout tổng (nếu có)
//   },
//   {
//     path: 'accounts',
//     element: <AdminAccounts />,
//   },
//   // {
//   //   path: 'chapter',
//   //   element: <Chapter />,
//   // },
//   // {
//   //   path: 'statistic',
//   //   element: <AdminStatistic />,
//   // },
// ];

// // Cấu hình router với basename /admin
// const router = createBrowserRouter(adminRoutes, {
//   basename: '/admin',
// });

// type AdminAppProps = {
//   standalone?: boolean;
// };

// // Component chính của module Admin
// export default function AdminApp({ standalone = false }: AdminAppProps) {
//   if (standalone) {
//     //  Khi chạy riêng module admin (vd: pnpm run dev trong /admin)
//     return <RouterProvider router={router} />;
//   }

//   // Khi được mount bởi app host (home)
//   return (
//     <Routes>
//       {adminRoutes.map((route) => (
//         <Route key={route.path} path={route.path} element={route.element} />
//       ))}
//     </Routes>
//   );
// }


// import { createBrowserRouter, RouterProvider, Routes, Route } from "react-router-dom";
// import AdminSidebar from "../components/Adminsidebar";
// import AdminAccounts from "../pages/AdminAccounts";

// type AdminAppProps = {
//   standalone?: boolean;
// };

// // ✅ Layout chung cho Admin (sidebar + content)
// function AdminLayout() {
//   return (
//     <div className="flex">
//       <AdminSidebar />
//       <div className="flex-1 min-h-screen bg-gray-100 p-4">
//         <Routes>
//           <Route path="accounts" element={<AdminAccounts />} />
//         </Routes>
//       </div>
//     </div>
//   );
// }

// // ✅ Router sử dụng khi chạy độc lập: pnpm dev trong folder /admin
// const standaloneRouter = createBrowserRouter(
//   [
//     {
//       path: "/",
//       element: <AdminLayout />,
//       children: [
//         { path: "accounts", element: <AdminAccounts /> },
//       ],
//     },
//   ],
//   {
//     basename: "/admin", // ✅ Quan trọng để http://localhost:3002/admin hoạt động
//   }
// );

// // ✅ Component chính của Admin micro-frontend
// export default function AdminApp({ standalone = false }: AdminAppProps) {
//   if (standalone) {
//     // ✅ Chạy độc lập
//     return <RouterProvider router={standaloneRouter} />;
//   }

//   // ✅ Khi chạy trong host (home)
//   return <AdminLayout />;
// }

import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import AdminSidebar from "../components/Adminsidebar";
import AdminAccounts from "../pages/AdminAccounts";
import AdminChapters from "../pages/AdminChapters";

type AdminAppProps = {
  standalone?: boolean;
};

// ✅ Layout chung cho Admin
function AdminLayout() {
  return (
    <div className="flex">
      <AdminSidebar />

      {/* ✅ THÊM ml-[360px] để tránh bị che */}
      <div className="flex-1 min-h-screen bg-gray-100 p-4 ml-[280px]">
        <Outlet />
      </div>
    </div>
  );
}


// ✅ Router khi chạy standalone (pnpm run dev tại /admin)
const standaloneRouter = createBrowserRouter(
  [
    {
      path: "/admin",  // đường dẫn gốc khi standalone
      element: <AdminLayout />,
      children: [
        { path: "accounts", element: <AdminAccounts /> },
        { path: "chapters", element: <AdminChapters /> },
      ],
    },
  ],
  {
    basename: "/", 
  }
);

// ✅ Khi chạy trong host
export default function AdminApp({ standalone = false }: AdminAppProps) {
  if (standalone) {
    return <RouterProvider router={standaloneRouter} />;
  }

  return <AdminLayout />;
}

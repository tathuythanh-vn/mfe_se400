import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
  Navigate,
} from 'react-router-dom';
import MainLayout from 'home/MainLayout';
import News from '../pages/News';
import MemberDocument from '../pages/MemberDocument';
import MyEvents from '../pages/MyEvents';
import '../App.css';

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

const router = createBrowserRouter(memberRoutes, {
  basename: '/member',
});

type MemberAppProps = {
  standalone?: boolean;
};

export default function MemberApp({ standalone = false }: MemberAppProps) {
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
        {memberRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </MainLayout>
  );
}

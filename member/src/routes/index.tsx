import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import App from '../App';
import News from '../pages/news';
import MemberDocument from '../pages/MemberDocument';

const memberRoutes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: 'news',
    element: <News />,
  },
  {
    path: 'documents',
    element: <MemberDocument />,
  },
];

const router = createBrowserRouter(memberRoutes, {
  basename: '/member',
});

type MemberAppProps = {
  standalone?: boolean;
};

export default function AuthApp({ standalone = false }: MemberAppProps) {
  if (standalone) {
    return <RouterProvider router={router} />;
  }

  return (
    <Routes>
      {memberRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

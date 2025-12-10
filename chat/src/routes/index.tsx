import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import Chat from '../pages/Chat';
import '../App.css';
import MainLayout from 'home/MainLayout';

const chatRoutes = [
  {
    path: '/',
    element: <Chat />,
  },
];

// Router
const router = createBrowserRouter(chatRoutes, {
  basename: '/chat',
});

type ChatAppProps = {
  standalone?: boolean;
};

export default function ChatApp({ standalone = false }: ChatAppProps) {
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
        {chatRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </MainLayout>
  );
}

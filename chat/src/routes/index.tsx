import {
  createBrowserRouter,
  Route,
  RouterProvider,
  Routes,
} from 'react-router-dom';
import Chat from '../pages/Chat';
import '../App.css';

import { Provider } from 'react-redux';
import MainLayout from 'home/MainLayout';
import { store } from 'home/store';

const chatRoutes = [
  {
    path: '/',
    element: <Chat />,
  },
];

// Router standalone
const standaloneRouter = createBrowserRouter([
  {
    path: '/chat/*',
    element: (
      <Provider store={store}>
        <Routes>
          {chatRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.element} />
          ))}
        </Routes>
      </Provider>
    ),
  },
]);

type ChatAppProps = {
  standalone?: boolean;
};

export default function ChatApp({ standalone = false }: ChatAppProps) {
  if (standalone) {
    return <RouterProvider router={standaloneRouter} />;
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

import type { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';
import Chatbot from './Chatbot';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex">
      {/* Side nav */}
      <Sidebar />
      <div className="basis-2/3 grow">
        {children}
        {/* Add AI chatbox to the right corner */}
        <Chatbot />
      </div>
    </div>
  );
};

export default MainLayout;

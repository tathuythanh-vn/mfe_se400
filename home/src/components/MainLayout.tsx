import type { ReactNode } from 'react';
import Sidebar from './sidebar/Sidebar';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex">
      {/* Side nav */}
      <Sidebar />
      <div className="basis-2/3 grow">{children}</div>
    </div>
  );
};

export default MainLayout;

import LogoSection from './LogoSection';
import NavSection from './NavSection';
import UserSection from './UserSection';

const Sidebar = () => {
  return (
    <aside
      className={`flex flex-col justify-between top-0 left-0 h-svh min-w-60 max-w-96 bg-sidebar z-10 px-6 basis-1/3`}
    >
      {/* Logo Section */}
      <LogoSection />

      {/* Nav Section */}
      <NavSection />

      {/* User Section */}
      <UserSection />
    </aside>
  );
};

export default Sidebar;

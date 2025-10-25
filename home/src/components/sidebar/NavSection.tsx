import {
  adminNavList,
  managerNavList,
  memberNavList,
  ROLE,
} from '../../constants/nav-items';
import { NavLink } from 'react-router-dom';
import { useGetProfileQuery } from '../../stores';

const NavSection = () => {
  const { data } = useGetProfileQuery();
  const role = data?.data?.role;

  // if (isLoading || !role) {
  //   // You can replace this with a spinner or skeleton if desired
  //   return null;
  // }

  let navList;
  switch (role) {
    case ROLE.ADMIN:
      navList = adminNavList;
      break;
    case ROLE.MANAGER:
      navList = managerNavList;
      break;
    case ROLE.MEMBER:
    default:
      navList = memberNavList;
      break;
  }

  return (
    <ul className="gap-2 grow-1">
      {navList.map((item) => (
        <li key={item.route}>
          <NavLink
            to={item.route}
            className={({ isActive }) =>
              `cursor-pointer hover:bg-sidebar-hover rounded transition block p-4 text-white my-2 ${
                isActive ? 'bg-sidebar-hover' : ''
              }`
            }
          >
            <p>{item.navLabel}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavSection;

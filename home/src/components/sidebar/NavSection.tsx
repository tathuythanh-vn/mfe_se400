import { useState } from 'react';
import {
  adminNavList,
  managerNavList,
  memberNavList,
  ROLE,
} from '../../constants/nav-items';
import { NavLink } from 'react-router-dom';
import { useGetProfileQuery } from '../../stores';

const NavSection = () => {
  const { data, isLoading } = useGetProfileQuery();
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
        <li
          key={item.route}
          className="cursor-pointer hover:bg-sidebar-hover p-2 rounded transition"
        >
          <NavLink to={item.route}>
            <p className="text-white">{item.navLabel}</p>
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default NavSection;

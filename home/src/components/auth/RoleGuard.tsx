import type { ReactNode } from 'react';
import type { ROLE } from '../../constants/nav-items';
import { useGetProfileQuery } from '../../stores';

interface RoleGuardProps {
  children: ReactNode;
  roles: ROLE[];
}

const RoleGuard = ({ children, roles }: RoleGuardProps) => {
  const { data, isLoading } = useGetProfileQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If no profile or no role, deny access
  const userRole = data?.data?.role;
  if (!userRole) {
    return <div>Not Authenticated</div>;
  }

  // Only allow if user's role is in the allowed roles
  if (!roles.includes(userRole)) {
    return <div>Not Authorized</div>;
  }

  return <>{children}</>;
};

export default RoleGuard;

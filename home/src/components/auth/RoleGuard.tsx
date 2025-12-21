import { useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ROLE } from '../../constants/nav-items';
import { useGetProfileQuery } from '../../stores';
import { Loading } from '../../pages';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  children: ReactNode;
  roles: ROLE[];
}

const RoleGuard = ({ children, roles }: RoleGuardProps) => {
  const { data, isLoading, isError } = useGetProfileQuery();
  const navigate = useNavigate();

  const userRole = data?.data?.role;
  const isUnauthenticated = !userRole || isError;

  // Handle navigation in useEffect (proper side effect handling)
  useEffect(() => {
    if (!isLoading && isUnauthenticated) {
      navigate('/auth/login', { replace: true });
    }
  }, [isLoading, isUnauthenticated, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  // Return null while redirecting to prevent content flash
  if (!isLoading && isUnauthenticated) {
    navigate('/auth/login', { replace: true });
    return null;
  }

  // Only allow if user's role is in the allowed roles (Unauthorized)
  if (!isLoading && (!userRole || !roles.includes(userRole))) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600 mb-6">
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên nếu bạn nghĩ đây là lỗi.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default RoleGuard;

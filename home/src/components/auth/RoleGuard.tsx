import { useEffect, useLayoutEffect, type ReactNode } from 'react';
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
  const { data, isLoading, isError, error, isSuccess } = useGetProfileQuery();
  const navigate = useNavigate();

  const userRole = data?.data?.role;

  useLayoutEffect(() => {
    // Only redirect if we're certain the user is unauthenticated
    // Don't redirect on initial load or temporary errors
    if (!isLoading && isError) {
      // Check if it's actually an auth error (401/403)
      const errorStatus = (error as any)?.status;
      if (errorStatus === 401 || errorStatus === 403) {
        navigate('/auth/login', { replace: true });
      }
    }
  }, [isLoading, isError, error, navigate]);

  // Show loading while fetching profile
  if (isLoading) {
    return <Loading />;
  }

  // If there's an auth error, show nothing while redirecting
  if (isError) {
    const errorStatus = (error as any)?.status;
    if (errorStatus === 401 || errorStatus === 403) {
      return null;
    }
    // For other errors, show error message
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <ShieldAlert className="w-24 h-24 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Đã xảy ra lỗi
          </h2>
          <p className="text-gray-600 mb-6">
            Không thể tải thông tin người dùng. Vui lòng thử lại.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Tải lại trang
          </button>
        </div>
      </div>
    );
  }

  // Check role authorization
  if (userRole && !roles.includes(userRole) && !isSuccess) {
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

  // If we have valid user data and correct role, show children
  return <>{children}</>;
};

export default RoleGuard;

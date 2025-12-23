import { useState } from 'react';
import { Bell, Dot, LogOut, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import {
  useGetProfileQuery,
  useGetNotificationsQuery,
  useUpdateNotificationsStatusMutation,
  type Notification,
} from '../../stores';
import AccountDetails from './AccountDetails/AccountDetails';
import avatarDefault from '../../assets/avatar.png';

export default function UserSection() {
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const navigate = useNavigate();

  // Fetch user profile
  const { data: userResponse } = useGetProfileQuery();
  const user = userResponse?.data;

  // Fetch notifications
  const { data: notificationsResponse } = useGetNotificationsQuery();
  const [updateNotificationsStatus] = useUpdateNotificationsStatusMutation();

  const notifications = notificationsResponse?.data || [];
  const unreadCount = notifications.filter(
    (item) => item.status === 'unread',
  ).length;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleClickNotification = async (item: Notification) => {
    // Handle notification click
    markNotificationsAsRead([item]);
    setShowNotifications(false);
    navigate('/admin/accounts?status=pending');
  };

  const markNotificationsAsRead = async (items: Notification[]) => {
    if (unreadCount === 0) return;

    try {
      await updateNotificationsStatus(items).unwrap();
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      toast.error('Không thể cập nhật trạng thái thông báo');
    }
  };

  return (
    <>
      <hr className="block border border-white w-full mx-auto" />
      <div className="flex flex-row p-[15px] justify-start items-center gap-0.5 h-[60px] rounded-t-lg my-2">
        {/* Profile Section */}
        <div
          className="flex flex-row justify-start items-center gap-2.5 relative cursor-pointer p-1.5 hover:bg-(--weight-blue) hover:rounded-lg"
          onClick={() => setShowProfileOptions((prev) => !prev)}
        >
          <img
            src={user?.avatar?.path || avatarDefault}
            alt="avatar"
            className="w-10 aspect-square rounded-full"
          />
          <p className="text-white w-40 font-bold">{user?.fullname}</p>

          {/* Profile Options Dropdown */}
          {showProfileOptions && (
            <div className="absolute bottom-[110%] w-full flex flex-col justify-around bg-white rounded-lg">
              <button
                onClick={() => setOpenProfile(true)}
                className="flex gap-2.5 p-2.5 text-(--dark-blue) rounded-lg cursor-pointer hover:bg-(--light-blue) hover:text-(--dark-blue) border-none bg-transparent"
              >
                <User size={20} />
                <span>Trang cá nhân</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex gap-2.5 p-2.5 text-(--dark-blue) rounded-lg cursor-pointer hover:bg-(--light-blue) hover:text-(--dark-blue) border-none bg-transparent"
              >
                <LogOut size={20} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>

        {/* Notification Section */}
        <div
          className="relative p-1.5 cursor-pointer"
          onClick={() => {
            setShowNotifications((prev) => !prev);
          }}
        >
          <Bell size={24} color="white" />

          {/* Notification Badge */}
          {unreadCount > 0 && (
            <div className="absolute bottom-[60%] left-[40%] border-2 border-solid border-(--normal-blue) bg-red-600 aspect-square w-[30px] rounded-full flex justify-center items-center cursor-pointer">
              <p className="p-0.5 text-white font-bold text-center text-sm">
                {unreadCount}
              </p>
            </div>
          )}

          {/* Notification List */}
          {showNotifications && (
            <>
              <div className="absolute w-[600px] bottom-full left-full rounded-lg bg-stone-100 shadow-md">
                <div className="flex items-center gap-4 bg-sidebar-hover p-3">
                  <Bell size={24} color="yellow" fill="yellow" />
                  <span className="text-white text-lg font-bold">
                    Yêu cầu phê duyệt
                  </span>
                </div>

                {notifications.length === 0 ? (
                  <div className="rounded-lg p-2.5 cursor-pointer">
                    <p className="text-(--dark-blue)">Không có thông báo mới</p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleClickNotification(item)}
                      className={`flex justify-between items-center p-2 px-4 cursor-pointer hover:bg-gray-400  ${item.status === 'unread' ? 'bg-transparent' : 'bg-gray-300'}`}
                    >
                      <p
                        style={{
                          fontWeight:
                            item.status === 'unread' ? 'bold' : 'normal',
                        }}
                      >
                        {item.text}
                      </p>
                      {item.status === 'unread' && (
                        <div className="rounded-full bg-blue-500 w-2 h-2" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* Profile Modal */}
        {openProfile && user && (
          <div className="absolute w-screen h-screen top-0 left-0 z-100 flex">
            <AccountDetails
              id={user._id}
              open={setOpenProfile}
              profile={true}
            />
          </div>
        )}
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { IoNotificationsOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

import logoDoan from "../assests/huyhieudoan.png";
import avatarDefault from "../assests/avatar.png";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [openInfo, setOpenInfo] = useState(false);
  const [me, setMe] = useState<any>({});

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/auth`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const data = await res.json();
        setMe(data.data);
      } catch (err) {
        console.error("fetchMe error:", err);
      }
    };

    fetchMe();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:5000/api/auth/logout`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      navigate("/auth/login");
    } catch (err) {
      console.error("logout error:", err);
    }
  };

  return (
    <div className="w-[360px] fixed h-screen bg-[#073763] flex flex-col justify-between shadow-xl">
      {/* TOP SECTION */}
      <div className="p-6 flex flex-col gap-14">
        {/* LOGO */}
        <div className="flex flex-col justify-center items-center gap-3">
          <img
            src={logoDoan}
            alt="Huy hiệu Đoàn Thanh Niên"
            className="h-[120px] w-[120px] drop-shadow-lg"
          />
          <p className="text-white font-bold text-center text-xl leading-tight">
            HỆ THỐNG HỖ TRỢ <br />
            NGHIỆP VỤ CÔNG TÁC ĐOÀN
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col text-white text-lg">
          {[
            { to: "/admin/accounts", label: "Danh sách tài khoản" },
            { to: "/admin/chapters", label: "Danh sách chi đoàn" },
            { to: "/admin/request-accounts", label: "Yêu cầu phê duyệt" },
          ].map((item) => (
            <NavLink
  key={item.to}
  to={item.to}
  className={({ isActive }: { isActive: boolean; isPending: boolean }) =>
    `h-[70px] border-b border-white/40 flex items-center pl-10 transition-all 
      ${isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"}`
  }
>
  {item.label}
</NavLink>

          ))}
        </nav>
      </div>

      {/* PROFILE SECTION */}
      <div className="bg-[#3d85c6] px-6 py-4 rounded-t-2xl flex items-center justify-between relative">
        {/* Profile + Dropdown */}
        <div
          className="flex items-center gap-4 cursor-pointer relative"
          onClick={() => setOpenInfo((prev) => !prev)}
        >
          <img
            src={me.avatar || avatarDefault}
            alt="Avatar"
            className="h-[55px] w-[55px] rounded-full border border-white shadow-md"
          />

          <p className="text-white font-semibold max-w-[160px] truncate">
            {me.fullname}
          </p>

          {openInfo && (
            <div className="absolute bottom-[115%] left-0 w-[180px] bg-white shadow-lg rounded-xl py-2 animate-fade-in">
              <button
                className="px-4 py-2 w-full text-left hover:bg-gray-100"
                onClick={() => navigate("/admin/profile")}
              >
                Hồ sơ cá nhân
              </button>

              <button
                className="px-4 py-2 w-full text-left hover:bg-gray-100"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          <button aria-label="Tin nhắn">
            <FaRegMessage size={26} className="text-white hover:scale-110 transition" />
          </button>

          <button aria-label="Thông báo">
            <IoNotificationsOutline
              size={30}
              className="text-white hover:scale-110 transition"
            />
          </button>
        </div>
      </div>
    </div>
  );
}


import React, { useState } from "react";
import {
  TbSquareRoundedChevronsLeftFilled,
  TbSquareRoundedChevronsRightFilled,
} from "react-icons/tb";

import avatar from "../assests/avatar.png";
import RequestAccountDetails from "../components/RequestAccountDetails";

// 👉 Import RTK Query hook
import { useGetAccountsInPageQuery } from "home/store";

export default function RequestAccounts() {
  const fields = [
    { flex: 1, label: "STT" },
    { flex: 3, label: "Họ và tên" },
    { flex: 3, label: "Email" },
    { flex: 2, label: "Số điện thoại" },
    { flex: 2, label: "Vai trò" },
    { flex: 2, label: "Trạng thái" },
  ];

  const [id, setId] = useState("");
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  //  RTK Query hook
  const { data: apiData, isLoading, isError } = useGetAccountsInPageQuery({
    page: currentPage,
    limit: 7,
    search,
    status: "pending",
    role: role === "all" ? undefined : role,
    sortBy: "createdAt",
    sortOrder: "asc",
  });

  const data = apiData?.data?.accounts || [];
  const totalPages = apiData?.data?.pagination?.totalPages || 1;

  return (
    <div className="w-full h-full flex flex-col items-center p-5 gap-10 box-border">
      {/* TOOLBAR */}
      <div className="w-full max-w-6xl grid grid-cols-4 gap-4 text-blue-800">
        {/* Search */}
        <div className="flex flex-col col-span-2">
          <label className="font-semibold mb-1">Tìm kiếm</label>
          <input
            type="search"
            placeholder="Tìm kiếm theo họ tên, email, số điện thoại"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="border-2 border-blue-800 rounded-lg px-3 py-3 text-blue-800 outline-none"
          />
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Vai trò</label>
          <select
            title="Vai trò"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setCurrentPage(1);
            }}
            className="border-2 border-blue-800 rounded-lg px-3 py-3 text-blue-800 outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="member">Đoàn viên</option>
            <option value="manager">Quản lý</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="w-full max-w-6xl border border-gray-300 rounded-t-xl">
        {/* Header */}
        <div className="flex bg-blue-800 text-white font-bold py-3 px-4 rounded-t-xl">
          {fields.map((h, i) => (
            <div key={i} className="flex items-center" style={{ flex: h.flex }}>
              {h.label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="w-full">
          {isLoading ? (
            <p className="text-center py-10 text-gray-600">Đang tải dữ liệu...</p>
          ) : isError ? (
            <p className="text-center py-10 text-red-600">Lỗi khi tải dữ liệu</p>
          ) : data.length === 0 ? (
            <p className="text-center py-10 text-gray-600">Không có dữ liệu</p>
          ) : (
            data.map((item: any, index: number) => {
              const avatarSrc = item.avatar || avatar;

              return (
                <div
                  key={item._id}
                  className="flex px-4 py-4 border-b hover:bg-blue-50 cursor-pointer items-center"
                  onClick={() => {
                    setId(item._id);
                    setOpen(true);
                  }}
                >
                  {/* STT */}
                  <div className="flex justify-center" style={{ flex: fields[0].flex }}>
                    {index + 1 + (currentPage - 1) * 7}
                  </div>

                  {/* Họ tên */}
                  <div className="flex items-center gap-3" style={{ flex: fields[1].flex }}>
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p>{item.fullname}</p>
                  </div>

                  {/* Email */}
                  <div style={{ flex: fields[2].flex }}>{item.email}</div>

                  {/* Phone */}
                  <div style={{ flex: fields[3].flex }}>{item.phone}</div>

                  {/* Role */}
                  <div style={{ flex: fields[4].flex }}>
                    {item.role === "member" && "Đoàn viên"}
                    {item.role === "manager" && "Quản lý chi đoàn"}
                    {item.role === "admin" && "Quản trị viên"}
                  </div>

                  {/* Status */}
                  <div className="font-medium flex items-center" style={{ flex: fields[5].flex }}>
                    <span className="w-3 h-3 rounded-full mr-2 bg-yellow-500"></span>
                    Chờ phê duyệt
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-5">
        <TbSquareRoundedChevronsLeftFilled
          size={40}
          className={`cursor-pointer ${currentPage === 1 ? "opacity-40 cursor-default" : ""} text-blue-800`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />

        <div className="flex gap-3">
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            return (
              <div
                key={page}
                onClick={() => setCurrentPage(page)}
                onMouseEnter={() => setHoveredPage(page)}
                onMouseLeave={() => setHoveredPage(null)}
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
                  ${page === currentPage
                    ? "bg-blue-300 text-blue-900 font-bold"
                    : "bg-blue-800 text-white hover:bg-blue-300 hover:text-blue-900"
                  }`}
              >
                {page}
              </div>
            );
          })}
        </div>

        <TbSquareRoundedChevronsRightFilled
          size={40}
          className={`cursor-pointer ${currentPage === totalPages ? "opacity-40 cursor-default" : ""} text-blue-800`}
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
        />

        {open && <RequestAccountDetails id={id} setOpen={setOpen} />}
      </div>
    </div>
  );
}

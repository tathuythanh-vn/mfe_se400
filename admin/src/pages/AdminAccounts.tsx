// import React from "react";

// const AdminAccounts: React.FC = () => {
//   return (
//     <div style={{ padding: "20px" }}>
//       <h1>Quản lý tài khoản</h1>
//       <p>Đây là trang /admin/accounts</p>
//     </div>
//   );
// };

// export default AdminAccounts;

import React, { useEffect, useState } from "react";
import avatar from "../assests/avatar.png";
import Pagination from "../components/Pagination";
//import AccountDetails from "../components/AccountDetails";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";

export default function AdminAccounts() {
  const fields = [
    { flex: 1, field: "STT" },
    { flex: 4, field: "Họ và tên" },
    { flex: 4, field: "Email" },
    { flex: 2, field: "Vai trò" },
    { flex: 2, field: "Trạng thái" },
  ];

  const mapFields: Record<string, string> = {
    admin: "Quản trị viên",
    manager: "Quản lý chi đoàn",
    member: "Đoàn viên",
    active: "Hoạt động",
    locked: "Khóa",
    pending: "Chờ duyệt",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [accountId, setAccountId] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let retryInterval: any = null;
    let timeout: any = null;
    let isMounted = true;

    const fetchAccounts = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_APP_SERVER_URL}/api/accounts?page=${currentPage}&limit=6&search=${search}&role=${role}&status=${status}`,
          { signal: controller.signal }
        );
        const result = await res.json();

        if (isMounted && result.data?.accounts?.length > 0) {
          clearInterval(retryInterval);
          clearTimeout(timeout);
          setData(result.data.accounts);
          setTotalPages(result.data.totalPages);
          setLoading(false);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") console.error(err);
      }
    };

    setLoading(true);
    fetchAccounts();

    retryInterval = setInterval(fetchAccounts, 5000);
    timeout = setTimeout(() => {
      clearInterval(retryInterval);
      setLoading(false);
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(retryInterval);
      clearTimeout(timeout);
      controller.abort();
    };
  }, [search, currentPage, role, status, openDetails]);

  return (
    <div className="w-full h-full flex flex-col items-center p-5 gap-10 box-border">
      {/* Toolbar */}
      <div className="flex w-4/5 gap-5">
        <div className="flex flex-col w-full gap-1">
          <label className="text-blue-800 font-semibold">Tìm kiếm</label>
          <input
            className="h-12 border-2 border-blue-700 rounded-lg px-3 text-blue-700"
            type="search"
            placeholder="Tìm kiếm theo họ tên, email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col w-full gap-1">
  <label htmlFor="roleSelect" className="text-blue-800 font-semibold">
    Vai trò
  </label>

  <select
    id="roleSelect"
    className="h-12 border-2 border-blue-700 rounded-lg px-3 text-blue-700"
    value={role}
    onChange={(e) => setRole(e.target.value)}
  >
    <option value="">Tất cả</option>
    <option value="admin">Quản trị viên</option>
    <option value="manager">Quản lý chi đoàn</option>
    <option value="member">Đoàn viên</option>
  </select>
</div>


        <div className="flex flex-col w-full gap-1">
  <label
    htmlFor="filterStatus"
    className="text-blue-800 font-semibold"
  >
    Trạng thái
  </label>

  <select
    id="filterStatus"
    className="h-12 border-2 border-blue-700 rounded-lg px-3 text-blue-700"
    value={status}
    onChange={(e) => setStatus(e.target.value)}
  >
    <option value="">Tất cả</option>
    <option value="active">Hoạt động</option>
    <option value="locked">Khóa</option>
    <option value="pending">Chờ duyệt</option>
  </select>
</div>
</div> 


      {/* Table */}
      <div className="w-4/5 border rounded-lg overflow-hidden">
        <div className="flex bg-blue-800 text-white font-bold p-4">
          {fields.map((item, index) => (
            <div key={index} style={{ flex: item.flex }} className="text-left">
              {item.field}
            </div>
          ))}
        </div>

        <div>
          {loading ? (
            <div className="flex flex-col items-center p-10 text-gray-600 text-lg gap-3">
              <ClipLoader size={50} color="#36d7b7" />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center p-10 text-gray-600 text-lg">
              Không có dữ liệu
            </div>
          ) : (
            data.map((item, index) => (
              <div
                key={item._id}
                className="flex p-4 border-b hover:bg-blue-100 cursor-pointer items-center"
                onClick={() => {
                  setAccountId(item._id);
                  setOpenDetails(true);
                }}
              >
                <div style={{ flex: fields[0].flex }} className="text-center pr-10">
                  {index + 1 + (currentPage - 1) * 6}
                </div>

                <div style={{ flex: fields[1].flex }} className="flex items-center gap-3 px-4">
<img
  src={item.avatar?.path || avatar}
  alt={item.fullname ? `Ảnh đại diện của ${item.fullname}` : "Avatar"}
  className="w-12 h-12 rounded-full"
/>
                  <p>{item.fullname}</p>
                </div>

                <div style={{ flex: fields[2].flex }}>
                  {item.email}
                </div>

                <div style={{ flex: fields[3].flex }}>
                  {mapFields[item.role]}
                </div>

                <div style={{ flex: fields[4].flex }}>
                  <p className="flex items-center gap-2" style={{ color: item.status === "active" ? "green" : item.status === "locked" ? "red" : "#ff8f00" }}>
                    <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.status === "active" ? "green" : item.status === "locked" ? "red" : "#ff8f00" }}></span>
                    {mapFields[item.status]}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div>
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>

      {/* {openDetails && <AccountDetails id={accountId} open={setOpenDetails} />} */}
    </div>
  );
}
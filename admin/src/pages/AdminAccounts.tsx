import React, { useEffect, useState } from "react";
import avatar from "../assests/avatar.png";
import Pagination from "../components/Pagination";
import ClipLoader from "react-spinners/ClipLoader";
import AccountDetails from "../components/AccountDetails";

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

  // ✅ Đọc API từ biến môi trường Rsbuild
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

const [selectedId, setSelectedId] = useState<string | null>(null);
const [openDetails, setOpenDetails] = useState(false);


  useEffect(() => {
    if (!API_URL) {
      console.error("Lỗi: VITE_BACKEND_URL không tồn tại!");
      return;
    }

    const controller = new AbortController();

    const fetchAccounts = async () => {
      setLoading(true);

      try {
        const url = `${API_URL}/accounts?page=${currentPage}&limit=6&search=${search}&role=${role}&status=${status}`;
        console.log("Fetching:", url);

        const res = await fetch(url, { signal: controller.signal });

        // Nếu server trả về HTML => báo lỗi (không thể parse JSON)
        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          console.error("Server trả về HTML, không phải JSON:", url);
          setLoading(false);
          return;
        }

        const result = await res.json();

        if (result.success && result.data?.accounts) {
          setData(result.data.accounts);
          setTotalPages(result.data.totalPages);
        } else {
          setData([]);
        }
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Fetch error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();

    return () => controller.abort();
  }, [API_URL, currentPage, search, role, status]);

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
          <label htmlFor="filterStatus" className="text-blue-800 font-semibold">
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
    setSelectedId(item._id);
    setOpenDetails(true);
  }}
>
                <div style={{ flex: fields[0].flex }} className="text-center pr-10">
                  {index + 1 + (currentPage - 1) * 6}
                </div>

                <div style={{ flex: fields[1].flex }} className="flex items-center gap-3 px-4">
                  <img
                    src={item.avatar?.path || avatar}
                    alt={item.fullname || "Avatar"}
                    className="w-12 h-12 rounded-full"
                  />
                  <p>{item.fullname}</p>
                </div>

                <div style={{ flex: fields[2].flex }}>{item.email}</div>
                <div style={{ flex: fields[3].flex }}>{mapFields[item.role]}</div>

                <div style={{ flex: fields[4].flex }}>
                  <p
                    className="flex items-center gap-2"
                    style={{
                      color:
                        item.status === "active"
                          ? "green"
                          : item.status === "locked"
                          ? "red"
                          : "#ff8f00",
                    }}
                  >
                    <span
                      className="inline-block w-3 h-3 rounded-full"
                      style={{
                        backgroundColor:
                          item.status === "active"
                            ? "green"
                            : item.status === "locked"
                            ? "red"
                            : "#ff8f00",
                      }}
                    ></span>
                    {mapFields[item.status]}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

{openDetails && selectedId && (
  <AccountDetails
    id={selectedId}
    setOpen={setOpenDetails}   // ⬅️ truyền đúng props modal cần
  />
)}
    </div>
  );
}

import { useState } from "react";
import Pagination from "../components/Pagination";
import AddEvent from "../components/AddEvent";
import EventDetails from "../components/EventDetails";
import ClipLoader from "react-spinners/ClipLoader";
import { IoAddCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGetEventsInPageQuery } from "home/store";

interface Event {
  _id: string;
  name: string;
  location: string;
  startedAt: string;
  scope: "public" | "chapter";
  status: "completed" | "doing" | "pending" | "canceled";
}

export default function Events() {
  const fields = [
    { flex: 1, field: "STT" },
    { flex: 4, field: "Tên sự kiện" },
    { flex: 4, field: "Địa điểm" },
    { flex: 2, field: "Ngày bắt đầu" },
    { flex: 2, field: "Quy mô" },
    { flex: 2, field: "Trạng thái" },
  ];

  const mapFields: Record<string, string> = {
    completed: "Hoàn thành",
    doing: "Đang diễn ra",
    pending: "Sắp diễn ra",
    canceled: "Đã hủy",
    public: "Công khai",
    chapter: "Chi đoàn",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState<"" | "public" | "chapter">("");
  const [status, setStatus] = useState<"" | "completed" | "doing" | "pending" | "canceled">("");
  const [openAdd, setOpenAdd] = useState(false);
  const [id, setId] = useState("");
  const [openDetails, setOpenDetails] = useState(false);

  // 🔹 RTK Query hook
  const { data: response, isLoading, isError } = useGetEventsInPageQuery({
    page: currentPage,
    limit: 6,
    search,
    scope,
    status,
  });

  const data = response?.data || [];
  const totalPages = response?.totalPages || 1;

  const getStatusColor = (status: Event["status"]) => {
    switch (status) {
      case "completed": return "green";
      case "canceled": return "red";
      default: return "yellow";
    }
  };

  if (isError) toast.error("Không thể tải danh sách sự kiện");

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-10">
      {/* Toolbar */}
      <div className="flex w-[90%] gap-5">
        {/* Search */}
        <div className="flex flex-col flex-[2] gap-2">
          <label htmlFor="search" className="text-blue-600 font-semibold">Tìm kiếm</label>
          <input
            id="search"
            type="search"
            placeholder="Tìm theo tên, địa điểm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-blue-600 text-blue-600 rounded-lg px-3 py-3 outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Scope */}
        <div className="flex flex-col flex-1 gap-2">
          <label htmlFor="scope" className="text-blue-600 font-semibold">Quy mô</label>
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value as typeof scope)}
            className="border-2 border-blue-600 text-blue-600 rounded-lg px-3 py-3 outline-none"
          >
            <option value="">Tất cả</option>
            <option value="public">Công khai</option>
            <option value="chapter">Chi đoàn</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col flex-1 gap-2">
          <label htmlFor="status" className="text-blue-600 font-semibold">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="border-2 border-blue-600 text-blue-600 rounded-lg px-3 py-3 outline-none"
          >
            <option value="">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="doing">Đang diễn ra</option>
            <option value="pending">Sắp diễn ra</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </div>

        {/* Add button */}
        <div
          className="flex flex-1 justify-end items-end cursor-pointer hover:scale-105 active:scale-95 transition"
          onClick={() => setOpenAdd(true)}
        >
          <IoAddCircle size={60} color="#3c78d8" />
        </div>
      </div>

      {/* Table */}
      <div className="w-[90%] border border-gray-300 rounded-t-xl overflow-hidden">
        <div className="flex bg-blue-600 text-white font-semibold py-4 px-4 rounded-t-xl">
          {fields.map((item, idx) => (
            <div key={idx} style={{ flex: item.flex }} className="text-center text-sm">{item.field}</div>
          ))}
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col items-center py-10 text-gray-600">
              <ClipLoader color="#36d7b7" size={50} />
              <p className="mt-4">Đang tải dữ liệu...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-10 text-gray-600">Không có dữ liệu</div>
          ) : (
            data.map((item, index) => (
              <div
                key={item._id}
                onClick={() => { setId(item._id); setOpenDetails(true); }}
                className="flex items-center py-4 px-4 border-b border-gray-200 hover:bg-blue-50 active:bg-blue-100 cursor-pointer transition"
              >
                <div className="text-center flex-1">{index + 1 + (currentPage - 1) * 6}</div>
                <div className="flex-[4]">{item.name}</div>
                <div className="flex-[4]">{item.location}</div>
                <div className="flex-[2] text-center">{new Date(item.startedAt).toLocaleDateString("vi-VN")}</div>
                <div className="flex-[2] text-center">{mapFields[item.scope]}</div>
                <div className="flex-[2] text-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      getStatusColor(item.status) === "green"
                        ? "bg-green-600"
                        : getStatusColor(item.status) === "red"
                        ? "bg-red-600"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <span
                    className={
                      getStatusColor(item.status) === "green"
                        ? "text-green-600"
                        : getStatusColor(item.status) === "red"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {mapFields[item.status]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-4">
        <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
      </div>

      {/* Modals */}
      {openDetails && <EventDetails id={id} open={setOpenDetails} />}
      {openAdd && <AddEvent open={setOpenAdd} />}
    </div>
  );
}

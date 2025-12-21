import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import AddEvent from "../components/AddEvent";
import EventDetails from "../components/EventDetails";
// @ts-ignore - Module Federation remote
import { useGetEventsInPageQuery, Event } from "home/store";

const fields = [
  { flex: "w-1/12", label: "STT" },
  { flex: "w-4/12", label: "Tên sự kiện" },
  { flex: "w-4/12", label: "Địa điểm" },
  { flex: "w-2/12", label: "Ngày bắt đầu" },
  { flex: "w-2/12", label: "Quy mô" },
  { flex: "w-2/12", label: "Trạng thái" },
];

const scopeMap: Record<string, string> = {
  public: "Công khai",
  chapter: "Chi đoàn",
};

const statusMap: Record<string, string> = {
  completed: "Hoàn thành",
  happening: "Đang diễn ra",
  pending: "Sắp diễn ra",
  canceled: "Đã hủy",
};

const statusColor: Record<string, string> = {
  completed: "green",
  canceled: "red",
  happening: "#1e88e5",
  pending: "#ff8f00",
};

export default function Events() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("");
  const [status, setStatus] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const { data, isLoading, error } = useGetEventsInPageQuery({
    page: currentPage,
    limit: 6,
    search,
    scope,
    status,
  });

  if (error) toast.error("Không thể tải danh sách sự kiện");

  const events: Event[] = data?.data?.data ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-end gap-4">
        <div className="flex-2 flex flex-col">
          <label htmlFor="search" className="mb-1 font-semibold">
            Tìm kiếm
          </label>
          <input
            id="search"
            type="search"
            placeholder="Tìm theo tên, địa điểm..."
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label htmlFor="scope" className="mb-1 font-semibold">
            Quy mô
          </label>
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="public">Công khai</option>
            <option value="chapter">Chi đoàn</option>
          </select>
        </div>

        <div className="flex-1 flex flex-col">
          <label htmlFor="status" className="mb-1 font-semibold">
            Trạng thái
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="completed">Hoàn thành</option>
            <option value="happening">Đang diễn ra</option>
            <option value="pending">Sắp diễn ra</option>
            <option value="canceled">Đã hủy</option>
          </select>
        </div>

        <div className="flex-1 flex justify-end">
          <IoAddCircle
            size={60}
            color="#3c78d8"
            className="cursor-pointer"
            onClick={() => setOpenAdd(true)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded shadow overflow-hidden">
        {/* Header */}
        <div className="flex bg-gray-100">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className={`${field.flex} p-2 text-center font-semibold`}
            >
              {field.label}
            </div>
          ))}
        </div>

        {/* Content */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <ClipLoader color="#36d7b7" size={50} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            events.map((event: Event, idx: number) => (
              <div
                key={event._id}
                className="flex border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedId(event._id);
                  setOpenDetails(true);
                }}
              >
                <div className={`${fields[0].flex} p-2 text-center`}>
                  {idx + 1 + (currentPage - 1) * 6}
                </div>
                <div className={`${fields[1].flex} p-2`}>{event.name}</div>
                <div className={`${fields[2].flex} p-2`}>{event.location}</div>
                <div className={`${fields[3].flex} p-2 text-center`}>
                  {new Date(event.startedAt).toLocaleDateString("vi-VN")}
                </div>
                <div className={`${fields[4].flex} p-2 text-center`}>
                  {scopeMap[event.scope]}
                </div>
                <div
                  className={`${fields[5].flex} p-2 text-center flex items-center justify-center gap-2`}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColor[event.status] }}
                  ></span>
                  <span style={{ color: statusColor[event.status] }}>
                    {statusMap[event.status]}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* Modals */}
      {openDetails && selectedId && (
        <EventDetails id={selectedId} open={setOpenDetails} />
      )}

      {openAdd && <AddEvent open={setOpenAdd} />}
    </div>
  );
}

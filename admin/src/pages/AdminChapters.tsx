import { useState, useEffect } from "react";
import { IoAddCircle } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";

import Pagination from "../components/Pagination";
import ChapterDetails from "../components/ChapterDetails";
import AddChapter from "../components/AddChapter";

import avatar from "../assests/avatar.png";

// RTK QUERY
import { useGetChaptersInPageQuery } from "home/store";

export default function AdminChapters() {
  const fields = [
    { flex: 1, label: "STT" },
    { flex: 3, label: "Tên chi đoàn" },
    { flex: 3, label: "Đoàn trực thuộc" },
    { flex: 3, label: "Người quản lý" },
    { flex: 2, label: "Trạng thái" },
  ];

  const mapStatus: Record<string, string> = {
    active: "Hoạt động",
    locked: "Khóa",
    pending: "Chờ duyệt",
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [hadManager, setHadManager] = useState("");
  const [status, setStatus] = useState("");

  const [chapterId, setChapterId] = useState("");
  const [openDetails, setOpenDetails] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  /** ==================== FETCH WITH RTK QUERY ==================== **/
  const { data, isLoading, refetch } = useGetChaptersInPageQuery({
    page: currentPage,
    limit: 6,
    search,
    hadManager,
    status,
  });

  const chapters = data?.data?.result || [];
  const totalPages = data?.data?.totalPages || 1;

  // Tự refetch khi đóng popup Add hoặc Details
  useEffect(() => {
    refetch();
  }, [openAdd, openDetails]);

  /** =============================================================== **/

  return (
    <div className="w-full h-full flex flex-col items-center p-5 gap-10 box-border">

      {/* ==================== TOOLBAR ==================== */}
      <div className="w-full max-w-6xl grid grid-cols-4 gap-4 text-blue-800 ">

        {/* Search */}
        <div className="flex flex-col col-span-2">
          <label className="font-semibold text-blue-800 mb-1">Tìm kiếm</label>
          <input
            type="search"
            placeholder="Tìm kiếm theo tên chi đoàn, đoàn trực thuộc"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-2 border-blue-800 rounded-lg px-3 py-3 text-blue-800 outline-none"
          />
        </div>

        {/* Had Manager */}
        <div className="flex flex-col">
          <label className="font-semibold text-blue-800 mb-1">
            Tình trạng quản lý
          </label>

          <select
            id="hadManager"
            title="select"
            value={hadManager}
            onChange={(e) => setHadManager(e.target.value)}
            className="border-2 border-blue-800 rounded-lg px-3 py-3 text-blue-800 outline-none"
          >
            <option value="">Tất cả</option>
            <option value="true">Có quản lý</option>
            <option value="false">Chưa có quản lý</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col relative">
          <label className="font-semibold text-blue-800 mb-1">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-2 border-blue-800 rounded-lg px-3 py-3 text-blue-800 outline-none"
          >
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Khóa</option>
            <option value="pending">Chờ duyệt</option>
          </select>

          {/* Add Button */}
          <IoAddCircle
            onClick={() => setOpenAdd(true)}
            size={55}
            className="absolute right-[-70px] top-6 cursor-pointer text-blue-800 active:scale-95"
          />
        </div>
      </div>

      {/* ==================== TABLE ==================== */}
      <div className="w-full max-w-6xl border border-gray-300 rounded-t-xl">

        {/* Table Head */}
        <div className="flex bg-blue-800 text-white font-bold py-3 px-4 rounded-t-xl">
          {fields.map((item, idx) => (
            <div key={idx} className="flex-1" style={{ flex: item.flex }}>
              {item.label}
            </div>
          ))}
        </div>

        {/* Table Body */}
        <div className="w-full">
          {isLoading ? (
            <div className="text-center py-10 flex flex-col items-center gap-3">
              <ClipLoader size={45} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : chapters.length === 0 ? (
            <p className="text-center py-10 text-gray-600">Không có dữ liệu</p>
          ) : (
            chapters.map((item: any, index: number) => {
              const avatarSrc = item.avatar || avatar;

              return (
                <div
                  key={item._id}
                  onClick={() => {
                    setChapterId(item._id);
                    setOpenDetails(true);
                  }}
                  className="flex px-4 py-4 border-b hover:bg-blue-50 cursor-pointer items-center"
                >
                  {/* STT */}
                  <div className="flex justify-center" style={{ flex: fields[0].flex }}>
                    {index + 1 + (currentPage - 1) * 6}
                  </div>

                  {/* Tên chi đoàn */}
                  <div style={{ flex: fields[1].flex }}>{item.name}</div>

                  {/* Đoàn trực thuộc */}
                  <div style={{ flex: fields[2].flex }}>{item.affiliated}</div>

                  {/* Người quản lý */}
                  <div style={{ flex: fields[3].flex }}>
                    {item.fullname ? (
                      <div className="flex items-center gap-3">
                        <img
                          src={avatarSrc}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <p>{item.fullname}</p>
                      </div>
                    ) : (
                      <p>Không</p>
                    )}
                  </div>

                  {/* Trạng thái */}
                  <div style={{ flex: fields[4].flex }} className="flex items-center font-medium">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        item.status === "active"
                          ? "bg-green-500"
                          : item.status === "locked"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    ></span>
                    {mapStatus[item.status]}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ==================== PAGINATION ==================== */}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      {/* ==================== MODALS ==================== */}
      {openDetails && (
        <ChapterDetails id={chapterId} open={setOpenDetails} />
      )}

      {openAdd && <AddChapter open={setOpenAdd} />}
    </div>
  );
}

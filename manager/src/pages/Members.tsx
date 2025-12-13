import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import { IoAddCircle } from "react-icons/io5";

import Pagination from "../components/Pagination";
import avatarDefault from "../assets/avatar.png";

// @ts-ignore - Module Federation remote
import { useGetMembersInPageQuery } from "home/store";
import type { MemberInPage } from "../../../home/src/stores/interfaces/member";
import AccountDetail from "../components/AccountDetail";
import AddMember from "../components/AddMember";

/* =========================
   TABLE CONFIG
========================= */
const fields = [
  { flex: "w-1/12", label: "STT" },
  { flex: "w-4/12", label: "Họ và tên" },
  { flex: "w-4/12", label: "Số thẻ đoàn" },
  { flex: "w-2/12", label: "Chức vụ" },
  { flex: "w-2/12", label: "Trạng thái" },
];

const mapFields: Record<string, string> = {
  secretary: "Bí thư",
  deputy_secretary: "Phó Bí thư",
  committee_member: "Ủy viên BCH",
  member: "Đoàn viên",

  active: "Hoạt động",
  locked: "Khóa",
  pending: "Chờ duyệt",
};

const statusColors: Record<string, string> = {
  active: "green",
  locked: "red",
  pending: "#ff8f00",
};

/* =========================
   COMPONENT
========================= */
export default function Members() {
  const [openAdd, setOpenAdd] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  const statusMap: Record<string, string> = {
    active: "active",
    locked: "locked",
    pending: "pending",
  };

  const { data, isLoading, isError } = useGetMembersInPageQuery({
    page: currentPage,
    limit: 6,
    search,
    position,
    status: status ? statusMap[status] : undefined,
  });

  const members: MemberInPage[] = data?.data?.result ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  useEffect(() => {
    if (isError) {
      toast.error("Không thể tải danh sách đoàn viên");
    }
  }, [isError]);

  const handleOpenDetail = (id: string) => {
    setSelectedMemberId(id);
    setOpenDetail(true);
  };

  // Reset page khi search/filter thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search, position, status]);

  // Nếu currentPage > totalPages, reset về 1
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  return (
    <div className="p-6 space-y-6">
      {/* Toolbar */}
      <div className="flex gap-4 w-full items-end">
        {/* Search */}
        <div className="flex flex-col flex-2">
          <label className="mb-1 font-semibold text-blue-800">Tìm kiếm</label>
          <input
            type="search"
            placeholder="Tìm theo số thẻ đoàn"
            className="border-2 rounded-xl border-blue-800 rounded p-3 text-blue-800 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Position */}
        <div className="flex flex-col flex-1">
          <label className="mb-1 font-semibold text-blue-800">Chức vụ</label>
          <select
            title="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="border-2 border-blue-800 rounded-xl p-3 text-blue-800 outline-none"
          >
            <option value="">Tất cả</option>
            <option value="secretary">Bí thư</option>
            <option value="deputy_secretary">Phó Bí thư</option>
            <option value="committee_member">Ủy viên BCH</option>
            <option value="member">Đoàn viên</option>
          </select>
        </div>

        {/* Add Button
        <div className="flex items-center justify-center h-[52px]">
          <IoAddCircle
            size={50}
            className="cursor-pointer text-blue-800 hover:scale-105 transition-all"
            onClick={() => setOpenAdd(true)}
          />
        </div> */}
      </div>

      {/* Table */}
      <div className="border rounded shadow overflow-hidden w-full">
        {/* Header */}
        <div className="flex bg-blue-800 text-white font-semibold">
          {fields.map((field, idx) => (
            <div key={idx} className={`${field.flex} p-3 text-center`}>
              {field.label}
            </div>
          ))}
        </div>

        {/* Body */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center p-6">
              <ClipLoader size={50} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center p-6">Không có dữ liệu</div>
          ) : (
            members.map((member, idx) => (
              <div
                key={member._id}
                className="flex border-t hover:bg-blue-50 cursor-pointer p-3"
                onClick={() => handleOpenDetail(member._id)}
              >
                {/* STT */}
                <div className="w-1/12 text-center">
                  {idx + 1 + (currentPage - 1) * 6}
                </div>

                {/* Name */}
                <div className="w-4/12 flex items-center gap-3">
                  <img
                    src={member.avatar?.path || avatarDefault}
                    className="w-10 h-10 rounded-full object-cover"
                    alt="avatar"
                  />
                  <span>{member.fullname}</span>
                </div>

                {/* Card Code */}
                <div className="w-4/12">{member.cardCode}</div>

                {/* Position */}
                <div className="w-2/12">
                  {mapFields[member.position] ?? member.position}
                </div>

                {/* Status */}
                <div className="w-2/12 flex items-center justify-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: statusColors[member.status] }}
                  />
                  <span style={{ color: statusColors[member.status] }}>
                    {mapFields[member.status]}
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

      {/* Add Member Modal */}
      {openAdd && <AddMember setOpen={setOpenAdd} />}

      {/* Member Detail */}
      {openDetail && selectedMemberId && (
        <AccountDetail
          id={selectedMemberId}
          setOpen={() => setOpenDetail(false)}
        />
      )}
    </div>
  );
}

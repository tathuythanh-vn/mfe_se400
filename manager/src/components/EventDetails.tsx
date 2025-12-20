import { useEffect, useMemo, useState } from "react";
import {
  useGetEventByIdQuery,
  useUpdateEventByIdMutation,
  useListEventRegistrationsQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useHideCommentMutation, // @ts-ignore - Module Federation remote
} from "home/store";

import { IoCloseCircle } from "react-icons/io5";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import avatar from "../assets/avatar.png";
import AttendeeItem from "../components/AttendeeItem";

/* ===================== TYPES ===================== */

interface Props {
  id: string;
  open: (val: boolean) => void;
}

interface EventForm {
  name: string;
  status: string;
  location: string;
  description: string;
}

interface Registration {
  _id: string;
  fullname?: string;
  status: "registered" | "attended";
  memberOf?: {
    name: string;
  };
}

interface Comment {
  _id: string;
  text: string;
  status: string;
  accountId?: {
    fullname?: string;
    avatar?: {
      path?: string;
    };
  };
}

/* ===================== COMPONENT ===================== */

export default function EventDetails({ id, open }: Props) {
  /* ===================== API ===================== */

  const { data: eventRes } = useGetEventByIdQuery(id, { skip: !id });

  const {
    data: registrationRes,
    isLoading: loadingRegs,
  } = useListEventRegistrationsQuery(
    { eventId: id },
    { skip: !id }
  );

  const { data: commentRes } = useGetCommentsQuery(
    { eventId: id },
    { skip: !id }
  );

  const [updateEvent, { isLoading }] = useUpdateEventByIdMutation();
  const [createComment] = useCreateCommentMutation();
  const [hideComment] = useHideCommentMutation();

  /* ===================== STATE ===================== */

  const [form, setForm] = useState<EventForm>({
    name: "",
    status: "pending",
    location: "",
    description: "",
  });

  const [comment, setComment] = useState("");
  const [showAttendee, setShowAttendee] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  /* ===================== DATA ===================== */

  const event = eventRes?.data;
  const registrations: Registration[] = registrationRes?.data || [];
  const comments: Comment[] = commentRes?.data || [];

  /* ===================== EFFECT ===================== */

  useEffect(() => {
    if (!event) return;

    setForm({
      name: event.name ?? "",
      status: event.status ?? "pending",
      location: event.location ?? "",
      description: event.description ?? "",
    });
  }, [event]);

  useEffect(() => {
  if (registrationRes) {
    console.log("RTK Query Data (Registrations):", registrationRes);
  }
}, [registrationRes]);


  /* ===================== FILTER ===================== */

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const matchSearch = search
        ? item.fullname?.toLowerCase().includes(search.toLowerCase())
        : true;

      const matchStatus = filterStatus
        ? item.status === filterStatus
        : true;

      return matchSearch && matchStatus;
    });
  }, [registrations, search, filterStatus]);

  /* ===================== HANDLERS ===================== */

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateEvent({ id, data: form }).unwrap();
      toast.success("Cập nhật thành công");
      open(false);
    } catch {
      toast.error("Cập nhật thất bại");
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    await createComment({
      eventId: id,
      text: comment,
    });

    setComment("");
  };

  /* ===================== UI ===================== */

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto">
        {/* CLOSE */}
        <button
          onClick={() => open(false)}
          className="absolute right-4 top-4"
        >
          <IoCloseCircle size={40} className="text-red-500" />
        </button>

        {/* NAME + STATUS */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <div className="col-span-4">
            <label className="font-semibold text-blue-700">Tên sự kiện</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>

          <div>
            <label className="font-semibold text-blue-700">Trạng thái</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="pending">Sắp diễn ra</option>
              <option value="happening">Đang diễn ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="canceled">Hủy</option>
            </select>
          </div>
        </div>

        {/* LOCATION */}
        <div className="mb-4">
          <label className="font-semibold text-blue-700">Địa điểm</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-4">
          <label className="font-semibold text-blue-700">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded w-full h-24"
          />
        </div>

        {/* UPDATE */}
        <button
          onClick={handleUpdate}
          disabled={isLoading}
          className="bg-blue-600 text-white px-5 py-2 rounded flex items-center gap-2"
        >
          {isLoading && <ClipLoader size={18} color="#fff" />}
          Cập nhật
        </button>

        {/* ================= ATTENDEES ================= */}
        <div className="mt-8">
          <div
            className="flex gap-3 items-center cursor-pointer"
            onClick={() => setShowAttendee(!showAttendee)}
          >
            <p className="font-bold text-xl text-blue-700">
              Danh sách người tham gia
            </p>
            {showAttendee ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
          </div>

          {showAttendee && (
            <>
              {/* TOOLBAR */}
              <div className="flex gap-4 mt-4 mb-3">
                <input
                  type="search"
                  placeholder="Tìm theo họ tên"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border p-2 rounded flex-1"
                />

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border p-2 rounded w-48"
                >
                  <option value="">Tất cả</option>
                  <option value="registered">Chưa có mặt</option>
                  <option value="attended">Đã có mặt</option>
                </select>
              </div>

              {/* LIST */}
              <div className="border rounded divide-y">
                {loadingRegs ? (
                  <p className="text-center py-4">Đang tải...</p>
                ) : filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((item) => (
                    <AttendeeItem key={item._id} item={item} />
                  ))
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    Không có người tham gia
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* ================= COMMENTS ================= */}
        <div className="mt-8">
          <div
            className="flex gap-3 items-center cursor-pointer"
            onClick={() => setShowComment(!showComment)}
          >
            <p className="font-bold text-xl text-blue-700">Bình luận</p>
            {showComment ? <FaChevronCircleUp /> : <FaChevronCircleDown />}
          </div>

          {showComment && (
            <>
              <div className="flex gap-2 my-3">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Viết bình luận..."
                  className="border p-2 rounded flex-1"
                />
                <button
                  onClick={handleSendComment}
                  className="bg-blue-600 text-white px-4 rounded"
                >
                  Gửi
                </button>
              </div>

              <div className="space-y-3">
                {comments.map((c) => (
                  <div key={c._id} className="border p-3 rounded flex gap-3">
                    <img
                      src={c.accountId?.avatar?.path || avatar}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {c.accountId?.fullname}
                      </p>
                      <p>{c.text}</p>
                    </div>
                    <button
                      onClick={() => hideComment(c._id)}
                      className="text-red-500 text-sm"
                    >
                      {c.status === "active" ? "Ẩn" : "Đã ẩn"}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

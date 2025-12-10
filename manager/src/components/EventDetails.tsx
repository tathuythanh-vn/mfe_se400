import { useState } from 'react';
import {
  useGetEventByIdQuery,
  useUpdateEventMutation,
  useGetRegistrationsQuery,
  useGetCommentsQuery,
  useCreateCommentMutation,
  useHideCommentMutation,
  // @ts-ignore - Module Federation remote
} from 'home/store';

import { IoCloseCircle } from 'react-icons/io5';
import { FaChevronCircleDown, FaChevronCircleUp } from 'react-icons/fa';
import ClipLoader from 'react-spinners/ClipLoader';
import { toast } from 'react-toastify';
import avatar from '../assets/avatar.png';

interface Props {
  id: string;
  open: (val: boolean) => void;
}

export default function EventDetails({ id, open }: Props) {
  const { data: eventData } = useGetEventByIdQuery(id);
  const { data: registrationData } = useGetRegistrationsQuery(id);
  const { data: commentsData } = useGetCommentsQuery(id);

  const [updateEvent] = useUpdateEventMutation();
  const [createComment] = useCreateCommentMutation();
  const [hideComment] = useHideCommentMutation();

  const [comment, setComment] = useState('');
  const [showAttendee, setShowAttendee] = useState(false);
  const [showComment, setShowComment] = useState(false);

  const event = eventData?.data;
  const registrations = registrationData?.data || [];
  const comments = commentsData?.data || [];

  const handleSendComment = async () => {
    if (!comment.trim()) return;

    await createComment({
      eventId: id,
      text: comment,
    });

    setComment('');
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append('name', event.name);

    await updateEvent({ id, body: form });
    toast.success('Cập nhật thành công');
    open(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center p-4 z-50">
      <div className="bg-white w-full max-w-4xl rounded-xl p-6 shadow-lg overflow-y-auto max-h-[90vh] relative">
        {/* Close button */}
        <button
          onClick={() => open(false)}
          className="absolute right-4 top-4 hover:opacity-80"
        >
          <IoCloseCircle size={40} className="text-red-500" />
        </button>

        {/* NAME + STATUS */}
        <div className="grid grid-cols-5 gap-4 my-4">
          <div className="col-span-4 flex flex-col">
            <label className="font-semibold text-blue-700">Tên sự kiện</label>
            <input
              className="border p-2 rounded w-full"
              value={event?.name || ''}
              onChange={() => {}}
            />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-blue-700">Trạng thái</label>
            <select className="border p-2 rounded">
              <option value="pending">Sắp diễn ra</option>
              <option value="happening">Đang diễn ra</option>
              <option value="completed">Hoàn thành</option>
              <option value="canceled">Hủy</option>
            </select>
          </div>
        </div>

        {/* LOCATION */}
        <div className="my-3">
          <label className="font-semibold text-blue-700">Địa điểm</label>
          <input className="border p-2 rounded w-full" />
        </div>

        {/* DESCRIPTION */}
        <div className="my-3">
          <label className="font-semibold text-blue-700">Mô tả</label>
          <textarea className="border p-2 rounded w-full h-24"></textarea>
        </div>

        {/* UPDATE BUTTON */}
        <div className="mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            <ClipLoader size={18} color="#fff" />
            Cập nhật
          </button>
        </div>

        {/* ATTENDEE LIST */}
        <div className="mt-6">
          <div
            className="flex items-center cursor-pointer gap-3"
            onClick={() => setShowAttendee(!showAttendee)}
          >
            <p className="text-xl font-bold text-blue-700">
              Danh sách người tham gia
            </p>
            {showAttendee ? (
              <FaChevronCircleUp size={22} className="text-blue-700" />
            ) : (
              <FaChevronCircleDown size={22} className="text-blue-700" />
            )}
          </div>

          {showAttendee && (
            <div className="mt-3 space-y-2">
              {registrations.map((u: any, i: number) => (
                <div key={i} className="p-3 border rounded shadow">
                  {u.accountId.fullname}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COMMENTS */}
        <div className="mt-6">
          <div
            className="flex items-center cursor-pointer gap-3"
            onClick={() => setShowComment(!showComment)}
          >
            <p className="text-xl font-bold text-blue-700">Bình luận</p>
            {showComment ? (
              <FaChevronCircleUp size={22} className="text-blue-700" />
            ) : (
              <FaChevronCircleDown size={22} className="text-blue-700" />
            )}
          </div>

          {showComment && (
            <div className="mt-3">
              {/* Input comment */}
              <div className="flex gap-2 mb-3">
                <input
                  className="border p-2 rounded flex-1"
                  placeholder="Viết bình luận..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  onClick={handleSendComment}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Gửi
                </button>
              </div>

              {/* Comment list */}
              <div className="space-y-3">
                {comments.map((c: any) => (
                  <div
                    key={c._id}
                    className="p-3 border rounded flex items-start gap-3"
                  >
                    <img
                      src={c.accountId?.avatar?.path || avatar}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="font-semibold">
                        {c.accountId?.fullname}
                      </div>
                      <div className="text-gray-700">{c.text}</div>
                    </div>
                    <button
                      onClick={() => hideComment(c._id)}
                      className="text-sm text-red-500"
                    >
                      {c.status === 'active' ? 'Ẩn' : 'Đã ẩn'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

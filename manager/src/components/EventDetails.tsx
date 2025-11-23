import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { FaChevronCircleDown, FaChevronCircleUp } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import avatar from "../../assets/avatar.png";
import AttendeeItem from "./AttendeeItem";
import {
  useGetEventQuery,
  useUpdateEventMutation,
  useGetRegistrationsQuery,
  useGetCommentsQuery,
  usePostCommentMutation,
  useHideCommentMutation,
  useGetProfileQuery,
} from "home/store"; 

interface EventDetailsProps {
  id: string;
  open: (val: boolean) => void;
}

interface Comment {
  id: string;
  accountId: {
    fullname: string;
    avatar?: string;
  };
  comment: string;
  status: string;
}

const EventDetails: React.FC<EventDetailsProps> = ({ id, open }) => {
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [cloudImgs, setCloudImgs] = useState<string[]>([]);
  const [fileImgs, setFileImgs] = useState<File[]>([]);
  const [comment, setComment] = useState("");
  const [toggleAttendee, setToggleAttendee] = useState(false);
  const [toggleComment, setToggleComment] = useState(false);
  const [updateData, setUpdateData] = useState<any>({});

  // RTK Query hooks
  const { data: eventData } = useGetEventQuery(id);
  const { data: registrations } = useGetRegistrationsQuery(id);
  const { data: commentsData } = useGetCommentsQuery(id);
  const { data: user } = useGetProfileQuery();
  const [updateEvent, { isLoading }] = useUpdateEventMutation();
  const [postComment] = usePostCommentMutation();
  const [hideComment] = useHideCommentMutation();

  // Update local states when eventData changes
  React.useEffect(() => {
    if (eventData) {
      setTags(eventData.tags || []);
      setCloudImgs(eventData.images.map((img: any) => img.filename));
      setImages(eventData.images.map((img: any) => img.path));
      setUpdateData({
        name: eventData.name,
        location: eventData.location,
        status: eventData.status,
        scope: eventData.scope,
        startedAt: eventData.startedAt,
        description: eventData.description,
      });
    }
  }, [eventData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdateData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag || tags.includes(tag)) {
      toast.error("Hashtag không hợp lệ hoặc đã tồn tại");
      return;
    }
    setTags([...tags, tag]);
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const handleAddFileImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setFileImgs([...fileImgs, ...files]);
    const fileURLs = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...fileURLs]);
  };

  const handleRemoveImage = (img: string) => {
    setImages(images.filter((i) => i !== img));
    setCloudImgs(cloudImgs.filter((f) => !img.includes(f)));
  };

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      for (const key in updateData) {
        if (updateData[key]) {
          formData.append(key, key === "startedAt" ? new Date(updateData[key]).toISOString() : updateData[key]);
        }
      }
      tags.forEach((tag) => formData.append("tags[]", tag));
      cloudImgs.forEach((img) => formData.append("cloudImgs[]", img));
      fileImgs.forEach((file) => formData.append("images", file));

      const result = await updateEvent({ id, body: formData }).unwrap();
      toast.success("Cập nhật sự kiện thành công");
      open(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Lỗi khi cập nhật sự kiện");
    }
  };

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      await postComment({ eventId: id, text: comment });
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "canceled":
        return "text-red-600";
      case "happening":
        return "text-yellow-600";
      case "pending":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 overflow-auto p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl relative p-6">
        <button className="absolute top-4 right-4" onClick={() => open(false)}>
          <IoCloseCircle size={40} className="text-red-600" />
        </button>

        {/* Event Form */}
        <div className="space-y-4">
          {/* Name & Status */}
          <div className="flex gap-4">
            <input
              name="name"
              placeholder="Tên sự kiện"
              value={updateData.name || ""}
              onChange={handleChange}
              className="flex-1 border rounded-lg p-2"
            />
            <select
              name="status"
              value={updateData.status || "pending"}
              onChange={handleChange}
              className={`border rounded-lg p-2 font-bold ${getStatusColor(updateData.status)}`}
            >
              <option value="completed">Hoàn thành</option>
              <option value="canceled">Hủy</option>
              <option value="happening">Đang diễn ra</option>
              <option value="pending">Sắp diễn ra</option>
            </select>
          </div>

          {/* Location */}
          <input
            name="location"
            placeholder="Địa điểm"
            value={updateData.location || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2"
          />

          {/* Scope & Start Time */}
          <div className="flex gap-4">
            <select
              name="scope"
              value={updateData.scope || ""}
              onChange={handleChange}
              className="border rounded-lg p-2 flex-1"
            >
              <option value="public">Công khai</option>
              <option value="chapter">Nội bộ</option>
            </select>
            <input
              name="startedAt"
              type="datetime-local"
              value={
                updateData.startedAt
                  ? new Date(new Date(updateData.startedAt).getTime() - new Date().getTimezoneOffset() * 60000)
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleChange}
              className="border rounded-lg p-2 flex-1"
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            rows={3}
            placeholder="Mô tả sự kiện"
            value={updateData.description || ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 resize-none"
          />

          {/* Tags */}
          <div>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="#hashtag"
                className="flex-1 border rounded-lg p-2"
              />
              <button onClick={handleAddTag} className="bg-blue-600 text-white p-2 rounded-lg">
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <span key={tag} className="bg-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block mb-2">Hình ảnh</label>
            <input type="file" multiple onChange={handleAddFileImg} className="mb-2" />
            <div className="flex flex-wrap gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative w-24 h-24">
                  <img src={img} alt="img" className="w-full h-full object-cover rounded-lg" />
                  <button
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Update Button */}
          <button
            onClick={handleUpdate}
            disabled={isLoading}
            className="bg-blue-600 text-white p-2 rounded-lg w-full flex justify-center items-center"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : "Cập nhật"}
          </button>

          {/* Attendees */}
          <div>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setToggleAttendee((prev) => !prev)}>
              <h3 className="text-lg font-bold text-blue-600">Danh sách người tham gia</h3>
              {toggleAttendee ? <FaChevronCircleUp size={24} /> : <FaChevronCircleDown size={24} />}
            </div>
            {toggleAttendee && (
              <div className="mt-2 space-y-2">
                {registrations?.map((item: any) => (
                  <AttendeeItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {/* Comments */}
          <div>
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setToggleComment((prev) => !prev)}>
              <h3 className="text-lg font-bold text-blue-600">Bình luận</h3>
              {toggleComment ? <FaChevronCircleUp size={24} /> : <FaChevronCircleDown size={24} />}
            </div>
            {toggleComment && (
              <div className="mt-2 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Viết bình luận..."
                    className="flex-1 border rounded-lg p-2"
                  />
                  <button onClick={handleSendComment} className="bg-blue-600 text-white p-2 rounded-lg">
                    Gửi
                  </button>
                </div>
                <div className="space-y-2">
                  {commentsData?.map((item: Comment) => (
                    <div key={item.id} className="flex items-start gap-2">
                      <img
                        src={item.accountId.avatar || avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="font-bold">{item.accountId.fullname}</div>
                        <p>{item.comment}</p>
                      </div>
                      <button onClick={() => hideComment(item.id)}>
                        {item.status === "active" ? "Ẩn" : "Đã ẩn"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;

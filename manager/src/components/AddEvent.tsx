import { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
// @ts-ignore - Module Federation remote
import { useCreateEventMutation } from "home/store";
import { validateEventForm } from "../utils/validate";

interface AddEventProps {
  open: (status: boolean) => void;
}

interface EventData {
  name: string;
  startedAt: string;
  location: string;
  description: string;
  tags: string[];
  scope: "public" | "chapter";
  images: File[];
}

const AddEvent: React.FC<AddEventProps> = ({ open }) => {
  const [data, setData] = useState<EventData>({
    name: "",
    startedAt: "",
    location: "",
    description: "",
    tags: [],
    scope: "public",
    images: [],
  });

  const [newTag, setNewTag] = useState("");
  const [preview, setPreview] = useState<string[]>([]);

  const [createEvent, { isLoading }] = useCreateEventMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (!data.tags.includes(tag)) setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));
    setData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreview((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    setPreview((prev) => prev.filter((_, i) => i !== index));
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddEvent = async () => {
    if (!data.name || !data.startedAt || !data.location || !data.tags.length) {
      toast.error("Vui lòng điền đầy đủ thông tin sự kiện.");
      return;
    }

    const validateMsg = validateEventForm(data);
    if (validateMsg) return toast.error(validateMsg);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("startedAt", data.startedAt);
    formData.append("location", data.location);
    formData.append("description", data.description);
    formData.append("scope", data.scope);
    data.tags.forEach((tag) => formData.append("tags", tag));
    data.images.forEach((img) => formData.append("images", img));

    try {
      await createEvent(formData).unwrap();
      toast.success("Thêm sự kiện thành công!");
      setData({
        name: "",
        startedAt: "",
        location: "",
        description: "",
        tags: [],
        scope: "public",
        images: [],
      });
      setPreview([]);
    } catch (err: any) {
      toast.error(err?.data?.message || "Thêm sự kiện thất bại");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-auto relative flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4 cursor-pointer text-red-500 hover:scale-105 transition-transform"
        >
          <IoCloseCircle size={36} />
        </button>

        {/* Form content */}
        <div className="flex flex-col gap-4">
          {/* Tên sự kiện */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1C398E]">Tên sự kiện</label>
            <input
              id="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Nhập tên sự kiện"
              className="border border-[#1C398E] rounded-2xl p-2 outline-none"
            />
          </div>

          {/* Địa điểm */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1C398E]">Địa điểm</label>
            <input
              id="location"
              value={data.location}
              onChange={handleChange}
              placeholder="Nhập địa điểm"
              className="border border-[#1C398E] rounded-2xl p-2 outline-none"
            />
          </div>

          {/* Scope + Time */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label className="font-bold text-[#1C398E]">Phạm vi</label>
              <select
                id="scope"
                value={data.scope}
                onChange={handleChange}
                className="border border-[#1C398E] rounded-2xl p-2 outline-none"
              >
                <option value="public">Công khai</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label className="font-bold text-[#1C398E]">Thời gian bắt đầu</label>
              <input
                id="startedAt"
                type="datetime-local"
                value={data.startedAt}
                onChange={handleChange}
                className="border border-[#1C398E] rounded-2xl p-2 outline-none"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1C398E]">Mô tả</label>
            <textarea
              id="description"
              value={data.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sự kiện"
              rows={4}
              className="border border-[#1C398E] rounded-2xl p-2 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1C398E]">Hashtag sự kiện</label>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nhập hashtag, ví dụ: #muahe"
                className="border border-[#1C398E] rounded-2xl p-2 flex-1 outline-none"
              />
              <button
                onClick={handleAddTag}
                className="bg-[#1C398E] text-white px-4 py-2 rounded-2xl hover:bg-[#162f77]"
              >
                Thêm
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#1C398E]/20 text-[#1C398E] px-3 py-1 rounded-2xl flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold text-lg cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-[#1C398E]">Hình ảnh</label>
            <label
              htmlFor="fileUpload"
              className="bg-[#1C398E] text-white py-1 px-4 rounded-2xl w-fit cursor-pointer hover:bg-[#162f77]"
            >
              + Thêm ảnh
            </label>
            <input
              id="fileUpload"
              type="file"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />

            {preview.length > 0 && (
              <div className="flex gap-3 overflow-x-auto max-h-[180px] mt-2">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img src={img} className="h-[160px] rounded-2xl shadow" />
                    <button
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAddEvent}
              disabled={isLoading}
              className={`bg-[#1C398E] text-white font-bold rounded-2xl py-2 px-6 w-28 text-center ${
                isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-[#162f77]"
              } flex justify-center items-center`}
            >
              {isLoading ? <ClipLoader size={16} color="#fff" /> : "Thêm sự kiện"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;

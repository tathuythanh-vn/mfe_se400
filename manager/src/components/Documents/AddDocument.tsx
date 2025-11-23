import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { validateEventForm } from "../../utils/validate";
import { useCreateEventMutation } from "home/store";

interface Props {
  open: (value: boolean) => void;
}

export default function AddEvent({ open }: Props) {
  const [createEvent, { isLoading }] = useCreateEventMutation();

  const [data, setData] = useState({
    name: "",
    startedAt: "",
    location: "",
    description: "",
    tags: [] as string[],
    scope: "public",
    images: [] as File[],
  });

  const [preview, setPreview] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;

    if (!data.tags.includes(tag)) {
      setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews = files.map((file) => URL.createObjectURL(file));

    setData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setPreview((prev) => [...prev, ...previews]);
  };

  const removeImage = (i: number) => {
    setPreview((prev) => prev.filter((_, idx) => idx !== i));
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== i),
    }));
  };

  const handleAdd = async () => {
    if (!data.name || !data.startedAt || !data.location || !data.tags.length) {
      toast.error("Vui lòng điền đầy đủ thông tin sự kiện.");
      return;
    }

    const validateMsg = validateEventForm(data);
    if (validateMsg) return toast.error(validateMsg);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("location", data.location);
    formData.append("startedAt", data.startedAt);
    formData.append("description", data.description);
    formData.append("scope", data.scope);
    data.tags.forEach((t) => formData.append("tags", t));
    data.images.forEach((img) => formData.append("images", img));

    try {
      const res = await createEvent(formData).unwrap();
      toast.success("Thêm sự kiện thành công!");

      // Reset
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
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[80%] rounded-2xl p-10 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => open(false)}
          className="absolute top-3 right-3"
        >
          <IoCloseCircle size={40} className="text-red-500" />
        </button>

        <div className="flex flex-col gap-4">

          {/* Tên sự kiện */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Tên sự kiện</label>
            <input
              id="name"
              value={data.name}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 outline-none"
              placeholder="Nhập tên sự kiện"
            />
          </div>

          {/* Địa điểm */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Địa điểm</label>
            <input
              id="location"
              value={data.location}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 outline-none"
              placeholder="Nhập địa điểm"
            />
          </div>

          {/* Scope + Time */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-blue-600">Phạm vi</label>
              <select
                id="scope"
                value={data.scope}
                onChange={handleChange}
                className="border border-blue-500 rounded-lg px-3 py-2 outline-none"
              >
                <option value="public">Công khai</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full">
              <label className="font-semibold text-blue-600">Thời gian bắt đầu</label>
              <input
                id="startedAt"
                type="datetime-local"
                value={data.startedAt}
                onChange={handleChange}
                className="border border-blue-500 rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Mô tả</label>
            <textarea
              id="description"
              value={data.description}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 outline-none"
              rows={5}
              placeholder="Nhập mô tả sự kiện"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Hashtag sự kiện</label>

            <div className="flex gap-2">
              <input
                className="border px-3 py-2 rounded-lg border-blue-500 w-full"
                placeholder="Nhập hashtag, ví dụ: #muahe"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                onClick={handleAddTag}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Thêm
              </button>
            </div>

            {/* List tag */}
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-red-500 font-bold text-lg"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-600">Hình ảnh</label>

            <label
              htmlFor="fileUpload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit cursor-pointer"
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
              <div className="flex gap-3 overflow-x-auto h-[180px]">
                {preview.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="h-[160px] rounded-lg shadow"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleAdd}
              disabled={isLoading}
              className="bg-blue-600 text-white font-bold rounded-lg px-6 py-3 w-60 flex items-center justify-center"
            >
              {isLoading ? <ClipLoader size={20} color="#fff" /> : "Thêm sự kiện"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
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

export default function AddEvent({ open }: AddEventProps) {
  const [data, setData] = useState<EventData>({
    name: "",
    startedAt: "",
    location: "",
    description: "",
    tags: [],
    scope: "public",
    images: [],
  });
  const [newTag, setNewTag] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [adding, setAdding] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (!data.tags.includes(tag)) setData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleAdd = async () => {
    if (!data.name || !data.startedAt || !data.location || !data.tags.length) {
      toast.error("Vui lòng điền đầy đủ thông tin sự kiện.");
      return;
    }

    const validate = validateEventForm(data);
    if (validate) {
      toast.error(validate);
      return;
    }

    setAdding(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("startedAt", data.startedAt);
      formData.append("location", data.location);
      formData.append("description", data.description);
      formData.append("scope", data.scope);
      data.tags.forEach((tag) => formData.append("tags", tag));
      data.images.forEach((img) => formData.append("images", img));

      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/events`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Thêm sự kiện thành công.");
        setData({ name: "", startedAt: "", location: "", description: "", tags: [], scope: "public", images: [] });
        setImages([]);
      } else {
        toast.error(result.message || "Thêm sự kiện thất bại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi thêm sự kiện.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
      <div className="relative w-4/5 bg-white rounded-2xl p-12 flex flex-col max-h-[80vh] overflow-auto">
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4 text-red-600 hover:scale-105 transition-transform"
        >
          <IoCloseCircle size={40} />
        </button>

        <div className="flex flex-col gap-5">
          {/* Tên sự kiện */}
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="font-bold text-blue-700">
              Tên sự kiện
            </label>
            <input
              id="name"
              value={data.name}
              onChange={handleChange}
              placeholder="Nhập tên sự kiện"
              className="border border-blue-700 rounded-lg px-3 h-9 outline-none text-blue-700"
            />
          </div>

          {/* Địa điểm */}
          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="font-bold text-blue-700">
              Địa điểm
            </label>
            <input
              id="location"
              value={data.location}
              onChange={handleChange}
              placeholder="Nhập địa điểm"
              className="border border-blue-700 rounded-lg px-3 h-9 outline-none text-blue-700"
            />
          </div>

          {/* Phạm vi & Thời gian */}
          <div className="flex gap-5">
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="scope" className="font-bold text-blue-700">
                Phạm vi
              </label>
              <select
                id="scope"
                value={data.scope}
                onChange={handleChange}
                className="border border-blue-700 rounded-lg px-3 h-9 outline-none text-blue-700"
              >
                <option value="public">Công khai</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label htmlFor="startedAt" className="font-bold text-blue-700">
                Thời gian bắt đầu
              </label>
              <input
                id="startedAt"
                type="datetime-local"
                value={data.startedAt}
                onChange={handleChange}
                className="border border-blue-700 rounded-lg px-3 h-9 outline-none text-blue-700"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="font-bold text-blue-700">
              Mô tả
            </label>
            <textarea
              id="description"
              rows={7}
              value={data.description}
              onChange={handleChange}
              placeholder="Nhập mô tả sự kiện"
              className="border border-blue-700 rounded-lg p-3 outline-none text-blue-700 resize-none"
            />
          </div>

          {/* Hashtag */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-blue-700">Hashtag sự kiện</label>
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Nhập hashtag, ví dụ: #muahe"
                className="flex-1 border border-blue-700 rounded-lg px-3 h-9 outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-blue-700 text-white font-bold px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors"
              >
                Thêm
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.tags.map((tag, index) => (
                <span key={index} className="bg-blue-200 px-3 py-1 rounded-full flex items-center gap-1 text-sm">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="text-red-600 font-bold">
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Hình ảnh */}
          <div className="flex flex-col gap-1">
            <label className="font-bold text-blue-700">Hình ảnh</label>
            <label
              htmlFor="imagesUpload"
              className="bg-blue-700 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors w-max"
            >
              + Thêm ảnh
            </label>
            <input id="imagesUpload" type="file" multiple onChange={handleImageChange} className="hidden" />
            <div className={`flex gap-3 mt-2 overflow-auto ${images.length ? "flex" : "hidden"}`}>
              {images.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} alt={`upload-${index}`} className="h-44 w-44 object-cover rounded-lg shadow" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex justify-center items-center text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Button thêm sự kiện */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg font-bold w-60 flex justify-center items-center gap-2 hover:bg-blue-800 transition-colors disabled:opacity-50"
            >
              {adding ? <ClipLoader size={20} color="#fff" /> : "Thêm sự kiện"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

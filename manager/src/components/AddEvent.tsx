import { useEffect, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
// @ts-ignore
import { useCreateEventMutation } from "home/store";

interface AddEventProps {
  open: (status: boolean) => void;
}

interface EventForm {
  name: string;
  location: string;
  startedAt: string;
  description: string;
  scope: "public" | "chapter";
  tags: string[];
  images: File[];
}

export default function AddEvent({ open }: AddEventProps) {
  /* ==================== STATE ==================== */
  const [form, setForm] = useState<EventForm>({
    name: "",
    location: "",
    startedAt: "",
    description: "",
    scope: "public",
    tags: [],
    images: [],
  });

  const [newTag, setNewTag] = useState("");
  const [previewImgs, setPreviewImgs] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [createEvent, { isLoading }] = useCreateEventMutation();

  /* ==================== EFFECT ==================== */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  /* ==================== HANDLERS ==================== */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  /* ===== TAGS ===== */
  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag || form.tags.includes(tag)) return;

    setForm((prev) => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
    setNewTag("");
  };

  const handleRemoveTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  /* ===== IMAGES ===== */
  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    setPreviewImgs((prev) => [
      ...prev,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviewImgs((prev) => prev.filter((_, i) => i !== index));
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.startedAt) {
      toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      await createEvent({
        name: form.name,
        location: form.location,
        startedAt: form.startedAt,
        description: form.description,
        scope: form.scope,
        tags: form.tags,
        images: form.images,
      }).unwrap();

      toast.success("Thêm sự kiện thành công");
      open(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Thêm sự kiện thất bại");
    }
  };

  /* ==================== RENDER ==================== */
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[800px] max-h-[90vh] rounded-xl flex flex-col">

        {/* ===== HEADER ===== */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#155DFC]">
            Thêm sự kiện
          </h2>
          <button onClick={() => open(false)}>
            <IoCloseCircle size={32} className="text-red-500" />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Name */}
          <div>
            <label className="font-semibold text-[#155DFC]">
              Tên sự kiện
            </label>
            <input
              id="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Location */}
          <div>
            <label className="font-semibold text-[#155DFC]">
              Địa điểm
            </label>
            <input
              id="location"
              value={form.location}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Scope & Time */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="font-semibold text-[#155DFC]">
                Phạm vi
              </label>
              <select
                id="scope"
                value={form.scope}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="public">Công khai</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="font-semibold text-[#155DFC]">
                Bắt đầu
              </label>
              <input
                id="startedAt"
                type="datetime-local"
                value={form.startedAt}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-[#155DFC]">
              Mô tả
            </label>
            <textarea
              id="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border rounded-lg px-3 py-2 resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="font-semibold text-[#155DFC]">
              Hashtag
            </label>
            <div className="flex gap-2">
              <input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-[#155DFC] text-white px-4 rounded-lg"
              >
                Thêm
              </button>
            </div>

            <div className="flex gap-2 flex-wrap mt-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 text-[#155DFC] px-3 py-1 rounded-lg flex items-center gap-1"
                >
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="font-semibold text-[#155DFC]">
              Hình ảnh
            </label>

            <div className="mt-2">
              <button
                type="button"
                onClick={handleAddImageClick}
                className="bg-[#155DFC] text-white px-4 py-2 rounded-lg"
              >
                Thêm ảnh
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {previewImgs.length > 0 && (
              <div className="flex gap-3 flex-wrap mt-3">
                {previewImgs.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="h-28 rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-4 border-t flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#155DFC] text-white px-8 py-3 rounded-lg font-bold"
          >
            {isLoading ? (
              <ClipLoader size={20} color="#fff" />
            ) : (
              "Thêm sự kiện"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

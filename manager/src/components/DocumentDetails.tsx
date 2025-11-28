import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'pdfjs-dist/web/pdf_viewer.css';
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

import {
  useGetDocumentByIdQuery ,
  useUpdateDocumentByIdMutation, // @ts-ignore - Module Federation remote
} from "home/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  id: string;
  open: (v: boolean) => void;
  canEdit: boolean;
}

export default function DocumentDetails({ id, open, canEdit }: Props) {
  const { data, refetch } = useGetDocumentByIdQuery (id);
  const [updateDocument, { isLoading }] = useUpdateDocumentByIdMutation();

  const [numPages, setNumPages] = useState<number>(0);
  const [file, setFile] = useState<any>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    docCode: "",
    scope: "",
    type: "VBHC",
    description: "",
  });

  // Load API → fill form + file
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || "",
        docCode: data.docCode || "",
        scope: data.scope || "",
        type: data.type || "VBHC",
        description: data.description || "",
      });

      if (data.file?.path) setFile(data.file.path);
    }
  }, [data]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Vui lòng chọn file PDF hợp lệ");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: any) => {
    setNumPages(numPages);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Vui lòng chọn file PDF!");

    const body = new FormData();
    if (file instanceof File) body.append("file", file);

    body.append("name", formData.name);
    body.append("docCode", formData.docCode);
    body.append("scope", formData.scope);
    body.append("type", formData.type);
    body.append("description", formData.description);

    try {
      await updateDocument({ id, body }).unwrap();
      toast.success("Cập nhật thành công!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[999]">
      <div className="bg-white w-[80%] rounded-2xl p-10 relative max-h-[90vh] overflow-auto flex gap-6">
        
        {/* Close */}
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4"
        >
          <IoCloseCircle size={42} className="text-red-500" />
        </button>

        {/* LEFT – INFO FORM */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-700 mb-2">Thông tin văn bản</h2>

          {/* Input */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Tên văn bản</label>
            <input
              id="name"
              disabled={!canEdit}
              value={formData.name}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Số hiệu</label>
            <input
              id="docCode"
              disabled={!canEdit}
              value={formData.docCode}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 outline-none"
            />
          </div>

          {/* Row: Scope + Type */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-blue-600 font-semibold">Phạm vi</label>
              <select
                id="scope"
                disabled={!canEdit}
                value={formData.scope}
                onChange={handleChange}
                className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 outline-none"
              >
                <option value="private">Mật</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label className="text-blue-600 font-semibold">Loại tài liệu</label>
              <select
                id="type"
                disabled={!canEdit}
                value={formData.type}
                onChange={handleChange}
                className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 outline-none"
              >
                <option value="VBHC">Văn bản hành chính</option>
                <option value="TLSH">Tài liệu sinh hoạt</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-600">Mô tả</label>
            <textarea
              id="description"
              rows={4}
              disabled={!canEdit}
              value={formData.description}
              onChange={handleChange}
              className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 outline-none resize-none"
            />
          </div>

          {/* Submit */}
          {canEdit && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg w-fit mt-4"
            >
              {isLoading ? <ClipLoader size={18} color="#fff" /> : "Lưu thay đổi"}
            </button>
          )}
        </div>

        {/* RIGHT – PDF PREVIEW */}
        <div className="w-[450px]">
          <h2 className="text-xl font-bold text-blue-700 mb-3">Xem tài liệu PDF</h2>

          {canEdit && (
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer inline-block mb-3">
              Chọn file PDF
              <input
                type="file"
                accept="application/pdf"
                onChange={onFileChange}
                className="hidden"
              />
            </label>
          )}

          {error && <p className="text-red-600">{error}</p>}

          {file && (
            <div className="border-4 border-blue-600 rounded-xl p-3 h-[500px] overflow-auto bg-blue-50">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => setError("Không thể hiển thị PDF")}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <Page key={i} pageNumber={i + 1} width={400} />
                ))}
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

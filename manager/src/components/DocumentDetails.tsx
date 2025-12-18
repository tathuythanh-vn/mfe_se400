import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

// @ts-ignore
import {
  useGetDocumentByIdQuery,
  useUpdateDocumentByIdMutation, // @ts-ignore - Module Federation remote
} from "home/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  id: string;
  open: (v: boolean) => void;
  canEdit: boolean;
}

export default function DocumentDetails({ id, open, canEdit }: Props) {
  /* ================= API ================= */
  const { data: docRes, refetch } = useGetDocumentByIdQuery(id);
  const [updateDocument, { isLoading }] =
    useUpdateDocumentByIdMutation();

  const doc = docRes?.data;

  /* ================= STATE ================= */
  const [numPages, setNumPages] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    docCode: "",
    scope: "",
    type: "VBHC",
    description: "",
  });

  /* ================= LOAD PDF ================= */
  const loadPdfAsFile = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      setFile(
        new File([blob], "document.pdf", {
          type: "application/pdf",
        })
      );
    } catch {
      setError("Không thể tải file PDF");
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    if (!doc) return;

    setFormData({
      name: doc.name || "",
      docCode: doc.docCode || "",
      scope: doc.scope || "",
      type: doc.type || "VBHC",
      description: doc.description || "",
    });

    if (doc.file?.path) loadPdfAsFile(doc.file.path);
  }, [doc]);

  /* ================= HANDLERS ================= */
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((p) => ({ ...p, [id]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || f.type !== "application/pdf") {
      setError("Vui lòng chọn file PDF hợp lệ");
      return;
    }
    setFile(f);
    setError("");
  };

  const handleSubmit = async () => {
    if (!file) return toast.error("Chưa chọn file PDF");

    const body = new FormData();
    Object.entries(formData).forEach(([k, v]) =>
      body.append(k, v)
    );
    body.append("file", file);

    try {
      await updateDocument({ id, body }).unwrap();
      toast.success("Cập nhật thành công");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Có lỗi xảy ra");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white w-[80%] rounded-2xl p-8 relative flex gap-8">

        {/* CLOSE */}
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4"
        >
          <IoCloseCircle size={40} className="text-red-500" />
        </button>

        {/* ================= LEFT ================= */}
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-700">
            Thông tin văn bản
          </h2>

          <Input label="Tên văn bản" id="name" value={formData.name} onChange={handleChange} disabled={!canEdit} />
          <Input label="Số hiệu" id="docCode" value={formData.docCode} onChange={handleChange} disabled={!canEdit} />

          <div className="flex gap-4">
            <Select
              label="Phạm vi"
              id="scope"
              value={formData.scope}
              onChange={handleChange}
              disabled={!canEdit}
              options={[
                { value: "private", label: "Mật" },
                { value: "chapter", label: "Nội bộ" },
              ]}
            />

            <Select
              label="Loại tài liệu"
              id="type"
              value={formData.type}
              onChange={handleChange}
              disabled={!canEdit}
              options={[
                { value: "VBHC", label: "Văn bản hành chính" },
                { value: "TLSH", label: "Tài liệu sinh hoạt" },
                { value: "other", label: "Khác" },
              ]}
            />
          </div>

          <Textarea
            label="Mô tả"
            id="description"
            value={formData.description}
            onChange={handleChange}
            disabled={!canEdit}
          />

          {canEdit && (
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg w-fit"
            >
              {isLoading ? <ClipLoader size={18} color="#fff" /> : "Lưu thay đổi"}
            </button>
          )}
        </div>

        {/* ================= RIGHT (PDF) ================= */}
        <div className="w-[420px] flex flex-col">
          <h2 className="text-xl font-bold text-blue-700 mb-3">
            Xem tài liệu PDF
          </h2>

          {canEdit && (
            <label className="bg-blue-600 text-white px-4 py-2 rounded-lg w-fit cursor-pointer mb-3">
              Chọn file PDF
              <input type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
            </label>
          )}

          {error && <p className="text-red-600 mb-2">{error}</p>}

          {/* ✅ CHỈ PDF CÓ SCROLL */}
          {file && (
            <div className="border-4 border-blue-600 rounded-xl p-3 h-[380px] overflow-auto bg-blue-50">
              <Document
                file={file}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <Page key={i} pageNumber={i + 1} width={340} />
                ))}
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= INPUT COMPONENTS ================= */

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-blue-600">{label}</label>
      <input {...props} className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600" />
    </div>
  );
}

function Select({
  label,
  options,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label className="font-semibold text-blue-600">{label}</label>
      <select {...props} className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold text-blue-600">{label}</label>
      <textarea {...props} rows={4} className="border border-blue-500 rounded-lg px-3 py-2 text-blue-600 resize-none" />
    </div>
  );
}

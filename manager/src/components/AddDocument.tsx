import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";

import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { IoCloseCircle } from "react-icons/io5";
// @ts-ignore - Module Federation remote
import { useCreateDocumentMutation } from "home/store";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AddDocumentProps {
  open: (status: boolean) => void;
}

interface FormDataState {
  name: string;
  docCode: string;
  scope: "private" | "chapter";
  type: "VBHC" | "TLSH" | "other";
  description: string;
}

const AddDocument: React.FC<AddDocumentProps> = ({ open }) => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    docCode: "",
    scope: "chapter",
    type: "VBHC",
    description: "",
  });

  const [addDocument, { isLoading }] = useCreateDocumentMutation();

  /* -------------------- Handlers -------------------- */

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Vui lòng chọn file PDF hợp lệ");
      setFile(null);
      return;
    }

    setError("");
    setFile(selected);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Vui lòng chọn file PDF!");
      return;
    }

    try {
      const data = new FormData();
      data.append("file", file);
      data.append("name", formData.name);
      data.append("docCode", formData.docCode);
      data.append("scope", formData.scope);
      data.append("type", formData.type);
      data.append("description", formData.description);

      await addDocument(data).unwrap();

      toast.success("Thêm tài liệu thành công!");
      open(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl p-6 overflow-auto relative">

        {/* Close */}
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4 text-red-500 hover:scale-110 transition"
        >
          <IoCloseCircle size={34} />
        </button>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            id="name"
            placeholder="Tên văn bản"
            value={formData.name}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <input
            id="docCode"
            placeholder="Số hiệu"
            value={formData.docCode}
            onChange={handleChange}
            className="border rounded-lg p-2"
          />

          <select
            id="scope"
            value={formData.scope}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="private">Mật</option>
            <option value="chapter">Nội bộ</option>
          </select>

          <select
            id="type"
            value={formData.type}
            onChange={handleChange}
            className="border rounded-lg p-2"
          >
            <option value="VBHC">Văn bản hành chính</option>
            <option value="TLSH">Tài liệu sinh hoạt</option>
            <option value="other">Khác</option>
          </select>

          <textarea
            id="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
            className="border rounded-lg p-2 resize-none md:col-span-2"
            rows={3}
          />
        </div>

        {/* Upload */}
        <div className="mb-4">
          <label className="inline-block bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
            Chọn file PDF
            <input
              type="file"
              accept="application/pdf"
              onChange={onFileChange}
              hidden
            />
          </label>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {/* Preview */}
        {file && (
          <div className="border rounded-lg p-3 max-h-[50vh] overflow-auto bg-gray-100">
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              loading="Đang tải PDF..."
              error="Không thể hiển thị PDF"
            >
              {Array.from({ length: numPages }, (_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={420}
                  renderTextLayer={false}      
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-70"
          >
            {isLoading && <ClipLoader size={16} color="#fff" />}
            Thêm tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocument;

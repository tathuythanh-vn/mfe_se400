import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
// @ts-ignore
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

export default function AddDocument({ open }: AddDocumentProps) {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<FormDataState>({
    name: "",
    docCode: "",
    scope: "chapter",
    type: "VBHC",
    description: "",
  });

  const [addDocument, { isLoading }] = useCreateDocumentMutation();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      setError("Vui lòng chọn file PDF hợp lệ");
      return;
    }

    setError("");
    setFile(selected);
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
      toast.success("Thêm tài liệu thành công");
      open(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl flex flex-col">

        {/* ===== HEADER ===== */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-[#155DFC]">
            Thêm tài liệu
          </h2>
          <button onClick={() => open(false)}>
            <IoCloseCircle size={32} className="text-red-500" />
          </button>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              id="name"
              placeholder="Tên văn bản"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <input
              id="docCode"
              placeholder="Số hiệu"
              value={formData.docCode}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            />

            <select
              id="scope"
              value={formData.scope}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="private">Mật</option>
              <option value="chapter">Nội bộ</option>
            </select>

            <select
              id="type"
              value={formData.type}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
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
              rows={3}
              className="border rounded-lg px-3 py-2 resize-none md:col-span-2"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="inline-block bg-[#155DFC] text-white px-4 py-2 rounded-lg cursor-pointer">
              Chọn file PDF
              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={onFileChange}
              />
            </label>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          {/* Preview */}
          {file && (
            <div className="border-2 border-[#155DFC] rounded-xl p-3 h-[380px] overflow-auto bg-blue-50">
              <Document
                file={file}
                renderMode="canvas"
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              >
                {Array.from({ length: numPages }, (_, i) => (
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    width={360}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                ))}
              </Document>
            </div>
          )}
        </div>

        {/* ===== FOOTER ===== */}
        <div className="p-4 border-t flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#155DFC] text-white px-8 py-3 rounded-lg font-bold"
          >
            {isLoading ? <ClipLoader size={20} color="#fff" /> : "Thêm tài liệu"}
          </button>
        </div>
      </div>
    </div>
  );
}

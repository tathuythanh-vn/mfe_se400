import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'pdfjs-dist/web/pdf_viewer.css';
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { IoCloseCircle } from "react-icons/io5";
// @ts-ignore - Module Federation remote
import { useCreateDocumentMutation } from "home/store";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface AddDocumentProps {
  open: (status: boolean) => void;
}

interface FormData {
  name: string;
  docCode: string;
  scope: "private" | "chapter";
  type: "VBHC" | "TLSH" | "other";
  description: string;
}

const AddDocument: React.FC<AddDocumentProps> = ({ open }) => {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    docCode: "",
    scope: "chapter",
    type: "VBHC",
    description: "",
  });

  const [addDocument, { isLoading }] = useCreateDocumentMutation();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setFile(null);
      setError("Vui lòng chọn một tệp PDF hợp lệ.");
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      setFormData({
        name: "",
        docCode: "",
        scope: "chapter",
        type: "VBHC",
        description: "",
      });
      setFile(null);
      setNumPages(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Đã xảy ra lỗi!");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-400/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-8 w-11/12 max-w-4xl max-h-[90vh] overflow-auto relative flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={() => open(false)}
          className="absolute top-4 right-4 cursor-pointer text-red-500 hover:scale-105 transition-transform"
        >
          <IoCloseCircle size={36} />
        </button>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="font-bold text-[#1C398E]">
              Tên văn bản
            </label>
            <input
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên văn bản"
              className="border border-[#1C398E] rounded-lg p-2 outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="docCode" className="font-bold text-[#1C398E]">
              Số hiệu
            </label>
            <input
              id="docCode"
              value={formData.docCode}
              onChange={handleChange}
              placeholder="Nhập số hiệu"
              className="border border-[#1C398E] rounded-lg p-2 outline-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="scope" className="font-bold text-[#1C398E]">
                Phạm vi
              </label>
              <select
                id="scope"
                value={formData.scope}
                onChange={handleChange}
                className="border border-[#1C398E] rounded-lg p-2 outline-none"
              >
                <option value="private">Mật</option>
                <option value="chapter">Nội bộ</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-2">
              <label htmlFor="type" className="font-bold text-[#1C398E]">
                Loại tài liệu
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={handleChange}
                className="border border-[#1C398E] rounded-lg p-2 outline-none"
              >
                <option value="VBHC">Văn bản hành chính</option>
                <option value="TLSH">Tài liệu sinh hoạt</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="font-bold text-[#1C398E]">
              Mô tả
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Nhập mô tả"
              rows={3}
              className="border border-[#1C398E] rounded-lg p-2 outline-none resize-none"
            />
          </div>
        </div>

        {/* PDF Preview */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[#1C398E] font-bold text-lg">Thêm tài liệu PDF</h2>
          <label className="bg-[#1C398E] text-white py-1 px-4 rounded-lg cursor-pointer inline-block hover:bg-[#162f77]">
            Chọn file PDF
            <input type="file" accept="application/pdf" onChange={onFileChange} className="hidden" />
          </label>
          {error && <p className="text-red-500">{error}</p>}
          {file && (
            <div className="mt-2 border-4 border-[#1C398E] rounded-lg p-2 overflow-auto bg-[#e5e8f8] max-h-[50vh]">
              <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={() => setError("Không thể hiển thị PDF")}
              >
                {Array.from(new Array(numPages), (_, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={400} />
                ))}
              </Document>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`bg-[#1C398E] text-white font-bold rounded-lg py-2 px-6 w-28 text-center ${
              isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:bg-[#162f77]"
            } flex justify-center items-center`}
          >
            {isLoading ? <ClipLoader size={16} color="#fff" /> : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDocument;
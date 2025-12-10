import { useState } from "react";
import { IoAddCircle } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import AddDocument from "../components/AddDocument";
import DocumentDetails from "../components/DocumentDetails";
// @ts-ignore - Module Federation remote
import { useGetDocumentsInPageQuery } from "home/store";

interface Document {
  _id: string;
  name: string;
  docCode: string;
  type: string;
  scope: string;
}

const fields = [
  { flex: "w-1/12", label: "STT" },
  { flex: "w-4/12", label: "Tên văn bản" },
  { flex: "w-2/12", label: "Số hiệu" },
  { flex: "w-2/12", label: "Loại văn bản" },
  { flex: "w-2/12", label: "Quy mô" },
];

const typeMap: Record<string, string> = {
  VBHC: "Văn bản hành chính",
  TLSH: "Tài liệu sinh hoạt",
  other: "Khác",
};

const scopeMap: Record<string, string> = {
  chapter: "Nội bộ",
  private: "Mật",
};

export default function Documents() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("");

  const { data, isLoading, error } = useGetDocumentsInPageQuery({
    page: currentPage,
    limit: 6,
    search,
    scope,
  });

  // ❗ Chỉ toast 1 lần, không để trong render chính
  if (error) {
    toast.error("Không thể tải danh sách văn bản");
  }

  // 🔒 Luôn an toàn (tránh undefined.length)
  const documents = data?.documents ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="p-6 space-y-4">
      {/* Toolbar */}
      <div className="flex items-end gap-4">
        <div className="flex-2 flex flex-col">
          <label htmlFor="search" className="mb-1 font-semibold">
            Tìm kiếm
          </label>
          <input
            id="search"
            type="search"
            placeholder="Tìm theo tên ..."
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex-1 flex flex-col">
          <label htmlFor="scope" className="mb-1 font-semibold">
            Quy mô
          </label>
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="border rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả</option>
            <option value="private">Mật</option>
            <option value="chapter">Chi đoàn</option>
          </select>
        </div>

        <div className="flex-1 flex justify-end">
          <IoAddCircle
            size={60}
            color="#3c78d8"
            className="cursor-pointer"
            onClick={() => setOpenAdd(true)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded shadow overflow-hidden">
        {/* Header */}
        <div className="flex bg-gray-100">
          {fields.map((field, idx) => (
            <div key={idx} className={`${field.flex} p-2 text-center font-semibold`}>
              {field.label}
            </div>
          ))}
        </div>

        {/* Data */}
        <div>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-6">
              <ClipLoader size={50} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : documents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">Không có dữ liệu</div>
          ) : (
            documents.map((doc: Document, idx: number) => (
              <div
                key={doc._id}
                className="flex border-t hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setSelectedId(doc._id);
                  setOpenDetails(true);
                }}
              >
                <div className={`${fields[0].flex} p-2 text-center`}>
                  {idx + 1 + (currentPage - 1) * 6}
                </div>
                <div className={`${fields[1].flex} p-2`}>{doc.name}</div>
                <div className={`${fields[2].flex} p-2 text-center`}>{doc.docCode}</div>
                <div className={`${fields[3].flex} p-2 text-center`}>{typeMap[doc.type]}</div>
                <div className={`${fields[4].flex} p-2 text-center`}>{scopeMap[doc.scope]}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

      {/* Modals */}
      {openDetails && <DocumentDetails id={selectedId} open={setOpenDetails} canEdit={true} />}
      {openAdd && <AddDocument open={setOpenAdd} />}
    </div>
  );
}

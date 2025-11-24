import { useState } from "react";
// @ts-ignore - Module Federation remote
import { useGetDocumentsQuery } from "home/store";
import { IoAddCircle } from "react-icons/io5";
import ClipLoader from "react-spinners/ClipLoader";
import AddDocument from "../components/Documents/AddDocument";
import DocumentDetails from "../components/DocumentDetails";

const mapFields: Record<string, string> = {
  VBHC: "Văn bản hành chính",
  TLSH: "Tài liệu sinh hoạt",
  other: "Khác",
  chapter: "Nội bộ",
  private: "Mật",
};

export default function Documents() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [scope, setScope] = useState("");
  const [id, setId] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);

  const { data, isLoading } = useGetDocumentsQuery({
    page,
    search,
    scope,
  });

  return (
    <div className="w-full h-full flex flex-col items-center p-6 gap-10">
      {/* Toolbar */}
      <div className="flex w-[90%] gap-5">
        <div className="flex flex-col gap-1 flex-2 w-full">
          <label className="font-semibold text-blue-600">Tìm kiếm</label>
          <input
            type="search"
            placeholder="Tìm theo tên..."
            className="border-2 h-12 rounded-lg border-blue-600 px-3 text-blue-600 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1">
          <label className="font-semibold text-blue-600">Quy mô</label>
          <select
            className="border-2 h-12 rounded-lg border-blue-600 px-3 text-blue-600 outline-none"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="private">Mật</option>
            <option value="chapter">Chi đoàn</option>
          </select>
        </div>

        <div
          className="flex items-end cursor-pointer"
          onClick={() => setOpenAdd(true)}
        >
          <IoAddCircle size={60} color="#3c78d8" />
        </div>
      </div>

      {/* Table */}
      <div className="w-[90%] border rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white font-bold flex p-4">
          <div className="flex-1 text-center">STT</div>
          <div className="flex-4 text-center">Tên văn bản</div>
          <div className="flex-2 text-center">Số hiệu</div>
          <div className="flex-2 text-center">Loại văn bản</div>
          <div className="flex-2 text-center">Quy mô</div>
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col items-center p-10">
              <ClipLoader size={40} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : !data?.documents?.length ? (
            <div className="text-center py-10 text-gray-500">
              Không có dữ liệu
            </div>
          ) : (
            data.documents.map((item, index) => (
              <div
                key={item._id}
                className="flex p-4 border-b cursor-pointer hover:bg-blue-100"
                onClick={() => {
                  setId(item._id);
                  setOpenDetails(true);
                }}
              >
                <div className="flex-1 text-center">
                  {index + 1 + (page - 1) * 6}
                </div>
                <div className="flex-4">{item.name}</div>
                <div className="flex-2 text-center">{item.docCode}</div>
                <div className="flex-2 text-center">{mapFields[item.type]}</div>
                <div className="flex-2 text-center">{mapFields[item.scope]}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex gap-3 items-center">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>
        <span>{page}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
          disabled={page >= (data?.totalPages ?? 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {openDetails && (
        <DocumentDetails id={id} open={setOpenDetails} canEdit={true} />
      )}
      {openAdd && <AddDocument open={setOpenAdd} />}
    </div>
  );
}

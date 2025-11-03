import { useState } from 'react';
import Pagination from '../components/Pagination';
import ClipLoader from 'react-spinners/ClipLoader';
import DocumentDetails from '../components/DocumentDetails';
// @ts-ignore - Module federation remote
import { useGetDocumentsInPageQuery } from 'home/store';

export default function MemberDocument() {
  const fields = [
    { flex: 1, field: 'STT' },
    { flex: 4, field: 'Tên văn bản' },
    { flex: 2, field: 'Số hiệu' },
    { flex: 2, field: 'Loại văn bản' },
    { flex: 2, field: 'Quy mô' },
  ];

  const mapFields: Record<string, string> = {
    VBHC: 'Văn bản hành chính',
    TLSH: 'Tài liệu sinh hoạt',
    other: 'Khác',
    chapter: 'Nội bộ',
    private: 'Mật',
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [id, setId] = useState('');
  const [openDetails, setOpenDetails] = useState(false);

  // Use RTK Query hook to fetch documents
  const {
    data: response,
    isLoading,
    isError,
  } = useGetDocumentsInPageQuery({
    page: currentPage,
    limit: 6,
    search: search,
    scope: 'chapter',
  });

  const data = response?.data?.documents || [];
  const totalPages = response?.data?.totalPages || 1;

  return (
    <div className="border border-solid w-full h-full flex box-border flex-col items-center p-5 gap-10 relative">
      <div className="flex flex-row w-[90%] gap-5">
        <div className="flex flex-col gap-1.5 w-full flex-2">
          <label htmlFor="search" className="text-(--normal-blue) font-bold">
            Tìm kiếm
          </label>
          <input
            type="search"
            id="search"
            placeholder="Tìm theo tên ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none h-[52px] rounded-[10px] px-2.5 border-2 border-solid border-(--normal-blue) caret-black text-(--normal-blue)"
          />
        </div>
      </div>

      <div className="w-[90%] border border-solid border-gray-300 rounded-t-[10px]">
        <div className="flex bg-blue-800 p-[15px] text-white font-bold text-center rounded-t-[10px]">
          {fields.map((item, index) => (
            <div
              key={index}
              className="text-center"
              style={{ flex: item.flex }}
            >
              <p>{item.field}</p>
            </div>
          ))}
        </div>

        <div>
          {isLoading ? (
            <div className="flex flex-col items-center py-10 text-base text-gray-600">
              <ClipLoader color="#36d7b7" size={50} />
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10 text-base text-red-600">
              <p>Không thể tải danh sách tài liệu</p>
            </div>
          ) : data?.length === 0 ? (
            <div className="text-center py-10 text-base text-gray-600">
              <p>Không có dữ liệu</p>
            </div>
          ) : (
            data.map((item: any, index: number) => (
              <div
                key={index}
                className="flex p-[15px] text-(--dark-blue) text-left justify-center items-center border-b border-solid border-gray-300 hover:bg-(--light-blue) active:bg-(--weight-blue) cursor-pointer"
                onClick={() => {
                  setOpenDetails(true);
                  setId(item._id);
                }}
              >
                <div className="text-center" style={{ flex: fields[0].flex }}>
                  <p>{index + 1 + (currentPage - 1) * 6}</p>
                </div>
                <div style={{ flex: fields[1].flex }}>
                  <p>{item.name}</p>
                </div>
                <div style={{ flex: fields[2].flex }}>
                  <p>{item.docCode}</p>
                </div>
                <div style={{ flex: fields[3].flex }}>
                  <p className="text-center">{mapFields[item.type]}</p>
                </div>
                <div style={{ flex: fields[4].flex }}>
                  <p className="text-center">{mapFields[item.scope]}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      {openDetails && (
        <DocumentDetails id={id} open={setOpenDetails} canEdit={false} />
      )}
    </div>
  );
}

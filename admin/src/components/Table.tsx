import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.png";
import { formatDisplayValue, formatUtcDateToDDMMYYYY } from "../utils/index";
import AccountDetails from "../components/AccountDetails";
import { createPortal } from "react-dom";

// import AccountForm from "../Form/AccountForm/AccountForm";
// import ChapterForm from "../Form/ChapterForm/ChapterForm";
// import EventForm from "../Form/EventForm/EventForm";

interface TableProps {
  name: string;
  data: any[];
  startIndex: number;
}

interface FieldConfig {
  flex: number;
  field: string;
  data?: string;
}

const Table: React.FC<TableProps> = ({ name, data, startIndex }) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [id, setId] = useState<string>("");

  const accountFields: FieldConfig[] = [
    { flex: 1, field: "STT", data: "" },
    { flex: 3, field: "Họ và tên", data: "fullname" },
    { flex: 3, field: "Email", data: "email" },
    { flex: 2, field: "Phân quyền", data: "role" },
    { flex: 2, field: "Trạng thái", data: "status" },
  ];

  const chapterFields: FieldConfig[] = [
    { flex: 1, field: "STT" },
    { flex: 3, field: "Tên chi đoàn", data: "name" },
    { flex: 3, field: "Địa chỉ", data: "address" },
    { flex: 3, field: "Người quản lý", data: "manager" },
    { flex: 1, field: "Trạng thái", data: "status" },
  ];

  const memberFields: FieldConfig[] = [
    { flex: 1, field: "STT" },
    { flex: 3, field: "Họ và tên", data: "fullname" },
    { flex: 2, field: "Số thẻ đoàn", data: "cardId" },
    { flex: 2, field: "Chức vụ", data: "position" },
    { flex: 1, field: "Trạng thái", data: "status" },
  ];

  const eventFields: FieldConfig[] = [
    { flex: 1, field: "STT" },
    { flex: 3, field: "Tên sự kiện", data: "name" },
    { flex: 1, field: "Ngày diễn ra", data: "startedAt" },
    { flex: 2, field: "Địa điểm", data: "location" },
    { flex: 1, field: "Quy mô", data: "scope" },
    { flex: 1, field: "Trạng thái", data: "status" },
  ];

  const documentFields: FieldConfig[] = [
    { flex: 0.5, field: "STT" },
    { flex: 2.5, field: "Tên tài liệu", data: "title" },
    { flex: 2, field: "Số, ký hiệu", data: "code" },
    { flex: 2, field: "Nơi ban hành", data: "issuedBy" },
    { flex: 1.5, field: "Độ mật", data: "confidentiality" },
  ];

  const [fields, setFields] = useState<FieldConfig[]>([]);

  useEffect(() => {
    switch (name) {
      case "account": setFields(accountFields); break;
      case "chapter": setFields(chapterFields); break;
      case "member": setFields(memberFields); break;
      case "event": setFields(eventFields); break;
      case "document": setFields(documentFields); break;
      default: setFields([]);
    }
  }, [name, data, openDetails]);

  return (
    <>
      <div className="w-full rounded-lg shadow-md border border-gray-200">
        <div className="flex font-bold px-4 py-3 bg-blue-900 text-white rounded-t-lg gap-3 text-center">
          {fields.map((col, index) => (
            <div key={index} style={{ flex: col.flex }} className="truncate">
              {col.field}
            </div>
          ))}
        </div>

        {data?.map((item, index) => (
          <div
            key={index}
            // className="flex px-4 py-2 border-b border-gray-100 items-center gap-3 cursor-pointer hover:bg-blue-100 rounded-lg text-center h-12"
            className="flex px-4 py-2 border border-red-500 relative z-50 
             border-b border-gray-100 items-center gap-3 cursor-pointer 
             hover:bg-blue-100 rounded-lg text-center h-12"
            onClick={() => { setId(item._id); setOpenDetails(true); }}
          >
            {fields.map((col, i) => (
              <div key={i} style={{ flex: col.flex }} className="truncate">
                {col.data === "manager" || col.data === "fullname" ? (
                  <div className="flex gap-2 items-center text-left">
                    <img src={item.avatar || avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                    <p>{item.fullname || "Chưa có"}</p>
                  </div>
                ) : col.data === "startedAt" || col.data === "issuedAt" ? (
                  <>{formatUtcDateToDDMMYYYY(item?.[col.data])}</>
                ) : (
                  <>
                    {i === 0 ? index + 1 + startIndex : formatDisplayValue(col.data || "", item?.[col.data || ""])}
                  </>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* {openDetails && (
        <>
          {(name === "account" || name === "member") && (
            <AccountDetails id={id} setOpen={setOpenDetails} />
          )}
        </>
      )}  */}
      {openDetails &&
  createPortal(
    <AccountDetails id={id} setOpen={setOpenDetails} />,
    document.body
  )
}
    </>
  );
};

export default Table;

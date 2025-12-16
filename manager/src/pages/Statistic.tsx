import React, { useState } from "react";
// @ts-ignore - Module Federation remote
import {
  useGetMemberStatisticQuery,
  useGetEventStatisticQuery,
  useGetDocumentStatisticQuery,  // @ts-ignore
} from "home/store";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import PieStatistic from "../components/PieStatistic";

/* =======================
   Utils
======================= */
const convertDocumentTypeLabel = (type: string) => {
  switch (type) {
    case "VBHC":
      return "Văn bản hành chính";
    case "TLSH":
      return "Tài liệu sinh hoạt";
    case "other":
      return "Khác";
    default:
      return type;
  }
};

const convertDocumentScopeLabel = (scope: string) => {
  switch (scope) {
    case "chapter":
      return "Nội bộ";
    case "private":
      return "Mật";
    default:
      return scope;
  }
};

/* =======================
   Component
======================= */
const Statistic: React.FC = () => {
  const [selected, setSelected] = useState<
    "members" | "events" | "documents"
  >("members");

  /* ===== API ===== */
  const { data: memberStat } = useGetMemberStatisticQuery();
  const { data: eventStat } = useGetEventStatisticQuery();
  const { data: documentStat } = useGetDocumentStatisticQuery();

  /* ===== MEMBER DATA ===== */
  const memberByGender = memberStat?.data.memberByGender ?? [];
  const memberByRole = memberStat?.data.memberByRole ?? [];
  const memberByStatus = memberStat?.data.memberByStatus ?? [];

  const participationData =
    memberStat?.data.participationData
      ?.slice()
      ?.sort((a: { name: string; value: number }, b: { name: string; value: number }) =>
    b.value - a.value
)


  /* ===== EVENT DATA ===== */
  const eventByStatus = eventStat?.data.eventByStatus ?? [];
  const eventByType = eventStat?.data.eventByType ?? [];
  const interactionData = eventStat?.data.interactionData ?? [];

  /* ===== DOCUMENT DATA ===== */
  const documentByType =
    documentStat?.data.documentByType?.map((item: any) => ({
      name: convertDocumentTypeLabel(item.name),
      value: item.value,
    })) ?? [];

  const documentByScope =
    documentStat?.data.documentByScope?.map((item: any) => ({
      name: convertDocumentScopeLabel(item.name),
      value: item.value,
    })) ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">
        Thống kê
      </h1>

      {/* ===== SELECT ===== */}
      <div className="mb-6">
        <label className="font-bold text-blue-900 mr-2">
          Chọn loại thống kê:
        </label>
        <select
          value={selected}
          onChange={(e) =>
            setSelected(e.target.value as any)
          }
          className="p-2 border-2 border-blue-900 rounded-lg text-blue-900"
        >
          <option value="members">Đoàn viên</option>
          <option value="events">Sự kiện</option>
          <option value="documents">Tài liệu</option>
        </select>
      </div>

      {/* ================= MEMBER STATISTIC ================= */}
      {selected === "members" && (
        <>
          <h2 className="text-xl font-semibold text-blue-900">
            Thống kê đoàn viên
          </h2>

          <div className="flex flex-wrap gap-6 justify-around mt-4">
            <PieStatistic title="Giới tính" data={memberByGender} />
            <PieStatistic title="Chức vụ" data={memberByRole} />
            <PieStatistic title="Trạng thái" data={memberByStatus} />
          </div>

          <h3 className="mt-10 mb-4 font-semibold text-blue-900">
            Số lượt tham gia của từng đoàn viên
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participationData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0d47a1" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ================= EVENT STATISTIC ================= */}
      {selected === "events" && (
        <>
          <h2 className="text-xl font-semibold text-blue-900">
            Thống kê sự kiện
          </h2>

          <div className="flex flex-wrap gap-6 justify-around mt-4">
            <PieStatistic title="Trạng thái" data={eventByStatus} />
            <PieStatistic title="Phân loại" data={eventByType} />
          </div>

          <h3 className="mt-10 mb-4 font-semibold text-blue-900">
            Lượt tương tác của các sự kiện
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interactionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="Lượt thích" fill="#0d47a1" />
              <Bar dataKey="comments" name="Bình luận" fill="#ff9800" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* ================= DOCUMENT STATISTIC ================= */}
      {selected === "documents" && (
        <>
          <h2 className="text-xl font-semibold text-blue-900">
            Thống kê tài liệu
          </h2>

          <div className="flex flex-wrap gap-6 justify-center mt-4">
            <PieStatistic
              title="Phân loại tài liệu"
              data={documentByType}
            />
            <PieStatistic
              title="Phạm vi tài liệu"
              data={documentByScope}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Statistic;

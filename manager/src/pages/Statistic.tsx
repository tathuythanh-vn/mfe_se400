import React, { useState } from "react";
import {
  useGetMemberStatisticQuery,
  useGetEventStatisticQuery,
  useGetDocumentStatisticQuery // @ts-ignore - Module Federation remote
} from "home/store";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import PieStatistic from "../components/PieStatistic";

const convertDocumentTypeLabel = (type: string) => {
  switch (type) {
    case "VBHC": return "Văn bản hành chính";
    case "TLSH": return "Tài liệu sinh hoạt";
    case "other": return "Khác";
    default: return type;
  }
};

const convertDocumentScopeLabel = (scope: string) => {
  switch (scope) {
    case "chapter": return "Nội bộ";
    case "private": return "Mật";
    default: return scope;
  }
};

const Statistic: React.FC = () => {
  const [selected, setSelected] = useState<"members" | "events" | "documents">("members");

  const { data: memberStat } = useGetMemberStatisticQuery();
  const { data: eventStat } = useGetEventStatisticQuery();
  const { data: docStat } = useGetDocumentStatisticQuery();

  const memberByGender = memberStat?.data.memberByGender ?? [];
  const memberByRole = memberStat?.data.memberByRole ?? [];
  const memberByStatus = memberStat?.data.memberByStatus ?? [];
  const participationData = memberStat?.data.participationData?.sort((a: any, b: any) => b.participation - a.participation) ?? [];

  const eventByStatus = eventStat?.data.eventByStatus ?? [];
  const eventByType = eventStat?.data.eventByType ?? [];
  const interactionData = eventStat?.data.interactionData ?? [];

  const documentByType = docStat?.data.documentByType?.map((i: any) => ({
    name: convertDocumentTypeLabel(i.name),
    value: i.value
  })) ?? [];

  const documentByScope = docStat?.data.documentByScope?.map((i: any) => ({
    name: convertDocumentScopeLabel(i.name),
    value: i.value
  })) ?? [];

  return (
    <div className="p-6">
      <h1 className="text-2xl text-blue-900 font-bold mb-6">Thống kê</h1>

      {/* Select */}
      <div className="mb-6">
        <label className="font-bold text-blue-900 mr-2">Chọn loại thống kê:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as any)}
          className="p-2 border-2 border-blue-900 rounded-lg text-blue-900"
        >
          <option value="members">Đoàn viên</option>
          <option value="events">Sự kiện</option>
          <option value="documents">Tài liệu</option>
        </select>
      </div>

      {/* MEMBER STATISTIC */}
      {selected === "members" && (
        <>
          <h2 className="text-blue-900 font-semibold text-xl">Thống kê đoàn viên</h2>
          <div className="flex flex-wrap gap-6 justify-around mt-4">
            <PieStatistic title="Giới tính" data={memberByGender} />
            <PieStatistic title="Chức vụ" data={memberByRole} />
            <PieStatistic title="Trạng thái" data={memberByStatus} />
          </div>

          <h3 className="text-blue-900 mt-10 mb-4 font-semibold">
            Số lượt tham gia của từng đoàn viên
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={participationData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="participation" fill="#0d47a1" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* EVENT STATISTIC */}
      {selected === "events" && (
        <>
          <h2 className="text-blue-900 font-semibold text-xl">Thống kê sự kiện</h2>
          <div className="flex flex-wrap gap-6 justify-around mt-4">
            <PieStatistic title="Trạng thái" data={eventByStatus} />
            <PieStatistic title="Phân loại" data={eventByType} />
          </div>

          <h3 className="text-blue-900 mt-10 mb-4 font-semibold">
            Lượt tương tác của các sự kiện
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={interactionData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="likes" name="Lượt thích" fill="#0d47a1" />
              <Bar dataKey="comments" name="Bình luận" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      {/* DOCUMENT STATISTIC */}
      {selected === "documents" && (
        <>
          <h2 className="text-blue-900 font-semibold text-xl">Thống kê tài liệu</h2>
          <div className="flex flex-wrap gap-6 justify-center mt-4">
            <PieStatistic title="Phân loại tài liệu" data={documentByType} />
            <PieStatistic title="Phạm vi tài liệu" data={documentByScope} />
          </div>
        </>
      )}
    </div>
  );
};

export default Statistic;

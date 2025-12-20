import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { useGetAccountStatisticQuery, useGetStatisticQuery } from "home/store";

ChartJS.register(ArcElement, Tooltip);

const CustomLegend = ({ labels, colors }: { labels: string[]; colors: string[] }) => (
  <div className="flex flex-col gap-3 mt-4">
    {labels.map((label, index) => (
      <div key={index} className="flex items-center gap-2">
        <div
          className="w-4 h-4 rounded"
          style={{ backgroundColor: colors[index] }}
        />
        <span className="text-blue-800 font-medium">{label}</span>
      </div>
    ))}
  </div>
);

export default function AdminStatistic() {
  const { data: accountStat, isLoading: loadingAccount } = useGetAccountStatisticQuery();
  const { data: chapterStat, isLoading: loadingChapter } = useGetStatisticQuery();
  const loading = loadingAccount || loadingChapter;

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center text-blue-800 text-xl font-semibold">
        Đang tải thống kê...
      </div>
    );
  }

  const statusCounts = [
    accountStat?.data.status.active ?? 0,
    accountStat?.data.status.locked ?? 0,
    accountStat?.data.status.pending ?? 0,
  ];

  const roleCounts = [
    accountStat?.data.role.admin ?? 0,
    accountStat?.data.role.manager ?? 0,
    accountStat?.data.role.member ?? 0,
  ];

  const chapterStatusCounts = [
    chapterStat?.data.status.active ?? 0,
    chapterStat?.data.status.locked ?? 0,
  ];

  const chapterManagerCounts = [
    chapterStat?.data.manager.hadManager ?? 0,
    chapterStat?.data.manager.noManager ?? 0,
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // quan trọng: fix lỗi quá to
    plugins: { legend: { display: false } },
  };

  const statusData = {
    labels: ["Hoạt động", "Bị khóa", "Chờ phê duyệt"],
    datasets: [{ data: statusCounts, backgroundColor: ["#2196F3", "#1976D2", "#BBDEFB"] }],
  };

  const roleData = {
    labels: ["Quản trị viên", "Quản lý chi đoàn", "Đoàn viên"],
    datasets: [{ data: roleCounts, backgroundColor: ["#1E88E5", "#42A5F5", "#90CAF9"] }],
  };

  const chapterManagerData = {
    labels: ["Có quản lý", "Chưa có quản lý"],
    datasets: [{ data: chapterManagerCounts, backgroundColor: ["#64B5F6", "#B3E5FC"] }],
  };

  const chapterStatusData = {
    labels: ["Hoạt động", "Khóa"],
    datasets: [{ data: chapterStatusCounts, backgroundColor: ["#0D47A1", "#64B5F6"] }],
  };

  const renderChart = (data: any) => (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="relative w-full md:w-1/2 h-[200px]">
        <Doughnut data={data} options={chartOptions} />
      </div>
      <CustomLegend labels={data.labels} colors={data.datasets[0].backgroundColor} />
    </div>
  );

  return (
    <div className="w-full h-full flex flex-col gap-10 p-10 box-border">

      {/* ============================ ACCOUNT SECTION ============================ */}
      <div className="w-full bg-blue-700 rounded-2xl shadow-md p-6 flex flex-col gap-6">
        <p className="text-white text-center font-bold text-2xl">Thống kê tài khoản</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-5">
            <h4 className="text-center text-blue-800 font-semibold">Theo trạng thái</h4>
            {renderChart(statusData)}
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-5">
            <h4 className="text-center text-blue-800 font-semibold">Theo vai trò</h4>
            {renderChart(roleData)}
          </div>
        </div>
      </div>

      {/* ============================ CHAPTER SECTION ============================ */}
      <div className="w-full bg-blue-700 rounded-2xl shadow-md p-6 flex flex-col gap-6">
        <p className="text-white text-center font-bold text-2xl">Thống kê chi đoàn</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-5">
            <h4 className="text-center text-blue-800 font-semibold">Trạng thái quản lý</h4>
            {renderChart(chapterManagerData)}
          </div>
          <div className="bg-white rounded-lg shadow p-5 flex flex-col gap-5">
            <h4 className="text-center text-blue-800 font-semibold">Trạng thái hoạt động</h4>
            {renderChart(chapterStatusData)}
          </div>
        </div>
      </div>

    </div>
  );
}

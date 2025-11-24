import Sidebar from "home/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminContent() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">

        <Outlet />
      </div>
    </div>
  );
}

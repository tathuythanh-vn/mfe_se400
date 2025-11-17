import AdminSidebar from "./components/Adminsidebar";
import { Outlet } from "react-router-dom";

export default function AdminContent() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Nội dung chính */}
      {/* <div className="flex-1 bg-gray-50 min-h-screen"> */}
      <div className="flex-1 bg-gray-50 min-h-screen overflow-auto">

        <Outlet />
      </div>
    </div>
  );
}

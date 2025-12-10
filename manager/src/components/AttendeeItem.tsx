import React, { useState } from "react";
import avatar from "../assets/avatar.png";
// @ts-ignore - Module Federation remote
import { useCheckinMutation } from "home/store";

interface AttendeeItemProps {
  item: {
    _id: string;
    fullname: string;
    memberOf: { name: string };
    position: "secretary" | "deputy_secretary" | "commitee_member" | "member";
    cardCode: string;
    status: string;
    avatar?: { path?: string };
  };
}

const mapFields: Record<AttendeeItemProps["item"]["position"], string> = {
  secretary: "Bí thư",
  deputy_secretary: "Phó Bí thư",
  commitee_member: "Ủy viên Ban chấp hành",
  member: "Đoàn viên",
};

const AttendeeItem: React.FC<AttendeeItemProps> = ({ item }) => {
  const [checkin, setCheckin] = useState(item.status === "attended");

  // Mutation từ RTK Query
  const [checkinUser, { isLoading }] = useCheckinMutation();

  const handleCheckin = async () => {
    try {
      const res = await checkinUser(item._id).unwrap();
      if (res.success) {
        setCheckin(true);
      }
    } catch (error) {
      console.log("Checkin error:", error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 border-b border-gray-300">
      <img
        src={item?.avatar?.path || avatar}
        alt="avatar"
        className="w-16 h-16 rounded-full object-cover"
      />

      <div className="flex-1 text-sm space-y-1">
        <p>
          <strong>Họ tên:</strong> {item.fullname}
        </p>
        <p>
          <strong>Chi đoàn:</strong> {item.memberOf.name}
        </p>
        <p>
          <strong>Chức vụ:</strong> {mapFields[item.position]}
        </p>
        <p>
          <strong>Số thẻ Đoàn:</strong> {item.cardCode}
        </p>
      </div>

      <div className="min-w-[120px] text-right">
        {checkin ? (
          <p className="text-green-600 font-bold">Đã có mặt</p>
        ) : (
          <button
            onClick={handleCheckin}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Điểm danh"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendeeItem;

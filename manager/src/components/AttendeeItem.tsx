import React, { useState } from "react";
import avatar from '../../assets/avatar.png';

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

  const handleCheckin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/event-registrations/${item._id}`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (data.success) {
        setCheckin(true);
      }
    } catch (error) {
      console.log(error);
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
          <p className="text-green-600 font-bold">✅ Đã có mặt</p>
        ) : (
          <button
            onClick={handleCheckin}
            className="bg-blue-600 hover:bg-blue-800 text-white px-3 py-1 rounded-md"
          >
            Điểm danh
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendeeItem;

import React, { useMemo } from "react";
import avatarFallback from "../assets/avatar.png";
// @ts-ignore - Module Federation remote
import { useCheckInToEventMutation, EventRegistrationWithAccount } from "home/store";

interface AttendeeItemProps {
  item: EventRegistrationWithAccount;
}

const positionMap: Record<string, string> = {
  secretary: 'Bí thư',
  deputy_secretary: 'Phó Bí thư',
  commitee_member: 'Ủy viên Ban chấp hành',
  member: 'Đoàn viên',
};

const AttendeeItem: React.FC<AttendeeItemProps> = ({ item }) => {
  const [checkInToEvent, { isLoading }] = useCheckInToEventMutation();

  const isCheckedIn = useMemo(
    () => item.status === 'attended',
    [item.status]
  );

  const handleCheckIn = async () => {
    try {
      await checkInToEvent(item._id).unwrap();
      // Không cần setState vì RTK Query sẽ refetch nhờ invalidatesTags
    } catch (error) {
      console.error('Check-in failed:', error);
    }
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm">
      {/* Avatar */}
      <img
        src={item.avatar?.path || avatarFallback}
        alt="avatar"
        className="h-16 w-16 rounded-full object-cover border"
      />

      {/* Info */}
      <div className="flex-1 space-y-1 text-sm">
        <p>
          <span className="font-semibold">Họ tên:</span>{' '}
          {item.fullname || '—'}
        </p>
        <p>
          <span className="font-semibold">Chi đoàn:</span>{' '}
          {item.memberOf?.name || '—'}
        </p>
        <p>
          <span className="font-semibold">Chức vụ:</span>{' '}
          {positionMap[item.position as string] || '—'}
        </p>
        <p>
          <span className="font-semibold">Số thẻ Đoàn:</span>{' '}
          {item.cardCode || '—'}
        </p>
      </div>

      {/* Action */}
      <div>
        {isCheckedIn ? (
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            ✅ Đã có mặt
          </span>
        ) : (
          <button
            onClick={handleCheckIn}
            disabled={isLoading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Đang điểm danh...' : 'Điểm danh'}
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendeeItem;

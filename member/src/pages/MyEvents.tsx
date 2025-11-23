import { useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
// @ts-ignore - module federation
import { useGetMyEventsQuery, useCancelEventRegistrationMutation } from "home/store";

export default function MyEvents() {
  const [confirmEvent, setConfirmEvent] = useState<any>(null);
  const [message, setMessage] = useState("");

  // Lấy danh sách sự kiện đã đăng ký bằng RTK Query
  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useGetMyEventsQuery(undefined);

  const events = response?.data || [];

  // Mutation hủy đăng ký sự kiện
  const [cancelRegistration, { isLoading: isCancelling }] =
    useCancelEventRegistrationMutation();

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    const h = date.getHours().toString().padStart(2, "0");
    const min = date.getMinutes().toString().padStart(2, "0");
    return `${d}/${m}/${y} ${h}:${min}`;
  };

  // Hủy đăng ký sự kiện
  const handleCancel = async () => {
    if (!confirmEvent) return;
    try {
      await cancelRegistration(confirmEvent._id).unwrap();
      toast.success(`Đã hủy đăng ký sự kiện: ${confirmEvent.name}`);
      setConfirmEvent(null);
      setMessage(`Đã hủy đăng ký sự kiện: ${confirmEvent.name}`);
      refetch();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      toast.error("Không thể hủy đăng ký sự kiện!");
    }
  };

  return (
    <div className="p-6 bg-blue-50 min-h-screen">
      <h2 className="text-2xl font-semibold text-blue-600 mb-5">
        Sự kiện đã đăng ký
      </h2>

      {message && (
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md border border-blue-200 mb-4">
          {message}
        </div>
      )}

      {/* Trạng thái tải dữ liệu */}
      {isLoading ? (
        <div className="text-center mt-10">
          <ClipLoader color="#36d7b7" size={50} />
          <p className="mt-2 text-gray-600">Đang tải dữ liệu...</p>
        </div>
      ) : isError ? (
        <p className="text-red-600">Không thể tải danh sách sự kiện.</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">Bạn chưa đăng ký sự kiện nào.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {events.map((event: any) => (
            <div
              key={event._id}
              className="bg-white border border-blue-400 rounded-xl shadow-sm p-4 transition hover:shadow-md"
            >
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                {event.name}
              </h3>
              <p>
                <strong>Thời gian:</strong> {formatDate(event.startTime)}
              </p>
              <p>
                <strong>Địa điểm:</strong> {event.location}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {event.status === "completed" ? "Đã diễn ra" : "Sắp diễn ra"}
              </p>
              <button
                className={`mt-3 px-3 py-2 rounded-md text-white font-medium transition ${
                  event.status === "completed" || isCancelling
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={event.status === "completed" || isCancelling}
                onClick={() => setConfirmEvent(event)}
              >
                {isCancelling && confirmEvent?._id === event._id
                  ? "Đang hủy..."
                  : "Hủy đăng ký"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận */}
      {confirmEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[999]">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-sm shadow-lg text-center">
            <h4 className="text-lg font-semibold mb-2">
              Bạn có chắc muốn hủy đăng ký?
            </h4>
            <p className="text-gray-700 mb-4 font-medium">
              {confirmEvent.name}
            </p>
            <div className="flex justify-around">
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isCancelling
                    ? "bg-blue-300 cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isCancelling ? "Đang xử lý..." : "Xác nhận"}
              </button>
              <button
                onClick={() => setConfirmEvent(null)}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

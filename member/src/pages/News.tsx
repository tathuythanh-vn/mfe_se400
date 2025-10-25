import { useGetEventsInPageQuery } from 'home/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EventCard from '../components/EventCard';

const News = () => {
  const { data, isLoading, isError, error } = useGetEventsInPageQuery({
    page: 1,
    limit: 100,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-[60px]">
        <p className="text-gray-600 text-lg">Đang tải...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#f0f8ff] flex items-center justify-center p-[60px]">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-red-500 text-lg font-semibold">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
          <p className="text-gray-600 mt-2">
            {(error as any)?.data?.message || 'Vui lòng thử lại sau'}
          </p>
        </div>
      </div>
    );
  }

  const events = data?.data?.data || [];

  return (
    <>
      <div className="min-h-screen bg-[#f0f8ff] p-[60px]">
        <div className="flex flex-col gap-5 items-center justify-center">
          {events.map((event: any) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </>
  );
};

export default News;

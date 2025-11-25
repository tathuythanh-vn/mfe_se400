// import React, { useEffect, useState } from "react";
// import { IoCloseCircle } from "react-icons/io5";
// import { toast } from "react-toastify";
// import ClipLoader from "react-spinners/ClipLoader";
// import avatar from "../assests/avatar.png";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// export default function ChapterDetails({
//   id,
//   open,
// }: {
//   id: string;
//   open: (v: boolean) => void;
// }) {
//   const [data, setData] = useState<any>({});
//   const [update, setUpdate] = useState<any>({});
//   const [loading, setLoading] = useState(false);
//   const [updating, setUpdating] = useState(false);

//   useEffect(() => {
//     if (!id) return;

//     const fetchData = async () => {
//       setLoading(true);
//       try {
// const res = await fetch(`${API_URL}/chapters/${id}`);

//         const result = await res.json();

//         if (result.success) {
//           setData(result.data);
//         } else {
//           toast.error(result.message || "Không thể tải dữ liệu.");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Không thể tải dữ liệu.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const handleChange = (e: any) => {
//     const { id, value } = e.target;
//     setData((prev: any) => ({ ...prev, [id]: value }));
//     setUpdate((prev: any) => ({ ...prev, [id]: value }));
//   };

//   const handleUpdate = async () => {
//     if (!id) return;

//     setUpdating(true);
//     try {
// const res = await fetch(`${API_URL}/chapters/${id}`, {
//   method: "PUT",
//   body: JSON.stringify(update),
//   headers: { "Content-Type": "application/json" },
// });


//       const result = await res.json();
//       if (result.success) {
//         toast.success("Cập nhật thành công!");
//         setUpdate({});
//       } else {
//         toast.error(result.message || "Cập nhật thất bại.");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Cập nhật thất bại.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full gap-3 text-lg">
//         <ClipLoader size={50} />
//         <p>Đang tải dữ liệu chi đoàn...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
//       <div className="relative bg-white w-4/5 max-h-[90vh] rounded-2xl p-10 shadow-lg overflow-hidden">
//         {/* Close Button */}
//         <button
//           onClick={() => open(false)}
//           className="absolute top-3 right-3 active:-translate-y-0.5"
//         >
//           <IoCloseCircle size={40} color="red" />
//         </button>

//         {/* Form content */}
//         <div className="flex flex-col gap-6 max-h-[75vh] overflow-auto pr-3">
//           {/* Row 1 */}
//           <div className="flex gap-6">
//             <div className="flex flex-col gap-1 w-3/4">
//               <label className="font-semibold text-blue-700">Tên chi đoàn</label>
//               <input
//                 id="name"
//                 type="text"
//                 value={data?.name || ""}
//                 onChange={handleChange}
//                 placeholder="Nhập họ tên"
//                 className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
//               />
//             </div>

//             <div className="flex flex-col gap-1 w-1/4">
//               <label className="font-semibold text-blue-700">Trạng thái</label>

// <select
//   id="status"
//   title="Trạng thái chi đoàn"
//   value={data?.status || "active"}
//   onChange={handleChange}
//   className={`border border-blue-500 rounded-lg px-3 h-10 font-bold
//     ${
//       data?.status === "active"
//         ? "text-green-600"
//         : data?.status === "locked"
//         ? "text-red-600"
//         : "text-orange-500"
//     }
//   `}
// >
//   <option value="active">Hoạt động</option>
//   <option value="locked">Khóa</option>
//   <option value="pending">Chờ duyệt</option>
// </select>

//             </div>
//           </div>

//           {/* Row 2 */}
//           <div className="flex gap-6">
//             <div className="flex flex-col gap-1 w-3/4">
//               <label className="font-semibold text-blue-700">
//                 Đoàn trực thuộc
//               </label>
//               <input
//                 id="affiliated"
//                 type="text"
//                 value={data?.affiliated || ""}
//                 onChange={handleChange}
//                 placeholder="Nhập affiliated"
//                 className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
//               />
//             </div>

//             <div className="flex flex-col gap-1 w-1/4">
//               <label className="font-semibold text-blue-700">
//                 Ngày thành lập
//               </label>
//               <input
//                 id="establishedAt"
//                 type="date"
//                 title="Date"
//                 value={data?.establishedAt?.substring(0, 10) || ""}
//                 onChange={handleChange}
//                 className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
//               />
//             </div>
//           </div>

//           {/* Address */}
//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-blue-700">Địa chỉ</label>
//             <input
//               id="address"
//               type="text"
//               value={data?.address || ""}
//               onChange={handleChange}
//               placeholder="Nhập địa chỉ"
//               className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
//             />
//           </div>

//           {/* Manager */}
//           <div className="flex flex-col gap-2">
//             <label className="font-semibold text-blue-700">Người quản lý</label>

//             {data.fullname ? (
//               <div className="flex items-center gap-3 text-blue-900">
// <img
//   src={data.avatar?.path || avatar}
//   alt={data.fullname ? `Ảnh của ${data.fullname}` : "Ảnh đại diện"}
//   className="w-12 h-12 rounded-full object-cover"
// />

//                 <p>{data.fullname}</p>
//               </div>
//             ) : (
//               <p>Không</p>
//             )}
//           </div>

//           {/* Button */}
//           <div className="flex justify-center mt-2">
//             <button
//               onClick={handleUpdate}
//               disabled={updating}
//               className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md active:scale-95 disabled:bg-blue-400"
//             >
//               {updating ? <ClipLoader size={20} color="#fff" /> : "Lưu"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import avatar from "../assests/avatar.png";

import {
  useGetChapterByIdQuery,
  useUpdateChapterByIdMutation,
} from "home/store";

export default function ChapterDetails({
  id,
  open,
}: {
  id: string;
  open: (v: boolean) => void;
}) {
  // ============================
  //  FETCH Chapter by ID
  // ============================
  const {
    data: chapterData,
    isLoading,
    isError,
    error,
  } = useGetChapterByIdQuery(id, { skip: !id });

  // ============================
  //  Mutation Update Chapter
  // ============================
  const [updateChapter, { isLoading: updating }] =
    useUpdateChapterByIdMutation();

  // ============================
  //  LOCAL STATE giữ dữ liệu nhập
  // ============================
  const [data, setData] = useState<any>({});
  const [update, setUpdate] = useState<any>({});

  // Sync API data vào form
  useEffect(() => {
    if (chapterData?.data) {
      setData(chapterData.data);
    }
  }, [chapterData]);

  // ============================
  //  HANDLE CHANGE INPUT
  // ============================
  const handleChange = (e: any) => {
    const { id, value } = e.target;
    setData((prev: any) => ({ ...prev, [id]: value }));
    setUpdate((prev: any) => ({ ...prev, [id]: value }));
  };

  // ============================
  //  HANDLE UPDATE API (PUT)
  // ============================
  const handleUpdate = async () => {
    try {
      const res: any = await updateChapter({
        id,
        data: update,
      });

      if (res?.data?.success) {
        toast.success("Cập nhật thành công!");
        setUpdate({});
      } else {
        toast.error(res?.error?.data?.message || "Cập nhật thất bại.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại.");
    }
  };

  // ============================
  //  STATE LOADING
  // ============================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 text-lg">
        <ClipLoader size={50} />
        <p>Đang tải dữ liệu chi đoàn...</p>
      </div>
    );
  }

  // ============================
  //  ERROR STATE
  // ============================
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3">
        <p className="text-red-600 font-bold">Không thể tải dữ liệu.</p>
        <button
          onClick={() => open(false)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Đóng
        </button>
      </div>
    );
  }

  // ============================
  //  UI
  // ============================
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="relative bg-white w-4/5 max-h-[90vh] rounded-2xl p-10 shadow-lg overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => open(false)}
          className="absolute top-3 right-3 active:-translate-y-0.5"
        >
          <IoCloseCircle size={40} color="red" />
        </button>

        {/* Form content */}
        <div className="flex flex-col gap-6 max-h-[75vh] overflow-auto pr-3">
          {/* Row 1 */}
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 w-3/4">
              <label className="font-semibold text-blue-700">Tên chi đoàn</label>
              <input
                id="name"
                type="text"
                value={data?.name || ""}
                onChange={handleChange}
                placeholder="Nhập họ tên"
                className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
              />
            </div>

            <div className="flex flex-col gap-1 w-1/4">
              <label className="font-semibold text-blue-700">Trạng thái</label>

              <select
                id="status"
                title="status"
                value={data?.status || "active"}
                onChange={handleChange}
                className={`border border-blue-500 rounded-lg px-3 h-10 font-bold
                ${
                  data?.status === "active"
                    ? "text-green-600"
                    : data?.status === "locked"
                    ? "text-red-600"
                    : "text-orange-500"
                }
                `}
              >
                <option value="active">Hoạt động</option>
                <option value="locked">Khóa</option>
                <option value="pending">Chờ duyệt</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-6">
            <div className="flex flex-col gap-1 w-3/4">
              <label className="font-semibold text-blue-700">
                Đoàn trực thuộc
              </label>
              <input
                id="affiliated"
                type="text"
                value={data?.affiliated || ""}
                onChange={handleChange}
                placeholder="Nhập affiliated"
                className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
              />
            </div>

            <div className="flex flex-col gap-1 w-1/4">
              <label className="font-semibold text-blue-700">
                Ngày thành lập
              </label>
              <input
                id="establishedAt"
                title="date"
                type="date"
                value={data?.establishedAt?.substring(0, 10) || ""}
                onChange={handleChange}
                className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-blue-700">Địa chỉ</label>
            <input
              id="address"
              type="text"
              value={data?.address || ""}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="border border-blue-500 rounded-lg px-3 h-10 text-blue-700"
            />
          </div>

          {/* Manager */}
          <div className="flex flex-col gap-2">
            <label className="font-semibold text-blue-700">Người quản lý</label>

            {data.fullname ? (
              <div className="flex items-center gap-3 text-blue-900">
                <img
                  src={data.avatar?.path || avatar}
                  alt={data.fullname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <p>{data.fullname}</p>
              </div>
            ) : (
              <p>Không</p>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md active:scale-95 disabled:bg-blue-400"
            >
              {updating ? <ClipLoader size={20} color="#fff" /> : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

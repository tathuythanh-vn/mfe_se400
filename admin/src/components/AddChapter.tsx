import React, { useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { validateChapterForm } from "../utils/validate";

//  Import RTK Query hook
import { useCreateChapterMutation } from "home/store";

interface AddChapterProps {
  open: (value: boolean) => void;
}

export default function AddChapter({ open }: AddChapterProps) {
  const [data, setData] = useState({
    name: "",
    address: "",
    affiliated: "",
    establishedAt: "",
  });

  // 👉 RTK Query mutation
  const [createChapter, { isLoading: adding }] = useCreateChapterMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAdd = async () => {
    // Validate form
    const error = validateChapterForm(data);
    if (error) {
      toast.error(error); // luôn là string
      return;
    }

    try {
      // unwrap() để nhận data thật sự hoặc throw error
      const result = await createChapter(data).unwrap();

      if (result.success) {
        toast.success("Thêm chi đoàn thành công!");
        // reset form
        setData({
          name: "",
          address: "",
          affiliated: "",
          establishedAt: "",
        });
        open(false);
      } else {
        toast.error(result.message || "Thêm chi đoàn thất bại.");
      }
    } catch (err: any) {
      console.error(err);
      // đảm bảo msg là string
      const msg = err?.data?.message || err?.message || "Lỗi khi thêm chi đoàn.";
      toast.error(String(msg));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 max-w-3xl rounded-2xl p-10 relative shadow-xl">

        {/* Close button */}
        <button
          onClick={() => open(false)}
          className="absolute top-3 right-3 hover:scale-105 transition"
        >
          <IoCloseCircle size={40} color="red" />
        </button>

        {/* Form */}
        <div className="max-h-[75vh] overflow-auto pr-2 flex flex-col gap-6">

          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-blue-800 font-semibold">Tên chi đoàn</label>
            <input
              id="name"
              type="text"
              value={data.name}
              onChange={handleChange}
              placeholder="Nhập tên chi đoàn"
              className="border border-blue-600 text-blue-800 rounded-lg h-10 px-3 outline-none"
            />
          </div>

          {/* Affiliated + Date */}
          <div className="flex gap-6">
            <div className="flex flex-col gap-2 w-3/4">
              <label className="text-blue-800 font-semibold">Đơn vị trực thuộc</label>
              <input
                id="affiliated"
                type="text"
                value={data.affiliated}
                onChange={handleChange}
                placeholder="Nhập đơn vị trực thuộc"
                className="border border-blue-600 text-blue-800 rounded-lg h-10 px-3 outline-none"
              />
            </div>

            <div className="flex flex-col gap-2 w-1/4">
              <label className="text-blue-800 font-semibold">Ngày thành lập</label>
              <input
                id="establishedAt"
                title="date"
                type="date"
                value={data.establishedAt?.substring(0, 10)}
                onChange={handleChange}
                className="border border-blue-600 text-blue-800 rounded-lg h-10 px-3 outline-none"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2">
            <label className="text-blue-800 font-semibold">Địa chỉ</label>
            <input
              id="address"
              type="text"
              value={data.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className="border border-blue-600 text-blue-800 rounded-lg h-10 px-3 outline-none"
            />
          </div>

          {/* Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={handleAdd}
              disabled={adding}
              className="bg-blue-700 hover:bg-blue-800 transition text-white font-bold px-6 h-11 rounded-lg shadow-md w-60 flex items-center justify-center disabled:bg-blue-400"
            >
              {adding ? <ClipLoader size={20} color="#fff" /> : "Thêm mới"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

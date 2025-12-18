import React, { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { MdEmail, MdPhone } from "react-icons/md";
import {
  FaRegUser,
  FaIdCard,
  FaUserTag,
  FaHouseUser,
  FaUsers,
  FaUserFriends,
  FaBook,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import avatarDefault from "../assets/avatar.png";

// RTK Query
import { useGetChaptersQuery, useCreateAccountMutation } from "home/store";
import { useGetChaptersInPageQuery } from 'home/store';
interface Chapter {
  _id: string;
  name: string;
}

interface AddMemberProps {
  setOpen: (open: boolean) => void;
}

interface FormDataType {
  email: string;
  phone: string;
  fullname: string;
  birthday: string;
  gender: string;
  role: string;
  password: string;
  chapterId: string;
  cardId: string;
  position: string;
  joinedAt: string;
  address: string;
  hometown: string;
  ethnicity: string;
  religion: string;
  eduLevel: string;
  avatar: string;
}

const AddMember: React.FC<AddMemberProps> = ({ setOpen }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormDataType>({
    email: "",
    phone: "",
    fullname: "",
    birthday: "",
    gender: "",
    role: "",
    password: "",
    chapterId: "",
    cardId: "",
    position: "",
    joinedAt: "",
    address: "",
    hometown: "",
    ethnicity: "",
    religion: "",
    eduLevel: "",
    avatar: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [togglePassword, setTogglePassword] = useState(true);

  // Lấy danh sách chi đoàn từ RTK Query
const { data: chaptersData } = useGetChaptersInPageQuery();
  const chapters: Chapter[] = chaptersData?.data?.chapters || [];

  // RTK Mutation tạo tài khoản
  const [createAccount, { isSuccess }] = useCreateAccountMutation();

  useEffect(() => {
    if (isSuccess) navigate("/"); // Sau khi tạo xong chuyển trang
  }, [isSuccess, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async () => {
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "avatar") fd.append(key, value as string);
    });
    if (avatarFile) fd.append("avatar", avatarFile);

    try {
      await createAccount(fd).unwrap();
    } catch (err) {
      console.error("Lỗi tạo tài khoản:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-blue-900/50">
      <div className="relative w-2/3 max-h-[90vh] overflow-y-auto bg-white rounded-2xl p-6">
        {/* Close */}
        <div
          className="absolute top-3 right-3 cursor-pointer"
          onClick={() => setOpen(false)}
        >
          <IoIosCloseCircle size={40} color="red" />
        </div>

        {/* Form */}
        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <img
              src={formData.avatar || avatarDefault}
              alt="avatar"
              className="w-40 h-40 rounded-full object-cover"
            />
            <input
              type="file"
              accept="image/*"
              id="avatar"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <label
              htmlFor="avatar"
              className="px-4 py-2 border-2 border-blue-800 text-blue-800 rounded-lg cursor-pointer"
            >
              Chọn ảnh đại diện
            </label>
          </div>

          {/* Email */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-800">Email</label>
            <div className="flex items-center border-2 border-blue-800 rounded-lg p-2 gap-2">
              <MdEmail size={25} color="#0d47a1" />
              <input
                type="email"
                name="email"
                placeholder="Nhập email"
                value={formData.email}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-800">Số điện thoại</label>
            <div className="flex items-center border-2 border-blue-800 rounded-lg p-2 gap-2">
              <MdPhone size={25} color="#0d47a1" />
              <input
                type="tel"
                name="phone"
                placeholder="Nhập số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Fullname */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-800">Họ và tên</label>
            <div className="flex items-center border-2 border-blue-800 rounded-lg p-2 gap-2">
              <FaRegUser size={25} color="#0d47a1" />
              <input
                type="text"
                name="fullname"
                placeholder="Nhập họ và tên"
                value={formData.fullname}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div className="w-full flex flex-col gap-1 relative">
            <label className="font-semibold text-blue-800">Mật khẩu</label>
            <div className="flex items-center border-2 border-blue-800 rounded-lg p-2 gap-2">
              <LuLock size={25} color="#0d47a1" />
              <input
                type={togglePassword ? "password" : "text"}
                name="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={handleChange}
                className="flex-1 outline-none"
              />
              <div
                className="cursor-pointer"
                onClick={() => setTogglePassword(!togglePassword)}
              >
                {togglePassword ? (
                  <LuEye size={25} color="#0d47a1" />
                ) : (
                  <LuEyeOff size={25} color="#0d47a1" />
                )}
              </div>
            </div>
          </div>

          {/* Role */}
          <div className="w-full flex flex-col gap-1">
            <label className="font-semibold text-blue-800">Vai trò</label>
            <select
              title="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border-2 border-blue-800 rounded-lg p-2 text-blue-800 outline-none"
            >
              <option value="">-- Chọn vai trò --</option>
              <option value="member">Đoàn viên</option>
              <option value="manager">Người quản lý chi đoàn</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>

          {/* Nếu là member */}
          {formData.role === "member" && (
            <>
              {/* Chapter */}
              <div className="w-full flex flex-col gap-1">
                <label className="font-semibold text-blue-800">
                  Chi đoàn sinh hoạt
                </label>
                <select
                  title="chapter"
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleChange}
                  className="border-2 border-blue-800 rounded-lg p-2 text-blue-800 outline-none"
                >
                  <option value="">Chọn chi đoàn</option>
                  {chapters.map((ch: Chapter) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* CardId */}
              <div className="w-full flex flex-col gap-1">
                <label className="font-semibold text-blue-800">Số thẻ đoàn</label>
                <div className="flex items-center border-2 border-blue-800 rounded-lg p-2 gap-2">
                  <FaIdCard size={25} color="#0d47a1" />
                  <input
                    type="text"
                    name="cardId"
                    placeholder="Nhập số thẻ đoàn"
                    value={formData.cardId}
                    onChange={handleChange}
                    className="flex-1 outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-blue-800 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Tạo tài khoản
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMember;

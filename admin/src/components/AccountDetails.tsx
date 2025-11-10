// AccountDetails.tsx fully corrected with TypeScript + TailwindCSS
import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { IoCloseCircle } from "react-icons/io5";
import avatarDefault from "../assets/avatar.png";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

interface AccountDetailsProps {
  id: string;
  open: (value: boolean) => void;
  profile?: boolean;
}

interface ChapterOption {
  value: string;
  name: string;
}

interface AvatarData {
  path?: string;
}

interface AccountData {
  fullname?: string;
  email?: string;
  phone?: string;
  avatar?: AvatarData;
  birthday?: string;
  position?: string;
  role?: string;
  status?: string;
  managerOf?: string;
  memberOf?: string;
  cardCode?: string;
  joinedAt?: string;
  address?: string;
  hometown?: string;
  ethnicity?: string;
  religion?: string;
  eduLevel?: string;
}

export default function AccountDetails({ id, open, profile }: AccountDetailsProps) {
  const [data, setData] = useState<AccountData>({});
  const [update, setUpdate] = useState<Partial<AccountData>>({});
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [chapters, setChapters] = useState<ChapterOption[]>([]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const formData = new FormData();
      for (const key in update) {
        const value = update[key as keyof typeof update];
        if (value !== undefined) formData.append(key, value as any);
      }

      const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/accounts/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();
      if (result.success) toast.success("Cập nhật thành công.");
      else toast.error(result.message || "Cập nhật thất bại.");
    } catch (err) {
      toast.error("Cập nhật thất bại.");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/accounts/${id}`);
        const result = await res.json();
        setData(result.data);
      } catch (err) {
        toast.error("Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/chapters?page=1&limit=10000`);
        const result = await res.json();
        setChapters(result.data.result.map((i: any) => ({ value: i._id, name: i.name })));
      } catch (err) {
        console.error(err);
      }
    };

    fetchChapters();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setData((prev) => ({ ...prev, [id]: value }));
    setUpdate((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 5 * 1024 * 1024) setUpdate((prev) => ({ ...prev, avatar: file }));
    else toast.info("Ảnh vượt quá 5MB.");
  };

  const renderAvatar = () => {
    if (update.avatar instanceof File) return URL.createObjectURL(update.avatar);
    if (data.avatar?.path) return data.avatar.path;
    return avatarDefault;
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-full text-lg gap-3">
        <ClipLoader size={50} color="#36d7b7" />
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-4/5 rounded-2xl p-10 relative max-h-[90vh] overflow-auto shadow-xl">
        <button onClick={() => open(false)} className="absolute top-4 right-4 hover:opacity-80">
          <IoCloseCircle size={40} color="red" />
        </button>

        <div className="flex flex-col gap-8">
          <div className="flex gap-8">
            <div className="w-48 flex flex-col items-center gap-4">
              <img src={renderAvatar()} alt="avatar" className="w-full aspect-square rounded-full shadow-md object-cover" />
              <label htmlFor="avatar" className="bg-blue-600 text-white py-2 px-4 rounded-lg cursor-pointer">Thay ảnh đại diện</label>
              <input type="file" id="avatar" className="hidden" onChange={handleFileChange} />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-blue-600 font-semibold">Họ và tên</label>
                  <input id="fullname" value={data.fullname || ""} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10" />
                </div>

                {!profile && (
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-blue-600 font-semibold">Trạng thái</label>
                    <select id="status" value={data.status || "active"} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10 font-bold">
                      <option value="active">Hoạt động</option>
                      <option value="locked">Khóa</option>
                      <option value="pending">Chờ duyệt</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-blue-600 font-semibold">Email</label>
                  <input id="email" value={data.email || ""} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10" />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-blue-600 font-semibold">Số điện thoại</label>
                  <input id="phone" value={data.phone || ""} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-full">
                  <label className="text-blue-600 font-semibold">Ngày sinh</label>
                  <input id="birthday" type="date" value={data.birthday?.substring(0, 10) || ""} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10" />
                </div>

                <div className="flex flex-col gap-1 w-full">
                  <label className="text-blue-600 font-semibold">Vai trò</label>
                  <select id="role" value={data.role || ""} disabled={profile} onChange={handleChange} className="border border-blue-600 rounded-lg px-3 h-10">
                    <option value="admin">Quản trị viên</option>
                    <option value="manager">Quản lý chi đoàn</option>
                    <option value="member">Đoàn viên</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Manager Role */}
          {data.role === "manager" && (
            <div className="flex flex-col gap-1">
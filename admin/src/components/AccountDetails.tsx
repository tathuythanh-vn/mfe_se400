import React, { useEffect, useState, useMemo } from "react";
import { IoCloseCircle } from "react-icons/io5";
import avatarDefault from "../assests/avatar.png";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";


import type { Account } from "../../../home/src/stores/interfaces/account";
const API_URL = import.meta.env.VITE_BACKEND_URL;

type AccountDetailsProps = {
  id: string;
  setOpen: (v: boolean) => void;
  profile?: boolean;
};


interface ChapterOption {
value: string;
name: string;
}
type AccountData = Record<string, any>;

export default function AccountDetails({ id, setOpen, profile = false }: AccountDetailsProps) {
const [data, setData] = useState<Partial<Account>>({});
const [update, setUpdate] = useState<Record<string, any>>({});
const [loading, setLoading] = useState(false);
const [updating, setUpdating] = useState(false);
const [chapters, setChapters] = useState<ChapterOption[]>([]);

  // ===========================
  // UPDATE ACCOUNT
  // ==========================

  const handleUpdate = async () => {
  setUpdating(true);
  try {
    const formData = new FormData();

    for (const key in update) {
      const value = update[key];

      if (key === "infoMember") {
        formData.append("infoMember", JSON.stringify(value)); // ⭐ FIX QUAN TRỌNG
      } else {
        formData.append(key, value);
      }
    }

    const res = await fetch(`${API_URL}/accounts/${id}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });

    const result = await res.json();
    console.log("FETCH ACCOUNT DETAILS RESULT:", result);

    result.success
      ? toast.success("Cập nhật thành công.")
      : toast.error(result.message || "Cập nhật thất bại.");
  } catch (err) {
    console.log(err);
    toast.error("Cập nhật thất bại.");
  } finally {
    setUpdating(false);
  }
};


  // ===========================
  // FETCH ACCOUNT DETAILS
  // ===========================
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/accounts/${id}`);
        const result = await res.json();
 const info = {
        memberOf: result.data.memberOf ?? "",
        cardCode: result.data.cardCode ?? "",
        joinedAt: result.data.joinedAt ?? "",
        position: result.data.position ?? "",
        address: result.data.address ?? "",
        hometown: result.data.hometown ?? "",
        ethnicity: result.data.ethnicity ?? "",
        religion: result.data.religion ?? "",
        eduLevel: result.data.eduLevel ?? "",
      };

      setData({
        ...result.data,
        infoMember: info,
      });

      setUpdate({
        ...result.data,
        infoMember: info,
      });

console.log("ACCOUNT DETAIL RAW:", result.data);


      } catch {
        toast.error("Không thể tải dữ liệu người dùng.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ===========================
  // FETCH CHAPTERS
  // ===========================
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(
          // `${import.meta.env.VITE_APP_SERVER_URL}/api/chapters?page=1&limit=10000`
`${API_URL}/chapters?page=1&limit=10000`

        );
        const result = await res.json();
        setChapters(
          result.data.result.map((i: any) => ({
            value: i._id,
            name: i.name,
          }))
        );
      } catch {}
    };
    fetchChapters();
  }, []);

  // ===========================
  // INPUT HANDLERS
  // ===========================
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { id, value } = e.target;
  //   setData((prev) => ({ ...prev, [id]: value }));
  //   setUpdate((prev) => ({ ...prev, [id]: value }));
  // };

// 1) mở rộng fields
const infoMemberFields = [
  "memberOf",
  "cardCode",
  "joinedAt",
  "position",
  "address",
  "hometown",
  "ethnicity",
  "religion",
  "eduLevel",
];

// handleChange (giữ nguyên, đã xử lý prev.infoMember ?? {})
const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { id, value } = e.target;
  const isInfoMemberField = infoMemberFields.includes(id);

  setData((prev: any) => ({
    ...prev,
    ...(isInfoMemberField
      ? {
          infoMember: {
            ...(prev.infoMember ?? {}),
            [id]: value,
          },
        }
      : { [id]: value }),
  }));

  setUpdate((prev: any) => ({
    ...prev,
    ...(isInfoMemberField
      ? {
          infoMember: {
            ...(prev.infoMember ?? {}),
            [id]: value,
          },
        }
      : { [id]: value }),
  }));
};




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 5 * 1024 * 1024) {
      setUpdate((prev) => ({ ...prev, avatar: file }));
    } else {
      toast.info("Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.");
    }
  };

  // ===========================
  // AVATAR PREVIEW
  // ===========================
  const avatarPreview = useMemo(() => {
    if (update.avatar) return URL.createObjectURL(update.avatar);
    return data.avatar?.path || avatarDefault;
  }, [update.avatar, data.avatar]);

  // ===========================
  // RENDER
  // ===========================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-600">
        <ClipLoader size={50} />
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] flex justify-center items-center z-50">
      <div className="relative w-4/5 bg-white rounded-2xl p-10 max-h-[90vh] overflow-hidden shadow-xl">

        {/* CLOSE BUTTON */}
        <button
          className="absolute top-3 right-3 text-red-500 hover:text-red-600 active:-translate-y-1"
          onClick={() => setOpen(false)}
        >
          <IoCloseCircle size={40} />
        </button>

        {/* SCROLL AREA */}
        <div className="overflow-auto max-h-[80vh] pr-3">

          {/* TOP SECTION */}
          <div className="flex gap-6">

            {/* Avatar */}
            <div className="w-[180px] px-5 flex flex-col items-center gap-5">
           <img
  src={avatarPreview}
  alt="User avatar preview"
  title="User avatar preview"
  className="w-full aspect-square rounded-full shadow-md object-cover border"
/>

              <label
                htmlFor="avatar"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer active:-translate-y-1"
              >
                Thay ảnh đại diện
              </label>

              <input type="file" id="avatar" className="hidden" onChange={handleFileChange} />
            </div>

            {/* MAIN INFORMATION */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <Input label="Họ và tên" id="fullname" value={data.fullname} onChange={handleChange} />

                {!profile && (
                  <Select
                    label="Trạng thái"
                    id="status"
                    value={data.status}
                    onChange={handleChange}
                    options={[
                      { value: "active", label: "Hoạt động" },
                      { value: "locked", label: "Khóa" },
                      { value: "pending", label: "Chờ duyệt" },
                    ]}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input label="Email" id="email" value={data.email} onChange={handleChange} />
                <Input label="Số điện thoại" id="phone" value={data.phone} onChange={handleChange} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Ngày sinh"
                  id="birthday"
                  type="date"
                  value={data.birthday?.substring(0, 10)}
                  onChange={handleChange}
                />

                <Select
                  label="Vai trò"
                  id="role"
                  disabled={profile}
                  value={data.role}
                  onChange={handleChange}
                  options={[
                    { value: "admin", label: "Quản trị viên" },
                    { value: "manager", label: "Quản lý chi đoàn" },
                    { value: "member", label: "Đoàn viên" },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* MANAGER */}
          {data.role === "manager" && (
            <div className="mt-4">
              <Select
                label="Chi đoàn quản lý"
                id="managerOf"
                value={data.managerOf}
                onChange={handleChange}
                options={chapters}
              />
            </div>
          )}

          {/* MEMBER */}
          {data.role === "member" && (
            <div className="grid gap-6 mt-6">

              <Select
    label="Chi đoàn sinh hoạt"
    id="memberOf"
    value={data.infoMember?.memberOf || ""}
    onChange={handleChange}
    options={chapters}
  />

              <div className="grid grid-cols-3 gap-4">
 <Input
      label="Số thẻ đoàn"
      id="cardCode"
      value={data.infoMember?.cardCode || ""}
      onChange={handleChange}
    />              <Input
      label="Ngày vào đoàn"
      id="joinedAt"
      type="date"
      value={data.infoMember?.joinedAt?.substring(0, 10) || ""}
      onChange={handleChange}
    />
                 <Select
      label="Chức vụ"
      id="position"
      value={data.infoMember?.position || ""}
      onChange={handleChange}
      options={[
        { value: "secretary", label: "Bí thư" },
        { value: "deputy_secretary", label: "Phó Bí thư" },
        { value: "committee_member", label: "Ủy viên BCH" },
        { value: "member", label: "Đoàn viên" },
      ]}
    />
              </div>

<Input
  label="Địa chỉ"
  id="address"
  value={data.infoMember?.address || ""}
  onChange={handleChange}
/>
<Input
  label="Quê quán"
  id="hometown"
  value={data.infoMember?.hometown || ""}
  onChange={handleChange}
/>
<div className="grid grid-cols-2 gap-4">
  <Input
    label="Dân tộc"
    id="ethnicity"
    value={data.infoMember?.ethnicity || ""}
    onChange={handleChange}
  />
  <Input
    label="Tôn giáo"
    id="religion"
    value={data.infoMember?.religion || ""}
    onChange={handleChange}
  />
</div>
<Input
  label="Trình độ học vấn"
  id="eduLevel"
  value={data.infoMember?.eduLevel || ""}
  onChange={handleChange}
/>

              <div className="flex justify-end">
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 disabled:opacity-50 active:scale-95"
                >
                  {updating ? <ClipLoader size={20} color="#fff" /> : "Lưu"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Input({ label, id, value, onChange, type = "text" }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-blue-600 font-bold">{label}</label>
      <input
        id={id}
        title="input"
        type={type}
        value={value || ""}
        onChange={onChange}
        className="input"
      />
    </div>
  );
}

function Select({ label, id, value, onChange, options, disabled = false }: any) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-blue-600 font-bold">{label}</label>
      <select
  id={id}
  title="Select option"
  value={value || ""}
  onChange={onChange}
  disabled={disabled}
  className="input"
>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label || opt.name}
          </option>
        ))}
      </select>
    </div>
  );
}

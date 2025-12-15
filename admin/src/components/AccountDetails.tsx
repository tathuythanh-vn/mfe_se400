import React, { useEffect, useState, useMemo } from "react";
import { IoCloseCircle } from "react-icons/io5";
import avatarDefault from "../assests/avatar.png";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

// RTK Query
import {
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
} from "home/store";
import {
  useGetChaptersInPageQuery,
} from "home/store";

import type { Account } from "home/store";

type AccountDetailsProps = {
  id: string;
  setOpen: (v: boolean) => void;
  profile?: boolean;
};

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

export default function AccountDetails({
  id,
  setOpen,
  profile = false,
}: AccountDetailsProps) {
  // Fetch account detail
  const { data: accountRes, isLoading } = useGetAccountByIdQuery(id);

  // Fetch chapters
  const { data: chaptersRes } = useGetChaptersInPageQuery({
    page: 1,
    limit: 10000,
  });

  const [updateAccount, { isLoading: updating }] =
    useUpdateAccountByIdMutation();

  const [data, setData] = useState<Partial<Account>>({});
  const [update, setUpdate] = useState<Record<string, any>>({});

  // ===========================
  // INIT DATA WHEN API RETURN
  // ===========================
  useEffect(() => {
    if (!accountRes?.data) return;

    const info = {
      memberOf: accountRes.data.memberOf ?? "",
      cardCode: accountRes.data.cardCode ?? "",
      joinedAt: accountRes.data.joinedAt ?? "",
      position: accountRes.data.position ?? "",
      address: accountRes.data.address ?? "",
      hometown: accountRes.data.hometown ?? "",
      ethnicity: accountRes.data.ethnicity ?? "",
      religion: accountRes.data.religion ?? "",
      eduLevel: accountRes.data.eduLevel ?? "",
    };

    setData({
      ...accountRes.data,
      infoMember: info,
    });

    setUpdate({
      ...accountRes.data,
      infoMember: info,
    });

    console.log("ACCOUNT DETAIL RAW:", accountRes.data);
  }, [accountRes]);

  // ===========================
  // HANDLE UPDATE
  // ===========================
  // const handleUpdate = async () => {
  //   try {
  //     const formData = new FormData();

  //     for (const key in update) {
  //       const value = update[key];

  //       if (key === "infoMember") {
  //         formData.append("infoMember", JSON.stringify(value));
  //       } else {
  //         formData.append(key, value);
  //       }
  //     }

  //     const result = await updateAccount({
  //       id,
  //       formData,
  //     }).unwrap();

  //     result.success
  //       ? toast.success("Cập nhật thành công.")
  //       : toast.error(result.message || "Cập nhật thất bại.");
  //   } catch (err: any) {
  //     console.log(err);
  //     toast.error(err?.data?.message || "Cập nhật thất bại.");
  //   }
  // };
// const handleUpdate = async () => {
//   try {
//     const formData = new FormData();

//     // Lặp qua các field
//     Object.entries(update).forEach(([key, value]) => {
//       if (value === undefined || value === null) return;

//       if (key === "infoMember") {
//         // Chỉ append khi object có giá trị
//         formData.append(key, JSON.stringify(value));
//       } else if (key === "avatar" && value instanceof File) {
//         formData.append("avatar", value);
//       } else {
//         formData.append(key, value);
//       }
//     });

//     const result = await updateAccount({
//       id,
//       formData,
//     }).unwrap();

//     if (result.success) {
//       toast.success("Cập nhật thành công.");
//     } else {
//       toast.error(result.message || "Cập nhật thất bại.");
//     }
//   } catch (err: any) {
//     console.log(err);
//     toast.error(err?.data?.message || "Cập nhật thất bại.");
//   }
// };
const handleUpdate = async () => {
  try {
    const formData = new FormData();

    // ===== AVATAR =====
    if (update.avatar instanceof File) {
      formData.append("avatar", update.avatar);
    }

    // ===== BASIC FIELDS =====
    const fields = [
      "fullname",
      "email",
      "phone",
      "birthday",
      "status",
      "role",
      "managerOf",
    ];

    fields.forEach((field) => {
      if (update[field] !== undefined) {
        formData.append(field, update[field]);
      }
    });

    // ===== INFO MEMBER =====
    if (update.infoMember) {
      formData.append(
        "infoMember",
        JSON.stringify(update.infoMember)
      );
    }

    const result = await updateAccount({
      id,
      formData,
    }).unwrap();

    if (result.success) {
      toast.success("Cập nhật thành công.");
    } else {
      toast.error(result.message || "Cập nhật thất bại.");
    }
  } catch (err: any) {
    console.log(err);
    toast.error(err?.data?.message || "Cập nhật thất bại.");
  }
};



  // ===========================
  // HANDLE INPUT CHANGE
  // ===========================
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

  // ===========================
  // AVATAR CHANGE
  // ===========================
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 5 * 1024 * 1024) {
      setUpdate((prev) => ({ ...prev, avatar: file }));
    } else {
      toast.info("Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.");
    }
  };

  const avatarPreview = useMemo(() => {
    if (update.avatar) return URL.createObjectURL(update.avatar);
    return data?.avatar?.path || avatarDefault;
  }, [update.avatar, data.avatar]);

  // ===========================
  // LOADING UI
  // ===========================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-600">
        <ClipLoader size={50} />
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  const chapters =
    chaptersRes?.data?.result?.map((i: any) => ({
      value: i._id,
      name: i.name,
    })) ?? [];

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.45)] flex justify-center items-center z-50">
      <div className="relative w-4/5 bg-white rounded-2xl p-10 max-h-[90vh] overflow-hidden shadow-xl">
        <button
          className="absolute top-3 right-3 text-red-500 hover:text-red-600 active:-translate-y-1"
          onClick={() => setOpen(false)}
        >
          <IoCloseCircle size={40} />
        </button>

        <div className="overflow-auto max-h-[80vh] pr-3">
          {/* =============================== */}
          {/* TOP SECTION */}
          {/* =============================== */}

          <div className="flex gap-6">
            <div className="w-[180px] px-5 flex flex-col items-center gap-5">
              <img
                src={avatarPreview}
                alt="avatar"
                className="w-full aspect-square rounded-full shadow-md object-cover border"
              />

              <label
                htmlFor="avatar"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer active:-translate-y-1"
              >
                Thay ảnh đại diện
              </label>

              <input
                type="file"
                id="avatar"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* MAIN INFO */}
            <div className="flex-1 flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Họ và tên"
                  id="fullname"
                  value={data.fullname}
                  onChange={handleChange}
                />

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
                <Input
                  label="Email"
                  id="email"
                  value={data.email}
                  onChange={handleChange}
                />
                <Input
                  label="Số điện thoại"
                  id="phone"
                  value={data.phone}
                  onChange={handleChange}
                />
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
                />
                <Input
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

// ===========================
// INPUT COMPONENTS
// ===========================
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
        title="select"
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

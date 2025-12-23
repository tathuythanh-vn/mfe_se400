// import React, { useEffect, useState, useMemo } from "react";
// import { IoCloseCircle } from "react-icons/io5";
// import avatarDefault from "../assests/avatar.png";
// import { toast } from "react-toastify";
// import ClipLoader from "react-spinners/ClipLoader";

// // RTK Query
// import {
//   useGetAccountByIdQuery,
//   useUpdateAccountByIdMutation,
//   useGetChaptersInPageQuery,
// } from "home/store";

// import type { Account } from "home/store";

// type AccountDetailsProps = {
//   id: string;
//   setOpen: (v: boolean) => void;
//   onUpdated?: () => void;
//   profile?: boolean;
// };

// const ETHNICITIES = [
//   "Kinh",
//   "Tày",
//   "Thái",
//   "Hoa",
//   "Khmer",
//   "Mường",
//   "Nùng",
//   "H'Mông",
//   "Dao",
//   "Gia Rai",
//   "Ê Đê",
//   "Ba Na",
//   "Xơ Đăng",
//   "Sán Chay",
//   "Cơ Ho",
//   "Chăm",
//   "Sán Dìu",
//   "Hrê",
//   "Mnông",
//   "Ra Glai",
//   "Xtiêng",
//   "Bru - Vân Kiều",
//   "Thổ",
//   "Giáy",
//   "Cơ Tu",
//   "Gié Triêng",
//   "Mạ",
//   "Khơ Mú",
//   "Co",
//   "Tà Ôi",
//   "Chơ Ro",
//   "Kháng",
//   "Xinh Mun",
//   "Hà Nhì",
//   "Chu Ru",
//   "Lào",
//   "La Chí",
//   "Phù Lá",
//   "La Hủ",
//   "La Ha",
//   "Pà Thẻn",
//   "Lự",
//   "Ngái",
//   "Chứt",
//   "Lô Lô",
//   "Mảng",
//   "Cờ Lao",
//   "Bố Y",
//   "Cống",
//   "Si La",
//   "Pu Péo",
//   "Rơ Măm",
//   "Brâu",
//   "Ơ Đu",
// ];


// const RELIGIONS = [
//   "Không",
//   "Phật giáo",
//   "Công giáo",
//   "Tin Lành",
//   "Cao Đài",
//   "Hòa Hảo",
//   "Khác",
// ];

// const EDU_LEVELS = [
//   "Tiểu học",
//   "THCS",
//   "THPT",
//   "Trung cấp",
//   "Cao đẳng",
//   "Đại học",
//   "Sau đại học",
// ];


// const infoMemberFields = [
//   "memberOf",
//   "cardCode",
//   "joinedAt",
//   "position",
//   "address",
//   "hometown",
//   "ethnicity",
//   "religion",
//   "eduLevel",
// ];

// export default function AccountDetails({
//   id,
//   setOpen,
//   onUpdated,
//   profile = false,
// }: AccountDetailsProps) {
//   const { data: accountRes, isLoading } = useGetAccountByIdQuery(id);

//   const { data: chaptersRes } = useGetChaptersInPageQuery({
//     page: 1,
//     limit: 10000,
//   });

//   const [updateAccount, { isLoading: updating }] =
//     useUpdateAccountByIdMutation();

//   const [data, setData] = useState<Partial<Account>>({});
//   const [update, setUpdate] = useState<Record<string, any>>({});

//   useEffect(() => {
//     if (!accountRes?.data) return;

//     const info = {
//       memberOf: accountRes.data.memberOf ?? "",
//       cardCode: accountRes.data.cardCode ?? "",
//       joinedAt: accountRes.data.joinedAt ?? "",
//       position: accountRes.data.position ?? "",
//       address: accountRes.data.address ?? "",
//       hometown: accountRes.data.hometown ?? "",
//       ethnicity: accountRes.data.ethnicity ?? "",
//       religion: accountRes.data.religion ?? "",
//       eduLevel: accountRes.data.eduLevel ?? "",
//     };

//     setData({ ...accountRes.data, infoMember: info });
//     setUpdate({ ...accountRes.data, infoMember: info });
//   }, [accountRes]);

//   const handleUpdate = async () => {
//     try {
//       const formData = new FormData();

//       if (update.avatar instanceof File) {
//         formData.append("avatar", update.avatar);
//       }

//       ["fullname", "email", "phone", "status", "role"].forEach((field) => {
//         if (update[field]) formData.append(field, update[field]);
//       });

//       if (update.birthday) {
//         formData.append("birthday", update.birthday);
//       }

//       if (update.role === "manager" && update.managerOf) {
//         formData.append("managerOf", update.managerOf);
//       }

//       if (update.role === "member" && update.infoMember) {
//         formData.append("infoMember", JSON.stringify(update.infoMember));
//       }

//       await updateAccount({ id, formData }).unwrap();

//       toast.success("Cập nhật thành công.");
//       onUpdated?.();
//       setOpen(false);
//     } catch (err: any) {
//       console.error(err);
//       toast.error(err?.data?.message || "Cập nhật thất bại.");
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { id, value } = e.target;
//     const isInfoMemberField = infoMemberFields.includes(id);

//     setData((prev: any) => ({
//       ...prev,
//       ...(isInfoMemberField
//         ? { infoMember: { ...(prev.infoMember ?? {}), [id]: value } }
//         : { [id]: value }),
//     }));

//     setUpdate((prev: any) => ({
//       ...prev,
//       ...(isInfoMemberField
//         ? { infoMember: { ...(prev.infoMember ?? {}), [id]: value } }
//         : { [id]: value }),
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (file.size < 5 * 1024 * 1024) {
//       setUpdate((prev) => ({ ...prev, avatar: file }));
//     } else {
//       toast.info("Ảnh vượt quá 5MB.");
//     }
//   };

//   const avatarPreview = useMemo(() => {
//     if (update.avatar instanceof File) {
//       return URL.createObjectURL(update.avatar);
//     }

//     const avatar = data?.avatar;
//     if (typeof avatar === "string") return avatar;
//     if (avatar && typeof avatar === "object") {
//       return avatar.path || avatar.url || avatar.secure_url || avatarDefault;
//     }

//     return avatarDefault;
//   }, [update.avatar, data?.avatar]);

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-600">
//         <ClipLoader size={50} />
//         <p>Đang tải dữ liệu người dùng...</p>
//       </div>
//     );
//   }

//   const chapters =
//     chaptersRes?.data?.result?.map((i: any) => ({
//       value: i._id,
//       label: i.name,
//     })) ?? [];

// return (
//   <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//     <div className="relative w-4/5 bg-white rounded-2xl p-10 max-h-[90vh] shadow-xl">
//       {/* Close button */}
//       <button
//         className="absolute top-3 right-3 text-red-500 hover:text-red-600"
//         onClick={() => setOpen(false)}
//       >
//         <IoCloseCircle size={40} />
//       </button>

//       {/* Form content */}
//       <div className="overflow-auto max-h-[80vh] pr-3">
//         <div className="flex gap-6">
//           {/* Avatar */}
//           <div className="w-[180px] flex flex-col items-center gap-4">
//             <img
//             title="img"
//               src={avatarPreview}
//               className="w-full aspect-square rounded-full object-cover border"
//             />
//             <label
//               htmlFor="avatar"
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
//             >
//               Thay ảnh
//             </label>
//             <input
//               id="avatar"
//               type="file"
//               hidden
//               onChange={handleFileChange}
//             />
//           </div>

//           {/* Basic info */}
//           <div className="flex-1 grid grid-cols-2 gap-5">
//             <Input
//               label="Họ và tên"
//               id="fullname"
//               value={data.fullname}
//               onChange={handleChange}
//               placeholder="Nhập họ và tên"
//             />
//             {!profile && (
//               <Select
//                 label="Trạng thái"
//                 id="status"
//                 value={data.status}
//                 onChange={handleChange}
//                 options={[
//                   { value: "active", label: "Hoạt động" },
//                   { value: "locked", label: "Khóa" },
//                   { value: "pending", label: "Chờ duyệt" },
//                 ]}
//               />
//             )}
//             <Input
//               label="Email"
//               id="email"
//               value={data.email}
//               onChange={handleChange}
//               placeholder="example@email.com"
//             />
//             <Input
//               label="Số điện thoại"
//               id="phone"
//               value={data.phone}
//               onChange={handleChange}
//               placeholder="0123456789"
//             />
//             <Input
//               label="Ngày sinh"
//               id="birthday"
//               type="date"
//               value={data.birthday?.substring(0, 10)}
//               onChange={handleChange}
//             />
//             <Select
//               label="Vai trò"
//               id="role"
//               disabled={profile}
//               value={data.role}
//               onChange={handleChange}
//               options={[
//                 { value: "admin", label: "Quản trị viên" },
//                 { value: "manager", label: "Quản lý chi đoàn" },
//                 { value: "member", label: "Đoàn viên" },
//               ]}
//             />
//           </div>
//         </div>

//         {/* Manager fields */}
//         {data.role === "manager" && (
//           <div className="mt-5">
//             <Select
//               label="Chi đoàn quản lý"
//               id="managerOf"
//               value={data.managerOf}
//               onChange={handleChange}
//               options={chapters}
//             />
//           </div>
//         )}

//         {/* Member fields */}
//         {data.role === "member" && (
//           <div className="grid gap-4 mt-6">
//             <Select
//               label="Chi đoàn sinh hoạt"
//               id="memberOf"
//               value={data.infoMember?.memberOf}
//               onChange={handleChange}
//               options={chapters}
//             />

//             <div className="grid grid-cols-3 gap-4">
//               <Input
//                 label="Số thẻ đoàn"
//                 id="cardCode"
//                 value={data.infoMember?.cardCode}
//                 onChange={handleChange}
//                 placeholder="VD: DV2025-01"
//               />
//               <Input
//                 label="Ngày vào đoàn"
//                 id="joinedAt"
//                 type="date"
//                 value={data.infoMember?.joinedAt?.substring(0, 10)}
//                 onChange={handleChange}
//               />
//               <Select
//                 label="Chức vụ"
//                 id="position"
//                 value={data.infoMember?.position}
//                 onChange={handleChange}
//                 options={[
//                   { value: "secretary", label: "Bí thư" },
//                   { value: "deputy_secretary", label: "Phó Bí thư" },
//                   { value: "committee_member", label: "Ủy viên BCH" },
//                   { value: "member", label: "Đoàn viên" },
//                 ]}
//               />
//             </div>

//             <Input
//               label="Địa chỉ"
//               id="address"
//               value={data.infoMember?.address}
//               onChange={handleChange}
//               placeholder="Nhập địa chỉ"
//             />
//             <Input
//               label="Quê quán"
//               id="hometown"
//               value={data.infoMember?.hometown}
//               onChange={handleChange}
//               placeholder="Nhập quê quán"
//             />

//             <div className="grid grid-cols-2 gap-4">
//               <Select
//                 label="Dân tộc"
//                 id="ethnicity"
//                 value={data.infoMember?.ethnicity}
//                 onChange={handleChange}
//                 options={ETHNICITIES.map((e) => ({ value: e, label: e }))}
//               />
//               <Select
//                 label="Tôn giáo"
//                 id="religion"
//                 value={data.infoMember?.religion}
//                 onChange={handleChange}
//                 options={RELIGIONS.map((r) => ({ value: r, label: r }))}
//               />
//             </div>

//             <Select
//               label="Trình độ học vấn"
//               id="eduLevel"
//               value={data.infoMember?.eduLevel}
//               onChange={handleChange}
//               options={EDU_LEVELS.map((e) => ({ value: e, label: e }))}
//             />
//           </div>
//         )}

//         {/* Save button – hiển thị cho tất cả role */}
//         <div className="flex justify-end mt-6">
//           <button
//             onClick={handleUpdate}
//             disabled={updating}
//             className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
//           >
//             {updating ? <ClipLoader size={20} color="#fff" /> : "Lưu"}
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// }

// // ===========================
// // INPUT / SELECT
// // ===========================
// function Input({ label, id, value, onChange, type = "text", placeholder }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-semibold text-blue-600">{label}</label>
//       <input
//         id={id}
//         type={type}
//         value={value || ""}
//         onChange={onChange}
//         placeholder={placeholder}
//         className="w-full px-4 py-2 rounded-lg border border-gray-300
//                    placeholder-gray-400 focus:ring-2 focus:ring-blue-500
//                    focus:border-blue-500 outline-none transition"
//       />
//     </div>
//   );
// }

// function Select({
//   label,
//   id,
//   value,
//   onChange,
//   options,
//   disabled = false,
// }: any) {
//   return (
//     <div className="flex flex-col gap-1">
//       <label className="text-sm font-semibold text-blue-600">{label}</label>
//       <select
//       title="select"
//         id={id}
//         value={value || ""}
//         onChange={onChange}
//         disabled={disabled}
//         className="w-full px-4 py-2 rounded-lg border border-gray-300
//                    bg-white focus:ring-2 focus:ring-blue-500
//                    focus:border-blue-500 outline-none transition"
//       >
//         <option value="" disabled>
//           — Chọn —
//         </option>
//         {options.map((opt: any) => (
//           <option key={opt.value} value={opt.value}>
//             {opt.label}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

import React, { useEffect, useState, useMemo } from "react";
import { IoCloseCircle } from "react-icons/io5";
import avatarDefault from "../assests/avatar.png";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

// RTK Query
import {
  useGetAccountByIdQuery,
  useUpdateAccountByIdMutation,
  useGetChaptersInPageQuery,
} from "home/store";

import type { Account } from "home/store";

type AccountDetailsProps = {
  id: string;
  setOpen: (v: boolean) => void;
  onUpdated?: () => void;
  profile?: boolean;
};

const ETHNICITIES = [
  "Kinh","Tày","Thái","Hoa","Khmer","Mường","Nùng","H'Mông","Dao","Gia Rai","Ê Đê","Ba Na","Xơ Đăng",
  "Sán Chay","Cơ Ho","Chăm","Sán Dìu","Hrê","Mnông","Ra Glai","Xtiêng","Bru - Vân Kiều","Thổ","Giáy",
  "Cơ Tu","Gié Triêng","Mạ","Khơ Mú","Co","Tà Ôi","Chơ Ro","Kháng","Xinh Mun","Hà Nhì","Chu Ru","Lào",
  "La Chí","Phù Lá","La Hủ","La Ha","Pà Thẻn","Lự","Ngái","Chứt","Lô Lô","Mảng","Cờ Lao","Bố Y","Cống",
  "Si La","Pu Péo","Rơ Măm","Brâu","Ơ Đu"
];

const RELIGIONS = ["Không","Phật giáo","Công giáo","Tin Lành","Cao Đài","Hòa Hảo","Khác"];

const EDU_LEVELS = ["Tiểu học","THCS","THPT","Trung cấp","Cao đẳng","Đại học","Sau đại học"];

const infoMemberFields = [
  "memberOf","cardCode","joinedAt","position","address","hometown","ethnicity","religion","eduLevel",
];

export default function AccountDetails({
  id,
  setOpen,
  onUpdated,
  profile = false,
}: AccountDetailsProps) {
  const { data: accountRes, isLoading } = useGetAccountByIdQuery(id);
  const { data: chaptersRes } = useGetChaptersInPageQuery({ page: 1, limit: 10000 });
  const [updateAccount, { isLoading: updating }] = useUpdateAccountByIdMutation();

  const [data, setData] = useState<Partial<Account>>({});
  const [update, setUpdate] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load account data
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

    setData({ ...accountRes.data, infoMember: info });
    setUpdate({ ...accountRes.data, infoMember: info });
  }, [accountRes]);

  // Handle update
  const handleUpdate = async () => {
    try {
      setErrors({});
      const formData = new FormData();

      if (update.avatar instanceof File) formData.append("avatar", update.avatar);

      ["fullname", "email", "phone", "status", "role"].forEach(f => {
        if (update[f]) formData.append(f, update[f]);
      });

      if (update.birthday) formData.append("birthday", update.birthday);
      if (update.role === "manager" && update.managerOf) formData.append("managerOf", update.managerOf);
      if (update.role === "member" && update.infoMember) formData.append("infoMember", JSON.stringify(update.infoMember));

      await updateAccount({ id, formData }).unwrap();

      toast.success("Cập nhật thành công.");
      onUpdated?.();
      setOpen(false);
    } catch (err: any) {
      console.error(err);

      // Nếu backend trả lỗi validation
      if (err?.data?.errors) {
        const parsedErrors: Record<string, string> = {};

        for (const key in err.data.errors) {
          if (key === "infoMember") {
            // flatten lỗi infoMember
            for (const subKey in err.data.errors.infoMember) {
              parsedErrors[subKey] = err.data.errors.infoMember[subKey];
            }
          } else {
            parsedErrors[key] = err.data.errors[key];
          }
        }

        setErrors(parsedErrors);
      } else {
        toast.error(err?.data?.message || "Cập nhật thất bại.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    const isInfoMemberField = infoMemberFields.includes(id);

    setData((prev: any) => ({
      ...prev,
      ...(isInfoMemberField ? { infoMember: { ...(prev.infoMember ?? {}), [id]: value } } : { [id]: value }),
    }));

    setUpdate((prev: any) => ({
      ...prev,
      ...(isInfoMemberField ? { infoMember: { ...(prev.infoMember ?? {}), [id]: value } } : { [id]: value }),
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 5 * 1024 * 1024) setUpdate(prev => ({ ...prev, avatar: file }));
    else toast.info("Ảnh vượt quá 5MB.");
  };

  const avatarPreview = useMemo(() => {
    if (update.avatar instanceof File) return URL.createObjectURL(update.avatar);
    const avatar = data?.avatar;
    if (typeof avatar === "string") return avatar;
    if (avatar && typeof avatar === "object") return avatar.path || avatar.url || avatar.secure_url || avatarDefault;
    return avatarDefault;
  }, [update.avatar, data?.avatar]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-4 text-gray-600">
        <ClipLoader size={50} />
        <p>Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  const chapters = chaptersRes?.data?.result?.map((i: any) => ({ value: i._id, label: i.name })) ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="relative w-4/5 bg-white rounded-2xl p-10 max-h-[90vh] shadow-xl">
        <button
          className="absolute top-3 right-3 text-red-500 hover:text-red-600"
          onClick={() => setOpen(false)}
        >
          <IoCloseCircle size={40} />
        </button>

        <div className="overflow-auto max-h-[80vh] pr-3">
          <div className="flex gap-6">
            {/* Avatar */}
            <div className="w-[180px] flex flex-col items-center gap-4">
              <img title="img" src={avatarPreview} className="w-full aspect-square rounded-full object-cover border" />
              <label htmlFor="avatar" className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">Thay ảnh</label>
              <input id="avatar" type="file" hidden onChange={handleFileChange} />
            </div>

            {/* Basic info */}
            <div className="flex-1 grid grid-cols-2 gap-5">
              <Input label="Họ và tên" id="fullname" value={data.fullname} onChange={handleChange} placeholder="Nhập họ và tên" error={errors.fullname} />
              {!profile && <Select label="Trạng thái" id="status" value={data.status} onChange={handleChange} options={[
                { value: "active", label: "Hoạt động" },
                { value: "locked", label: "Khóa" },
                { value: "pending", label: "Chờ duyệt" }
              ]} error={errors.status} />}
              <Input label="Email" id="email" value={data.email} onChange={handleChange} placeholder="example@email.com" error={errors.email} />
              <Input label="Số điện thoại" id="phone" value={data.phone} onChange={handleChange} placeholder="0123456789" error={errors.phone} />
              <Input label="Ngày sinh" id="birthday" type="date" value={data.birthday?.substring(0, 10)} onChange={handleChange} error={errors.birthday} />
              <Select label="Vai trò" id="role" disabled={profile} value={data.role} onChange={handleChange} options={[
                { value: "admin", label: "Quản trị viên" },
                { value: "manager", label: "Quản lý chi đoàn" },
                { value: "member", label: "Đoàn viên" }
              ]} error={errors.role} />
            </div>
          </div>

          {/* Manager fields */}
          {data.role === "manager" && (
            <div className="mt-5">
              <Select label="Chi đoàn quản lý" id="managerOf" value={data.managerOf} onChange={handleChange} options={chapters} error={errors.managerOf} />
            </div>
          )}

          {/* Member fields */}
          {data.role === "member" && (
            <div className="grid gap-4 mt-6">
              <Select label="Chi đoàn sinh hoạt" id="memberOf" value={data.infoMember?.memberOf} onChange={handleChange} options={chapters} error={errors.memberOf} />

              <div className="grid grid-cols-3 gap-4">
                <Input label="Số thẻ đoàn" id="cardCode" value={data.infoMember?.cardCode} onChange={handleChange} placeholder="VD: DV2025-01" error={errors.cardCode} />
                <Input label="Ngày vào đoàn" id="joinedAt" type="date" value={data.infoMember?.joinedAt?.substring(0, 10)} onChange={handleChange} error={errors.joinedAt} />
                <Select label="Chức vụ" id="position" value={data.infoMember?.position} onChange={handleChange} options={[
                  { value: "secretary", label: "Bí thư" },
                  { value: "deputy_secretary", label: "Phó Bí thư" },
                  { value: "committee_member", label: "Ủy viên BCH" },
                  { value: "member", label: "Đoàn viên" }
                ]} error={errors.position} />
              </div>

              <Input label="Địa chỉ" id="address" value={data.infoMember?.address} onChange={handleChange} placeholder="Nhập địa chỉ" error={errors.address} />
              <Input label="Quê quán" id="hometown" value={data.infoMember?.hometown} onChange={handleChange} placeholder="Nhập quê quán" error={errors.hometown} />

              <div className="grid grid-cols-2 gap-4">
                <Select label="Dân tộc" id="ethnicity" value={data.infoMember?.ethnicity} onChange={handleChange} options={ETHNICITIES.map(e => ({ value: e, label: e }))} error={errors.ethnicity} />
                <Select label="Tôn giáo" id="religion" value={data.infoMember?.religion} onChange={handleChange} options={RELIGIONS.map(r => ({ value: r, label: r }))} error={errors.religion} />
              </div>

              <Select label="Trình độ học vấn" id="eduLevel" value={data.infoMember?.eduLevel} onChange={handleChange} options={EDU_LEVELS.map(e => ({ value: e, label: e }))} error={errors.eduLevel} />
            </div>
          )}

          {/* Save button */}
          <div className="flex justify-end mt-6">
            <button onClick={handleUpdate} disabled={updating} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {updating ? <ClipLoader size={20} color="#fff" /> : "Lưu"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// INPUT / SELECT COMPONENTS
// ===========================
function Input({ label, id, value, onChange, type = "text", placeholder, error }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-blue-600">{label}</label>
      <input
        id={id}
        type={type}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

function Select({ label, id, value, onChange, options, disabled = false, error }: any) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold text-blue-600">{label}</label>
      <select
        title="select"
        id={id}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-4 py-2 rounded-lg border ${error ? "border-red-500" : "border-gray-300"} bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
      >
        <option value="" disabled>— Chọn —</option>
        {options.map((opt: any) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
      </select>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}

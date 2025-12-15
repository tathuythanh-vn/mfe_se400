import { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FaUser, FaIdCard, FaUsers, FaUserTag } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";
import avatarDefault from "../assets/avatar.png";
import { useGetMemberByIdQuery, useUpdateMemberByIdMutation } from "home/store";
import type { MemberInPage } from "../../../home/src/stores/interfaces/member";

type Props = { id: string; onClose: () => void };

const positionMap: Record<string, string> = {
  secretary: "Bí thư",
  deputy_secretary: "Phó Bí thư",
  committee_member: "Ủy viên BCH",
  member: "Đoàn viên",
};

export default function MemberDetail({ id, onClose }: Props) {
  const { data, isLoading } = useGetMemberByIdQuery(id);
  const [updateMember, { isLoading: updating }] = useUpdateMemberByIdMutation();

  const [form, setForm] = useState<Partial<MemberInPage>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

useEffect(() => {
  console.log("Member API data:", data);
  if (data?.data) setForm(data.data);
}, [data]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== undefined && value !== null) formData.append(key, value as string);
    });
    if (avatarFile) formData.append("avatar", avatarFile);

    await updateMember({ id, formData });
    onClose();
  };

  const handleToggleStatus = async () => {
    const formData = new FormData();
    formData.append("status", form.status === "active" ? "locked" : "active");

    await updateMember({ id, formData });
    setForm((prev) => ({ ...prev, status: prev.status === "active" ? "locked" : "active" }));
  };

  if (isLoading) return <div>Đang tải...</div>;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[900px] max-h-[90vh] rounded-2xl relative overflow-auto p-8">
        <IoIosCloseCircle
          size={40}
          className="absolute top-4 right-4 text-red-500 cursor-pointer"
          onClick={onClose}
        />

        <div className="flex gap-6 items-center mb-6">
          <img
          title="avatar"
            src={avatarPreview || form.avatar?.path || avatarDefault}
            className="w-32 h-32 rounded-full border-2 border-blue-600 object-cover"
          />
          <div>
            <h2 className="text-2xl font-bold text-blue-700">{form.fullname}</h2>
            <span className={`px-4 py-1 rounded-full text-white ${form.status === "active" ? "bg-green-500" : "bg-red-500"}`}>
              {form.status === "active" ? "Hoạt động" : "Khóa"}
            </span>
          </div>
        </div>

        <input title="image" type="file" accept="image/*" onChange={handleAvatarChange} className="mb-4" />

        <div className="grid grid-cols-2 gap-6">
          <Field label="Họ và tên" name="fullname" value={form.fullname || ""} onChange={handleChange} icon={<FaUser />} />
          <Field label="Email" name="email" value={form.email || ""} onChange={handleChange} icon={<MdEmail />} />
          <Field label="Số điện thoại" name="phone" value={form.phone || ""} onChange={handleChange} icon={<MdPhone />} />
          <Field label="Mã thẻ đoàn" name="cardCode" value={form.cardCode || ""} onChange={handleChange} icon={<FaIdCard />} />
          <Field label="Chi đoàn" name="memberOf" value={form.memberOf || ""} onChange={handleChange} icon={<FaUsers />} />

          <Select
            label="Chức vụ"
            name="position"
            value={form.position || ""}
            onChange={handleChange}
            options={[
              { value: "member", label: "Đoàn viên" },
              { value: "deputy_secretary", label: "Phó Bí thư" },
              { value: "secretary", label: "Bí thư" },
              { value: "committee_member", label: "Ủy viên BCH" },
            ]}
          />
        </div>

        <div className="flex justify-end gap-4 pt-6">
          <button onClick={handleToggleStatus} className="px-6 py-2 rounded-lg bg-red-600 text-white">
            {form.status === "active" ? "Khóa" : "Mở khóa"}
          </button>
          <button onClick={handleSubmit} disabled={updating} className="px-6 py-2 rounded-lg bg-blue-600 text-white">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, type = "text", ...props }: any) {
  return (
    <div>
      <label className="text-blue-700 font-semibold">{label}</label>
      <div className="mt-1 flex items-center border-2 border-blue-600 rounded-lg px-3">
        {icon && <span className="mr-2 text-blue-600">{icon}</span>}
        <input {...props} type={type} className="w-full py-2 outline-none text-blue-700" />
      </div>
    </div>
  );
}

function Select({ label, options = [], ...props }: any) {
  return (
    <div>
      <label className="text-blue-700 font-semibold">{label}</label>
      <select {...props} className="mt-1 w-full border-2 border-blue-600 rounded-lg py-2 px-3 text-blue-700">
        <option value="">-- Chọn --</option>
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

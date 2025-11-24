export type Role = "admin" | "manager" | "member";

export interface UserForm {
  email?: string;
  phone?: string;
  fullname?: string;
  birthday?: string;
  gender?: "male" | "female" | "other";
  role?: Role | string;
  password?: string;
  managerOf?: string[];
  memberOf?: string[];
  cardCode?: string;
  joinedAt?: string;
  position?: string;
  address?: string;
  hometown?: string;
  ethnicity?: string;
  religion?: string;
  eduLevel?: string;
  avatar?: File;
}

export interface ChapterForm {
  name?: string;
  address?: string;
  affiliated?: string;
  establishedAt?: string;
}

export interface EventForm {
  name?: string;
  startedAt?: string;
  location?: string;
  description?: string;
  scope?: string;
  tags?: string[];
  images?: File[];
}

export const validateForm = (
  data: UserForm,
  role: Role,
  isUpdate: boolean = false
): string | null => {
  const isEmpty = (val: any) => val === null || val === undefined || val === "";

  const fieldLabels: Record<string, string> = {
    email: "Email",
    phone: "Số điện thoại",
    fullname: "Họ tên",
    birthday: "Ngày sinh",
    gender: "Giới tính",
    role: "Vai trò",
    password: "Mật khẩu",
    managerOf: "Đơn vị quản lý",
    memberOf: "Đơn vị tham gia",
    cardCode: "Mã thẻ",
    joinedAt: "Ngày vào Đoàn",
    position: "Chức vụ",
    address: "Địa chỉ",
    hometown: "Quê quán",
    ethnicity: "Dân tộc",
    religion: "Tôn giáo",
    eduLevel: "Trình độ học vấn",
    avatar: "Ảnh đại diện",
  };

  const requiredFieldsByRole: Record<Role, string[]> = {
    admin: ["email", "phone", "fullname", "birthday", "gender", "role", "password"],
    manager: ["email", "phone", "fullname", "birthday", "gender", "role", "password", "managerOf"],
    member: [
      "email",
      "phone",
      "fullname",
      "birthday",
      "gender",
      "role",
      "password",
      "cardCode",
      "joinedAt",
      "address",
      "hometown",
      "ethnicity",
      "religion",
      "eduLevel",
      "memberOf",
    ],
  };

  if (!isUpdate) {
    if (!role || !requiredFieldsByRole[role]) {
      return "Vai trò không hợp lệ hoặc thiếu";
    }

    const requiredFields = requiredFieldsByRole[role];
    for (const field of requiredFields) {
      if (isEmpty(data[field as keyof UserForm])) {
        return `${fieldLabels[field] || field} là bắt buộc cho vai trò ${role}`;
      }
    }
  }

  if (!isEmpty(data.email)) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email!)) return "Email không hợp lệ";
  }

  if (!isEmpty(data.phone)) {
    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(data.phone!)) return "Số điện thoại không hợp lệ";
  }

  if (!isEmpty(data.fullname)) {
    if (data.fullname!.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự";
  }

  if (!isEmpty(data.birthday)) {
    if (isNaN(Date.parse(data.birthday!))) return "Ngày sinh không hợp lệ";
  }

  if (!isEmpty(data.gender)) {
    if (!["male", "female", "other"].includes(data.gender!)) return "Giới tính không hợp lệ";
  }

  if (!isEmpty(data.role)) {
    if (typeof data.role !== "string") return "Vai trò không hợp lệ";
  }

  if (!isEmpty(data.password)) {
    if (data.password!.length < 6) return "Mật khẩu phải có ít nhất 6 ký tự";
  }

  if (!isEmpty(data.cardCode)) {
    if (data.cardCode!.trim().length < 4) return "Mã thẻ phải có ít nhất 4 ký tự";
  }

  if (!isEmpty(data.joinedAt)) {
    if (isNaN(Date.parse(data.joinedAt!))) return "Ngày vào đoàn không hợp lệ";
  }

  const stringFields: (keyof UserForm)[] = ["position", "address", "hometown", "ethnicity", "religion", "eduLevel"];
  for (const field of stringFields) {
    if (!isEmpty(data[field]) && typeof data[field] !== "string") {
      return `${fieldLabels[field] || field} phải là chuỗi`;
    }
  }

  if (!isEmpty(data.avatar)) {
    if (!(data.avatar instanceof File)) return "Ảnh đại diện không hợp lệ";
  }

  return null;
};

export const validateChapterForm = (form: ChapterForm, isUpdate: boolean = false): string | null => {
  if (!isUpdate || form?.name !== undefined) {
    if (!form.name || form.name.trim() === "") return "Tên chi đoàn không được để trống.";
    if (form.name.trim().length < 3) return "Tên chi đoàn phải có ít nhất 3 ký tự.";
  }

  if (!isUpdate || form?.address !== undefined) {
    if (!form.address || form.address.trim() === "") return "Địa chỉ không được để trống.";
  }

  if (!isUpdate || form?.affiliated !== undefined) {
    if (!form.affiliated || form.affiliated.trim() === "") return "Đơn vị trực thuộc không được để trống.";
  }

  if (!isUpdate) {
    if (!form.establishedAt) return "Vui lòng chọn ngày thành lập.";
    const date = new Date(form.establishedAt);
    if (isNaN(date.getTime())) return "Ngày thành lập không hợp lệ.";
  }

  return null;
};

export const validateEventForm = (form: EventForm, isUpdate: boolean = false): string | null => {
  if (!isUpdate || form?.name !== undefined) {
    if (!form.name || form.name.trim() === "") return "Tên sự kiện không được để trống.";
    if (form.name.trim().length < 3) return "Tên sự kiện phải có ít nhất 3 ký tự.";
  }

  if (!isUpdate || form?.startedAt !== undefined) {
    if (!form.startedAt) return "Vui lòng chọn thời gian bắt đầu.";
    const date = new Date(form.startedAt);
    if (isNaN(date.getTime())) return "Thời gian bắt đầu không hợp lệ.";
  }

  if (!isUpdate || form?.location !== undefined) {
    if (!form.location || form.location.trim() === "") return "Địa điểm không được để trống.";
  }

  if (!isUpdate || form?.description !== undefined) {
    if (!form.description || form.description.trim() === "") return "Mô tả sự kiện không được để trống.";
  }

  if (!isUpdate || form?.scope !== undefined) {
    if (!form.scope || form.scope.trim() === "") return "Phạm vi sự kiện không được để trống.";
  }

  return null;
};

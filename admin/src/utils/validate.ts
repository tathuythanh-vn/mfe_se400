// utils/validate.ts

export interface UserData {
  email?: string;
  phone?: string;
  fullname?: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  role?: 'admin' | 'manager' | 'member';
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

export const validateForm = (
  data: UserData,
  role: 'admin' | 'manager' | 'member',
  isUpdate = false
): string | null => {
  const isEmpty = (val: unknown): boolean =>
    val === null || val === undefined || val === '';

  const fieldLabels: Record<string, string> = {
    email: 'Email',
    phone: 'Số điện thoại',
    fullname: 'Họ tên',
    birthday: 'Ngày sinh',
    gender: 'Giới tính',
    role: 'Vai trò',
    password: 'Mật khẩu',
    managerOf: 'Đơn vị quản lý',
    memberOf: 'Đơn vị tham gia',
    cardCode: 'Mã thẻ',
    joinedAt: 'Ngày vào Đoàn',
    position: 'Chức vụ',
    address: 'Địa chỉ',
    hometown: 'Quê quán',
    ethnicity: 'Dân tộc',
    religion: 'Tôn giáo',
    eduLevel: 'Trình độ học vấn',
    avatar: 'Ảnh đại diện',
  };

  const requiredFieldsByRole: Record<
    'admin' | 'manager' | 'member',
    string[]
  > = {
    admin: ['email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password'],
    manager: ['email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password', 'managerOf'],
    member: [
      'email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password',
      'cardCode', 'joinedAt', 'address', 'hometown', 'ethnicity', 'religion', 'eduLevel', 'memberOf',
    ],
  };

  if (!isUpdate) {
    if (!role || !requiredFieldsByRole[role]) {
      return 'Vai trò không hợp lệ hoặc thiếu';
    }

    const requiredFields = requiredFieldsByRole[role];
    for (const field of requiredFields) {
      if (isEmpty((data as any)[field])) {
        return `${fieldLabels[field] || field} là bắt buộc cho vai trò ${role}`;
      }
    }
  }

  if (!isEmpty(data.email)) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email!)) return 'Email không hợp lệ';
  }

  if (!isEmpty(data.phone)) {
    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(data.phone!)) return 'Số điện thoại không hợp lệ';
  }

  if (!isEmpty(data.fullname)) {
    if (data.fullname!.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
  }

  if (!isEmpty(data.birthday)) {
    if (isNaN(Date.parse(data.birthday!))) return 'Ngày sinh không hợp lệ';
  }

  if (!isEmpty(data.gender)) {
    if (!['male', 'female', 'other'].includes(data.gender!)) return 'Giới tính không hợp lệ';
  }

  if (!isEmpty(data.role)) {
    if (typeof data.role !== 'string') return 'Vai trò không hợp lệ';
  }

  if (!isEmpty(data.password)) {
    if (data.password!.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  if (!isEmpty(data.cardCode)) {
    if (data.cardCode!.trim().length < 4) return 'Mã thẻ phải có ít nhất 4 ký tự';
  }

  if (!isEmpty(data.joinedAt)) {
    if (isNaN(Date.parse(data.joinedAt!))) return 'Ngày vào đoàn không hợp lệ';
  }

  const stringFields = ['position', 'address', 'hometown', 'ethnicity', 'religion', 'eduLevel'];
  for (const field of stringFields) {
    const value = (data as any)[field];
    if (!isEmpty(value) && typeof value !== 'string') {
      return `${fieldLabels[field] || field} phải là chuỗi`;
    }
  }

  if (!isEmpty(data.avatar)) {
    if (!(data.avatar instanceof File)) return 'Ảnh đại diện không hợp lệ';
  }

  return null; // Hợp lệ
};

export const validateChapterForm = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.name || values.name.trim() === '') {
    errors.name = 'Tên chi đoàn là bắt buộc';
  }

  if (!values.leader || values.leader.trim() === '') {
    errors.leader = 'Tên bí thư là bắt buộc';
  }

  if (!values.phone || !/^[0-9]{10}$/.test(values.phone)) {
    errors.phone = 'Số điện thoại không hợp lệ';
  }

  return errors;
};

export const validateEventForm = (values: any) => {
  const errors: Record<string, string> = {};

  if (!values.title || values.title.trim() === '') {
    errors.title = 'Tên sự kiện là bắt buộc';
  }

  if (!values.date) {
    errors.date = 'Ngày tổ chức là bắt buộc';
  }

  if (!values.location || values.location.trim() === '') {
    errors.location = 'Địa điểm là bắt buộc';
  }

  if (values.participants && values.participants < 0) {
    errors.participants = 'Số lượng người tham gia không hợp lệ';
  }

  return errors;
};
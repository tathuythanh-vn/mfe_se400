export const validateForm = (data, role, isUpdate = false) => {
  const isEmpty = (val) => val === null || val === undefined || val === '';

  const fieldLabels = {
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

  const requiredFieldsByRole = {
    admin: ['email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password'],
    manager: ['email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password', 'managerOf'],
    member: [
      'email', 'phone', 'fullname', 'birthday', 'gender', 'role', 'password',
      'cardCode', 'joinedAt', 'address', 'hometown', 'ethnicity', 'religion', 'eduLevel', 'memberOf'
    ],
  };

  if (!isUpdate) {
    if (!role || !requiredFieldsByRole[role]) {
      return 'Vai trò không hợp lệ hoặc thiếu';
    }

    const requiredFields = requiredFieldsByRole[role];
    for (const field of requiredFields) {
      if (isEmpty(data[field])) {
        return `${fieldLabels[field] || field} là bắt buộc cho vai trò ${role}`;
      }
    }
  }

  if (!isEmpty(data.email)) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) return 'Email không hợp lệ';
  }

  if (!isEmpty(data.phone)) {
    const phoneRegex = /^\d{9,11}$/;
    if (!phoneRegex.test(data.phone)) return 'Số điện thoại không hợp lệ';
  }

  if (!isEmpty(data.fullname)) {
    if (data.fullname.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
  }

  if (!isEmpty(data.birthday)) {
    if (isNaN(Date.parse(data.birthday))) return 'Ngày sinh không hợp lệ';
  }

  if (!isEmpty(data.gender)) {
    if (!['male', 'female', 'other'].includes(data.gender)) return 'Giới tính không hợp lệ';
  }

  if (!isEmpty(data.role)) {
    if (typeof data.role !== 'string') return 'Vai trò không hợp lệ';
  }

  if (!isEmpty(data.password)) {
    if (data.password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự';
  }

  // if (!isEmpty(data.managerOf)) {
  //   if (!Array.isArray(data.managerOf)) return 'managerOf phải là mảng';
  // }

  // if (!isEmpty(data.memberOf)) {
  //   if (!Array.isArray(data.memberOf)) return 'memberOf phải là mảng';
  // }

  if (!isEmpty(data.cardCode)) {
    if (data.cardCode.trim().length < 4) return 'Mã thẻ phải có ít nhất 4 ký tự';
  }

  if (!isEmpty(data.joinedAt)) {
    if (isNaN(Date.parse(data.joinedAt))) return 'Ngày vào đoàn không hợp lệ';
  }

  const stringFields = ['position', 'address', 'hometown', 'ethnicity', 'religion', 'eduLevel'];
  for (const field of stringFields) {
    if (!isEmpty(data[field]) && typeof data[field] !== 'string') {
      return `${fieldLabels[field] || field} phải là chuỗi`;
    }
  }

  if (!isEmpty(data.avatar)) {
    if (!(data.avatar instanceof File)) return 'Ảnh đại diện không hợp lệ';
  }

  return null; // Hợp lệ
};

export function validateChapterForm(form, isUpdate = false) {
  // Kiểm tra tên chi đoàn
  if (!isUpdate || form?.name !== undefined) {
    if (!form?.name || form?.name.trim() === "") {
      return "Tên chi đoàn không được để trống.";
    }
    if (form?.name.trim().length < 3) {
      return "Tên chi đoàn phải có ít nhất 3 ký tự.";
    }
  }

  // Kiểm tra địa chỉ
  if (!isUpdate || form?.address !== undefined) {
    if (!form?.address || form?.address.trim() === "") {
      return "Địa chỉ không được để trống.";
    }
  }

  // Kiểm tra đơn vị trực thuộc
  if (!isUpdate || form?.affiliated !== undefined) {
    if (!form?.affiliated || form?.affiliated.trim() === "") {
      return "Đơn vị trực thuộc không được để trống.";
    }
  }

  // Kiểm tra ngày thành lập (chỉ khi tạo mới)
  if (!isUpdate) {
    if (!form?.establishedAt) {
      return "Vui lòng chọn ngày thành lập.";
    }
    const date = new Date(form?.establishedAt);
    if (isNaN(date.getTime())) {
      return "Ngày thành lập không hợp lệ.";
    }
  }

  return null; // Không có lỗi
}

export function validateEventForm(form, isUpdate = false) {
  // Kiểm tra tên sự kiện
  if (!isUpdate || form?.name !== undefined) {
    if (!form?.name || form?.name.trim() === "") {
      return "Tên sự kiện không được để trống.";
    }
    if (form?.name.trim().length < 3) {
      return "Tên sự kiện phải có ít nhất 3 ký tự.";
    }
  }

  // Kiểm tra thời gian bắt đầu
  if (!isUpdate || form?.startedAt !== undefined) {
    if (!form?.startedAt) {
      return "Vui lòng chọn thời gian bắt đầu.";
    }
    const date = new Date(form?.startedAt);
    if (isNaN(date.getTime())) {
      return "Thời gian bắt đầu không hợp lệ.";
    }
  }

  // Kiểm tra địa điểm
  if (!isUpdate || form?.location !== undefined) {
    if (!form?.location || form?.location.trim() === "") {
      return "Địa điểm không được để trống.";
    }
  }

  // Kiểm tra mô tả
  if (!isUpdate || form?.description !== undefined) {
    if (!form?.description || form?.description.trim() === "") {
      return "Mô tả sự kiện không được để trống.";
    }
  }

  // Kiểm tra phạm vi (scope)
  if (!isUpdate || form?.scope !== undefined) {
    if (!form?.scope || form?.scope.trim() === "") {
      return "Phạm vi sự kiện không được để trống.";
    }
  }

  return null; // Không có lỗi
}

export function validateDocumentForm(form, isUpdate = false) {
  // Kiểm tra tên văn bản
  if (!isUpdate || form?.name !== undefined) {
    if (!form?.name || form.name.trim() === "") {
      return "Tên văn bản không được để trống.";
    }
    if (form.name.trim().length < 3) {
      return "Tên văn bản phải có ít nhất 3 ký tự.";
    }
  }

  // Kiểm tra số hiệu văn bản
  if (!isUpdate || form?.docCode !== undefined) {
    if (!form?.docCode || form.docCode.trim() === "") {
      return "Số hiệu văn bản không được để trống.";
    }
  }

  // Kiểm tra mô tả
  if (!isUpdate || form?.description !== undefined) {
    if (!form?.description || form.description.trim() === "") {
      return "Mô tả văn bản không được để trống.";
    }
  }

  // Kiểm tra phạm vi (scope)
  if (!isUpdate || form?.scope !== undefined) {
    if (!form?.scope || form.scope.trim() === "") {
      return "Phạm vi không được để trống.";
    }
  }

  // Kiểm tra loại tài liệu (type)
  if (!isUpdate || form?.type !== undefined) {
    if (!form?.type || form.type.trim() === "") {
      return "Loại tài liệu không được để trống.";
    }
  }

  return null; // Không có lỗi
}

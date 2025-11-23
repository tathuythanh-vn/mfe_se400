import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import avatarDefault from '../../../assets/avatar.png';
import FormInput from './FormInput';

interface ChapterOption {
  value: string;
  name: string;
}

interface UpdateData {
  avatar?: File;
  [key: string]: string | File | undefined;
}

interface AccountDetailFormProps {
  data: any;
  updates: UpdateData;
  chapters: ChapterOption[];
  profile?: boolean;
  isUpdating: boolean;
  setUpdates: React.Dispatch<React.SetStateAction<UpdateData>>;
  onUpdate: () => void;
}

export default function AccountDetailForm({
  data,
  updates,
  chapters,
  profile = false,
  isUpdating,
  setUpdates,
  onUpdate,
}: AccountDetailFormProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id: fieldId, value } = e.target;
    // All fields are stored flat at root level, no nesting needed
    setUpdates((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 5 * 1024 * 1024) {
      setUpdates((prev) => ({ ...prev, avatar: file }));
    } else {
      toast.info('Ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
    }
  };

  const renderAvatar = () => {
    if (updates.avatar instanceof File) {
      return URL.createObjectURL(updates.avatar);
    }
    if (data?.avatar?.path) {
      return data.avatar.path;
    }
    return avatarDefault;
  };

  // Get current value with updates applied
  const getValue = (field: string) => {
    // Check if field has been updated
    if (updates[field] !== undefined) {
      return updates[field] as string;
    }
    // Return original data value
    return (data as any)?.[field] || '';
  };
  return (
    <div className="overflow-auto max-h-[80vh] pr-2.5">
      {/* Account Info Section */}
      <div className="flex flex-row">
        {/* Avatar Container */}
        <div className="w-[180px] px-5 flex flex-col justify-start items-center gap-5">
          <img
            src={renderAvatar()}
            alt="avatar"
            className="w-full aspect-square rounded-full shadow-md"
          />
          <label
            htmlFor="avatar"
            className="bg-sidebar text-white px-3 py-2 rounded-lg cursor-pointer active:-translate-y-0.5"
          >
            Thay ảnh
          </label>
          <input
            type="file"
            id="avatar"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        {/* Information Container */}
        <div className="flex-1 flex flex-col gap-5">
          {/* Fullname and Status */}
          <div className="flex gap-5">
            <FormInput
              id="fullname"
              label="Họ và tên"
              type="text"
              value={getValue('fullname')}
              onChange={handleChange}
              placeholder="Nhập họ tên"
              className="flex-3"
            />
            {!profile && (
              <FormInput
                id="status"
                label="Trạng thái"
                type="select"
                value={getValue('status') || 'active'}
                onChange={handleChange}
                className="flex-1"
                style={{
                  color:
                    getValue('status') === 'active'
                      ? 'green'
                      : getValue('status') === 'locked'
                        ? 'red'
                        : '#ff8f00',
                  fontWeight: 'bold',
                }}
              >
                <option value="active">Hoạt động</option>
                <option value="locked">Khóa</option>
                <option value="pending">Chờ duyệt</option>
              </FormInput>
            )}
          </div>

          {/* Email and Phone */}
          <div className="flex gap-5">
            <FormInput
              id="email"
              label="Email"
              type="email"
              value={getValue('email')}
              onChange={handleChange}
              placeholder="Nhập email"
              className="flex-2"
            />
            <FormInput
              id="phone"
              label="Số điện thoại"
              type="text"
              value={getValue('phone')}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className="flex-1"
            />
          </div>

          {/* Birthday and Role */}
          <div className="flex gap-5">
            <FormInput
              id="birthday"
              label="Ngày sinh"
              type="date"
              value={
                getValue('birthday')
                  ? String(getValue('birthday')).substring(0, 10)
                  : ''
              }
              onChange={handleChange}
            />
            <FormInput
              id="role"
              label="Vai trò"
              type="select"
              value={getValue('role')}
              onChange={handleChange}
              disabled={profile}
            >
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý chi đoàn</option>
              <option value="member">Đoàn viên</option>
            </FormInput>
          </div>
        </div>
      </div>

      {/* Role Info Section */}
      <div className="flex flex-col mt-5">
        {/* Manager Section */}
        <div
          className={`${getValue('role') === 'manager' ? 'flex' : 'hidden'}`}
        >
          <FormInput
            id="managerOf"
            label="Chi đoàn quản lý"
            type="select"
            value={getValue('managerOf')}
            onChange={handleChange}
          >
            {chapters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </FormInput>
        </div>

        {/* Member Section */}
        <div
          className={`flex-col gap-5 ${getValue('role') === 'member' ? 'flex' : 'hidden'}`}
        >
          <FormInput
            id="memberOf"
            label="Chi đoàn sinh hoạt"
            type="select"
            value={getValue('memberOf')}
            onChange={handleChange}
          >
            {chapters.map((item) => (
              <option key={item.value} value={item.value}>
                {item.name}
              </option>
            ))}
          </FormInput>

          <div className="flex gap-5">
            <FormInput
              id="cardCode"
              label="Số thẻ đoàn"
              type="text"
              value={getValue('cardCode')}
              onChange={handleChange}
              placeholder="Nhập số thẻ đoàn"
            />
            <FormInput
              id="joinedAt"
              label="Ngày vào đoàn"
              type="date"
              value={
                getValue('joinedAt')
                  ? String(getValue('joinedAt')).substring(0, 10)
                  : ''
              }
              onChange={handleChange}
            />
            <FormInput
              id="position"
              label="Chức vụ"
              type="select"
              value={getValue('position')}
              onChange={handleChange}
            >
              <option value="secretary">Bí thư</option>
              <option value="deputy_secretary">Phó Bí thư</option>
              <option value="committee_member">Ủy viên BCH</option>
              <option value="member">Đoàn viên</option>
            </FormInput>
          </div>

          <FormInput
            id="address"
            label="Địa chỉ"
            type="text"
            value={getValue('address')}
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
          />

          <FormInput
            id="hometown"
            label="Quê quán"
            type="text"
            value={getValue('hometown')}
            onChange={handleChange}
            placeholder="Nhập quê quán"
          />

          <div className="flex gap-5">
            <FormInput
              id="ethnicity"
              label="Dân tộc"
              type="text"
              value={getValue('ethnicity')}
              onChange={handleChange}
              placeholder="Nhập dân tộc"
            />
            <FormInput
              id="religion"
              label="Tôn giáo"
              type="text"
              value={getValue('religion')}
              onChange={handleChange}
              placeholder="Nhập tôn giáo"
            />
          </div>

          <FormInput
            id="eduLevel"
            label="Trình độ học vấn"
            type="text"
            value={getValue('eduLevel')}
            onChange={handleChange}
            placeholder="Nhập trình độ học vấn"
          />
        </div>
      </div>

      {/* Button Container */}
      <div className="flex justify-center items-center mt-5">
        <button
          onClick={onUpdate}
          disabled={isUpdating || Object.keys(updates).length === 0}
          className="px-[18px] py-3 h-10 w-[120px] text-white border-none text-lg outline-none rounded-lg font-bold bg-sidebar cursor-pointer transition-all duration-200 shadow-md active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isUpdating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lưu'}
        </button>
      </div>
    </div>
  );
}

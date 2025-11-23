import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useRegisterMutation, useGetChaptersInPageQuery } from 'home/store';

// TODO: Add logo when available
// import logo from "../assets/logo.webp";

interface Chapter {
  _id: string;
  status: 'active' | 'locked';
  name: string;
  affiliated: string;
  address: string;
  establishedAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  fullname: string | null;
  avatar: string | null;
}

export default function Signup() {
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();

  // Fetch chapters using RTK Query
  const { data: chaptersData } = useGetChaptersInPageQuery({
    page: 1,
    limit: 10000,
  });

  const chapters: { value: string; name: string }[] =
    chaptersData?.data.result.map((chapter: Chapter) => ({
      value: chapter._id,
      name: chapter.name,
    })) || [];

  const [account, setAccount] = useState({
    email: '',
    phone: '',
    fullname: '',
    birthday: '',
    gender: '',
    password: '',
    role: '',
  });

  const [roleInfo, setRoleInfo] = useState({
    managerOf: '',
    memberOf: '',
    cardCode: '',
    position: '',
    address: '',
    hometown: '',
    ethnicity: '',
    religion: '',
    eduLevel: '',
    joinedAt: '',
  });
  const [togglePassword, setTogglePassword] = useState(false);

  const handleAccountChange = (key: string, value: string) => {
    setAccount((prev) => ({ ...prev, [key]: value }));
  };

  const handleRoleInfoChange = (key: string, value: string) => {
    setRoleInfo((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validation
      if (!account.fullname.trim()) {
        alert('Vui lòng nhập họ tên');
        return;
      }
      if (!account.email.trim()) {
        alert('Vui lòng nhập email');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(account.email)) {
        alert('Email không hợp lệ');
        return;
      }
      if (!account.phone.trim()) {
        alert('Vui lòng nhập số điện thoại');
        return;
      }
      const phoneRegex = /^(0|\+84)\d{9}$/;
      if (!phoneRegex.test(account.phone)) {
        alert('Số điện thoại không hợp lệ');
        return;
      }
      if (!account.password || account.password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return;
      }
      if (!account.birthday) {
        alert('Vui lòng chọn ngày sinh');
        return;
      }
      if (!account.gender) {
        alert('Vui lòng chọn giới tính');
        return;
      }
      if (!account.role) {
        alert('Vui lòng chọn vai trò');
        return;
      }

      // Role-specific validation
      if (account.role === 'manager') {
        if (!roleInfo.managerOf.trim()) {
          alert('Vui lòng chọn chi đoàn quản lý');
          return;
        }
      } else if (account.role === 'member') {
        if (!roleInfo.memberOf?.trim()) {
          alert('Vui lòng chọn chi đoàn tham gia');
          return;
        }
        if (!roleInfo.cardCode?.trim()) {
          alert('Vui lòng nhập mã thẻ đoàn');
          return;
        }
        if (!roleInfo.position?.trim()) {
          alert('Vui lòng chọn chức vụ');
          return;
        }
        if (!roleInfo.address?.trim()) {
          alert('Vui lòng nhập địa chỉ');
          return;
        }
        if (!roleInfo.hometown?.trim()) {
          alert('Vui lòng nhập quê quán');
          return;
        }
        if (!roleInfo.ethnicity?.trim()) {
          alert('Vui lòng nhập dân tộc');
          return;
        }
        if (!roleInfo.religion?.trim()) {
          alert('Vui lòng nhập tôn giáo');
          return;
        }
        if (!roleInfo.eduLevel?.trim()) {
          alert('Vui lòng nhập trình độ học vấn');
          return;
        }
      }

      // Use Redux Toolkit Query mutation
      const response = await register({
        account: {
          email: account.email,
          phone: account.phone,
          fullname: account.fullname,
          birthday: account.birthday,
          gender: account.gender as 'male' | 'female' | 'other',
          password: account.password,
          role: account.role as 'manager' | 'member',
        },
        roleInfo: {
          managerOf: roleInfo.managerOf || undefined,
          memberOf: roleInfo.memberOf || undefined,
          cardCode: roleInfo.cardCode || undefined,
          position: roleInfo.position || undefined,
          address: roleInfo.address || undefined,
          hometown: roleInfo.hometown || undefined,
          ethnicity: roleInfo.ethnicity || undefined,
          religion: roleInfo.religion || undefined,
          eduLevel: roleInfo.eduLevel || undefined,
          joinedAt: roleInfo.joinedAt || undefined,
        },
      }).unwrap();

      console.log('Registration response:', response);

      if (response.success) {
        navigate('/');
        alert(response.message || 'Đăng ký thành công');
      } else {
        alert(response.message || 'Đăng ký thất bại');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      alert(err?.data?.message || 'Đã có lỗi xảy ra');
    }
  };

  return (
    <div className="min-h-screen bg-sidebar overflow-auto">
      {/* Logo Container */}
      <div className="flex flex-col justify-center items-center gap-2.5 pt-10 pb-60">
        {/* TODO: Uncomment when logo is available */}
        {/* <img src={logo} alt="Logo" className="w-30 animate-bounce-slow" /> */}
        <div className="w-30 h-30 bg-white rounded-full flex items-center justify-center animate-bounce-slow">
          <span className="text-primary text-5xl font-bold">HT</span>
        </div>
        <p className="text-white text-2xl font-bold">
          HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleRegister}
        className="w-2/5 min-w-[300px] mx-auto -mt-[200px] mb-[200px] rounded-2xl bg-white p-10 flex flex-col gap-5"
      >
        {/* Email */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="email" className="text-primary font-bold">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email để đăng ký"
            value={account.email}
            onChange={(e) => handleAccountChange('email', e.target.value)}
            className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="phone" className="text-primary font-bold">
            Số điện thoại
          </label>
          <input
            type="text"
            id="phone"
            placeholder="Nhập số điện thoại"
            value={account.phone}
            onChange={(e) => handleAccountChange('phone', e.target.value)}
            className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
          />
        </div>

        {/* Fullname */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="fullname" className="text-primary font-bold">
            Họ và tên
          </label>
          <input
            type="text"
            id="fullname"
            placeholder="Nhập họ và tên"
            value={account.fullname}
            onChange={(e) => handleAccountChange('fullname', e.target.value)}
            className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
          />
        </div>

        {/* Birthday & Gender */}
        <div className="flex gap-5 flex-wrap md:flex-nowrap">
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="birthday" className="text-primary font-bold">
              Ngày sinh
            </label>
            <input
              type="date"
              id="birthday"
              value={account.birthday}
              onChange={(e) => handleAccountChange('birthday', e.target.value)}
              className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
            />
          </div>
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="gender" className="text-primary font-bold">
              Giới tính
            </label>
            <select
              id="gender"
              value={account.gender}
              onChange={(e) => handleAccountChange('gender', e.target.value)}
              className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5 w-full relative">
          <label htmlFor="password" className="text-primary font-bold">
            Mật khẩu
          </label>
          <input
            type={togglePassword ? 'text' : 'password'}
            id="password"
            placeholder="Nhập mật khẩu"
            value={account.password}
            onChange={(e) => handleAccountChange('password', e.target.value)}
            className="outline-none h-12 rounded-lg px-2.5 pr-14 border-2 border-primary text-primary"
          />
          <button
            type="button"
            onClick={() => setTogglePassword((prev) => !prev)}
            className="absolute right-5 bottom-3 text-primary cursor-pointer"
          >
            {togglePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Role */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="role" className="text-primary font-bold">
            Chọn vai trò
          </label>
          <select
            id="role"
            value={account.role}
            onChange={(e) => handleAccountChange('role', e.target.value)}
            className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
          >
            <option value="" disabled>
              Chọn vai trò
            </option>
            <option value="manager">Quản lý chi đoàn</option>
            <option value="member">Đoàn viên</option>
          </select>
        </div>

        {/* Manager Fields */}
        {account.role === 'manager' && (
          <div className="flex flex-col gap-1.5 w-full">
            <label htmlFor="managerOf" className="text-primary font-bold">
              Chi đoàn quản lý
            </label>
            <select
              id="managerOf"
              value={roleInfo.managerOf}
              onChange={(e) =>
                handleRoleInfoChange('managerOf', e.target.value)
              }
              className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
            >
              <option value="" disabled>
                Chọn chi đoàn quản lý
              </option>
              {chapters.map((item) => (
                <option key={item.name} value={item.value}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Member Fields */}
        {account.role === 'member' && (
          <div className="flex flex-col gap-5">
            {/* Member Of */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="memberOf" className="text-primary font-bold">
                Chi đoàn sinh hoạt
              </label>
              <select
                id="memberOf"
                value={roleInfo.memberOf}
                onChange={(e) =>
                  handleRoleInfoChange('memberOf', e.target.value)
                }
                className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
              >
                <option value="" disabled>
                  Chọn chi đoàn sinh hoạt
                </option>
                {chapters.map((item: any) => (
                  <option key={item.value} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Card Code & Joined Date */}
            <div className="flex gap-5 flex-wrap md:flex-nowrap">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="cardCode" className="text-primary font-bold">
                  Số thẻ đoàn
                </label>
                <input
                  type="text"
                  id="cardCode"
                  placeholder="Nhập số thẻ đoàn"
                  value={roleInfo.cardCode}
                  onChange={(e) =>
                    handleRoleInfoChange('cardCode', e.target.value)
                  }
                  className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="joinedAt" className="text-primary font-bold">
                  Ngày vào đoàn
                </label>
                <input
                  type="date"
                  id="joinedAt"
                  value={roleInfo.joinedAt}
                  onChange={(e) =>
                    handleRoleInfoChange('joinedAt', e.target.value)
                  }
                  className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
                />
              </div>
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="position" className="text-primary font-bold">
                Chức vụ
              </label>
              <select
                id="position"
                value={roleInfo.position}
                onChange={(e) =>
                  handleRoleInfoChange('position', e.target.value)
                }
                className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
              >
                <option value="" disabled>
                  Chọn chức vụ
                </option>
                <option value="secretary">Bí thư</option>
                <option value="deputy_secretary">Phó Bí thư</option>
                <option value="committee_member">Ủy viên BCH</option>
                <option value="member">Đoàn viên</option>
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="address" className="text-primary font-bold">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                placeholder="Nhập địa chỉ"
                value={roleInfo.address}
                onChange={(e) =>
                  handleRoleInfoChange('address', e.target.value)
                }
                className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
              />
            </div>

            {/* Hometown */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="hometown" className="text-primary font-bold">
                Quê quán
              </label>
              <input
                type="text"
                id="hometown"
                placeholder="Nhập quê quán"
                value={roleInfo.hometown}
                onChange={(e) =>
                  handleRoleInfoChange('hometown', e.target.value)
                }
                className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
              />
            </div>

            {/* Ethnicity & Religion */}
            <div className="flex gap-5 flex-wrap md:flex-nowrap">
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="ethnicity" className="text-primary font-bold">
                  Dân tộc
                </label>
                <input
                  type="text"
                  id="ethnicity"
                  placeholder="Nhập dân tộc"
                  value={roleInfo.ethnicity}
                  onChange={(e) =>
                    handleRoleInfoChange('ethnicity', e.target.value)
                  }
                  className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5 w-full">
                <label htmlFor="religion" className="text-primary font-bold">
                  Tôn giáo
                </label>
                <input
                  type="text"
                  id="religion"
                  placeholder="Nhập tôn giáo"
                  value={roleInfo.religion}
                  onChange={(e) =>
                    handleRoleInfoChange('religion', e.target.value)
                  }
                  className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
                />
              </div>
            </div>

            {/* Education Level */}
            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="eduLevel" className="text-primary font-bold">
                Trình độ học vấn
              </label>
              <input
                type="text"
                id="eduLevel"
                placeholder="Nhập trình độ học vấn"
                value={roleInfo.eduLevel}
                onChange={(e) =>
                  handleRoleInfoChange('eduLevel', e.target.value)
                }
                className="outline-none h-12 rounded-lg px-2.5 border-2 border-primary text-primary"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center items-center mt-2.5">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-15 px-4 py-3 text-white text-lg font-bold bg-primary rounded-lg cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.97] active:shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </div>

        {/* Login Link */}
        <div className="flex justify-center gap-1.5 text-primary">
          <p>Bạn đã có tài khoản.</p>
          <NavLink
            to="/auth/login"
            className="font-bold cursor-pointer hover:underline"
          >
            Đăng nhập ngay
          </NavLink>
        </div>
      </form>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

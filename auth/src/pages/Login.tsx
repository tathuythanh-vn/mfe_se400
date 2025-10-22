import { useState, type FormEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useLoginMutation } from 'home/store';
import { NavLink } from 'react-router-dom';

// TODO: Update the logo path - you can import from home app or copy to auth/src/assets
// import logo from "../assets/logo.webp";

export default function Login() {
  const [account, setAccount] = useState({
    email: '',
    password: '',
  });
  const [togglePassword, setTogglePassword] = useState(false);

  const [login] = useLoginMutation();

  const handleAccountChange = (key: string, value: string) => {
    setAccount((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await login({
        email: account.email,
        password: account.password,
      });

      const { token, role } = data.data;

      localStorage.setItem('token', token);

      // TODO: Handle successful login (store token, navigate, etc.)
    } catch (error) {
      console.error('Login failed:', error);
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      {/* Logo Container */}
      <div className="flex flex-col items-center mb-8">
        {/* TODO: Uncomment when logo is available */}
        {/* <img src={logo} alt="Logo" className="w-24 h-24 mb-4" /> */}
        <div className="w-24 h-24 bg-primary rounded-full mb-4 flex items-center justify-center">
          <span className="text-white text-4xl font-bold">HT</span>
        </div>
        <p className="text-primary text-lg font-semibold text-center">
          HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN
        </p>
      </div>

      {/* Form Container */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-xl p-8"
      >
        {/* Email Input */}
        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Nhập email để đăng nhập"
            value={account.email}
            onChange={(e) => handleAccountChange('email', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
        </div>

        {/* Password Input */}
        <div className="mb-6 relative">
          <label
            htmlFor="password"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Mật khẩu
          </label>
          <input
            type={togglePassword ? 'text' : 'password'}
            id="password"
            placeholder="Nhập mật khẩu"
            value={account.password}
            onChange={(e) => handleAccountChange('password', e.target.value)}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          />
          <button
            type="button"
            onClick={() => setTogglePassword((prev) => !prev)}
            className="absolute right-4 top-[42px] text-primary hover:text-primary/80 transition-colors"
          >
            {togglePassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Login Button */}
        <div className="mb-6">
          <button className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md hover:shadow-lg">
            Đăng nhập
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">Bạn chưa có tài khoản. </span>
          <NavLink
            to="/auth/signup"
            className="text-primary font-semibold hover:text-primary/80 hover:underline transition-colors"
          >
            Đăng ký ngay
          </NavLink>
        </div>
      </form>
    </div>
  );
}

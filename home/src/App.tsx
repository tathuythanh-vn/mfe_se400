import { useState } from 'react';
import { Users, Award, Calendar, TrendingUp, ChevronRight } from 'lucide-react';
import { NavLink } from "react-router-dom";

import "./App.css"

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-blue-800">Quản Lý Đoàn Viên</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition">Tính năng</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition">Giới thiệu</a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition">Liên hệ</a>
            </nav>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to={"/auth/login"} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition">
                Đăng nhập
              </NavLink>
              <NavLink to={"/auth/signup"} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md">
                Đăng ký
              </NavLink>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600 hover:text-blue-600 py-2">Tính năng</a>
              <a href="#about" className="block text-gray-600 hover:text-blue-600 py-2">Giới thiệu</a>
              <a href="#contact" className="block text-gray-600 hover:text-blue-600 py-2">Liên hệ</a>
              <NavLink to={"/auth/signup"} className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
                Đăng nhập
              </NavLink>
              <NavLink to={"/auth/signup"} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Đăng ký
              </NavLink>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Inspired by Image 1 layout */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-block">
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
                  Hiện đại & Tiện lợi
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hệ Thống Quản Lý
                <span className="block text-blue-600 mt-2">Đoàn Viên</span>
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Giải pháp toàn diện cho việc quản lý thông tin đoàn viên, theo dõi hoạt động và đánh giá hiệu quả công tác đoàn.
              </p>

              <div className="flex flex-row gap-4">
                <NavLink to={"auth/login"} className="group px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                  <span className="font-semibold">Bắt đầu ngay</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </NavLink>
                <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold">
                  Tìm hiểu thêm
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-blue-600">1000+</div>
                  <div className="text-sm text-gray-600 mt-1">Đoàn viên</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">50+</div>
                  <div className="text-sm text-gray-600 mt-1">Chi đoàn</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">98%</div>
                  <div className="text-sm text-gray-600 mt-1">Hài lòng</div>
                </div>
              </div>
            </div>

            {/* Right Content - Image Grid inspired by Image 1 */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quản lý thành viên</h3>
                  <p className="text-sm text-gray-600">Theo dõi thông tin đầy đủ của từng đoàn viên</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 mt-8">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Đánh giá & Khen thưởng</h3>
                  <p className="text-sm text-gray-600">Hệ thống đánh giá tự động và công bằng</p>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Quản lý hoạt động</h3>
                  <p className="text-sm text-gray-600">Lên lịch và theo dõi các hoạt động đoàn</p>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1 mt-8">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Báo cáo & Thống kê</h3>
                  <p className="text-sm text-gray-600">Phân tích dữ liệu chi tiết và trực quan</p>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
              <div className="absolute -z-10 bottom-0 left-0 w-72 h-72 bg-purple-200 rounded-full filter blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Được thiết kế để đáp ứng mọi nhu cầu quản lý đoàn viên của bạn
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "👥",
                title: "Quản lý danh sách",
                desc: "Cập nhật thông tin đoàn viên nhanh chóng, chính xác với giao diện thân thiện"
              },
              {
                icon: "🔍",
                title: "Tìm kiếm thông minh",
                desc: "Tìm kiếm và lọc thông tin đoàn viên theo nhiều tiêu chí khác nhau"
              },
              {
                icon: "📊",
                title: "Thống kê chi tiết",
                desc: "Biểu đồ và báo cáo trực quan giúp ra quyết định hiệu quả"
              },
              {
                icon: "✅",
                title: "Phê duyệt nhanh",
                desc: "Quy trình phê duyệt tự động, tiết kiệm thời gian và công sức"
              },
              {
                icon: "🔔",
                title: "Thông báo tức thì",
                desc: "Cập nhật thông tin mới nhất qua email và thông báo trong app"
              },
              {
                icon: "🔒",
                title: "Bảo mật cao",
                desc: "Dữ liệu được mã hóa và bảo vệ theo tiêu chuẩn quốc tế"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Đăng ký ngay hôm nay để trải nghiệm hệ thống quản lý đoàn viên hiện đại nhất
          </p>
          <NavLink to={"auth/signup"} className="px-10 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1 w-fit">
            Đăng ký miễn phí
          </NavLink>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full"></div>
                <span className="font-bold text-white">Quản Lý Đoàn Viên</span>
              </div>
              <p className="text-sm">Giải pháp quản lý đoàn viên toàn diện và hiệu quả</p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Sản phẩm</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Tính năng</a></li>
                <li><a href="#" className="hover:text-white transition">Bảng giá</a></li>
                <li><a href="#" className="hover:text-white transition">Hướng dẫn</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Công ty</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Giới thiệu</a></li>
                <li><a href="#" className="hover:text-white transition">Liên hệ</a></li>
                <li><a href="#" className="hover:text-white transition">Tuyển dụng</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-white transition">Điều khoản</a></li>
                <li><a href="#" className="hover:text-white transition">Bảo mật</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
            © 2024 Hệ Thống Quản Lý Đoàn Viên. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
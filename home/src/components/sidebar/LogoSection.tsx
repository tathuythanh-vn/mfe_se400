import logo from '../../assets/logo.webp';

const LogoSection = () => {
  return (
    <div className="flex flex-col justify-center items-center gap-[10px] py-6">
      <img className="w-[120px]" src={logo} />
      <p className="text-white text-base font-bold text-center">
        HỆ THỐNG QUẢN LÝ ĐOÀN VIÊN
      </p>
      <hr className="block border border-white w-3/4" />
    </div>
  );
};

export default LogoSection;

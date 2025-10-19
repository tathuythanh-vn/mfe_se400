export const regexValidators = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^(0|\+84)[0-9]{9,10}$/,       // Hỗ trợ đầu 0 hoặc +84 và dài 9–10 số
  password: /^.{6,}$/,                  // Tối thiểu 6 ký tự bất kỳ
  cardCode: /^\d{7}$/                  // Chính xác 7 chữ số
};

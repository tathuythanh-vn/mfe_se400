import bcrypt from 'bcryptjs'

// Mã hóa mật khẩu
export const hashPassword = async (plainPassword) => {
  const saltRounds = 10;
  return await bcrypt.hash(plainPassword, saltRounds);
};

// So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
export const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

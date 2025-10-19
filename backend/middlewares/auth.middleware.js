import Account from "../models/account.model.js";
import { sendResponse } from "../utils/response.js";
import { verifyToken } from "../utils/token.js";

const AuthMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return sendResponse(res, 401, 'Bạn chưa đăng nhập');
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      const accountId = decoded.accountId;

      const account = await Account.findById(accountId)
      if (!account) {
        return sendResponse(res, 404, 'Không tìm thấy tài khoản');
      }

      if (account.role !== requiredRole && requiredRole) {
        return sendResponse(res, 403, 'Bạn không có quyền truy cập');
      }

      req.account = account; // lưu thông tin account nếu cần dùng tiếp
      next();
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, 'Lỗi xác thực. Vui lòng thử lại sau.');
    }
  };
};

export default AuthMiddleware;

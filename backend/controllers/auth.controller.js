import { transporter } from "../configs/mailer.js";
import Account from "../models/account.model.js";
import Chapter from "../models/chapter.model.js";
import Member from "../models/member.model.js";
import Notification from "../models/notification.model.js";
import { accountFields, memberFields } from "../utils/field.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { regexValidators } from "../utils/regex.js";
import { sendResponse } from "../utils/response.js";
import { getIO } from "../utils/socket.js";
import { signToken, verifyToken } from "../utils/token.js";

const AuthController = () => {
  const register = async (req, res) => {
    try {
      const { token } = req.query;
      const form = req.body;
      console.log(form);
      if (!token) {
        const { account, roleInfo } = form;

        //checkDuplicatedAccount
        console.log(account.password);
        const duplicatedEmail = await Account.findOne({
          email: form.account.email,
        });
        if (duplicatedEmail) {
          return sendResponse(res, 400, "Email này đã được sử dụng.");
        }

        for (const field of accountFields) {
          if (!account[field]) {
            return sendResponse(res, 400, `${field} không được để trống`);
          }

          if (
            regexValidators[field] &&
            !regexValidators[field].test(account[field])
          ) {
            return sendResponse(res, 400, `${field} không đúng định dạng`);
          }
        }

        if (account.role == "member") {
          //checkDuplicatedCardCode
          const duplicatedCardCode = await Member.findOne({
            cardCode: roleInfo.cardCode,
          });
          if (duplicatedCardCode) {
            return sendResponse(res, 400, "Số thẻ đoàn này đã được sử dụng.");
          }

          //checkRoleInfo
          for (const field of memberFields) {
            if (!roleInfo[field]) {
              return sendResponse(res, 400, `${field} không được để trống`);
            }

            if (
              regexValidators[field] &&
              !regexValidators[field].test(roleInfo[field])
            ) {
              return sendResponse(res, 400, `${field} không đúng định dạng`);
            }
          }
        }

        if (account.role == "manager") {
          const duplicatedManagerOf = await Account.findOne({
            managerOf: roleInfo.managerOf,
          });
          if (duplicatedManagerOf) {
            return sendResponse(res, 400, "Chi đoàn này đã có người quản lý.");
          }
        }

        //hashPassword
        account.password = await hashPassword(account.password);
        const confirm = signToken(form);
        await transporter.sendMail({
          from: '"Ứng dụng QLDV" <your_email@gmail.com>',
          to: account.email,
          subject: "Xác nhận tài khoản QLDV",
          html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
      <h2 style="color: #2c3e50;">👋 Chào mừng bạn đến với Ứng dụng QLDV!</h2>
      <p style="font-size: 16px; color: #333;">
        Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào nút bên dưới để xác nhận tài khoản của bạn:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://localhost:5000/api/auth/confirm-register/?token=${confirm}" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
          Xác nhận tài khoản
        </a>
      </div>
      <p style="font-size: 14px; color: #777;">
        Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.
      </p>
      <hr style="margin: 20px 0;">
      <p style="font-size: 12px; color: #aaa;">Ứng dụng QLDV © 2025</p>
    </div>
  `,
        });

        return sendResponse(res, 200, "Hãy kiểm tra email của bạn");
      }

      const decode = verifyToken(token);
      const { account, roleInfo } = decode;
      console.log(account);
      const accountdb = new Account(account);
      if (account.role == "member") {
        var memberdb = new Member(roleInfo);
      }
      if (account.role == "manager") {
        accountdb.managerOf = roleInfo.managerOf;
      }

      accountdb.status = "pending";

      console.log(accountdb.password);

      if (memberdb) {
        accountdb.infoMember = memberdb._id;
        await memberdb.save();
      }

      await accountdb.save();

      const admin = await Account.findOne({ role: "admin" });

      const notification = new Notification({
        accountId: admin._id,
        text: `Bạn có yêu cầu phê duyệt từ ${account.fullname}`,
      });

      const io = getIO();
      io.emit("admin_req", `Bạn có yêu cầu phê duyệt từ ${account.fullname}`);
      await notification.save();

      res.redirect(301, "http://localhost:5173/"); // redirect vĩnh viễn
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Lỗi đăng ký. Hãy thử lại");
    }
  };

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;


      const account = await Account.findOne({ email: email }).populate(
        "infoMember"
      );
      if (!account) {
        return sendResponse(
          res,
          404,
          "Lỗi đăng nhập. Không tìm thấy tài khoản"
        );
      }

      if (!(await comparePassword(password, account.password))) {
        return sendResponse(res, 404, "Lỗi đăng nhập. Mật khẩu không đúng");
      }
      const chapterId =
        account.managerOf || account.infoMember?.memberOf || null;
      const chapter = await Chapter.findById(chapterId);
      if (
        account.status != "active" ||
        (chapter && chapter.status != "active")
      ) {
        return sendResponse(res, 403, "Bạn chưa có quyền truy cập");
      }

      const token = signToken({ accountId: account._id });

      return sendResponse(res, 200, "Đăng nhập thành công", {
        token,
        role: account.role,
      });
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Lỗi đăng nhập. Hãy thử lại");
    }
  };
  // // Hàm đăng nhập
  // const login = async (req, res) => {
  //   const logPrefix = "[AuthController][login]";
  //   console.log(`${logPrefix} Start with data:`, req.body);

  //   try {
  //     const input = req.body;

  //     // Tìm tài khoản theo email
  //     const account = await Account.findOne({ email: input.email })
  //       .select("+password")
  //       .populate("infoMember")
  //       .populate("managerOf");

  //     if (!account) {
  //       return response(res, 401, "INVALID_CREDENTIALS");
  //     }

  //     // So sánh mật khẩu nhập vào với mật khẩu đã lưu (đã mã hóa)
  //     const isMatch = bcrypt.compare(input.password, account.password);
  //     if (!isMatch) {
  //       return response(res, 401, "INVALID_CREDENTIALS");
  //     }

  //     // Kiểm tra trạng thái tài khoản và member (nếu có)
  //     if (
  //       account.status === "waiting" || account.status === "banned" ||
  //       (account.infoMember && (account.infoMember.status === "waiting" || account.infoMember.status === "banned")) ||
  //       (account.managerOf && account.managerOf.status === "banned")
  //     ) {
  //       return response(res, 401, "INVALID_ACCOUNT_STATUS");
  //     }

  //     // Sinh token xác thực
  //     const token = generateToken(account);
  //     res.cookie("token", token, { httpOnly: false });

  //     return response(res, 200, "LOGIN_SUCCESS", { token, role:account.role });
  //   } catch (error) {
  //     console.error(`${logPrefix} Error:`, error);
  //     return response(res, 500, "SERVER_ERROR");
  //   }
  // };

  // // Hàm đăng xuất
  // const logout = async (req, res) => {
  //   const logPrefix = "[AuthController][logout]";
  //   console.log(`${logPrefix} Start for account:`, req.accountId);

  //   try {
  //     res.clearCookie("token", { httpOnly: true });
  //     return response(res, 200, "LOGOUT_SUCCESS");
  //   } catch (error) {
  //     console.error(`${logPrefix} Error:`, error);
  //     return response(res, 500, "SERVER_ERROR");
  //   }
  // };

  // // Hàm lấy thông tin hồ sơ cá nhân
  // const getProfile = async (req, res) => {
  //   const logPrefix = "[AuthController][getProfile]";
  //   const decode = verifyToken(req.cookies.token);
  //   const accountId = decode.id;

  //   try {
  //     const account = await Account.findById(accountId)
  //       .populate("infoMember")
  //       .populate("managerOf");

  //     return response(res, 200, "PROFILE_FETCHED", account);
  //   } catch (error) {
  //     console.error(`${logPrefix} Error:`, error);
  //     return response(res, 500, "SERVER_ERROR");
  //   }
  // };

  // // Hàm cập nhật hồ sơ cá nhân
  // const updateProfile = async (req, res) => {
  //   const logPrefix = "[AuthController][updateProfile]";
  //   const decode = verifyToken(req.cookies.token);
  //   const accountId = decode.id;

  //   try {
  //     const input = req.body;
  //     const file = req.file;

  //     const currentAccount = await Account.findById(accountId);
  //     const accountFields = ["email", "phone", "fullname", "birthday", "gender", "role"];

  //     // Kiểm tra email mới có trùng không
  //     if (input.email !== "") {
  //       const existingAccount = await Account.findOne({ email: input.email });
  //       if (existingAccount && existingAccount._id.toString() !== accountId.toString()) {
  //         return response(res, 400, "INVALID_ACCOUNT_DATA");
  //       }
  //     }

  //     // Cập nhật các trường thông tin của tài khoản
  //     for (const field of accountFields) {
  //       if (input[field] !== "") {
  //         currentAccount[field] = input[field];
  //       }
  //     }

  //     // Cập nhật avatar nếu có
  //     if (input.avatar !== "") {
  //       currentAccount.avatar = file.path;
  //     }

  //     // Nếu là member, cập nhật infoMember
  //     if (currentAccount.infoMember) {
  //       const currentMember = await Member.findById(currentAccount.infoMember);
  //       const infoMemberFields = [
  //         "chapterId", "cardId", "position", "joinedAt",
  //         "address", "hometown", "ethnicity", "religion", "eduLevel",
  //       ];

  //       if (input.cardId !== "") {
  //         const existingMember = await Member.findOne({ cardId: input.cardId });
  //         if (existingMember && currentMember._id.toString() !== existingMember._id.toString()) {
  //           return response(res, 400, "INVALID_MEMBER_DATA");
  //         }
  //       }

  //       for (const field of infoMemberFields) {
  //         if (input[field] !== "") {
  //           currentMember[field] = input[field];
  //         }
  //       }

  //       await currentMember.save();
  //     }

  //     // Nếu là manager, cập nhật chapter phụ trách
  //     if (currentAccount.managerOf && input.chapterId !== "") {
  //       currentAccount.managerOf = input.chapterId;
  //     }

  //     await currentAccount.save();

  //     // Trả về tài khoản đã cập nhật
  //     const updatedAccount = await Account.findById(accountId)
  //       .populate("infoMember")
  //       .populate("managerOf");

  //     return response(res, 201, "ACCOUNT_UPDATED", updatedAccount);
  //   } catch (error) {
  //     console.error(`${logPrefix} Error:`, error);
  //     return response(res, 500, "SERVER_ERROR");
  //   }
  // };
  const getProfile = async (req, res) => {
    try {
      const account = await Account.findById(req.account._id);
      return sendResponse(res, 200, "Lấy hồ sơ thành công", account);
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Lỗi lấy hồ sơ, hãy thử lại");
    }
  };
  return {
    register,
    login,
    // logout,
    getProfile,
    // updateProfile,
  };
};

export default AuthController();

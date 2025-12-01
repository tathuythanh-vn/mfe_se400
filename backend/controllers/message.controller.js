import Account from "../models/account.model.js";
import Member from "../models/member.model.js";
import Message from "../models/message.model.js";
import { sendResponse } from "../utils/response.js";

const MessageController = () => {
  const getHistoryMessage = async (req, res) => {
    try {
      const me = req.account;
      const { partnerId } = req.params;

      const messages = await Message.find({
        participants: { $all: [me._id, partnerId] },
        $expr: { $eq: [{ $size: "$participants" }, 2] },
      }).sort({ createdAt: 1 });

      const result = messages.map((item) => ({
        senderId: item.senderId,
        message: item.text,
        status: item.status,
      }));

      return sendResponse(res, 200, "Lấy lịch sử tin nhắn thành công", result);
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Lỗi");
    }
  };

  const createMessage = async (req, res) => {
    try {
      const me = req.account;
      const { partnerId } = req.params;
      const text = req.body.text;

      const message = new Message({
        participants: [me._id, partnerId],
        senderId: me._id,
        text: text,
      });

      await message.save();
      return sendResponse(res, 200, "Lấy lịch sử tin nhắn thành công");
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Lỗi");
    }
  };

  const getContacts = async (req, res) => {
    try {
      const account = req.account;
      const role = account.role;

      switch (role) {
        case "admin": {
          // ADMIN: Lấy tất cả Manager
          const managers = await Account.find({ role: "manager" }).populate(
            "managerOf"
          );
          return sendResponse(res, 200, "Lấy liên hệ Admin thành công", {
            managers,
          });
        }

        case "manager": {
          const groupId = account.managerOf;

          // MANAGER: Chạy song song 3 query độc lập
          const [admin, managers, members] = await Promise.all([
            Account.findOne({ role: "admin" }),
            Account.find({ role: "manager" }).populate("managerOf"),
            getGroupMembers(groupId), // Tối ưu hóa N+1
          ]);

          return sendResponse(res, 200, "Lấy liên hệ Manager thành công", {
            admin,
            managers,
            members,
          });
        }

        case "member": {
          // MEMBER: Query 1 cần chạy tuần tự để lấy groupId
          const memberInfo = await Member.findById(account.infoMember).select(
            "memberOf"
          );

          if (!memberInfo) {
            return sendResponse(
              res,
              404,
              "Không tìm thấy thông tin thành viên liên kết"
            );
          }

          const groupId = memberInfo.memberOf;

          // Chạy song song 2 query còn lại
          const [manager, members] = await Promise.all([
            Account.findOne({ role: "manager", managerOf: groupId }),
            getGroupMembers(groupId), // Tối ưu hóa N+1
          ]);

          return sendResponse(res, 200, "Lấy liên hệ Member thành công", {
            manager,
            members,
          });
        }

        default:
          // Xử lý các role không xác định
          return sendResponse(res, 403, "Không có quyền truy cập");
      }
    } catch (error) {
      console.error("Lỗi khi lấy liên hệ:", error); // Dùng console.error và log chi tiết hơn
      return sendResponse(res, 500, "Lỗi Server");
    }
  };

  return {
    getHistoryMessage,
    createMessage,
    getContacts,
  };
};

export default MessageController();

import cloudinary from "../configs/cloudinary.js";
import Account from "../models/account.model.js";
import Member from "../models/member.model.js";
import { sendResponse } from "../utils/response.js"
import { validateForm } from "../utils/validate.js";


const AccountController = () => {

  const getAccountsInPage = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 6,
        search,
        role,
        status,
      } = req.query;

      const query = {};

      // Tìm theo họ tên hoặc email
      if (search) {
        query.$or = [
          { fullname: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo vai trò
      if (role) {
        query.role = role;
      }

      // Lọc theo trạng thái
      if (status) {
        query.status = status;
      }

      const skip = (page - 1) * limit > -1 ? (page - 1) * limit : 0

      const [accounts, total] = await Promise.all([
        Account.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Account.countDocuments(query),
      ]);

      return sendResponse(res, 200, "Lấy danh sách tài khoản thành công", {
        accounts,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        500,
        "Lỗi khi lấy danh sách tài khoản, hãy thử lại"
      );
    }
  }

  const getAccountById = async (req, res) => {
    try {
      const { id } = req.params
      const account = await Account.findById(id)
      let result = { ...account.toObject() }
      if (account.infoMember) {
        const member = await Member.findById(account.infoMember)
        result = { ...member.toObject(), ...account.toObject() }
      }


      return sendResponse(res, 200, "Lấy thông tin tài khoản thành công", result)
    } catch (error) {
      console.log(error);
      return sendResponse(
        res,
        500,
        "Lỗi khi lấy danh sách tài khoản, hãy thử lại"
      );
    }
  }
  // const updateAccountById = async (req, res) => {
  //   try {
  //     const form = req.body
  //     const avatar = req.file
  //     const { id } = req.params

  //     console.log(req.file, form)

  //     const account = await Account.findById(id)
  //     console.log(validateForm(form, account.role, true), 123)
  //     const member = await Member.findById(account.infoMember)

  //     if (form.email) {
  //       const duplicate = await Account.findOne({ email: form.email })
  //       if (duplicate) {
  //         return sendResponse(res, 400, 'Email này đã được sử dụng')
  //       }
  //     }

  //     if (form.managerOf) {
  //       const duplicate = await Account.findOne({ managerOf: form.managerOf })
  //       if (duplicate) {
  //         return sendResponse(res, 400, 'Chi đoàn này đã có người quản lý')
  //       }
  //     }
  //     if (form.cardCode) {
  //       const duplicate = await Account.findOne({ cardCode: form.cardCode })
  //       if (duplicate) {
  //         return sendResponse(res, 400, 'Số thẻ đoàn này đã được sử dụng')
  //       }
  //     }

  //     const updateAccount = new Account(form)

  //     for (const field in updateAccount.toObject()) {
  //       if (updateAccount[field] && field != '_id') {
  //         account[field] =
  //           updateAccount[field]
  //       }
  //     }
  //     if (account.role == 'member') {
  //       const updateMember = new Member(form)

  //       for (const field in updateMember.toObject()) {
  //         if (updateMember[field] && field != '_id') {
  //           member[field] =
  //             updateMember[field]
  //         }
  //       }
  //       await member.save()
  //     }


  //     if (avatar) {
  //       if (account.avatar) {
  //         cloudinary.uploader.destroy(account.avatar.filename)
  //       }

  //       account.avatar = avatar
  //     }
  //     console.log(updateAccount, account)
  //     await account.save()


  //     return sendResponse(
  //       res,
  //       200,
  //       "Cập nhật tài khoản thành công"
  //     );
  //   } catch (error) {
  //     console.log(error);
  //     return sendResponse(
  //       res,
  //       500,
  //       "Lỗi khi lấy danh sách tài khoản, hãy thử lại"
  //     );
  //   }
  // }
  const updateAccountById = async (req, res) => {
  try {
    const form = req.body;
    const avatar = req.file;
    const { id } = req.params;

    // Tìm account hiện tại
    const account = await Account.findById(id);
    if (!account) return sendResponse(res, 404, "Tài khoản không tồn tại");

    // Parse infoMember nếu FE gửi dạng JSON string
    if (form.infoMember && typeof form.infoMember === "string") {
      form.infoMember = JSON.parse(form.infoMember);
    }

    // ========== CHECK DUPLICATE ==========
    if (form.email && form.email !== account.email) {
      const duplicate = await Account.findOne({ email: form.email, _id: { $ne: id } });
      if (duplicate) return sendResponse(res, 400, 'Email này đã được sử dụng');
    }

    if (form.managerOf) {
      const duplicate = await Account.findOne({ managerOf: form.managerOf, _id: { $ne: id } });
      if (duplicate) return sendResponse(res, 400, 'Chi đoàn này đã có người quản lý');
    }

    if (form.infoMember?.cardCode) {
      const duplicate = await Account.findOne({ 'infoMember.cardCode': form.infoMember.cardCode, _id: { $ne: id } });
      if (duplicate) return sendResponse(res, 400, 'Số thẻ đoàn này đã được sử dụng');
    }

    // ========== UPDATE ACCOUNT ==========
    const accountFields = ['fullname','email','phone','birthday','role','status','managerOf'];
    accountFields.forEach(field => {
      if (form[field] !== undefined) account[field] = form[field];
    });

    // ========== UPDATE MEMBER ==========
    if (account.role === 'member' && form.infoMember) {
      let member;
      if (account.infoMember) {
        member = await Member.findById(account.infoMember);
      } else {
        member = new Member();
        account.infoMember = member._id;
      }

      const memberFields = ['memberOf','cardCode','joinedAt','position','address','hometown','ethnicity','religion','eduLevel'];
      memberFields.forEach(field => {
        if (form.infoMember[field] !== undefined) member[field] = form.infoMember[field];
      });

      await member.save();
    }

    // ========== UPDATE AVATAR ==========
    if (avatar) {
      if (account.avatar?.filename) {
        await cloudinary.uploader.destroy(account.avatar.filename);
      }
      account.avatar = avatar;
    }

    await account.save();

    return sendResponse(res, 200, "Cập nhật tài khoản thành công", account);
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Lỗi khi cập nhật tài khoản, hãy thử lại");
  }
};


 const getStatistic = async (req, res) => {
  try {
    const accounts = await Account.find();

    // Thống kê theo trạng thái
    const active = accounts.filter(item => item.status === "active").length;
    const locked = accounts.filter(item => item.status === "locked").length;
    const pending = accounts.filter(item => item.status === "pending").length;

    // Thống kê theo vai trò
    const admin = accounts.filter(item => item.role === "admin").length;
    const manager = accounts.filter(item => item.role === "manager").length;
    const member = accounts.filter(item => item.role === "member").length;

    return res.status(200).json({
      success: true,
      data: {
        status: {
          active,
          locked,
          pending
        },
        role: {
          admin,
          manager,
          member
        },
        total: accounts.length
      }
    });

  } catch (error) {
    console.error(error);
    return sendResponse(
      res,
      500,
      "Lỗi khi lấy thống kê tài khoản, hãy thử lại."
    );
  }
};

  return { getAccountsInPage, getAccountById, updateAccountById, getStatistic }
}

export default AccountController()
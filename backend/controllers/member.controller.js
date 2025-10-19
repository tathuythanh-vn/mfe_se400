import Account from "../models/account.model.js"
import EventRegistration from "../models/event_registration.model.js";
import Member from "../models/member.model.js"
import { sendResponse } from "../utils/response.js"


const MemberController = () => {
 const getMembersInPage = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 6,
      search,
      position,
    } = req.query;

    const skip = (page - 1) * limit > -1 ? (page - 1) * limit : 0;

    // Tạo query trên Member
    const memberQuery = {
      memberOf: req.account.managerOf,
    };

    if (search) {
      memberQuery.$or = [
        { cardCode: { $regex: search, $options: "i" } },
    
      ];
    }

    if(position){
      memberQuery.position = position
    }


    const [members, total] = await Promise.all([
      Member.find(memberQuery)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Member.countDocuments(memberQuery),
    ]);

    const result = await Promise.all(members.map(async(member)=>{
      const account = await Account.findOne({infoMember: member._id})
      return({...member, ...account.toObject()})
    }))
  

 

    return sendResponse(res, 200, "Lấy danh sách đoàn viên thành công", {
      result,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Lỗi lấy danh sách đoàn viên");
  }
};



const getStatistic = async (req, res) => {
  try {
    const memberOf = req.account.managerOf;

    // Lấy tất cả member thuộc chi đoàn của quản lý
    const infoMembers = await Member.find({ memberOf });
    const participationData = []
    // Gộp với account để lấy các field như status, gender...
    const members = await Promise.all(
      infoMembers.map(async (item) => {
        const account = await Account.findOne({ infoMember: item._id });
        const attended = await (await EventRegistration.find({accountId:account._id, status:'attended'})).length
        participationData.push({name: account.fullname, participation: attended})
        return { ...item.toObject(), ...account?.toObject() };
      })
    );

    // Thống kê giới tính
    const memberByGender = [
      { name: "Nam", value: members.filter((m) => m.gender === "male").length },
      { name: "Nữ", value: members.filter((m) => m.gender === "female").length },
    ];

    // Thống kê trạng thái
    const memberByStatus = [
      { name: "Hoạt động", value: members.filter((m) => m.status === "active").length },
      { name: "Bị khóa", value: members.filter((m) => m.status === "locked").length },
    ];

    // Thống kê chức vụ
    const roleMap = {
      secretary: "Bí thư",
      deputy_secretary: "Phó Bí thư",
      committee_member: "Ủy viên",
      member: "Đoàn viên",
    };

    const memberByRole = Object.entries(roleMap).map(([key, label]) => ({
      name: label,
      value: members.filter((m) => m.position === key).length,
    }));



    return sendResponse(res, 200, "Thống kê thành công", {
      memberByGender,
      memberByStatus,
      memberByRole,
     participationData
    });
  } catch (error) {
    console.error("Lỗi khi thống kê:", error);
    return sendResponse(res, 500, "Lỗi lấy danh sách đoàn viên");
  }
};


return{getMembersInPage, getStatistic}
}
export default MemberController();

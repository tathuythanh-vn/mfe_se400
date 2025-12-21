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
      const account = await Account.findOne({infoMember: member._id}).lean()
      return({...member, ...account})
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
  // Lấy danh sách memberId
const memberIds = infoMembers.map(m => m._id);

// 1. Lấy toàn bộ account liên quan (chỉ 1 query)
const accounts = await Account.find({ infoMember: { $in: memberIds } });

// Map nhanh để join
const accountMap = new Map(accounts.map(acc => [String(acc.infoMember), acc]));

// 2. Lấy toàn bộ participation (cũng chỉ 1 query)
const registrations = await EventRegistration.find({
  accountId: { $in: accounts.map(acc => acc._id) },
  status: "attended",
});

// Đếm số lần attended theo accountId
const attendCountMap = new Map();
registrations.forEach(r => {
  const key = String(r.accountId);
  attendCountMap.set(key, (attendCountMap.get(key) || 0) + 1);
});

// 3. Gộp data cuối cùng
const members = infoMembers.map(item => {
  const account = accountMap.get(String(item._id));
  const attended = account ? (attendCountMap.get(String(account._id)) || 0) : 0;

  participationData.push({
    name: account?.fullname || "Unknown",
    participation: attended
  });

  return {
    ...item.toObject(),
    ...(account ? account.toObject() : {}),
  };
});


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

const getMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin member
    const member = await Member.findById(id).lean();
    if (!member) return sendResponse(res, 404, "Không tìm thấy đoàn viên");

    // Lấy thông tin account liên quan
    const account = await Account.findOne({ infoMember: member._id }).lean();

    return sendResponse(res, 200, "Lấy thông tin đoàn viên thành công", {
      ...member,
      ...(account || {}),
    });
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết đoàn viên:", error);
    return sendResponse(res, 500, "Lỗi server");
  }
};


return{getMembersInPage, getStatistic, getMemberById}
}
export default MemberController();
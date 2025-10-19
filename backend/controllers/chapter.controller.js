import Account from "../models/account.model.js"
import Chapter from "../models/chapter.model.js"
import { sendResponse } from "../utils/response.js"
import { validateChapterForm } from "../utils/validate.js"

const ChapterController = () => {

  const createChapter = async (req, res) => {
    try {
      const form = req.body
      console.log(form)

      const validForm = validateChapterForm(form)
      if (validForm) {
        return sendResponse(res, 400, validForm)
      }

      const duplicate = await Chapter.findOne({ name: form.name, affiliated: form.affiliated })
      if (duplicate) {
        return sendResponse(res, 400, 'Chi đoàn này đã có')
      }
      const chapter = new Chapter(form)
      chapter.status = 'active'
      await chapter.save()
      console.log(chapter)
      return sendResponse(res, 200, 'Tạo chi đoàn thành công')
    } catch (error) {
      console.log(error)
      return sendResponse(res, 500, 'Có lỗi xảy ra khi tạo chi đoàn')
    }
  }

  const getChaptersInPage = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 6,
        search,
        hadManager,
        status,
      } = req.query;

      const query = {};

      // Tìm kiếm theo tên hoặc đơn vị trực thuộc
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { affiliated: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo trạng thái
      if (status) {
        query.status = status;
      }

      // Lọc theo chi đoàn đã có quản lý hay chưa
      if (hadManager === 'true') {
        // Các chapter có ít nhất một Account quản lý
        const managers = await Account.find(
          { managerOf: { $ne: null } },
          'managerOf'
        );

        const chapterIds = managers.map((acc) => acc.managerOf).filter(Boolean);
        query._id = { $in: chapterIds };
      } else if (hadManager === 'false') {
        const managers = await Account.find(
          { managerOf: { $ne: null } },
          'managerOf'
        );

        const chapterIds = managers.map((acc) => acc.managerOf).filter(Boolean);
        query._id = { $nin: chapterIds };
      }

      const skip = (page - 1) * limit > -1 ? (page - 1) * limit : 0;

      const [chapters, total] = await Promise.all([
        Chapter.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Chapter.countDocuments(query),
      ]);

      const result = await Promise.all(
        chapters.map(async (chapter) => {
          const manager = await Account.findOne({ managerOf: chapter._id }).select('avatar fullname');

          return {
            ...chapter.toObject(),
            fullname: manager?.fullname || null,
            avatar: manager?.avatar || null,
          };
        })
      );



      return sendResponse(res, 200, "Lấy danh sách chi đoàn thành công", {
        result,
        total,
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Có lỗi xảy ra khi lấy danh sách chi đoàn");
    }
  };

  const getChapterById = async (req, res) => {
    try {
      const { id } = req.params
      const chapter = await Chapter.findById(id)
      const manager = await Account.findOne({ managerOf: chapter._id }).select('avatar fullname');
      let result = chapter
      if (manager) {
        result = { ...chapter.toObject(), fullname: manager.fullname, avatar: manager.avatar }
      }



      return sendResponse(res, 200, "Lấy danh sách chi đoàn thành công", result)

    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Có lỗi xảy ra khi lấy thông tin chi đoàn");
    }
  }
  const updateChapterById = async (req, res) => {
    try {
      const { id } = req.params
      const chapter = await Chapter.findById(id)
      const form = req.body
      const validForm = validateChapterForm(form, true)
      if (validForm) {
        return sendResponse(res, 400, validForm)
      }



      const update = new Chapter(form)

      for (const field in update.toObject()) {
        if (update[field] && field != '_id') {
          chapter[field] =
            update[field]
        }
      }
      if(form.name || form.affiliated){
 const duplicate = await Chapter.findOne({ name: chapter.name, affiliated: chapter.affiliated })
      if (duplicate) {
        console.log(duplicate)
        return sendResponse(res, 400, 'Chi đoàn này đã có')
      }
      }
     
      await chapter.save()
      return sendResponse(res, 200, "Cập nhật thông tin chi đoàn thành công");
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Có lỗi xảy ra khi cập nhật thông tin chi đoàn");
    }
  }
const getStatistic = async (req, res) => {
  try {
    const chapters = await Chapter.find();
    const managers = await Account.find({managerOf:{$ne: null}})

    const active = chapters.filter(ch => ch.status === 'active').length;
    const locked = chapters.filter(ch => ch.status === 'locked').length;

    const hadManager = managers.length;
    const noManager = chapters.length - hadManager;

   return sendResponse(res, 200, "Lấy thống kê thành công", {
  status: { active, locked },
  manager: { hadManager, noManager },

});

  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Có lỗi xảy ra khi lấy báo cáo chi đoàn");
  }
};

  return { createChapter, getChaptersInPage, getChapterById, updateChapterById, getStatistic }
}

export default ChapterController()
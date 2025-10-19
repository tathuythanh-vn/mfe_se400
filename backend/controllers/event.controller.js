import cloudinary from "../configs/cloudinary.js"
import Comment from "../models/comment.model.js"
import Event from "../models/event.model.js"
import { sendResponse } from "../utils/response.js"
import { validateEventForm } from "../utils/validate.js"

const EventController = () => {

  const createEvent = async (req, res) => {
    try {

      const form = req.body
      const images = req.files

      const validation = validateEventForm(form)
      if (validation) {
        return sendResponse(res, 400, validation)
      }

      const event = new Event(form)
      event.status = 'pending'
      event.chapterId = req.account.managerOf
      if (images) {
        event.images = images
      }

      await event.save()

      return sendResponse(res, 200, 'Tạo sự kiện')
    } catch (error) {
      console.log(error)
      return sendResponse(res, 500, 'Có lỗi tạo sự kiện')
    }
  }

  const getEventsInPage = async (req, res) => {
    try {
      const chapterId = req.account.managerOf || null
      const { limit = 10, page = 1, search = "", status, scope } = req.query;

      // Xây dựng bộ lọc
      const filter = {};

      if (chapterId) filter.chapterId = chapterId

      if (search) {
        filter.name = { $regex: search, $options: "i" }; // Tìm theo tên (không phân biệt hoa thường)
      }

      if (status) {
        filter.status = status; // VD: active, inactive, pending
      }

      if (scope) {
        filter.scope = scope; // VD: "school", "district", "province"
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy dữ liệu
      const [events, total] = await Promise.all([
        Event.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit))
          .populate('chapterId'),
        Event.countDocuments(filter),
      ]);

      return sendResponse(res, 200, "Lấy danh sách sự kiện thành công", {
        data: events,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
      });
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Có lỗi khi lấy danh sách sự kiện");
    }
  };

  const getEventById = async (req, res) => {
    try {
      const { id } = req.params
      const event = await Event.findById(id).populate('chapterId')
      console.log(event)
      return sendResponse(res, 200, 'Lấy sự kiện', event);
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Có lỗi khi lấy danh sách sự kiện");
    }
  }
  const updateEventById = async (req, res) => {
    try {
      const { id } = req.params
      const form = req.body
      console.log(form)
      const cloudImgs = form['cloudImgs']
      delete form['cloudImgs']
      const files = req.files

      const validation = validateEventForm(form, true)
      if (validation) {
        return sendResponse(res, 400, validation)
      }
      const event = await Event.findById(id)
      const update = new Event(form)
      for (const field in update.toObject()) {
        if (update[field] && field != '_id' && field != 'images') {
          event[field] =
            update[field]
        }
      }
      if (cloudImgs) {

        const updateImgs = event.images.filter((item) => {
          for (const img of cloudImgs) {
            if (item.filename == img) {
              return item
            }


          }

          cloudinary.uploader.destroy(item.filename)
        })


        console.log(updateImgs)
        event.images = updateImgs
      }

      if (files) {
        event.images = [...event.images, ...files]
        console.log(files)
      }

      console.log(event)
      await event.save()
      return sendResponse(res, 200, 'Lấy sự kiện');
    } catch (error) {
      return sendResponse(res, 500, "Có lỗi khi lấy danh sách sự kiện");
    }
  }
const getStatistic = async (req, res) => {
  try {
    const chapterId = req.account.managerOf;

    const events = await Event.find({ chapterId });

    const interactionData = await Promise.all(events.map(async(item)=>{
      const comments = (await Comment.find({eventId: item._id})).length
      return ({name: item.name, likes: item.likes, comments: comments})
    }))

    // Thống kê trạng thái sự kiện
    const statusMap = {
      completed: "Hoàn thành",
      pending: "Sắp diễn ra",
      canceled: "Bị hủy",
    };

    const eventByStatus = Object.entries(statusMap).map(([key, label]) => ({
      name: label,
      value: events.filter((e) => e.status === key).length,
    }));

    // Thống kê theo phạm vi
    const eventByType = [
      { name: "Cộng đồng", value: events.filter((e) => e.scope === "public").length },
      { name: "Chi đoàn", value: events.filter((e) => e.scope === "chapter").length },
    ];

  

    return sendResponse(res, 200, "Thống kê sự kiện thành công", {
      eventByStatus,
      eventByType,
      interactionData,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, "Có lỗi khi lấy danh sách sự kiện");
  }
};
  return { createEvent, getEventsInPage, getEventById, updateEventById, getStatistic }
}

export default EventController()
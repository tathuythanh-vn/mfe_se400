import Account from "../models/account.model.js";
import EventRegistration from "../models/event_registration.model.js";
import Member from "../models/member.model.js";
import { sendResponse } from "../utils/response.js";

const EventRegistrationController = () => {
  const registerForEvent = async (req, res) => {
    try {
      const account = req.account;
      const { eventId } = req.body;

      const duplicate = await EventRegistration.findOne({ accountId: account._id, eventId });
      if (duplicate) {
        return sendResponse(res, 400, "Bạn đã đăng ký sự kiện này rồi.");
      }

      const newRegistration = new EventRegistration({
        accountId: account._id,
        eventId,
      });

      await newRegistration.save();

      return sendResponse(res, 200, "Đăng ký sự kiện thành công.");
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Đã xảy ra lỗi khi đăng ký sự kiện.");
    }
  };

  const cancelEventRegistration = async (req, res) => {
    try {
      const { id } = req.params;

      const deleted = await EventRegistration.findByIdAndDelete(id);
      if (!deleted) {
        return sendResponse(res, 404, "Không tìm thấy đăng ký sự kiện.");
      }

      return sendResponse(res, 200, "Hủy đăng ký sự kiện thành công.");
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Đã xảy ra lỗi khi hủy đăng ký sự kiện.");
    }
  };

  const listEventRegistrations = async (req, res) => {
    try {
      const { eventId } = req.query;

      const registrations = await EventRegistration.find({ eventId });

      const result = await Promise.all(registrations.map(async(item)=>{

        const account = await Account.findById(item.accountId)
        const member = await Member.findById(account.infoMember).populate('memberOf')
    
    
       const rs = {...member.toObject(), ...account.toObject(),...item.toObject()}
       delete rs['infoMember']
       return rs
      }))

      return sendResponse(res, 200, "Lấy danh sách đăng ký thành công.", result);
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Đã xảy ra lỗi khi lấy danh sách đăng ký.");
    }
  };

  const checkInToEvent = async (req, res) => {
    try {
      const { id } = req.params;

      const registration = await EventRegistration.findById(id);
      if (!registration) {
        return sendResponse(res, 404, "Không tìm thấy đăng ký sự kiện.");
      }

      registration.status = "attended";
      await registration.save();

      return sendResponse(res, 200, "Điểm danh thành công.");
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, "Đã xảy ra lỗi khi điểm danh.");
    }
  };

  const getMyEvents = async(req, res)=>{
    try {
      const account = req.account
      const events = await EventRegistration.find({accountId: account._id}).populate('eventId')   
      console.log(events)
      const result = await Promise.all(events.map(async(item)=>{
        return ({_id: item._id, name: item.eventId.name, startTime: item.eventId.startedAt, location: item.eventId.location, status: item.eventId.status})
      }))

      return sendResponse(res, 200, 'Sự kiện của tôi', result)
    } catch (error) {
       console.error(error);
      return sendResponse(res, 500, "Đã xảy ra lỗi khi điểm danh.");
    }
  }

  return {
    registerForEvent,
    cancelEventRegistration,
    listEventRegistrations,
    checkInToEvent,
    getMyEvents
  };
};

export default EventRegistrationController();

import Notification from "../models/notification.model.js"
import { sendResponse } from "../utils/response.js"

const NotificationController = ()=>{

  const getNotifications = async(req,res)=>{
   
    try {
      const notifications = await Notification.find({accountId:req.account._id}).limit(10)

      return sendResponse(res,200,'Lấy danh sách thông báo thành công', notifications)
    } catch (error) {
      console.log(error)
      return sendResponse(res,500,'Có lỗi  xảy ra khi lấy thông báo')
    }
  }
const updateStatusNotifications = async(req,res)=>{
    try {
      const notifications = req.body
      console.log(notifications)

      await Promise.all(notifications.map(async(item)=>{
        await Notification.findByIdAndUpdate(item._id, {status:'read'})
      }))


      return sendResponse(res,200,'Lấy danh sách thông báo thành công', notifications)
    } catch (error) {
      console.log(error)
      return sendResponse(res,500,'Có lỗi  xảy ra khi lấy thông báo')
    }
}
  return{getNotifications, updateStatusNotifications}
}

export default NotificationController()
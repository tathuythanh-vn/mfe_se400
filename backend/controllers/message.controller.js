import Account from "../models/account.model.js"
import Member from "../models/member.model.js"
import Message from "../models/message.model.js"
import { sendResponse } from "../utils/response.js"

const MessageController = () => {

  const getHistoryMessage = async (req, res) => {
    try {
      const me = req.account
      const { partnerId } = req.params

      const messages = await Message.find({
        participants: { $all: [me._id, partnerId] },
        $expr: { $eq: [{ $size: "$participants" }, 2] }
      }).sort({ createdAt: 1 });


      const result = messages.map((item) => ({ senderId: item.senderId, message: item.text, status: item.status }))

      return sendResponse(res, 200, 'Lấy lịch sử tin nhắn thành công', result)

    } catch (error) {
      console.log(error)
      return sendResponse(res, 500, 'Lỗi')
    }
  }

  const createMessage = async (req, res) => {
    try {
      const me = req.account
      const { partnerId } = req.params
      const text = req.body.text

      const message = new Message({ participants: [me._id, partnerId], senderId: me._id, text: text })

      await message.save()
      return sendResponse(res, 200, 'Lấy lịch sử tin nhắn thành công')
    } catch (error) {
      console.log(error)
      return sendResponse(res, 500, 'Lỗi')
    }
  }

  const getContacts = async (req, res) => {
    try {
      const account = req.account
      if (account.role == 'admin') {
        const result = await Account.find({ role: 'manager' }).populate('managerOf')
        return sendResponse(res, 200, 'Lấy liên hệ admin', {managers: result})
      }

      if (account.role == 'manager') {

        const admin = await Account.findOne({ role: 'admin' })
        const managers = await Account.find({ role: 'manager' }).populate('managerOf')
        const infoMembers = await Member.find({ memberOf: account.managerOf })
        const members = await Promise.all(infoMembers.map(async (item) => {
          const member = await Account.findOne({ infoMember: item._id })
          return member
        }))

        return sendResponse(res, 200, 'Lấy liên hệ admin', {
          admin, managers, members
        })
      }

      
      if (account.role == 'member') {

       const member = await Member.findById(account.infoMember);
        const manager = await Account.findOne({ role: 'manager', managerOf: member.memberOf})
        const infoMembers = await Member.find({ memberOf: member.memberOf })
        const members = await Promise.all(infoMembers.map(async (item) => {
          const member = await Account.findOne({ infoMember: item._id })
          return member
        }))

        return sendResponse(res, 200, 'Lấy liên hệ admin', {
          manager, members
        })
      }
       return sendResponse(res, 400, 'có lỗi')
    } catch (error) {
      console.log(error)
      return sendResponse(res, 500, 'Lỗi')
    }
  }


  return {
    getHistoryMessage,
    createMessage, getContacts
  }
}

export default MessageController()
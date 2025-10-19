import Comment from "../models/comment.model.js";
import { sendResponse } from "../utils/response.js";

const CommentController = () => {
  const createComment = async (req, res) => {
    try {
      const account = req.account;
      const { eventId, text } = req.body;
      console.log(req.body)

      const comment = new Comment({
        accountId: account._id,
        eventId: eventId,
        text: text,
      });

      await comment.save();

      return sendResponse(res, 200, "Bình luận thành công", comment);
    } catch (error) {
      console.log(error);
      return sendResponse(res, 500, "Có lỗi xảy ra");
    }
  };
  const getComments = async (req, res) => {
    try {
      const { eventId, status } = req.query;
      const query = {}
      query['eventId'] = eventId;
      if(status){
        query['status'] = status
      }
      const comments = await Comment.find(query).populate('accountId').sort({createdAt: -1})
      return sendResponse(res, 200, 'Laays binhf luanj',comments)
    } catch (error) {
      return sendResponse(res, 500, "Có lỗi xảy ra");
    }
  }

  const hideComment = async(req,res)=>{
    try {  
      const { id } = req.params;
      const comment = await Comment.findById(id)
      comment.status= comment.status == 'locked' ? 'active' :'locked'
      await comment.save()
      return sendResponse(res, 200, 'Laays binhf luanj',)
      
    } catch (error) {
        return sendResponse(res, 500, "Có lỗi xảy ra");
    }
  }
  return {
    createComment,
    getComments,
    hideComment
  };
};

export default CommentController();

import Event from "../models/event.model.js";
import Favorite from "../models/favorite.model.js";
import { sendResponse } from "../utils/response.js";

const FavoriteController = () => {
  // Hàm toggle yêu thích (like/unlike)
  const toggleFavorite = async (req, res) => {
    try {
      const account = req.account;
      const { eventId } = req.body;

      const existingFavorite = await Favorite.findOne({
        accountId: account._id,
        eventId,
      });

      const event = await Event.findById(eventId);
      if (!event) {
        return sendResponse(res, 404, "Không tìm thấy sự kiện");
      }

      if (existingFavorite) {
        // Unlike
        event.likes = Math.max(0, event.likes - 1);
        await event.save();
        await Favorite.findByIdAndDelete(existingFavorite._id);
        return sendResponse(res, 200, "Đã bỏ yêu thích");
      } else {
        // Like
        const newFavorite = new Favorite({
          accountId: account._id,
          eventId,
        });
        await newFavorite.save();
        event.likes += 1;
        await event.save();
        return sendResponse(res, 200, "Đã yêu thích");
      }
    } catch (error) {
      console.log("toggleFavorite", error);
      return sendResponse(res, 500, "Có lỗi khi xử lý yêu thích");
    }
  };

  // Kiểm tra sự kiện đã được yêu thích chưa
  const checkFavoriteStatus = async (req, res) => {
    try {
      const account = req.account;
      const { eventId } = req.query;

      const exists = await Favorite.findOne({
        accountId: account._id,
        eventId,
      });

      return sendResponse(
        res,
        200,
        exists ? "Đã yêu thích" : "Chưa yêu thích",
        { liked: !!exists }
      );
    } catch (error) {
      console.log("checkFavoriteStatus", error);
      return sendResponse(res, 500, "Có lỗi khi kiểm tra yêu thích");
    }
  };

  return {
    toggleFavorite,
    checkFavoriteStatus,
  };
};

export default FavoriteController();

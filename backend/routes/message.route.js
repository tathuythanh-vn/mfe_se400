
import express from "express";
import messageController from "../controllers/message.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";



const MessageRoutes = express.Router();
MessageRoutes.get("/contacts",AuthMiddleware(), messageController.getContacts);
MessageRoutes.get("/:partnerId",AuthMiddleware(), messageController.getHistoryMessage);
MessageRoutes.post("/:partnerId",AuthMiddleware(), messageController.createMessage);



export default MessageRoutes;

import express from "express";
import NotificationController from "../controllers/notification.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";



const NotificationRoutes = express.Router();

NotificationRoutes.get("/", AuthMiddleware(), NotificationController.getNotifications);
NotificationRoutes.patch("/", NotificationController.updateStatusNotifications);


export default NotificationRoutes;
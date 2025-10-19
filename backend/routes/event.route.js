import express from "express";
import uploadImage from "../middlewares/uploadImage.js";
import eventController from "../controllers/event.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const EventRoutes = express.Router();

EventRoutes.post("/", AuthMiddleware('manager'), uploadImage.array('images',10), eventController.createEvent);
EventRoutes.get("/",AuthMiddleware(), eventController.getEventsInPage);
EventRoutes.get("/statistic", AuthMiddleware('manager'),eventController.getStatistic);
// EventRoutes.patch("/checkin/:registrationId", EventController.checkin);
// EventRoutes.patch("/comments/:commentId", EventController.changeCommentStatus);
EventRoutes.get("/:id", eventController.getEventById);
EventRoutes.put("/:id",uploadImage.array('images',10), eventController.updateEventById);

// EventRoutes.patch("/:eventId", EventController.changeEventStatus);
// EventRoutes.patch("/:eventId/like", EventController.likeEvent);
// EventRoutes.post("/:eventId/register", EventController.registerEvent);
// EventRoutes.get("/:eventId/register", EventController.getRegistrationsInPage);
// EventRoutes.post("/:eventId/comments", EventController.postComment);
// EventRoutes.get("/:eventId/comments", EventController.getComments);


export default EventRoutes;


import express from "express";
import memberController from "../controllers/member.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";


const MemberRoutes = express.Router();

MemberRoutes.get("/",AuthMiddleware('manager'), memberController.getMembersInPage);
MemberRoutes.get("/statistic",AuthMiddleware('manager'), memberController.getStatistic);
// MemberRoutes.get("/:memberId", MemberController.getMemberById);
// MemberRoutes.put("/:memberId", MemberController.updateMemberById);
// MemberRoutes.patch("/:memberId", MemberController.changeMemberStatus);

export default MemberRoutes;

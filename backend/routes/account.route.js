import express from "express";

import uploadImage from "../middlewares/uploadImage.js";
import AccountController from "../controllers/account.controller.js";

const AccountRoutes = express.Router();

// AccountRoutes.post("/", uploadImage.single('avatar'),AccountController.createAccount);
AccountRoutes.get("/", AccountController.getAccountsInPage);
AccountRoutes.get("/statistic", AccountController.getStatistic);
AccountRoutes.get("/:id", AccountController.getAccountById);
AccountRoutes.put("/:id", uploadImage.single('avatar'),  AccountController.updateAccountById);



export default AccountRoutes;

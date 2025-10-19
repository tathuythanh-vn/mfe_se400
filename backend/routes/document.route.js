import express from "express";
import uploadFile from "../middlewares/uploadFile.js";
import documentController from "../controllers/document.controller.js";
import AuthMiddleware from "../middlewares/auth.middleware.js";

const DocumentRoutes = express.Router();

DocumentRoutes.post("/",AuthMiddleware('manager'),uploadFile.single('file'), documentController.createDocument);
DocumentRoutes.get("/", AuthMiddleware(),documentController.getDocumentsInPage);
DocumentRoutes.get("/statistic", AuthMiddleware('manager'),documentController.getStatistic);
DocumentRoutes.get("/:id", documentController.getDocumentById);
DocumentRoutes.put("/:id",uploadFile.single('file'), documentController.updateDocumentById);
// DocumentRoutes.patch("/:documentId", DocumentController.changeDocumentStatus);
 
export default DocumentRoutes;

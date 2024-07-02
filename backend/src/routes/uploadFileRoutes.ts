import { Router } from "express";
import { uploadFile } from "../controllers/uploadFileController.js";
import upload from "../middleware/uploadFileMiddleware.js";

const uploadFileRouter = Router();

uploadFileRouter.post("/profile", upload.single("avatar"), uploadFile);

export default uploadFileRouter;
